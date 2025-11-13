# 🔗 UTM Link Manager

A secure web-based tool for generating, managing, and tracking UTM links with Bitly integration.

---

## ✨ Features

- **🔗 UTM Link Generation** - Single or batch creation with customizable parameters
- **🌐 Bitly Integration** - Create branded short links with `links.comfy.org`
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

## 📖 Detailed Usage Guide

### Basic Workflow

```
1. Fill form → 2. Generate → 3. Select → 4. Push to Bitly → 5. Manage & Track
```

---

### 1. Form Fields Explained

| Field | Required | What It Does | Example |
|-------|----------|--------------|---------|
| **Destination URL** | ✅ Yes | Where users land when clicking the link | `https://www.comfy.org/` |
| **Source** | ✅ Yes | Traffic platform (utm_source) | `twitter`, `youtube`, `bilibili` |
| **Medium** | No | Channel type (utm_medium) | `social`, `video`, `email` |
| **Campaign** | No | Marketing activity name (utm_campaign) | `beta_launch_2024`, `influencer_collab` |
| **Short Alias** | No | Custom short URL slug (auto-suggested) | `tw`, `bili-creator1` |
| **Names** | No | Create variants (utm_content), one per line | `creator_alice`, `creator_bob` |

**Notes:**
- **Destination URL**: Must be a valid URL starting with `http://` or `https://`
- **Source**: Required field. Can select from dropdown or use custom input
- **Medium**: Optional. If empty, no utm_medium parameter is added
- **Campaign**: Optional. Used for tracking specific campaigns
- **Short Alias**: Auto-suggested based on source and destination URL. Can be edited
- **Names**: Empty = single link without utm_content. With names = each name creates a separate link

---

### 2. Batch Generation

The tool supports powerful batch generation using **Cartesian product** (all combinations):

**How it works:**
- **Source**: Can select multiple sources using "✏️ Other (custom)" → enter one per line
- **Medium**: Can select multiple mediums using "✏️ Other (custom)" → enter one per line  
- **Names**: Each line in Names field creates a separate link

**Example:**
```
Source (custom): 
  twitter
  bilibili
  youtube

Medium (custom):
  social
  video

Names:
  creator_alice
  creator_bob

Result: 3 sources × 2 mediums × 2 names = 12 links!
```

**Batch Indicators:**
- When you enter multiple sources/mediums/names, indicators show:
  - `📦 Batch: 3 sources` (for Source)
  - `📦 Batch: 2 mediums` (for Medium)
  - `Will create 12 links` (below form)

---

### 3. Custom Source/Medium

**To use custom values:**

1. **Select "✏️ Other (custom)"** from Source or Medium dropdown
2. **Textarea appears** below the dropdown
3. **Enter values**, one per line:
   ```
   tiktok
   telegram
   newsletter
   ```
4. **Batch indicator** shows how many sources/mediums you've entered

**Tips:**
- Custom values are case-sensitive
- Empty lines are ignored
- Each line becomes a separate source/medium

---

### 4. Link Modes (Custom vs Random)

**Default Mode** (set in form):
- **Custom**: Uses your Short Alias (e.g., `links.comfy.org/twitter`)
- **Random**: Bitly generates random code (e.g., `links.comfy.org/3kX9pQ2`)

**Per-Link Mode** (toggle in table):
- Each link has a toggle switch in the table
- **ON (Custom)**: Uses Short Alias field value
- **OFF (Random)**: Bitly generates random code

**When to use:**
- **Custom**: When you want memorable, branded URLs
- **Random**: When you don't need specific aliases (faster, no conflicts)

**Important for Custom mode:**
- Short Alias must be filled before pushing to Bitly
- If missing, you'll get a warning
- You can edit Short Alias directly in the table

---

### 5. Unified Note Feature

**Enable unified note:**
1. Check **"Use unified note for all links"** checkbox
2. Choose mode:
   - **Manual input**: Enter note text (required)
   - **Auto generate**: Note created from UTM params (`source - medium - campaign - content`)

**How it works:**
- When enabled, all generated links get the same note
- Manual mode: You type the note once, applies to all links
- Auto mode: Each link gets note like `twitter - social - campaign - creator_alice`

**Use cases:**
- Manual: "Q4 2024 Campaign" for all links
- Auto: Different note per link based on UTM parameters

---

### 6. Short Alias Auto-Suggestion

**How it works:**
- Auto-suggested when you select Source
- Based on source name and destination URL patterns

**Mapping examples:**
- `twitter` → `tw`
- `bilibili` → `bili`
- `youtube` → `yt`
- `discord` → `dc`

**URL-based suffixes:**
- URLs with `download` → adds `-dl`
- URLs with `cloud` → adds `-cloud`
- URLs with `docs` → adds `-docs`

**With Names:**
- Single source: `tw-creator_alice`
- Multiple sources: `tw-twitter-creator_alice` (includes source prefix)

**You can:**
- Edit Short Alias in form before generating
- Edit Short Alias in table after generating
- Leave empty for Random mode links

---

### 7. Generating Links

**Steps:**
1. Fill **Destination URL** (required)
2. Select **Source** (required)
3. Optionally fill Medium, Campaign, Names
4. Click **⚡ Generate Links**

**What happens:**
- Links are created with all UTM parameters
- Duplicate URLs are detected and skipped (warning shown)
- Links appear in the table below
- Form state is auto-saved

**Duplicate detection:**
- Checks if exact same Full URL already exists
- Shows warning: "Found X duplicate link(s)"
- Duplicates are skipped, new links are added

---

### 8. Table Management

**Table columns:**
- ☑️ **Checkbox**: Select links for batch operations
- **Source**: UTM source value
- **Campaign**: Campaign name
- **Content**: utm_content (from Names field)
- **Long URL**: Full UTM link
- **Short Alias**: Editable field (for Custom mode)
- **Mode**: Toggle switch (Custom/Random)
- **Short Link**: Bitly short link (if created)
- **Note**: Editable field
- **Status**: Pending/Created
- **Actions**: Copy, Stats, Delete

**Inline editing:**
- **Short Alias**: Click field, edit, press Enter or click outside
- **Note**: Click field, edit, press Enter or click outside
- Changes saved automatically

**Mode toggle:**
- Click toggle switch to change between Custom/Random
- Custom mode requires Short Alias to be filled
- Random mode ignores Short Alias

---

### 9. Selection & Batch Operations

**Selecting links:**
- **Single**: Click checkbox in row
- **All**: Click checkbox in table header
- **Multiple**: Click individual checkboxes

**Selection info:**
- Shows count: "X selected"
- Enables/disables batch buttons

**Batch operations:**

**🔗 Push to Bitly:**
1. Select links (must not already have short links)
2. Click **🔗 Push to Bitly** button
3. Confirm creation
4. Progress bar shows status
5. Results summary shown

**🗑️ Delete:**
1. Select links
2. Click **🗑️ Delete** button
3. Choose to also delete from Bitly (if applicable)
4. Confirm deletion
5. Progress bar for Bitly deletion (if selected)

---

### 10. Bitly Integration

**Setup:**
1. Click **⚠️ Bitly** button (top right)
2. Panel opens
3. Enter **API Token**: Get from [bitly.com](https://bitly.com) → Settings → Developer Settings → API
4. Enter **Group ID**: From dashboard URL `app.bitly.com/YOUR_GROUP_ID/links/...`
5. Click **✅ Verify**
6. Button turns green **✅ Bitly** when connected

**Creating short links:**
1. Generate links (or use existing)
2. Select links without short links
3. Click **🔗 Push to Bitly**
4. Choose Custom or Random mode (based on link settings)
5. Wait for creation (progress shown)
6. Short links appear in table

**Custom mode requirements:**
- Short Alias must be filled
- If missing, warning shown
- Edit Short Alias in table, then retry

**Random mode:**
- No Short Alias needed
- Bitly generates random code automatically

**Viewing stats:**
- Click **📊 Stats** button for any link with short link
- Opens Bitly dashboard in new tab
- Shows clicks, geography, referrers, timeline
- **Requires**: Group ID must be configured

**Deleting from Bitly:**
- When deleting link, checkbox option appears
- Check "Also delete Bitly short link"
- Progress bar shows deletion status

---

### 11. CSV Import/Export

**Export:**
1. Click **💾 Export CSV** button
2. File downloads: `comfyui_links_YYYY-MM-DD.csv`
3. Contains all link data (Source, Medium, Campaign, URLs, Notes, etc.)

**Import:**
1. Click **📁 Import CSV** button
2. Select CSV file
3. Links are imported and added to table
4. Success message shows count

**CSV format:**
```csv
Source,Medium,Campaign,Content,Base_URL,Full_URL,Short_Alias,Short_Link,Note,Status,Created_At
twitter,social,campaign1,creator1,https://...,https://...?utm_source=...,tw-creator1,https://...,Note text,created,2024-01-01T...
```

**Tips:**
- Export before major changes (backup)
- Import to restore or share links
- CSV can be edited in Excel/Google Sheets

---

### 12. Security & Encryption

**First-time setup:**
- When saving first API token, password dialog appears
- Enter master password (min 8 characters)
- Confirm password
- Encryption enabled automatically

**Daily use:**
- Open tool → Password prompt (if encrypted)
- Enter password → Unlocked for session
- Close tab → Password cleared (auto-lock)

**Unlocking:**
- Click **⚠️ Bitly** button → Unlock dialog appears
- Enter password → Credentials decrypted
- Password verified when actually used (e.g., pushing to Bitly)

**Changing password:**
1. Click **⚠️ Bitly** button
2. Click **🔑 Change Password**
3. Enter current password
4. Enter new password (min 8 chars)
5. Confirm new password
6. All credentials re-encrypted with new password

**Security features:**
- AES-256 encryption
- Password never saved (session only)
- Auto-lock on tab close
- Credentials stored encrypted in localStorage

---

### 13. Form State Auto-Save

**What's saved:**
- Destination URL
- Source selection (including custom values)
- Medium selection (including custom values)
- Campaign
- Short Alias
- Unified Note settings
- Link Mode preference
- Names field

**When it saves:**
- Automatically on field change
- On page refresh, form restores automatically

**Reset:**
- Click **🔄 Reset All** to clear everything
- Warning dialog shows what will be deleted
- Requires confirmation checkbox

---

### 14. Statistics & Tracking

**Header stats:**
- **Total Links**: Count of all generated links
- **Short Links**: Count of links with Bitly short links

**Bitly analytics:**
- Click **📊 Stats** for any created link
- Opens Bitly dashboard with detailed analytics:
  - Total clicks
  - Geographic distribution
  - Referrer sources
  - Click timeline
  - Device types

**Requirements:**
- Group ID must be configured in Bitly Setup
- Link must have short link created

---

### 15. Tips & Best Practices

**Campaign naming:**
- ✅ Use descriptive names: `product_launch_q4_2024`, `influencer_collab_jan`
- ❌ Avoid generic: `test`, `campaign1`, `测试`

**Batch operations:**
- Use for influencer collaborations (one link per creator)
- Use for A/B testing (different sources/mediums)
- Monitor individual performance per link

**Short aliases:**
- Keep them short and memorable
- Use consistent naming: `platform-creator` or `campaign-type`
- Avoid special characters (auto-cleaned)

**Cleanup:**
- Delete test links with Bitly option checked
- Keep active links: uncheck Bitly delete option
- Export before major cleanup (backup)

**Organization:**
- Use Campaign field to group related links
- Use Notes for additional context
- Export regularly for backup

---

## 🐛 Troubleshooting

**Q: Can't save Bitly tokens**
→ When saving first token, encryption setup dialog appears automatically. Enter master password to enable encryption.

**Q: Stats button doesn't work**
→ Configure Group ID in Bitly Setup panel. Get it from Bitly dashboard URL: `app.bitly.com/YOUR_GROUP_ID/...`

**Q: Forgot encryption password**
→ Clear browser localStorage and re-enter tokens:
  1. Open browser DevTools (F12)
  2. Go to Application/Storage → Local Storage
  3. Delete all items for this site
  4. Re-enter Bitly credentials

**Q: Links not generating**
→ Check:
  - Destination URL is filled (required)
  - Source is selected (required)
  - URL starts with `http://` or `https://`

**Q: "Push to Bitly" button is disabled**
→ Check:
  - Bitly API token is configured (click ⚠️ Bitly button)
  - Links are selected (checkbox checked)
  - Selected links don't already have short links

**Q: Custom mode link creation fails**
→ Check:
  - Short Alias is filled in table
  - Alias doesn't conflict with existing Bitly links
  - Switch to Random mode if you don't need custom alias

**Q: Password prompt keeps appearing**
→ This is normal security behavior:
  - Password is stored in session only
  - Close tab = password cleared
  - Reopen = enter password again
  - Password verified when actually using encrypted features

**Q: Form state not saving**
→ Check browser localStorage is enabled:
  - Some browsers block localStorage in private mode
  - Check browser console for errors
  - Try refreshing page

**Q: CSV import not working**
→ Check CSV format matches expected structure:
  - Headers: Source,Medium,Campaign,Content,Base_URL,Full_URL,Short_Alias,Short_Link,Note,Status,Created_At
  - Values properly quoted if contain commas
  - File encoding is UTF-8

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
