# Z-image Generator

A modern AI-powered image generation application built with Next.js and Vercel design style, powered by Wavespeed AI.

![Z-image Generator](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

## Features

- 🎨 **Modern UI** - Clean, minimalist dark theme following Vercel's design language
- ⚡ **Fast Generation** - Powered by Wavespeed AI's flux model
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 💾 **Download Images** - Save generated images directly to your device
- 🔗 **Open in New Tab** - View full-size images in a new browser tab
- ⏱️ **Generation Time** - See how long each image took to generate

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Wavespeed AI API key (get one at [wavespeed.ai](https://wavespeed.ai))

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

3. Create a `.env.local` file in the root directory and add your Wavespeed AI API key:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API key:
```
WAVESPEED_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a descriptive prompt in the text area
2. Click "Generate Image" or press Enter
3. Wait for the image to be generated (usually takes 5-10 seconds)
4. Download or open the generated image

### Tips for Better Results

- Be specific about style, lighting, and composition
- Include details like "photorealistic", "digital art", or "oil painting"
- Describe the mood and atmosphere you want
- Use adjectives to enhance your descriptions

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI API**: [Wavespeed AI](https://wavespeed.ai/)

## Project Structure

```
zimage-creator/
├── src/
│   └── app/
│       ├── api/
│       │   └── generate/
│       │       └── route.ts    # API route for image generation
│       ├── globals.css         # Global styles
│       ├── layout.tsx          # Root layout
│       └── page.tsx            # Main page component
├── .env.example                # Environment variables template
├── .env.local                  # Your local environment variables (not in git)
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WAVESPEED_API_KEY` | Your Wavespeed AI API key | Yes |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel

The easiest way to deploy this app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add `WAVESPEED_API_KEY` to your environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/zimage-creator)

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- [Vercel](https://vercel.com) for the design inspiration
- [Wavespeed AI](https://wavespeed.ai) for the image generation API
- [Next.js](https://nextjs.org) for the amazing framework