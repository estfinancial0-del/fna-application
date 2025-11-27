# Manual Deployment Guide

## Current Situation

I've successfully:
✅ Fixed the deployment architecture issue  
✅ Pushed the fix to GitHub (`d05193a` and `85c37f2`)  
✅ Completed OAuth authentication successfully (unlike the previous stuck session)

However, the Vercel CLI authentication doesn't persist across shell sessions in this environment, making automated deployment challenging.

## The Fix is Ready - Just Needs Deployment

All the code changes are already in your GitHub repository:
- **Commit**: `85c37f2` - "Trigger deployment: deploy the fixed build configuration"
- **Previous commit**: `d05193a` - "Fix Vercel deployment: separate static files from API serverless function"

## How to Deploy (Choose One Method)

### Method 1: Vercel Dashboard (Easiest - Recommended)

1. Go to https://vercel.com/estfinancials-projects/fna-application
2. Click on the "Deployments" tab
3. Find any recent deployment
4. Click the three dots menu (⋮) next to it
5. Click "Redeploy"
6. In the dialog:
   - **Uncheck** "Use existing Build Cache" (important - ensures fresh build with new script)
   - Click "Redeploy"
7. Wait for the deployment to complete (~2-3 minutes)
8. Visit https://fna.est.com.au to verify

### Method 2: Enable Git Auto-Deploy

The project currently has `"live": false` which disables automatic deployments from Git.

1. Go to https://vercel.com/estfinancials-projects/fna-application/settings/git
2. Enable "Production Branch" for the `main` branch
3. The latest commits will automatically deploy
4. Future pushes to `main` will auto-deploy

### Method 3: Create a Deploy Hook

1. Go to https://vercel.com/estfinancials-projects/fna-application/settings/git
2. Scroll to "Deploy Hooks"
3. Create a new hook (name it "Manual Deploy" or similar)
4. Copy the webhook URL
5. Use curl to trigger deployment:
   ```bash
   curl -X POST https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_URL
   ```

### Method 4: Vercel CLI (If you have local access)

If you're on your own machine with Vercel CLI installed:

```bash
# Clone the repository
git clone https://github.com/estfinancial0-del/fna-application.git
cd fna-application

# Login to Vercel (one-time)
vercel login

# Deploy to production
vercel --prod
```

## What the Deployment Will Do

When deployed, the new build script will:

1. **Build frontend** with Vite → Creates HTML, CSS, JS files
2. **Build API function** with esbuild → Creates serverless function for `/api/*` routes
3. **Create Vercel output structure**:
   - `.vercel/output/static/` - Frontend files (served by Vercel CDN)
   - `.vercel/output/functions/api.func/` - Backend API (serverless)
   - `.vercel/output/config.json` - Routing rules

4. **Deploy to production**:
   - Static files served globally from CDN (fast!)
   - API requests handled by serverless function
   - Proper separation of concerns

## Verification After Deployment

Once deployed, check:

1. **Visit https://fna.est.com.au**
   - Should see the actual FNA application interface
   - NOT source code (that was the bug)

2. **Test functionality**:
   - Try logging in
   - Navigate through the app
   - Check if API calls work

3. **Check browser console**:
   - Open DevTools (F12)
   - Look for any errors in the Console tab

4. **Verify build logs**:
   - In Vercel dashboard, click on the deployment
   - Check "Build Logs" tab
   - Should see successful build messages

## Expected Build Log Output

You should see something like:
```
[1/5] Building frontend with Vite...
✓ 2044 modules transformed.
✓ built in 7.3s

[2/5] Building Vercel serverless function...
✓ server/_core/vercel.ts compiled

[3/5] Creating Vercel output structure...
[4/5] Copying static files...
[5/5] Creating API serverless function...

✅ Build Complete
```

## If It Still Shows Source Code

If after deployment you still see source code:

1. **Clear browser cache**: Ctrl+Shift+R (hard refresh)
2. **Check deployment logs**: Look for build errors
3. **Verify environment variables**: Make sure DATABASE_URL, etc. are set
4. **Check the deployment URL**: Try the Vercel preview URL first before the custom domain

## Environment Variables to Set

In Vercel project settings → Environment Variables, make sure these are set:

**Required**:
- `DATABASE_URL` - Your MySQL database connection string
- `OAUTH_SERVER_URL` - OAuth server endpoint
- `JWT_SECRET` - Secret for session cookies
- `OWNER_OPEN_ID` - Admin user OpenID

**Optional** (for analytics):
- `VITE_APP_LOGO`
- `VITE_APP_TITLE`
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

## Summary

**What's Fixed**: Deployment architecture - static files now served by CDN, API by serverless function  
**What's Ready**: Code is in GitHub, just needs to be deployed  
**What You Need to Do**: Trigger a deployment using one of the methods above  
**Expected Result**: Working application at https://fna.est.com.au

---

**Note**: This is NOT the same issue as the previous stuck session. That was an OAuth error (10091). This time, OAuth worked perfectly - we just need to trigger the actual deployment with the fixed code.
