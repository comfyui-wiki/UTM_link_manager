# 🚀 Quick Start Guide

Get started with UTM Link Manager in 5 minutes!

## Step 1: Open the Tool

Double-click `index.html` or open it in your browser. That's it! No installation needed.

## Step 2: (Optional) Set Up Bitly

Want short links like `links.comfy.org/tw`?

1. Click **"⚙️ Setup Token"** button
2. Visit [bitly.com](https://bitly.com) → Settings → Developer Settings → API
3. Copy your API token
4. Paste it and click **"✅ Verify"**
5. Done! Token will be saved automatically

> **Skip this step** if you only need UTM links without shortening.

## Step 3: Create Your First Link

### Single Link Example

Let's create a link for your Twitter bio:

1. **Destination URL**: `https://www.comfy.org/`
2. **Source**: Select `twitter`
3. **Medium**: Leave as `-- Auto --` (or select `social`)
4. **Campaign**: Leave as `-- Auto --` (or select `bio_link`)
5. **Names/Variants**: Leave empty
6. Click **"⚡ Generate Links"**

**Result**: 
```
https://www.comfy.org/?utm_source=twitter
```

### Batch Links Example

Create 10 links for influencer collaboration:

1. **Destination URL**: `https://www.comfy.org/`
2. **Source**: Select `bilibili`
3. **Medium**: Select `influencer`
4. **Campaign**: Select `influencer_collab`
5. **Names/Variants**: Enter (one per line):
   ```
   creator_alice
   creator_bob
   creator_charlie
   ```
6. Click **"⚡ Generate Links"**

**Result**: 3 links with different `utm_content` values!

## Step 4: Create Short Links (Optional)

1. Check the boxes next to links you want to shorten
2. Click **"🔗 Push to Bitly"**
3. Wait a few seconds
4. Done! Short links appear in the table

## Step 5: Copy & Use

Click **"Copy"** button next to any link to copy it to your clipboard. Paste it anywhere!

---

## Common Scenarios

### Scenario 1: Social Media Bio Link

**Need**: One link for your bio

```
Source: twitter / instagram / linkedin
Medium: -- Auto --
Campaign: -- Auto --
Names: (empty)
```

**Short Link**: `links.comfy.org/tw`

---

### Scenario 2: YouTube Video Description

**Need**: Track tutorial video performance

```
Source: youtube
Medium: video
Campaign: tutorial_content
Names: (empty)
```

**Short Link**: `links.comfy.org/yt-tut`

---

### Scenario 3: Multiple Influencers

**Need**: Track which influencer drives most traffic

```
Source: bilibili
Medium: influencer
Campaign: influencer_collab
Names:
  tech_reviewer_zhang
  creative_coder_li
  ai_artist_wang
```

**Result**: 3 unique links, each trackable!

---

## Tips & Tricks

### ✨ Smart Auto-Suggestions
- The tool auto-fills **Short Prefix** based on your source
- Example: `twitter` → `tw`, `bilibili` → `bili`

### 📝 Edit in Table
- Click **Short Alias** field to edit custom URL
- Click **Note** field to add internal memo
- Toggle **Mode** switch to change Custom ↔ Random

### 🔄 Batch Operations
- Select multiple links (checkboxes)
- Click **"🔗 Push to Bitly"** to create all at once
- Click **"🗑️ Delete"** to remove selected links

### 💾 Auto-Save
- All your settings are saved automatically
- Close and reopen - everything's still there!
- No need to manually save

### 📤 Export & Share
- Click **"💾 Export"** to download CSV
- Share with team or backup your links
- Click **"📁 Import"** to restore

---

## What's Next?

### Track Your Results
1. Go to Mixpanel dashboard
2. Create report: "Page Views by utm_source"
3. See which channels drive most traffic!

### Advanced Features
- Read the full [README.md](README.md)
- Learn about duplicate prevention
- Explore export/import options

### Need Help?
- **Token Issues**: Click "Clear" and re-verify
- **Alias Conflicts**: Switch to Random mode
- **Questions**: Check [README.md](README.md) troubleshooting section

---

**That's it! You're ready to create and track all your marketing links.** 🎉

Happy tracking! 📊

