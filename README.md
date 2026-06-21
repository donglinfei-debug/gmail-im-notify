# gmail-im-notify

> Get instant notifications when important emails hit your Gmail inbox — powered by AI summaries, delivered to DingTalk (and more IMs in the future).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-JavaScript-blue)]()

## Why This Exists

| Scenario | Pain Point | How This Solves It |
|----------|------------|-------------------|
| 🏢 **Busy Professionals** | Checking Gmail constantly is distracting | Get instant push notifications with AI summaries to your team chat |
| ✈️ **Traveling / On Leave** | Easy to miss important emails | DingTalk (soon more) delivers alerts to your phone immediately |
| 🔐 **Restricted Networks** | Gmail is slow or inaccessible in some regions | Script runs on Google Cloud, notifications delivered via local IMs |
| 👨‍👩‍👧 **Team Shared Mailbox** | Nobody wants to refresh the inbox all day | New emails auto-push to the group, everyone stays informed |

## How It Works

```
New email arrives in Gmail
        │
        │  Google Apps Script (checks every minute)
        │  ─ Runs on Google Cloud, no local PC needed
        │
        ├─→ DeepSeek API ──→ AI Summary
        │                      (1-line summary + details + urgency + to-do)
        │
        └─→ DingTalk Webhook ──→ Your phone / desktop
```

## Quick Start (3 minutes)

### 1. Prerequisites

- A Gmail account
- A [DeepSeek API Key](https://platform.deepseek.com) (free credits for new users)
- A DingTalk group robot Webhook ([create guide](https://open.dingtalk.com/document/orgapp/custom-bot))

### 2. Deploy

```
① Go to https://script.google.com
② Create a new project, clear default code
③ Paste the content of main.gs into the editor
④ Update the CONFIG section with your credentials:
    - deepseekApiKey    → Your DeepSeek API key
    - dingtalkWebhook   → Your DingTalk robot Webhook URL
    - dingtalkSecret    → Your DingTalk signing secret
⑤ Run the init() function → Authorize → Auto-creates a 1-minute trigger
⑥ Run the test() function → Check DingTalk group for a notification → Done!
```

### Config Reference

| Config | Description | How to Get |
|--------|-------------|-----------|
| `deepseekApiKey` | DeepSeek API key | [platform.deepseek.com](https://platform.deepseek.com) → API Keys |
| `deepseekModel` | Model name (default: `deepseek-v4-flash`) | |
| `dingtalkWebhook` | DingTalk robot Webhook | DingTalk group → Settings → Smart Assistant → Add Robot → Custom |
| `dingtalkSecret` | HMAC signing secret (starts with `SEC`) | Choose "Signing" security when creating the robot |
| `checkMinutes` | Check interval in minutes (default: 1) | Adjust based on your needs |
| `maxPerBatch` | Max emails to process per check (default: 5) | |

### Notification Card Example

```
## Q2 Quarterly Report Reminder

**From** zhangsan@company.com 📎
**Time** 06-10 14:30
**Status** 🔴 Urgent

---

**📝 Summary** Reminder to submit Q2 report by tomorrow

**📄 Details** Manager requires all departments to submit
Q2 performance reports by tomorrow 17:00. Template attached.

**📋 Action** Submit Q2 report before tomorrow 17:00

---

📬 [View in Gmail]()
```

## Verification Code Handling

Emails containing verification codes, activation codes, or confirmation codes are **automatically flagged 🔴 urgent**, with the code preserved verbatim in the summary.

## Advanced Usage

### Monitor Specific Labels

Modify the query in `checkNewEmails()`:

```javascript
// Before: Monitor all inbox
var query = "in:inbox after:" + …;

// After: Monitor only IMPORTANT label
var query = "label:important after:" + …;
```

### Customize AI Summary Style

Modify the system prompt in `askDeepSeek()`:

```javascript
// More formal business style
{ role: "system", content: "You are a professional assistant. Generate summaries in formal business Chinese." }

// More concise style
{ role: "system", content: "Generate a 30-character max email summary. Output directly." }
```

### Push to Multiple DingTalk Groups

Add a second Webhook call at the end of `sendToDing()`.

## Roadmap

- [x] DingTalk push notification
- [ ] Feishu (Lark) push notification
- [ ] WeChat Work push notification
- [ ] Customizable AI summary prompt templates
- [ ] Multi-mailbox support
- [ ] Label/tag filtering configuration

## Pricing

| Service | Cost |
|---------|------|
| Google Apps Script | **Free** — 20,000 reads + 20,000 URL fetches per day |
| DeepSeek API | ~¥0.001/call — 1 call/min ≈ ¥1/day |
| DingTalk Robot | **Free** — max 20 messages/min |

## License

MIT © [Ryan Dong](https://github.com/donglinfei-debug)
