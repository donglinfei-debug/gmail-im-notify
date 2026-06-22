<div align="center">

# 📬 Gmail IM Notify

**Gmail 新邮件即时推送到钉钉 · AI 摘要驱动 · 零基础设施**

[![GitHub Stars](https://img.shields.io/github/stars/donglinfei-debug/gmail-im-notify?style=flat-square&logo=github)](https://github.com/donglinfei-debug/gmail-im-notify/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/donglinfei-debug/gmail-im-notify?style=flat-square&logo=github)](https://github.com/donglinfei-debug/gmail-im-notify/issues)
[![GitHub Forks](https://img.shields.io/github/forks/donglinfei-debug/gmail-im-notify?style=flat-square&logo=github)](https://github.com/donglinfei-debug/gmail-im-notify/forks)
[![License](https://img.shields.io/github/license/donglinfei-debug/gmail-im-notify?style=flat-square)](LICENSE)
[![Google Apps Script](https://img.shields.io/badge/GAS-JavaScript-blue.svg?style=flat-square&logo=google)](https://developers.google.com/apps-script)
[![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-brightgreen.svg?style=flat-square)](https://platform.deepseek.com/)

🌏 **语言 / Language**：[🇨🇳 中文](README.zh.md) | [🇬🇧 English](README.md)

</div>

---

收到 Gmail 新邮件即推送到钉钉，AI 自动生成摘要（一句话总结、内容简述、重要程度、待办事项）。基于 Google Apps Script，零服务器维护。


## 📌 为什么需要这个工具？

| 场景 | 痛点 | 本项目如何解决 |
|:-----|:-----|:---------------|
| 🏢 **职场人** | 切到 Gmail 看邮件很分散注意力 | 即时通讯推送，一眼看完摘要决定要不要处理 |
| ✈️ **出差/休假** | 不打开 Gmail App 就会漏邮件 | 钉钉作为你已有的工作入口，邮件通知无缝接入 |
| 🔐 **网络受限** | Gmail 在某些地区访问慢或不可用 | 脚本跑在 Google 云端，走国内即时通讯链路送达 |
| 👨‍👩‍👧 **团队共享邮箱** | 没人想一直刷收件箱 | 新邮件自动推群，成员都能看到 |

**Gmail IM Notify** 打通了 Gmail 收件箱和即时通讯之间的最后一公里——AI 驱动、零基础设施。

## 🏗️ 架构示意

```mermaid
flowchart LR
    subgraph Google["☁️ Google Cloud"]
        GAS[main.gs · Google Apps Script<br/>每分钟触发 · 增量轮询]
        GM[Gmail API<br/>in:inbox after:{ts}]
    end
    subgraph AI["🧠 AI 层"]
        DS[DeepSeek API<br/>结构化摘要]
    end
    subgraph Push["📲 推送"]
        DT[钉钉 Webhook<br/>HMAC-SHA256 · Markdown]
    end

    GAS --> GM
    GAS --> DS
    GAS --> DT

    style GAS fill:#0ea5e9,color:#fff,stroke:none
    style GM fill:#6366f1,color:#fff,stroke:none
    style DS fill:#f59e0b,color:#fff,stroke:none
    style DT fill:#10b981,color:#fff,stroke:none
```

## ✨ 功能特性

| # | 功能 | 说明 |
|:--|:-----|:------|
| 1 | **AI 摘要** | DeepSeek 提取 4 个字段：一句话总结、内容简述、重要程度、待办 |
| 2 | **零基础设施** | 运行在 Google 云端，无需服务器 |
| 3 | **增量轮询** | ScriptProperties 游标持久化，不漏邮件 |
| 4 | **签名验证** | HMAC-SHA256 加签推送到钉钉 |
| 5 | **紧急标记** | 含验证码/激活码的邮件自动标 🔴 |

## 🚀 快速开始

```bash
# 1. 新建 Google Apps Script 项目
# 2. 复制 main.gs 到编辑器
# 3. 在 Script Properties 中设置：
#    DEEPSEEK_API_KEY, DINGTALK_WEBHOOK, DINGTALK_SECRET
# 4. 创建时间触发器（每分钟执行一次）
```

## 📁 文件结构

```
gmail-im-notify/
├── main.gs               # Google Apps Script — 全部逻辑
├── .env.example          # 环境变量模板
├── LICENSE               # MIT
└── README.md / README.zh.md
```

## ❓ 常见问题

**需要服务器吗？**
不需要。全部运行在 Google Apps Script（Google 云端），完全免费。只需要 Gmail 账号和钉钉 Webhook。

**多久检查一次新邮件？**
每分钟一次（可通过 TimeBased 触发器调整）。基于游标的增量轮询确保不漏邮件。

**支持哪些即时通讯平台？**
目前支持钉钉（HMAC-SHA256 加签）。架构支持扩展飞书、企微、Telegram 等渠道。

**会超出 Gmail API 配额吗？**
不会。使用增量轮询 + ScriptProperties 持久化游标，每次检查的 API 调用量极小。

## 📄 许可证

MIT © 2026 Ryan Dong

## 🌟 Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=donglinfei-debug/gmail-im-notify&type=Date)](https://star-history.com/#donglinfei-debug/gmail-im-notify&Date)



## 👤 关于作者

**Ryan Dong** — AI 产品经理 & 全栈开发者

我在 AI 能力与生产级软件之间架桥。工作覆盖全栈：从 AI 驱动的产品功能设计、LLM API 集成，到模块化的后端服务和干净、文档完整的代码交付。

| 角色 | 专注领域 |
|:-----|:---------|
| 🧠 **AI 产品经理** | 产品策略、AI 功能设计、Prompt 工程、模型选型 |
| 💻 **全栈开发者** | Python、FastAPI、Google Apps Script、自动化管线、API 集成 |

本仓库是我个人工具箱的一部分——一个不断增长的、解决实际自动化问题的模块集合。每个项目设计为独立可用、易于集成到更大的系统中。

📬 **donglinfei@gmail.com** — 欢迎商务合作、技术交流和招聘联系。

## 📬 联系方式

Ryan Dong — donglinfei@gmail.com
