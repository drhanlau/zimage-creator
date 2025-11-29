# Google OAuth Setup Guide

## Step-by-Step Instructions

### Step 1: Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account (laucherhan@gmail.com)

### Step 2: Create a New Project

1. Click the project dropdown at the top of the page
2. Click **"NEW PROJECT"**
3. Enter project name: `Z-Image Generator` (or any name you like)
4. Click **"CREATE"**
5. Wait for the project to be created
6. Make sure your new project is selected in the dropdown

### Step 3: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on it
4. Click **"ENABLE"**

### Step 4: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** user type
3. Click **"CREATE"**

4. Fill in the required fields:
   - **App name**: `Z-Image Generator`
   - **User support email**: `laucherhan@gmail.com`
   - **Developer contact email**: `laucherhan@gmail.com`

5. Click **"SAVE AND CONTINUE"**
6. On the "Scopes" page, click **"SAVE AND CONTINUE"** (no changes needed)
7. On the "Test users" page, add your email:
   - Click **"ADD USERS"**
   - Enter: `laucherhan@gmail.com`
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**
8. Click **"BACK TO DASHBOARD"**

### Step 5: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

4. Configure the OAuth client:
   - **Application type**: Select **"Web application"**
   - **Name**: `Z-Image Web Client`

5. Under **"Authorized redirect URIs"**:
   - Click **"+ ADD URI"**
   - Enter: `http://localhost:3000/api/auth/callback/google`
   - Click **"+ ADD URI"** again
   - Enter: `http://localhost:3001/api/auth/callback/google`

6. Click **"CREATE"**

### Step 6: Copy Your Credentials

A popup will appear with your credentials:

1. **Copy the "Client ID"** - it looks like:
   ```
   123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

2. **Copy the "Client secret"** - it looks like:
   ```
   GOCSPX-abcdefghijklmnopqrstuvwxyz
   ```

3. Keep these safe! You'll need them in the next step.

### Step 7: Update Your .env.local File

Open your `.env.local` file and replace the placeholder values:

```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

### Step 8: Generate NEXTAUTH_SECRET

While you're updating `.env.local`, also generate a secret for NextAuth:

1. Run this command in your terminal:
   ```bash
   openssl rand -base64 32
   ```

2. Copy the output and update `.env.local`:
   ```env
   NEXTAUTH_SECRET=paste_the_generated_secret_here
   ```

### Step 9: Restart Your Development Server

1. Stop the current server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 10: Test Sign In

1. Go to http://localhost:3000
2. Click "Sign in with Google"
3. Choose your Google account
4. You should be redirected back to the app successfully!

## Common Issues

### Issue: "Access blocked: This app's request is invalid"
- **Solution**: Make sure you added the correct redirect URI: `http://localhost:3000/api/auth/callback/google`

### Issue: "Error 401: invalid_client"
- **Solution**: Double-check that your Client ID and Client Secret are copied correctly in `.env.local`

### Issue: "This app isn't verified"
- **Solution**: Click "Advanced" → "Go to Z-Image Generator (unsafe)" - this is normal for development

## For Production (Netlify)

When you deploy to Netlify, you'll need to:

1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add your production redirect URI:
   ```
   https://your-site-name.netlify.app/api/auth/callback/google
   ```
4. Add the same credentials to Netlify environment variables

## Quick Reference

Your `.env.local` should look like this when complete:

```env
WAVESPEED_API_KEY=your_wavespeed_key
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefg
NEXTAUTH_SECRET=some_long_random_string
NEXTAUTH_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://jdxxlxprghfsvfmbinyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeHhseHByZ2hmc3ZmbWJpbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTMyMTcsImV4cCI6MjA3OTk4OTIxN30.FDbBuzFHxM3ruDgavtGiupKfoifr729cT3C-ukQN9Ww
```

