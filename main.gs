/**
 * gmail-im-notify — Gmail 即时消息通知
 * =======================================
 * 托管于 Google Apps Script，运行在 Google 云端，不依赖本地 PC。
 * 新邮件 → AI 摘要 → 即时通讯推送（当前支持钉钉，架构预留扩展）
 *
 * GitHub: https://github.com/donglinfei-debug/gmail-im-notify
 *
 * 首次部署（3 分钟）：
 *   1. 打开 https://script.google.com  → 新建项目
 *   2. 粘贴本文件全部内容
 *   3. 修改下方 CONFIG 中的 YOUR_xxx 配置项
 *   4. 运行 init() 函数 → 弹窗授权 Gmail + 外部请求 → 自动创建触发器
 *   5. 运行 test() 函数 → 钉钉群收到一封测试通知 → 部署完成
 *
 * 之后每分钟自动检查收件箱新邮件，推送 AI 摘要到指定即时通讯群。
 */

// ════════════════════════════════════════════
//  配置（⚠️ 请修改为你的真实凭据）
// ════════════════════════════════════════════

var CONFIG = {

  // ── DeepSeek API ──
  // 注册地址: https://platform.deepseek.com
  deepseekApiKey: "YOUR_DEEPSEEK_API_KEY",
  deepseekModel: "deepseek-v4-flash",   // 或 deepseek-chat

  // ── 钉钉机器人 ──
  // 创建机器人: 钉钉群 → 群设置 → 智能群助手 → 添加机器人 → 自定义(Webhook)
  // 安全设置选"加签"，把 SEC 开头的字符串填到下方 secret
  dingtalkWebhook: "YOUR_DINGTALK_WEBHOOK_URL",
  dingtalkSecret: "YOUR_DINGTALK_SECRET",

  // ── 监控参数 ──
  checkMinutes: 1,
  maxPerBatch: 5,
};


// ════════════════════════════════════════════
//  初始化（首次运行）
// ════════════════════════════════════════════

function init() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) { ScriptApp.deleteTrigger(t); });

  ScriptApp.newTrigger("checkNewEmails")
    .timeBased().everyMinutes(CONFIG.checkMinutes).create();

  PropertiesService.getScriptProperties()
    .setProperty("lastTime", String(new Date().getTime()));

  Logger.log("Gmail->DingTalk ready | every " + CONFIG.checkMinutes + " min");
}


// ════════════════════════════════════════════
//  主循环（每分钟自动调用）
// ════════════════════════════════════════════

function checkNewEmails() {
  var props = PropertiesService.getScriptProperties();
  var lastStr = props.getProperty("lastTime");
  var lastTime = lastStr ? Number(lastStr) : new Date().getTime() - 60000;

  var query = "in:inbox after:" + Math.floor(lastTime / 1000);
  var threads = GmailApp.search(query, 0, CONFIG.maxPerBatch);

  var newLastTime = lastTime;

  for (var i = 0; i < threads.length; i++) {
    var msgs = threads[i].getMessages();
    for (var j = 0; j < msgs.length; j++) {
      var msg = msgs[j];
      var msgTime = msg.getDate().getTime();
      if (msgTime > lastTime) {
        try { processOne(msg); } catch (e) { Logger.log("ERR: " + e); }
        if (msgTime > newLastTime) newLastTime = msgTime;
      }
    }
  }
  props.setProperty("lastTime", String(newLastTime));
}


// ════════════════════════════════════════════
//  单封邮件处理
// ════════════════════════════════════════════

function processOne(msg) {
  var from     = msg.getFrom();
  var subject  = msg.getSubject();
  var date     = msg.getDate();
  var body     = getBody(msg);
  var attach   = msg.getAttachments().length > 0;
  var msgId    = msg.getId();

  var ai = askDeepSeek(from, subject, date, attach, body);
  sendToDing(from, subject, date, attach, ai, msgId);
}

function getBody(msg) {
  var b = msg.getPlainBody();
  return b.length > 2000 ? b.slice(0, 2000) + "…" : b;
}


// ════════════════════════════════════════════
//  DeepSeek 摘要
// ════════════════════════════════════════════

function askDeepSeek(from, subject, date, attach, body) {
  var t = Utilities.formatDate(date, "Asia/Shanghai", "yyyy-MM-dd HH:mm");

  var prompt = [
    "分析以下邮件，输出 4 行（每行一段，勿加序号或解释）：",
    "",
    "一行总结（≤20 字）",
    "内容简述（≤200 字；如含验证码/激活码须原样保留）",
    "重要程度：🔴紧急 / 🟡需回复 / 🟢一般",
    "待办：（无则写\"无需操作\"）",
    "",
    "发件人：" + from,
    "主题：" + subject,
    "时间：" + t,
    "附件：" + (attach ? "有" : "无"),
    "正文前 2000 字：\n" + body
  ].join("\n");

  var payload = {
    model: CONFIG.deepseekModel,
    messages: [
      { role: "system", content: "你是邮件摘要助手。含验证码/激活码必须原样保留并标紧急。" },
      { role: "user", content: prompt }
    ],
    max_tokens: 500,
    temperature: 0.3
  };

  var resp = UrlFetchApp.fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "post",
    headers: {
      "Authorization": "Bearer " + CONFIG.deepseekApiKey,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  var d = JSON.parse(resp.getContentText());
  if (d.choices && d.choices.length > 0) {
    return parseAi(d.choices[0].message.content.trim());
  }
  return { s: "(AI 失败)", d: "(无)", l: "🟢一般", t: "无需操作" };
}

function parseAi(text) {
  var r = { s: "(无)", d: "(无)", l: "🟢一般", t: "无需操作" };
  var lines = text.split("\n").filter(function(l) { return l.trim(); });
  var i = 0;
  if (lines[i]) { r.s = lines[i]; i++; }
  if (lines[i]) { r.d = lines[i]; i++; }
  if (lines[i]) { r.l = lines[i]; i++; }
  if (lines[i]) { r.t = lines[i]; }
  return r;
}


// ════════════════════════════════════════════
//  钉钉机器人（Markdown 卡片，HMAC-SHA256 加签）
// ════════════════════════════════════════════

function sendToDing(from, subject, date, attach, ai, msgId) {
  var ts = String(new Date().getTime());
  var raw = ts + "\n" + CONFIG.dingtalkSecret;
  var sig = Utilities.computeHmacSha256Signature(raw, CONFIG.dingtalkSecret);
  var sign = encodeURIComponent(Utilities.base64Encode(sig));
  var url = CONFIG.dingtalkWebhook + "&timestamp=" + ts + "&sign=" + sign;

  var timeStr = Utilities.formatDate(date, "Asia/Shanghai", "MM-dd HH:mm");
  var attachTag = attach ? " 📎" : "";
  var link = "https://mail.google.com/mail/u/0/#inbox/" + msgId;

  var card = [
    "## " + subject,
    "",
    "**发件人** " + from + attachTag,
    "**时间** " + timeStr,
    "**状态** " + levelBadge(ai.l),
    "",
    "---",
    "",
    "**📝 一句话**  " + ai.s,
    "",
    "**📄 简述**  " + ai.d,
    "",
    "**📋 待办**  " + ai.t,
    "",
    "---",
    "",
    "📬 [Gmail 查看](" + link + ")"
  ].join("\n");

  var r = UrlFetchApp.fetch(url, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    payload: JSON.stringify({
      msgtype: "markdown",
      markdown: { title: "📧 " + subject.slice(0, 50), text: card }
    }),
    muteHttpExceptions: true
  });

  var j = JSON.parse(r.getContentText());
  if (j.errcode !== 0) Logger.log("DingTalk ERR: " + JSON.stringify(j));
}

function levelBadge(l) {
  if (l.indexOf("🔴") !== -1) return '<font color="#FF0000">🔴 紧急</font>';
  if (l.indexOf("🟡") !== -1) return '<font color="#FFAA00">🟡 需回复</font>';
  return '<font color="#999999">🟢 一般知悉</font>';
}


// ════════════════════════════════════════════
//  手动测试（处理最新一封邮件）
// ════════════════════════════════════════════

function test() {
  var threads = GmailApp.search("in:inbox", 0, 1);
  if (threads.length === 0) { Logger.log("收件箱为空"); return; }
  var msg = threads[0].getMessages()[0];
  Logger.log("测试: " + msg.getSubject());
  processOne(msg);
  Logger.log("完成 — 查看钉钉群");
}
