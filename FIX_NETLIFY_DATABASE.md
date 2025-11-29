# Fix: Netlify Database Connection Error

## The Problem

Netlify serverless functions can't connect to Supabase database:
```
Can't reach database server at `db.jdxxlxprghfsvfmbinyb.supabase.co:5432`
```

## Why This Happens

Netlify serverless functions need **connection pooling** (pgBouncer) instead of direct database connections. The direct connection (port 5432) doesn't work well with serverless environments.

## Solution: Use Connection Pooling

### Step 1: Get Your Supabase Connection Pooling URL

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `jdxxlxprghfsvfmbinyb`
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Find the **"Connection pooling"** section
6. Select **"Transaction"** mode
7. Copy the connection string - it should look like:
   ```
   postgresql://postgres.jdxxlxprghfsvfmbinyb:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Step 2: Update Netlify Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **"Site settings"** → **"Environment variables"**

### Step 3: Update DATABASE_URL

1. Find `DATABASE_URL` in your environment variables
2. Click to edit it
3. Replace it with the **connection pooling URL**:

**For Netlify (USE THIS):**
```
postgresql://postgres.jdxxlxprghfsvfmbinyb:YrHSvHD4nstfrSvT@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important differences:**
- ✅ Uses `pooler.supabase.com` (not `db.supabase.co`)
- ✅ Uses port `6543` (not `5432`)
- ✅ Includes `?pgbouncer=true` parameter
- ✅ Username format: `postgres.jdxxlxprghfsvfmbinyb` (includes project ref)

### Step 4: Keep DIRECT_URL for Migrations (Optional)

The `DIRECT_URL` can stay as is (for local development and migrations):
```
postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
```

### Step 5: Add SSL Parameter (If Still Not Working)

If you still get connection errors, add SSL parameters:

```
postgresql://postgres.jdxxlxprghfsvfmbinyb:YrHSvHD4nstfrSvT@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

### Step 6: Redeploy

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

### Step 7: Test

1. Go to your site: [https://zimage.theleadapps.com/](https://zimage.theleadapps.com/)
2. Sign in
3. Try generating an image
4. Check Netlify function logs - the database connection should work now

## Connection String Comparison

### ❌ Wrong (Direct Connection - Doesn't Work on Netlify):
```
postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
```

### ✅ Correct (Connection Pooling - Works on Netlify):
```
postgresql://postgres.jdxxlxprghfsvfmbinyb:YrHSvHD4nstfrSvT@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Key Differences

| Feature | Direct (5432) | Pooling (6543) |
|---------|---------------|----------------|
| Host | `db.jdxxlxprghfsvfmbinyb.supabase.co` | `aws-0-us-west-1.pooler.supabase.com` |
| Port | `5432` | `6543` |
| Username | `postgres` | `postgres.jdxxlxprghfsvfmbinyb` |
| Parameter | None | `?pgbouncer=true` |
| Works on Serverless | ❌ No | ✅ Yes |

## Troubleshooting

### Still Getting Connection Errors?

1. **Verify the connection string format:**
   - Must use `pooler.supabase.com`
   - Must use port `6543`
   - Must include `?pgbouncer=true`
   - Username must include project ref: `postgres.jdxxlxprghfsvfmbinyb`

2. **Check Supabase Dashboard:**
   - Go to Settings → Database
   - Make sure connection pooling is enabled
   - Copy the exact connection string from there

3. **Add SSL if needed:**
   ```
   ...?pgbouncer=true&sslmode=require
   ```

4. **Check Netlify Logs:**
   - Go to Functions tab in Netlify
   - Check for any connection errors
   - Look for the exact error message

5. **Verify Environment Variable:**
   - Make sure `DATABASE_URL` is set correctly in Netlify
   - No extra spaces or characters
   - URL is properly encoded

## Quick Fix Summary

**In Netlify Environment Variables, set `DATABASE_URL` to:**

```
postgresql://postgres.jdxxlxprghfsvfmbinyb:YrHSvHD4nstfrSvT@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Then redeploy!

