# Z-image Generator

A modern AI-powered image generation application built with Next.js and Vercel design style, powered by Wavespeed AI.

![Z-image Generator](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

## Features

- 🔐 **Google Authentication** - Secure access with Google login
- 📊 **Prompt Logging** - Automatic logging of all user prompts with statistics
- 🎨 **Modern UI** - Clean, minimalist dark theme following Vercel's design language
- ⚡ **Fast Generation** - Powered by Wavespeed AI's flux model
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 💾 **Download Images** - Save generated images directly to your device
- 🔗 **Open in New Tab** - View full-size images in a new browser tab
- ⏱️ **Generation Time** - See how long each image took to generate
- 📈 **Analytics Dashboard** - View all prompt logs with filtering and stats

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Wavespeed AI API key (get one at [wavespeed.ai](https://wavespeed.ai))
- Google OAuth credentials (see setup below)
- Supabase account and database (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zimage-creator.git
cd zimage-creator
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Your project is already set up at: `https://jdxxlxprghfsvfmbinyb.supabase.co`
   - Go to Settings → Database → Connection string
   - Copy the "Connection pooling" URI (for DATABASE_URL)
   - Copy the "Direct connection" URI (for DIRECT_URL)
   - Get your database password from the same page

4. Set up Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" and create an OAuth 2.0 Client ID
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - For production, add: `https://yourdomain.netlify.app/api/auth/callback/google`
   - Copy the Client ID and Client Secret

5. Create a `.env.local` file in the root directory:
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
DATABASE_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YrHSvHD4nstfrSvT@db.jdxxlxprghfsvfmbinyb.supabase.co:5432/postgres

# Supabase API
NEXT_PUBLIC_SUPABASE_URL=https://jdxxlxprghfsvfmbinyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeHhseHByZ2hmc3ZmbWJpbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTMyMTcsImV4cCI6MjA3OTk4OTIxN30.FDbBuzFHxM3ruDgavtGiupKfoifr729cT3C-ukQN9Ww
```

6. Generate a NextAuth secret:
```bash
openssl rand -base64 32
```
Add this value to `NEXTAUTH_SECRET` in your `.env.local` file.

7. **Database is already set up!** The Prisma migration has already been run.

8. Start the development server:
```bash
npm run dev
```

9. Open [http://localhost:3000](http://localhost:3000) in your browser.

10. Sign in with your Google account to access the app.

## Usage

1. Sign in with your Google account
2. Enter a descriptive prompt in the text area
3. Click "Generate Image" or press Enter
4. Wait for the image to be generated (usually takes 5-10 seconds)
5. Download or open the generated image
6. Sign out when finished

### Tips for Better Results

- Be specific about style, lighting, and composition
- Include details like "photorealistic", "digital art", or "oil painting"
- Describe the mood and atmosphere you want
- Use adjectives to enhance your descriptions

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **AI API**: [Wavespeed AI](https://wavespeed.ai/)
- **Hosting**: [Netlify](https://www.netlify.com/)

## Project Structure

```
zimage-creator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts    # NextAuth API route
│   │   │   └── generate/
│   │   │       └── route.ts        # API route for image generation
│   │   ├── signin/
│   │   │   └── page.tsx            # Sign in page
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Main page component
│   ├── components/
│   │   └── Providers.tsx           # Session provider wrapper
│   └── middleware.ts               # Auth middleware
├── .env.local                      # Your local environment variables (not in git)
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Project dependencies
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WAVESPEED_API_KEY` | Your Wavespeed AI API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |
| `NEXTAUTH_SECRET` | Random secret for NextAuth (use `openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | URL of your app (e.g., `http://localhost:3000`) | Yes |
| `DATABASE_URL` | Supabase PostgreSQL connection string (with pooling) | Yes |
| `DIRECT_URL` | Supabase PostgreSQL direct connection string | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations (production)
- `npm run prisma:migrate:dev` - Run database migrations (development)
- `npm run prisma:studio` - Open Prisma Studio to view database

## Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on Netlify
3. Add the following environment variables in your Netlify site settings:
   - `WAVESPEED_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your production URL, e.g., `https://yourdomain.netlify.app`)
   - `DATABASE_URL` (Supabase connection string with pooling)
   - `DIRECT_URL` (Supabase direct connection string)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update your Google OAuth authorized redirect URIs to include: `https://yourdomain.netlify.app/api/auth/callback/google`
5. The database migrations will run automatically during build via `postinstall` script
6. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/zimage-creator)

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- [Vercel](https://vercel.com) for the design inspiration
- [Wavespeed AI](https://wavespeed.ai) for the image generation API
- [Next.js](https://nextjs.org) for the amazing framework
