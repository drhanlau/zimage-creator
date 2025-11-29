# Fix: redirect_uri_mismatch Error

## The Problem

You're seeing this error:
```
Error 400: redirect_uri_mismatch
redirect_uri=https://zimage.theleadapps.com/api/auth/callback/google
```

This means the redirect URI in Google Cloud Console doesn't match what NextAuth is sending.

## Step-by-Step Fix

### Step 1: Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the **correct project** (the one you created for Z-Image Generator)
3. Go to **"APIs & Services"** → **"Credentials"**

### Step 2: Find Your OAuth Client

1. Look for your OAuth 2.0 Client ID in the list
2. It should be named something like "Z-Image Web Client" or similar
3. Click the **pencil icon (Edit)** next to it

### Step 3: Check Authorized Redirect URIs

Scroll down to the **"Authorized redirect URIs"** section.

### Step 4: Add the Exact Redirect URI

1. Click **"+ ADD URI"** button
2. Add **exactly** this URI (copy and paste to avoid typos):
   ```
   https://zimage.theleadapps.com/api/auth/callback/google
   ```

**CRITICAL - Must match exactly:**
- ✅ Starts with `https://` (not `http://`)
- ✅ No trailing slash after `.com`
- ✅ Exact path: `/api/auth/callback/google`
- ✅ No extra spaces or characters

### Step 5: Verify All Redirect URIs

You should have these redirect URIs in your list:

**For Development (if you still need local testing):**
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

**For Production (REQUIRED):**
```
https://zimage.theleadapps.com/api/auth/callback/google
```

### Step 6: Save Changes

1. Click **"SAVE"** at the bottom of the page
2. Wait 1-2 minutes for Google to propagate the changes

### Step 7: Verify Netlify Environment Variable

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **"Site settings"** → **"Environment variables"**
4. Find `NEXTAUTH_URL`
5. Make sure it's set to exactly:
   ```
   https://zimage.theleadapps.com
   ```
   - ✅ No trailing slash
   - ✅ Starts with `https://`
   - ✅ Exact domain: `zimage.theleadapps.com`

### Step 8: Redeploy (If Needed)

If you updated the environment variable:
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

### Step 9: Test Again

1. Go to [https://zimage.theleadapps.com/](https://zimage.theleadapps.com/)
2. Click "Sign in with Google"
3. It should work now!

## Common Mistakes to Avoid

### ❌ Wrong Redirect URI Examples:
```
https://zimage.theleadapps.com/api/auth/callback/google/  (trailing slash)
http://zimage.theleadapps.com/api/auth/callback/google    (http instead of https)
https://zimage.theleadapps.com/api/auth/callback/         (missing /google)
https://zimage.theleadapps.com//api/auth/callback/google  (double slash)
```

### ✅ Correct Redirect URI:
```
https://zimage.theleadapps.com/api/auth/callback/google
```

## Still Not Working?

### Check 1: Wait for Propagation
Google can take 1-5 minutes to update redirect URIs. Wait a few minutes and try again.

### Check 2: Clear Browser Cache
1. Clear your browser cache
2. Try in an incognito/private window
3. Or try a different browser

### Check 3: Verify in Google Console
1. Go back to Google Cloud Console
2. Edit your OAuth client again
3. Scroll to "Authorized redirect URIs"
4. Verify the URI is there and spelled correctly
5. Make sure you clicked "SAVE"

### Check 4: Check Netlify Environment Variables
1. In Netlify, go to Environment Variables
2. Verify `NEXTAUTH_URL` is exactly: `https://zimage.theleadapps.com`
3. No trailing slash, no typos

### Check 5: Check the Error Details
The error message shows what URI NextAuth is trying to use:
```
redirect_uri=https://zimage.theleadapps.com/api/auth/callback/google
```

This should **exactly match** what you have in Google Console.

## Quick Checklist

- [ ] Added redirect URI in Google Cloud Console
- [ ] URI is exactly: `https://zimage.theleadapps.com/api/auth/callback/google`
- [ ] Clicked "SAVE" in Google Console
- [ ] Waited 1-2 minutes for propagation
- [ ] `NEXTAUTH_URL` in Netlify is: `https://zimage.theleadapps.com`
- [ ] Redeployed Netlify site (if you changed environment variables)
- [ ] Cleared browser cache or tried incognito mode

## Need More Help?

If it's still not working after following all steps:
1. Double-check the exact redirect URI in the error message
2. Compare it character-by-character with what's in Google Console
3. Make sure there are no hidden spaces or special characters
4. Try removing and re-adding the redirect URI in Google Console

