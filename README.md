# 🔗 UTM Link Manager

A powerful web-based tool for generating, managing, and tracking UTM links with Bitly integration. Perfect for marketing teams to create and organize campaign tracking links efficiently.

## ✨ Features

### 🎯 Link Generation
- **Single or Batch Creation**: Generate one link or hundreds at once
- **Smart Auto-Suggestions**: Automatic short alias generation based on platform and destination
- **UTM Parameter Support**: Full support for `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`
- **Duplicate Detection**: Automatically detects and prevents duplicate links

### 🔗 Bitly Integration
- **Custom Domain Support**: Uses `links.comfy.org` for branded short links
- **Flexible Link Modes**: Choose between custom aliases or random codes
- **Per-Link Control**: Toggle between custom/random mode for each individual link
- **Bulk Operations**: Create multiple short links at once
- **Token Management**: Secure API token storage with validation

### 📊 Link Management
- **Real-time Table**: View and edit all your links in one place
- **Inline Editing**: Modify short aliases and notes directly in the table
- **Status Tracking**: Monitor which links have been shortened
- **Batch Selection**: Select multiple links for bulk operations
- **Export/Import**: Save and share your links via CSV

### 💾 Data Persistence
- **Auto-save**: All form inputs and links are automatically saved
- **Local Storage**: No server required, works entirely in your browser
- **Session Continuity**: Your settings persist across page refreshes

## 🚀 Quick Start

### 1. Open the Tool
Simply open `index.html` in your web browser. No installation or server required!

### 2. Set Up Bitly (Optional)
1. Click **"⚙️ Setup Token"**
2. Get your API token from [bitly.com](https://bitly.com) → Settings → Developer Settings → API
3. Paste token and click **"✅ Verify"**
4. Token will be saved for future use

### 3. Generate Your First Link

**Single Link:**
```
Destination URL: https://www.comfy.org/
Source: twitter
Medium: (leave as "-- Auto --")
Campaign: (leave as "-- Auto --")
Names/Variants: (leave empty)
```
Result: `https://www.comfy.org/?utm_source=twitter`

**Batch Links:**
```
Destination URL: https://www.comfy.org/
Source: bilibili
Medium: video
Campaign: influencer_collab
Names/Variants:
  creator_alice
  creator_bob
  creator_charlie
```
Result: 3 links with different `utm_content` values

### 4. Push to Bitly
1. Select links from the table (checkboxes)
2. Click **"🔗 Push to Bitly"**
3. Your custom short links will be created!

## 📖 How to Use

### Link Generator Form

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| **Destination URL** | ✅ Yes | Where users land | `https://www.comfy.org/` |
| **Source** | ✅ Yes | Traffic platform | `twitter`, `bilibili`, `discord` |
| **Medium** | ⬜ No | Channel type | `social`, `video`, `influencer` |
| **Campaign** | ⬜ No | Marketing activity name | `cloud_beta_launch_2024`, `holiday_sale` |
| **Short Prefix** | ⬜ No | Auto-suggested prefix | `tw`, `bili-inf` |
| **Note** | ⬜ No | Internal memo | `Q4 Campaign` |
| **Mode** | - | Default link mode | Custom or Random |
| **Names/Variants** | ⬜ No | Creates utm_content | One name per line |

### Link Modes

**Custom Mode** (Default):
- Uses your defined short alias
- Example: `links.comfy.org/bili-inf-creator1`
- Readable and memorable

**Random Mode**:
- Bitly generates a random code
- Example: `links.comfy.org/3kL9mPq`
- Shorter, but less descriptive

💡 **Tip**: Toggle the switch in the table to change mode per link!

### Supported Platforms

#### Global Platforms
- Twitter, Discord, GitHub, YouTube
- LinkedIn, Reddit, Instagram, Facebook

#### Chinese Platforms
- Bilibili 
- WeChat 
- WeChat Groups

#### Other
- Email, Partner, Influencer

## 📊 Examples

### Example 1: Social Media Bio Link
```
Source: twitter
Medium: (auto)
Campaign: (auto)
Names: (empty)
```
**Generated URL**: `https://www.comfy.org/?utm_source=twitter`

**Short Link**: `links.comfy.org/tw`

---

### Example 2: YouTube Video Description
```
Source: youtube
Medium: video
Campaign: tutorial_series_2024
Names: (empty)
```
**Generated URL**: `https://www.comfy.org/?utm_source=youtube&utm_medium=video&utm_campaign=tutorial_series_2024`

**Short Link**: `links.comfy.org/yt-tut`

---

### Example 3: Influencer Collaboration (Batch)
```
Source: bilibili
Medium: influencer
Campaign: influencer_collab
Names:
  tech_reviewer_zhang
  creative_coder_li
  ai_artist_wang
```
**Generated URLs**: 3 links with different `utm_content`
- `...&utm_content=tech_reviewer_zhang`
- `...&utm_content=creative_coder_li`
- `...&utm_content=ai_artist_wang`

**Short Links**:
- `links.comfy.org/bili-inf-tech-reviewer-zhang`
- `links.comfy.org/bili-inf-creative-coder-li`
- `links.comfy.org/bili-inf-ai-artist-wang`

## 🔧 Advanced Features

### Duplicate Prevention
- **URL Duplicates**: Automatically skipped with warning
- **Alias Duplicates**: Timestamp suffix added automatically

### Export/Import
- **Export**: Download all links as CSV
- **Import**: Upload CSV to restore or share links
- **Format**: Compatible with Excel and Google Sheets

### Keyboard Shortcuts
- `Enter` in text fields: Focus next field
- `Ctrl/Cmd + S`: (Future) Save links

## 💡 Best Practices

### Naming Conventions
✅ **Good**: `creator_john`, `summer_2024`, `blog_post_title`
❌ **Avoid**: `John's Link!!!`, `测试123`, `link #1`

### Campaign Organization
- Use consistent campaign names across platforms
- Examples: `cloud_beta_launch`, `tutorial_series_01`, `partnership_acme`

### Short Alias Strategy
- **Single links**: Use platform code (e.g., `tw`, `bili`)
- **Batch links**: Include creator/variant name
- **Subpages**: Add suffix (e.g., `tw-docs`, `yt-blog`)

## 📁 File Structure

```
UTM_link_manager/
├── index.html          # Main application (all-in-one file)
└── README.md          # This file
```

## 🔐 Privacy & Security

- ✅ **No Server Required**: Runs entirely in your browser
- ✅ **Local Storage Only**: All data stays on your computer
- ✅ **Token Security**: API token stored locally, never transmitted except to Bitly
- ✅ **No Tracking**: We don't collect any usage data

## 🐛 Troubleshooting

### Bitly Token Issues
**Problem**: "Invalid Token" error
**Solution**:
1. Generate a new token at [bitly.com/a/sign_up](https://bitly.com/a/sign_up)
2. Ensure you have access to `links.comfy.org` domain
3. Click "Clear" and re-verify token

### Short Link Creation Fails
**Problem**: "Custom alias already exists"
**Solution**:
1. Switch to Random mode for that link, OR
2. Change the short alias to something unique

### Links Not Saving
**Problem**: Links disappear after refresh
**Solution**:
- Check browser settings allow localStorage
- Try a different browser (Chrome, Firefox, Safari)

## 📋 CSV Format

When exporting/importing, the CSV format is:

```csv
Source,Medium,Campaign,Content,Base_URL,Full_URL,Short_Alias,Short_Link,Note,Status,Created_At
twitter,social,bio_link,,https://www.comfy.org/,https://www.comfy.org/?utm_source=twitter,tw,https://links.comfy.org/tw,Twitter bio link,created,2024-10-24T10:30:00Z
```

## 🤝 Contributing

This tool is maintained by the ComfyUI Marketing Team. If you have suggestions or find bugs:

1. **Report Issues**: Contact the team directly
2. **Feature Requests**: Submit via team channels
3. **Improvements**: Fork and submit pull requests

## 📚 Resources

### UTM Parameters
- [Google Analytics UTM Guide](https://support.google.com/analytics/answer/1033863)
- [Mixpanel UTM Tracking](https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#track-utm-tags)

### Bitly API
- [Bitly API Documentation](https://dev.bitly.com/)
- [Custom Domains Guide](https://support.bitly.com/hc/en-us/articles/115000047867)

## 📝 Version History

### v1.0 (Current)
- ✅ Single and batch link generation
- ✅ Bitly integration with custom domain
- ✅ Per-link mode control (custom/random)
- ✅ Form state persistence
- ✅ Duplicate detection
- ✅ Export/Import CSV
- ✅ Inline editing
- ✅ Auto-save functionality

## 📄 License

Internal tool for ComfyUI team use.

---

**Need Help?** Contact the Marketing Team or check the [Mixpanel Documentation](https://docs.mixpanel.com/).

**Tool Location**: `GTM/UTM_link_manager/index.html`

