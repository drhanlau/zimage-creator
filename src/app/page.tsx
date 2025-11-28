'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationTime, setGenerationTime] = useState<number | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsLoading(true)
    setError(null)
    setImageUrl(null)
    setGenerationTime(null)
    const startTime = Date.now()

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setImageUrl(data.imageUrl)
      setGenerationTime((Date.now() - startTime) / 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `zimage-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <h1 className="text-xl font-semibold text-white">Z-image Generator</h1>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Wavespeed AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Prompt Input */}
          <div className="space-y-6">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Prompt
              </label>
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the image you want to create..."
                className="w-full h-40 bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-600">
                  Press Enter to generate, Shift+Enter for new line
                </p>
                <span className="text-xs text-gray-600">
                  {prompt.length} characters
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full h-12 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Image</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-950/50 border border-red-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-400">Error</p>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Tips for better results</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Be specific about style, lighting, and composition
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Include details like &ldquo;photorealistic&rdquo;, &ldquo;digital art&rdquo;, or &ldquo;oil painting&rdquo;
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Describe the mood and atmosphere you want
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Use adjectives to enhance your descriptions
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Image Display */}
          <div className="space-y-4">
            <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
              <div className="aspect-square relative bg-gray-900">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-blue-500 rounded-full absolute top-0 left-0 animate-spin border-t-transparent"></div>
                    </div>
                    <p className="mt-6 text-gray-400 text-sm">Creating your image...</p>
                    <p className="mt-2 text-gray-600 text-xs">This may take a few seconds</p>
                  </div>
                ) : imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Generated image"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Your generated image will appear here</p>
                  </div>
                )}
              </div>

              {/* Image Actions */}
              {imageUrl && (
                <div className="border-t border-gray-800 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {generationTime && (
                        <span>Generated in {generationTime.toFixed(1)}s</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Display */}
            {imageUrl && prompt && (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Prompt used</p>
                <p className="text-sm text-gray-300">{prompt}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 Z-image Generator. All rights reserved.</p>
            <p>Built with Next.js and Wavespeed AI</p>
          </div>
        </div>
      </footer>
    </main>
  )
}