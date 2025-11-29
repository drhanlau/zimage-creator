# 🔍 Troubleshooting: Can't Generate Images

## Common Issues and Solutions

### Issue 1: Missing Environment Variables ⚠️

The most common reason you can't generate images is **missing API keys** in your `.env.local` file.

#### ✅ Solution:

Make sure you have a `.env.local` file in your project root with ALL of these variables:

```env
# Required for image generation
WAVESPEED_API_KEY=your_actual_wavespeed_key_here

# Required for Google login
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_secret_here

# Required for authentication
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3001

# Already configured - Database
DATABASE_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres

# Already configured - Supabase API
NEXT_PUBLIC_SUPABASE_URL=https://jdxxlxprghfsvfmbinyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeHhseHByZ2hmc3ZmbWJpbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTMyMTcsImV4cCI6MjA3OTk4OTIxN30.FDbBuzFHxM3ruDgavtGiupKfoifr729cT3C-ukQN9Ww
```

**IMPORTANT:** Note the server is running on **port 3001**, so set:
```env
NEXTAUTH_URL=http://localhost:3001
```

### Issue 2: Can't Sign In

If you can't sign in with Google:

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable "Google+ API"
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:3001/api/auth/callback/google`
   - Copy Client ID and Secret to `.env.local`

2. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Add the output to `.env.local`

### Issue 3: "Unauthorized" Error

This means you're not logged in. You must:
1. Sign in with Google first
2. Then you can generate images

### Issue 4: API Error / Generation Failed

If you see API errors:

1. **Check Wavespeed API Key:**
   - Make sure `WAVESPEED_API_KEY` is set in `.env.local`
   - Verify the key is valid at [wavespeed.ai](https://wavespeed.ai)
   - Check you have credits/quota remaining

2. **Check Network:**
   - Ensure you have internet connection
   - Check if wavespeed.ai is accessible

### Issue 5: Database Error

If you see database errors:

1. **Check Supabase Connection:**
   ```bash
   npm run prisma:studio
   ```
   This will test your database connection

2. **Verify Database URL:**
   - Should be: `postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres`

## Quick Diagnostic Steps

### Step 1: Check Browser Console

1. Open your browser dev tools (F12)
2. Go to Console tab
3. Try to generate an image
4. Look for error messages

Common errors:
- `401 Unauthorized` → Not logged in or session expired
- `400 Bad Request` → Missing prompt or validation error
- `500 Internal Server Error` → Check server terminal for errors
- API errors → Wavespeed API key issue

### Step 2: Check Server Terminal

Look at the terminal where you ran `npm run dev`:
- Look for error messages
- Check if API calls are being logged
- Look for database connection errors

### Step 3: Verify Environment Variables

Create a test file to check:

```bash
# From project root
node -e "console.log(process.env.WAVESPEED_API_KEY ? '✓ API Key found' : '✗ API Key missing')"
```

### Step 4: Restart the Server

After updating `.env.local`:

1. Stop the server (Ctrl+C in terminal)
2. Start it again: `npm run dev`
3. Clear browser cache or open incognito window
4. Try again

## Step-by-Step Fix

If nothing works, follow these steps in order:

### 1. Create `.env.local` with ALL required variables

```bash
# Copy this template
cat > .env.local << 'EOF'
WAVESPEED_API_KEY=REPLACE_WITH_YOUR_ACTUAL_KEY
GOOGLE_CLIENT_ID=REPLACE_WITH_YOUR_ACTUAL_ID
GOOGLE_CLIENT_SECRET=REPLACE_WITH_YOUR_ACTUAL_SECRET
NEXTAUTH_SECRET=REPLACE_WITH_GENERATED_SECRET
NEXTAUTH_URL=http://localhost:3001
DATABASE_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://jdxxlxprghfsvfmbinyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeHhseHByZ2hmc3ZmbWJpbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTMyMTcsImV4cCI6MjA3OTk4OTIxN30.FDbBuzFHxM3ruDgavtGiupKfoifr729cT3C-ukQN9Ww
EOF
```

Then edit `.env.local` and replace the placeholder values.

### 2. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and replace `NEXTAUTH_SECRET` value in `.env.local`

### 3. Restart the server

```bash
npm run dev
```

### 4. Access the app

Open: http://localhost:3001

### 5. Sign in with Google

### 6. Try generating an image

## Still Not Working?

Check these specific errors:

### Error: "Prompt is required"
- You need to type something in the prompt box

### Error: "Unauthorized"
- You need to sign in with Google first

### Error: "Failed to generate image"
- Check your Wavespeed API key
- Check server terminal for detailed error
- Verify you have API credits

### Error: Database/Prisma errors
- Run: `npm run prisma:generate`
- Restart server

## Get More Help

1. Check the server terminal output for detailed error messages
2. Check browser console (F12 → Console tab)
3. Verify all environment variables are set correctly
4. Make sure you're using the correct port (3001, not 3000)

## Quick Test

To test if everything is working:

1. ✓ Server running? → Check http://localhost:3001
2. ✓ Can access sign-in page? → Should see Google sign-in button
3. ✓ Can sign in? → Should redirect to main page after Google login
4. ✓ Can see user email in header? → Means authentication works
5. ✓ Can type prompt and click generate? → Should start loading
6. ✓ Image appears? → Success! ✨

If any step fails, that's where the problem is!

