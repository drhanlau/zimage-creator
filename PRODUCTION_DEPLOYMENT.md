# Production Deployment Guide - Google OAuth Setup

## Step 1: Your Production URL

Your production URL is:
- **`https://zimage.theleadapps.com/`**

**Note:** This is your custom domain. Make sure it's properly configured in Netlify.

## Step 2: Update Google Cloud Console

### 2.1 Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one you created for Z-Image Generator)
3. Go to **"APIs & Services"** → **"Credentials"**

### 2.2 Edit Your OAuth Client

1. Find your OAuth 2.0 Client ID (the one you created earlier)
2. Click the **pencil icon** (Edit) next to it

### 2.3 Add Production Redirect URI

1. Scroll down to **"Authorized redirect URIs"**
2. Click **"+ ADD URI"**
3. Add your production redirect URI:
   ```
   https://zimage.theleadapps.com/api/auth/callback/google
   ```
   **Important:** Use exactly this URL (no trailing slash after `.com`)

4. Click **"SAVE"** at the bottom

### 2.4 Update OAuth Consent Screen (If Needed)

If you're still in testing mode:

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. If you want to make it public (not just test users):
   - Click **"PUBLISH APP"**
   - This will make it available to all Google users
   - Note: This requires verification if you request sensitive scopes

## Step 3: Update Netlify Environment Variables

### 3.1 Go to Netlify Dashboard

1. Go to your [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **"Site settings"** → **"Environment variables"**

### 3.2 Update NEXTAUTH_URL

1. Find `NEXTAUTH_URL` in your environment variables
2. Click to edit it
3. Update it to your production URL:
   ```
   https://zimage.theleadapps.com
   ```
   **Important:**
   - Use `https://` (not `http://`)
   - Don't include a trailing slash after `.com`
   - Use exactly: `https://zimage.theleadapps.com`

4. Click **"Save"**

### 3.3 Verify All Environment Variables

Make sure you have all these set in Netlify:

- ✅ `WAVESPEED_API_KEY` - Your Wavespeed API key
- ✅ `GOOGLE_CLIENT_ID` - From Google Cloud Console
- ✅ `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- ✅ `NEXTAUTH_SECRET` - Same secret you used locally (or generate a new one)
- ✅ `NEXTAUTH_URL` - **Your production URL** (e.g., `https://your-site.netlify.app`)
- ✅ `DATABASE_URL` - Your Supabase connection string
- ✅ `DIRECT_URL` - Your Supabase direct connection string
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Step 4: Redeploy

After updating environment variables:

1. Go to **"Deploys"** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. This will rebuild with the new environment variables

## Step 5: Test Production Login

1. Go to your production site: [https://zimage.theleadapps.com/](https://zimage.theleadapps.com/)
2. Click **"Sign in with Google"**
3. You should be redirected to Google
4. After signing in, you should be redirected back to your site
5. You should now be logged in!

## Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**Cause:** The redirect URI in Google Console doesn't match what NextAuth is using.

**Solution:**
1. Check your `NEXTAUTH_URL` in Netlify - it must be exactly: `https://zimage.theleadapps.com`
2. Check the redirect URI in Google Console - it must be exactly:
   ```
   https://zimage.theleadapps.com/api/auth/callback/google
   ```
3. Make sure there are no typos or extra slashes
4. Wait a few minutes after updating (Google caches settings)

### Issue: "This app isn't verified"

**Cause:** Your app is still in testing mode.

**Solution:**
- For development: Click "Advanced" → "Go to [Your App] (unsafe)"
- For production: Publish your app in OAuth consent screen settings

### Issue: Can't sign in after deployment

**Checklist:**
- ✅ `NEXTAUTH_URL` is set to production URL in Netlify
- ✅ Redirect URI is added in Google Console
- ✅ `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct in Netlify
- ✅ Site has been redeployed after updating environment variables

## Quick Reference

### Google Console Redirect URIs Should Include:

**Development:**
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

**Production:**
```
https://zimage.theleadapps.com/api/auth/callback/google
```

### Netlify Environment Variables:

```env
NEXTAUTH_URL=https://zimage.theleadapps.com
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=your_secret_here
```

## Security Notes

1. **Never commit** `.env.local` or environment variables to Git
2. **Use different secrets** for production if possible (generate new `NEXTAUTH_SECRET`)
3. **Keep your Google Client Secret** secure - don't share it
4. **Use HTTPS** in production (Netlify provides this automatically)

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Check Netlify build logs
3. Verify all environment variables are set correctly
4. Make sure the redirect URI matches exactly (including `https://`)

