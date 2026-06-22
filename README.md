<div align="center">

# 📬 Gmail IM Notify

**Instant Gmail notifications with AI summaries — delivered to DingTalk (and more IMs coming)**

[![GitHub Stars](https://img.shields.io/github/stars/donglinfei-debug/gmail-im-notify?style=flat-square&logo=github)](https://github.com/donglinfei-debug/gmail-im-notify/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/donglinfei-debug/gmail-im-notify?style=flat-square&logo=github)](https://github.com/donglinfei-debug/gmail-im-notify/issues)
[![GitHub Forks](https://img.shields.io/github/forks/donglinfei-debug/gmail-im-notify?style=flat-square&logo=github)](https://github.com/donglinfei-debug/gmail-im-notify/forks)
[![License](https://img.shields.io/github/license/donglinfei-debug/gmail-im-notify?style=flat-square)](LICENSE)
[![Google Apps Script](https://img.shields.io/badge/GAS-JavaScript-blue.svg?style=flat-square&logo=google)](https://developers.google.com/apps-script)
[![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-brightgreen.svg?style=flat-square)](https://platform.deepseek.com/)

🌏 **Language / 语言**：[🇨🇳 中文](README.zh.md) | [🇬🇧 English](README.md)

</div>

---

Get instant notifications when important emails hit your Gmail inbox — powered by AI summaries, delivered to DingTalk (and more IMs in the future). Built with Google Apps Script, zero infrastructure to maintain.


## 📌 Why This?

| Scenario | Pain Point | How This Solves It |
|----------|------------|-------------------|
| 🏢 **Busy Professionals** | Checking Gmail constantly is distracting | Get instant push notifications with AI summaries to your team chat |
| ✈️ **Traveling / On Leave** | Easy to miss important emails | DingTalk delivers alerts to your phone immediately |
| 🔐 **Restricted Networks** | Gmail is slow or inaccessible in some regions | Script runs on Google Cloud, notifications delivered via local IMs |
| 👨‍👩‍👧 **Team Shared Mailbox** | Nobody wants to refresh the inbox all day | New emails auto-push to the group, everyone stays informed |

**Gmail IM Notify** bridges the gap between your Gmail inbox and your instant messaging platform — powered by AI, requiring zero infrastructure on your end.

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Google["☁️ Google Cloud"]
        GAS[main.gs · Google Apps Script<br/>每分钟触发 · 增量轮询]
        GM[Gmail API<br/>in:inbox after:{ts}]
    end
    subgraph AI["🧠 AI Layer"]
        DS[DeepSeek API<br/>结构化摘要]
    end
    subgraph Push["📲 Notification"]
        DT[DingTalk Webhook<br/>HMAC-SHA256 · Markdown]
    end

    GAS --> GM
    GAS --> DS
    GAS --> DT

    style GAS fill:#0ea5e9,color:#fff,stroke:none
    style GM fill:#6366f1,color:#fff,stroke:none
    style DS fill:#f59e0b,color:#fff,stroke:none
    style DT fill:#10b981,color:#fff,stroke:none
```

## ✨ Features

| # | Feature | Description |
|:--|:--------|:------------|
| 1 | **AI-Powered Summaries** | DeepSeek extracts 4 fields: summary, details, urgency, actions |
| 2 | **Zero Infrastructure** | Runs on Google Cloud, no server needed |
| 3 | **Incremental Polling** | ScriptProperties cursor — never misses an email |
| 4 | **Signed Webhook** | HMAC-SHA256 verified delivery to DingTalk |
| 5 | **Urgency Detection** | Emails with verification codes / activation links auto-marked 🔴 |

## 🚀 Quick Start

```bash
# 1. Create a new Google Apps Script project
# 2. Copy main.gs into the editor
# 3. Set Script Properties:
#    DEEPSEEK_API_KEY, DINGTALK_WEBHOOK, DINGTALK_SECRET
# 4. Create a time-based trigger (every 1 minute)
```

## 📁 Files

```
gmail-im-notify/
├── main.gs               # Google Apps Script — all logic
├── .env.example          # Environment variable template
├── LICENSE               # MIT
└── README.md / README.zh.md
```



## ❓ FAQ

**Do I need a server to run this?**
No. It runs entirely on Google Apps Script (Google Cloud), free of charge. You only need a Gmail account and a DingTalk webhook.

**How often does it check for new emails?**
Every minute, configurable via the TimeBased trigger in Google Apps Script. The cursor-based system ensures no emails are missed.

**Which IM platforms are supported?**
Currently DingTalk via HMAC-SHA256 signed webhook. The architecture supports adding more platforms (Feishu, WeCom, Telegram) by implementing additional notifiers.

**Does this work with Gmail API quotas?**
Yes. It uses incremental polling with GmailApp.search() and a ScriptProperties cursor — minimal API calls per check.

## 📄 License

MIT © 2026 Ryan Dong

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=donglinfei-debug/gmail-im-notify&type=Date)](https://star-history.com/#donglinfei-debug/gmail-im-notify&Date)



## 👤 About the Author

**Ryan Dong** — AI Product Manager & Full-Stack Developer

I bridge the gap between AI capabilities and production-ready software. My work spans the full stack: from designing AI-powered product features and integrating LLM APIs, to building modular backend services and shipping clean, documented code.

| Role | Focus |
|:-----|:------|
| 🧠 **AI Product Manager** | Product strategy, AI feature design, prompt engineering, model selection |
| 💻 **Full-Stack Developer** | Python, FastAPI, Google Apps Script, automation pipelines, API integration |

This repository is part of a personal toolbox — a growing collection of practical, reusable modules that solve real automation problems. Each project is designed to be independently useful and easily integrated into larger systems.

📬 **donglinfei@gmail.com** — open to business discussions, collaborations, and recruiting inquiries.

## 📬 Contact

Ryan Dong — donglinfei@gmail.com
