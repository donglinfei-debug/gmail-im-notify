# gmail-im-notify

> 收到 Gmail 新邮件，即时消息立刻通知你 — AI 摘要驱动，推送至钉钉（后续支持更多即时通讯）。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-JavaScript-blue)]()

## 适用场景

| 场景 | 痛点 | 本项目如何解决 |
|------|------|---------------|
| 🏢 **职场人** | Gmail 挂着，切过去看费时间 | 即时通讯推送，一眼看完摘要决定要不要处理 |
| ✈️ **出差/休假** | 不打开 Gmail App 就会漏邮件 | 钉钉作为你已有的工作入口，邮件通知无缝接入 |
| 🔐 **网络受限** | Gmail 在某些地区/网络下访问慢或不可用 | 脚本跑在 Google 云端，走国内即时通讯链路送达 |
| 👨‍👩‍👧 **团队共享邮箱** | 谁都不想一直刷收件箱 | 新邮件自动推群，成员都能看到，避免重复处理 |

## 原理架构

```
Gmail 收到新邮件
        │
        │  Google Apps Script（每分钟检查一次）
        │  — 运行在 Google 云端，无需本地 PC
        │
        ├─→ DeepSeek API ──→ AI 摘要
        │                      （一句话总结 + 内容简述 + 重要程度 + 待办）
        │
        └─→ 钉钉 Webhook ──→ 你的手机 / 电脑
```

## 快速开始（3 分钟）

### 1. 准备工作

- 一个 Gmail 账号
- 一个 [DeepSeek API Key](https://platform.deepseek.com)（新用户送免费额度）
- 一个钉钉群机器人 Webhook（[创建教程](https://open.dingtalk.com/document/orgapp/custom-bot)）

### 2. 部署

```
① 打开 https://script.google.com
② 新建项目，清空默认代码
③ 把 main.gs 全部内容粘贴进去
④ 修改 CONFIG 配置项：
    - deepseekApiKey    → 你的 DeepSeek API Key
    - dingtalkWebhook   → 你的钉钉机器人 Webhook 地址
    - dingtalkSecret    → 你的钉钉加签密钥
⑤ 运行 init() 函数 → 授权 → 自动创建每分钟触发器
⑥ 运行 test() 函数 → 钉钉群收到测试通知 → 完成！
```

### 配置项说明

| 配置 | 说明 | 获取方式 |
|------|------|---------|
| `deepseekApiKey` | DeepSeek API 密钥 | [platform.deepseek.com](https://platform.deepseek.com) → API Keys |
| `deepseekModel` | 模型名称（默认 `deepseek-v4-flash`） | |
| `dingtalkWebhook` | 钉钉机器人 Webhook | 钉钉群 → 群设置 → 智能群助手 → 添加机器人 → 自定义 |
| `dingtalkSecret` | 加签密钥（SEC 开头） | 创建机器人时选择"加签"安全方式 |
| `checkMinutes` | 检查频率（默认 1 分钟） | 按需调整 |
| `maxPerBatch` | 每次最多处理邮件数（默认 5） | |

### 通知卡片效果

钉钉群内收到的消息示例：

```
## Q2 季度汇报通知

**发件人** zhangsan@company.com 📎
**时间** 06-10 14:30
**状态** 🔴 紧急

---

**📝 一句话** 明天前提交 Q2 报告

**📄 简述** 老板要求各部门明天 17:00 前提交
Q2 绩效报告，附件有模板。

**📋 待办** 明天 17:00 前提交 Q2 报告

---

📬 [在 Gmail 中查看]()
```

### 验证码邮件特殊处理

如果邮件中包含验证码、激活码、确认码等，AI 会自动标记为 🔴 紧急，并在简述中**原样保留验证码**。

## 进阶用法

### 只监控特定标签

修改 `checkNewEmails()` 中的查询语句：

```javascript
// 改前：收件箱全部
var query = "in:inbox after:" + …;

// 改后：只监控"重要"标签
var query = "label:important after:" + …;
```

### 调整 AI 摘要风格

修改 `askDeepSeek()` 中的 system prompt：

```javascript
// 更正式的商务风格
{ role: "system", content: "你是专业商务助理，用正式中文生成邮件摘要。" }

// 更精简的风格
{ role: "system", content: "生成一条不超过 30 字的邮件摘要，直接输出。" }
```

### 同时推送到多个钉钉群

在 `sendToDing()` 函数结尾增加第二个 Webhook 调用即可。

## 后续规划

- [x] 钉钉推送
- [ ] 飞书推送
- [ ] 企业微信推送
- [ ] 可自定义 AI 摘要提示词模板
- [ ] 多邮箱支持
- [ ] 标签过滤配置

## 计费

| 服务 | 费用 |
|------|------|
| Google Apps Script | **免费** — 每天 20,000 次邮件读取 + 20,000 次外部请求 |
| DeepSeek API | 约 0.001 元/次 — 每分钟一次 = 每天约 1 元 |
| 钉钉机器人 | **免费** — 每分钟最多发 20 条 |

## License

MIT © [Ryan Dong](https://github.com/donglinfei-debug)
