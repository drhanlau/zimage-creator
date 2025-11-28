import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Z-image Generator',
  description: 'AI-powered image generation with Wavespeed AI',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}