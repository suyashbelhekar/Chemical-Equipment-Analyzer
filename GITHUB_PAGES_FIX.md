# GitHub Pages Setup Guide

## ✅ Quick Fix for 404 Error

The 404 error you're seeing means GitHub Pages isn't serving your app correctly. Follow these steps:

### Step 1: Update GitHub Repository Settings

1. Go to: https://github.com/suyashbelhekar/Chemical-Equipment-Analyzer/settings/pages
2. Under **"Build and deployment"**:
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `gh-pages` 
   - **Folder:** Select `/ (root)`
3. Click **Save**

### Step 2: Wait for Workflow to Complete

1. Go to: https://github.com/suyashbelhekar/Chemical-Equipment-Analyzer/actions
2. Look for the **"Deploy Frontend to GitHub Pages"** workflow
3. Wait for it to show a ✅ green checkmark (may take 2-3 minutes)
4. Once complete, GitHub Pages will be active

### Step 3: Access Your App

Once the workflow completes, visit:
```
https://suyashbelhekar.github.io/Chemical-Equipment-Analyzer/
```

---

## 🔧 If You Still Get 404

### Option 1: Force Rebuild

1. Go to Actions tab
2. Click "Deploy Frontend to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait 2-3 minutes for deployment

### Option 2: Check Branch Creation

```bash
cd Chemical-Equipment-Analyzer
git branch -r
# Should show: origin/gh-pages
```

If `gh-pages` branch doesn't exist, run:

```bash
git checkout -b gh-pages
git push origin gh-pages
```

### Option 3: Clear Cache

1. Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or open in incognito/private window

---

## 📝 Push Latest Changes

Make sure to push the fixes I just made:

```bash
cd d:\Chemical-Visualizer

git add .github/workflows/deploy.yml web-frontend/vite.config.ts web-frontend/public/404.html

git commit -m "Fix GitHub Pages deployment - add base URL and 404 handling"

git push origin main
```

Then wait for the GitHub Actions workflow to complete.

---

## 🔍 Verify Deployment

Check these to ensure everything is working:

1. **GitHub Actions**
   - Visit: https://github.com/suyashbelhekar/Chemical-Equipment-Analyzer/actions
   - Should show green ✅ checkmark
   - Click on the workflow to see build logs

2. **Pages Settings**
   - Visit: https://github.com/suyashbelhekar/Chemical-Equipment-Analyzer/settings/pages
   - Should show "Your site is live at https://suyashbelhekar.github.io/Chemical-Equipment-Analyzer/"

3. **Your App**
   - Visit: https://suyashbelhekar.github.io/Chemical-Equipment-Analyzer/
   - Should show login page with "Chemical Equipment Visualizer" title

---

## 📊 What Changed

I fixed three things:

### 1. Vite Config (`web-frontend/vite.config.ts`)
```typescript
base: '/Chemical-Equipment-Analyzer/',  // Set correct repo path
```

### 2. 404 Handler (`web-frontend/public/404.html`)
- GitHub Pages serves 404.html for all routes
- This redirects back to index.html for React Router

### 3. Workflow (`.github/workflows/deploy.yml`)
- Updated to latest GitHub Actions
- Proper permissions and artifact handling
- Better error detection

---

## ⏱️ Deployment Timeline

```
You push code
    ↓ (GitHub detects push)
Workflow starts (2-3 min)
    ↓
npm install
npm run build
    ↓
Upload to gh-pages branch
    ↓
GitHub Pages deploys (1-2 min)
    ↓
✅ Live at https://suyashbelhekar.github.io/Chemical-Equipment-Analyzer/
```

Total time: **5-10 minutes**

---

## 🚀 Next Steps

Once GitHub Pages is working:

1. **Deploy Backend** to Railway/Render (see DEPLOYMENT_GUIDE.md)
2. **Update API URL** in App.tsx to use production backend
3. **Test file uploads** from production app
4. **Check PDF generation** works

---

## 📞 Troubleshooting

### Still seeing 404?
- [ ] Workflow completed successfully (green ✅)
- [ ] gh-pages branch exists
- [ ] Settings point to gh-pages branch
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Check browser console for errors (F12)

### Blank white page?
- [ ] Check console errors (F12)
- [ ] Verify API_URL is correct
- [ ] Check Network tab for failed requests

### CSS/JS not loading?
- [ ] Clear browser cache
- [ ] Check if base URL is correct
- [ ] Verify paths in index.html

---

## ✨ Summary

**Your app should now be live at:**
```
https://suyashbelhekar.github.io/Chemical-Equipment-Analyzer/
```

The workflow is automated - every time you push to `main`, it will:
1. Build the React app
2. Deploy to gh-pages branch
3. Update live site (within 5 minutes)

🎉 No more manual deploys needed!
