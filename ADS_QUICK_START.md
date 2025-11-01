# Ads Management - Quick Start Guide

## 🚀 Access the Ads Dashboard

1. **Login as root user**
2. **Go to:** `http://localhost:3000/dashboard`
3. **Click the "Ads" tab** (📢 icon) in the sidebar
4. **URL:** `/dashboard?tab=ads-management`

## ➕ Create Your First Ad

### Step 1: Click "Create New Ad"
The button is in the top-right corner of the dashboard.

### Step 2: Fill in the Form

**Ad Title** (Required)
```
Example: "Creative Commons - Republish Our Articles"
```

**Link URL** (Optional)
```
Example: https://creativecommons.org
```
Where should the ad navigate when clicked?

**Position** (Required)
- **Sidebar** ← Recommended (shows in right sidebar of articles)
- Content (within article content)
- Bottom (at end of article)

**Status** (Required)
- **Active** ← Shows on website
- Inactive (hidden, for testing)

**Image** (Required, Max 4MB)
- Click "Choose File"
- Select an image (JPEG, PNG, GIF, WebP, SVG)
- Wait for upload to complete
- See preview below

### Step 3: Submit
- Click **"Create Ad"**
- Wait for success message
- ✅ Done! Your ad is now live

## 👀 View Your Ad

1. **Go to any article page**
   ```
   http://localhost:3000/en/[article-slug]
   ```

2. **Scroll to the right sidebar**
   - Look for "Advertisement" section
   - Your ad should appear there

3. **Click the ad** (if you added a link)
   - Opens in new tab
   - Click is tracked automatically

## 📊 Monitor Performance

### View Stats
On the ads dashboard, you'll see:

- **Total Ads** - How many ads you've created
- **Active** - Currently showing on website
- **Inactive** - Hidden from users

### Check Individual Ad Performance

In the ads table, each ad shows:
- **Impressions** - How many times shown
- **Clicks** - How many times clicked
- **CTR %** - Click-through rate (clicks ÷ impressions × 100)

Example:
```
Impressions: 1,000
Clicks: 50
CTR: 5.0%
```

## ✏️ Edit an Ad

1. **Find the ad** in the table
2. **Click "Edit"** button
3. **Update fields** as needed
4. **Upload new image** (optional)
5. **Click "Update Ad"**

## 🗑️ Delete an Ad

1. **Find the ad** in the table
2. **Click "Delete"** button
3. **Confirm** the deletion
4. ✅ Ad is removed permanently

## 🔄 Activate/Deactivate an Ad

### To hide an ad temporarily:
1. Click "Edit"
2. Change Status to **"Inactive"**
3. Click "Update Ad"
4. ✅ Ad hidden from website (but not deleted)

### To show it again:
1. Click "Edit"
2. Change Status to **"Active"**
3. Click "Update Ad"
4. ✅ Ad visible on website again

## 🎯 Filter Ads

Use the filter buttons to view:

- **Active (default)** - See only live ads
- **All** - See everything
- **Inactive** - See hidden ads

Each button shows the count: `Active (5)`

## 📱 Ad Sizes & Best Practices

### Recommended Image Sizes

**Sidebar Ads (most common):**
- 300 × 250 pixels (Medium Rectangle)
- 300 × 600 pixels (Half Page)

**Content Ads:**
- 728 × 90 pixels (Leaderboard)
- 970 × 250 pixels (Billboard)

**Bottom Ads:**
- 320 × 100 pixels (Mobile Banner)
- 728 × 90 pixels (Desktop Banner)

### File Requirements
- **Max size:** 4MB
- **Formats:** JPEG, PNG, GIF, WebP, SVG
- **Recommended:** Use WebP for best compression

### Design Tips
- ✅ Clear, readable text
- ✅ Strong call-to-action
- ✅ High contrast colors
- ✅ Professional appearance
- ❌ Avoid cluttered designs
- ❌ No misleading content

## 🚨 Common Issues

### "Failed to upload image"
- **Check file size** - Must be < 4MB
- **Check file type** - Must be an image
- **Try again** - May be a network issue

### "Ad not showing on article page"
- **Check status** - Must be "Active"
- **Check position** - Must match where you're looking
- **Refresh page** - Clear cache and reload

### "No ads found"
- **Create an ad first** - Dashboard may be empty
- **Check filter** - You might be on "Inactive" filter

## 🎨 Example Ad Campaign

### Non-Profit Awareness (Like Creative Commons)

**Ad 1: Main Message**
- Title: "Republish Our Articles - Creative Commons"
- Link: https://creativecommons.org
- Image: Creative Commons logo + "Republish this article"
- Position: Sidebar
- Status: Active

**Ad 2: Call to Action**
- Title: "Learn About Creative Commons Licensing"
- Link: https://creativecommons.org/licenses
- Image: License icons + "Free to share"
- Position: Sidebar
- Status: Active

**Result:** Ads rotate randomly on each article page load

## 📈 Performance Goals

### Good CTR Benchmarks:
- **Display Ads:** 0.5% - 2%
- **Awareness Campaigns:** 2% - 5%
- **Call-to-Action:** 5% - 10%+

### If CTR is low (<0.5%):
- Try different image
- Update call-to-action
- Change ad position
- Test new messaging

### If CTR is high (>5%):
- Great job! 🎉
- Keep the ad active
- Create similar variants
- Monitor conversions

## 🔧 Advanced Features

### Multiple Ads Rotation
If you have multiple active ads with the same position:
- System randomly selects one per page load
- Helps A/B test different designs
- Distributes impressions evenly

### Tracking Analytics
All tracking is automatic:
- **Impression tracked** when ad loads
- **Click tracked** when ad is clicked
- **No user action needed** - it just works

### Position Targeting
Create ads for specific locations:
- Sidebar: Best for awareness
- Content: Best for engagement
- Bottom: Best for non-intrusive display

## 📝 Quick Checklist

Before creating an ad:
- [ ] Image ready (< 4MB, good quality)
- [ ] Link URL prepared (if needed)
- [ ] Position decided (sidebar recommended)
- [ ] Title written (clear and concise)

After creating an ad:
- [ ] Check it shows on article pages
- [ ] Test clicking the ad
- [ ] Monitor impressions after 24 hours
- [ ] Check CTR after significant traffic

## 🎉 Success Metrics

**Week 1:**
- Create 3-5 ads
- Get 1,000+ impressions
- Achieve 1%+ CTR

**Month 1:**
- Rotate ads regularly
- Test different designs
- Achieve 2%+ CTR
- Collect engagement data

**Ongoing:**
- Update ads quarterly
- Remove low performers
- A/B test continuously
- Monitor trends

## 💡 Pro Tips

1. **Start simple** - Create 1-2 ads first
2. **Test on mobile** - Check responsive display
3. **Use clear CTAs** - "Learn More", "Get Started", etc.
4. **Monitor regularly** - Check dashboard weekly
5. **Update seasonally** - Refresh ad creative quarterly
6. **Track conversions** - Link to tracking URLs if possible

## 🆘 Need Help?

**Documentation:**
- Full docs: `docs/ADS_SYSTEM_IMPLEMENTATION.md`
- Newsletter docs: `docs/NEWSLETTER_IMPLEMENTATION.md`

**Common URLs:**
- Ads dashboard: `/dashboard?tab=ads-management`
- Article page: `/en/[slug]`
- Upload API: `/api/upload`

---

## 🚀 Ready to Start!

Your ads management system is fully set up and ready to use. Start by creating your first ad and watching the metrics roll in!

**Quick Start:**
1. `/dashboard?tab=ads-management`
2. Click "Create New Ad"
3. Fill form & upload image
4. Click "Create Ad"
5. Visit article page
6. See your ad live! 🎉
