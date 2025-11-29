# Supabase Setup Guide

## Quick Setup Instructions

You need to complete the following steps to set up your Supabase database:

### 1. Get Your Database Password

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `jdxxlxprghfsvfmbinyb`
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Click **Reset Database Password** if you don't have it saved
6. Copy your password

### 2. Update Your `.env.local` File

Create or update your `.env.local` file with the following:

```env
# Wavespeed AI API Key
WAVESPEED_API_KEY=your_wavespeed_api_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Supabase Database Connection
# ✅ Already configured with your credentials
DATABASE_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres

# Supabase API
NEXT_PUBLIC_SUPABASE_URL=https://jdxxlxprghfsvfmbinyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeHhseHByZ2hmc3ZmbWJpbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTMyMTcsImV4cCI6MjA3OTk4OTIxN30.FDbBuzFHxM3ruDgavtGiupKfoifr729cT3C-ukQN9Ww
```

### 3. ✅ Database Migration (ALREADY COMPLETED!)

The database migration has been successfully run! The `PromptLog` table is now created in your Supabase database.

This will create the `PromptLog` table in your Supabase database.

### 4. Verify Setup

You can verify your database setup by running:

```bash
npx prisma studio
```

This will open a browser window where you can view your database tables.

## Database Schema

The application creates one table:

### PromptLog Table

| Column | Type | Description |
|--------|------|-------------|
| id | String | Unique identifier |
| userEmail | String | Email of the user who submitted the prompt |
| prompt | String | The image generation prompt |
| imageUrl | String? | URL of the generated image (if successful) |
| status | String | Status: "success", "failed", or "error" |
| errorMessage | String? | Error message if generation failed |
| generationTime | Float? | Time taken to generate image (in seconds) |
| createdAt | DateTime | Timestamp of when the prompt was submitted |

## Troubleshooting

### Connection Issues

If you can't connect to the database:

1. **Check your password**: Make sure you're using the correct database password
2. **Check the connection string**: Verify the format is correct
3. **Check Supabase status**: Go to your dashboard and ensure the database is active
4. **Firewall/Network**: Ensure your network allows connections to Supabase

### Migration Issues

If migrations fail:

1. **Reset migrations**: Delete the `prisma/migrations` folder and run the migration again
2. **Check permissions**: Ensure your database user has permission to create tables
3. **Manual migration**: You can manually create the table using Supabase SQL Editor:

```sql
CREATE TABLE "PromptLog" (
  id TEXT PRIMARY KEY,
  "userEmail" TEXT NOT NULL,
  prompt TEXT NOT NULL,
  "imageUrl" TEXT,
  status TEXT NOT NULL,
  "errorMessage" TEXT,
  "generationTime" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PromptLog_userEmail_idx" ON "PromptLog"("userEmail");
CREATE INDEX "PromptLog_createdAt_idx" ON "PromptLog"("createdAt");
```

## For Netlify Deployment

When deploying to Netlify:

1. Add all environment variables in **Site settings** → **Environment variables**
2. The migration will run automatically via the `postinstall` script
3. Make sure to use the same database password in production
4. Update `NEXTAUTH_URL` to your Netlify domain

## Support

If you encounter any issues:
- Check [Supabase Documentation](https://supabase.com/docs)
- Check [Prisma Documentation](https://www.prisma.io/docs)
- Verify all environment variables are correctly set

