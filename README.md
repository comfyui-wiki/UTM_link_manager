# 🔗 UTM Link Manager

A secure web-based tool for generating, managing, and tracking UTM links with Bitly and Notion integration.

---

## ✨ Features

- **🔗 UTM Link Generation** - Single or batch creation with customizable parameters
- **🌐 Bitly Integration** - Create branded short links with `links.comfy.org`
- **📝 Notion Sync** - Sync links to your Notion database
- **🔒 AES-256 Encryption** - Protect your API tokens with a master password
- **📊 Analytics** - Quick access to Bitly click statistics
- **🗑️ Smart Delete** - Delete from manager and optionally from Bitly
- **💾 Import/Export** - CSV support for backup and sharing

---

## 🚀 Quick Start

### 1. Open the Tool
Open `index.html` in your browser. That's it!

### 2. Set Up Integrations (Optional)

**First Time Only - Security Setup:**
When you try to save your first API token, a popup will ask you to create a master password. This password encrypts all your credentials with AES-256.

**Bitly (for short links):**
1. Click **⚠️ Bitly** button
2. Get API token: [bitly.com](https://bitly.com) → Settings → Developer Settings → API
3. Get Group ID: From Bitly dashboard URL `app.bitly.com/YOUR_GROUP_ID/...`
4. Paste both and click **✅ Verify**
5. Button turns green **✅ Bitly** when connected

**Notion (for team sync):**
1. Click **⚠️ Notion** button
2. Create integration: [notion.so/my-integrations](https://www.notion.so/my-integrations)
3. Create database, share with integration, get Database ID
4. Paste credentials and click **✅ Verify**
5. Button turns green **✅ Notion** when connected

**🔒 Security (automatic):**
- First token save triggers password setup
- All credentials encrypted with AES-256
- Password stored in session only (cleared on tab close)
- Reopen tool = password prompt

### 3. Generate Your First Link

**Simple:**
```
Destination: https://www.comfy.org/
Source: twitter
→ Click "Generate Links"
→ Select and push to Bitly
```

**Batch:**
```
Source: bilibili
Names (one per line):
  creator_alice
  creator_bob
  creator_charlie
→ Creates 3 links instantly
```

---

## 📖 How to Use

### Basic Workflow

```
1. Fill form → 2. Generate → 3. Select → 4. Push to Bitly → 5. Sync to Notion
```

### Field Explanations

| Field | Required | What It Does | Example |
|-------|----------|--------------|---------|
| **Destination URL** | ✅ Yes | Where users land | `https://www.comfy.org/` |
| **Source** | ✅ Yes | Traffic platform | `twitter`, `youtube` |
| **Medium** | No | Channel type | `social`, `video` |
| **Campaign** | No | Marketing activity | `beta_launch_2024` |
| **Names** | No | Create variants | One name per line |

### Special Features

**Custom Source/Medium:**
- Select "✏️ Other (custom)"
- Enter one per line for batch

**Link Modes:**
- **Custom**: Your own short alias (e.g., `twitter`)
- **Random**: Bitly generates code (e.g., `3kX9pQ2`)

**Batch Creation:**
```
3 sources × 2 mediums × 5 names = 30 links!
```

---

## 🔒 Security (Automatic)

**First token save triggers encryption setup:**
- 🔑 Create master password (popup appears)
- 🔐 All credentials encrypted with AES-256
- 💾 Stored locally in browser (encrypted)
- 🚫 Password never saved (session memory only)
- 🚪 Close tab = auto-lock

**Daily use:**
```
Open → Password → Unlocked for session → Close → Locked
```

---

## 📊 Bitly Analytics

### View Stats
- Click **📊 Stats** for any created link
- Opens Bitly dashboard with:
  - Total clicks
  - Geographic data
  - Referrer sources
  - Click timeline

**Requirement:** Group ID must be configured in Bitly Setup

---

## 🗑️ Smart Delete

### Single Link
```
Click "Del" → Dialog appears:
☐ Also delete Bitly short link

✅ Check: Delete from both
❌ Uncheck: Keep Bitly link active
```

### Batch Delete
```
Select multiple → Click "🗑️ Delete" → Dialog:
☐ Also delete X Bitly short links

Progress bar shows deletion status
```

---

## 💡 Tips

### Campaign Naming
```
✅ Good: product_launch_q4_2024, influencer_collab_jan
❌ Avoid: test, campaign1, 测试
```

### Batch Operations
- Use batch for influencer collaborations
- Each creator gets unique tracking link
- Monitor individual performance

### Cleanup
- Delete test links with Bitly option checked
- Keep active links: uncheck Bitly delete

---

## 🐛 Troubleshooting

**Q: Can't save tokens**
→ Enable encryption first (click 🔒 Security)

**Q: Stats button doesn't work**
→ Configure Group ID in Bitly Setup

**Q: Forgot encryption password**
→ Clear browser localStorage and re-enter tokens

**Q: Links not generating**
→ Check Destination URL and Source are filled

---

## 📁 Files

```
├── index.html    # Main tool (open this)
└── README.md     # Documentation
```

That's it! Everything in one HTML file.

---

## 🔐 Privacy & Storage

**Everything is local:**
- ✅ No server, no tracking, no data collection
- ✅ Runs 100% in your browser
- ✅ Credentials encrypted and stored in browser's localStorage
- ✅ Master password in sessionStorage only (cleared on tab close)
- ✅ Same browser required (data is browser-specific)

**Important:** Close the tab = password cleared. Reopen = enter password again.

---

## 📄 License

MIT License - Use freely, modify as needed.

---

**Questions?** The tool should be self-explanatory. If not, we need to improve the UI! 🎯
