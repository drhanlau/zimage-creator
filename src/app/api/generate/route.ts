import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const WAVESPEED_API_KEY = process.env.WAVESPEED_API_KEY
const WAVESPEED_API_URL = 'https://api.wavespeed.ai/api/v3/wavespeed-ai/z-image/turbo'

interface WavespeedCreateResponse {
  code: number
  message: string
  data: {
    id: string
    status: string
    outputs?: string[]
  }
}

interface WavespeedStatusResponse {
  code: number
  message: string
  data: {
    id: string
    status: string
    outputs?: string[]
  }
}

async function pollForResult(taskId: string, maxAttempts = 60): Promise<string | null> {
  const statusUrl = `https://api.wavespeed.ai/api/v2/predictions/${taskId}/result`

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds between polls

    try {
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WAVESPEED_API_KEY}`,
        },
      })

      if (!response.ok) {
        console.error('Polling error:', response.status)
        continue
      }

      const data: WavespeedStatusResponse = await response.json()
      console.log('Polling response:', JSON.stringify(data))

      if (data.data?.status === 'completed' && data.data?.outputs && data.data.outputs.length > 0) {
        return data.data.outputs[0]
      }

      if (data.data?.status === 'failed') {
        return null
      }
    } catch (error) {
      console.error('Polling error:', error)
    }
  }

  return null
}

export async function POST(request: Request) {
  const startTime = Date.now()
  let userEmail = ''
  let promptText = ''

  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    userEmail = session.user?.email || 'unknown'
    const { prompt } = await request.json()
    promptText = prompt

    if (!prompt || typeof prompt !== 'string') {
      // Log failed request
      await prisma.promptLog.create({
        data: {
          userEmail,
          prompt: promptText || '',
          status: 'failed',
          errorMessage: 'Prompt is required',
        },
      })

      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('Generating image with prompt:', prompt)

    // Call Wavespeed AI API
    const response = await fetch(WAVESPEED_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WAVESPEED_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        size: '1024*1024',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        enable_safety_checker: true,
      }),
    })

    const responseText = await response.text()
    console.log('Wavespeed API response:', responseText)

    if (!response.ok) {
      console.error('Wavespeed API error:', responseText)
      return NextResponse.json(
        { error: `API error: ${response.status} - ${responseText}` },
        { status: response.status }
      )
    }

    let data: WavespeedCreateResponse
    try {
      data = JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { error: 'Invalid API response' },
        { status: 500 }
      )
    }

    // Check if we got outputs directly
    if (data.data?.outputs && data.data.outputs.length > 0) {
      const generationTime = (Date.now() - startTime) / 1000
      const imageUrl = data.data.outputs[0]

      // Log successful generation
      await prisma.promptLog.create({
        data: {
          userEmail,
          prompt: promptText,
          imageUrl,
          status: 'success',
          generationTime,
        },
      })

      return NextResponse.json({ imageUrl })
    }

    // If we got a task ID, poll for the result
    if (data.data?.id) {
      console.log('Got task ID, polling for result:', data.data.id)
      const imageUrl = await pollForResult(data.data.id)

      if (imageUrl) {
        const generationTime = (Date.now() - startTime) / 1000

        // Log successful generation
        await prisma.promptLog.create({
          data: {
            userEmail,
            prompt: promptText,
            imageUrl,
            status: 'success',
            generationTime,
          },
        })

        return NextResponse.json({ imageUrl })
      }

      // Log timeout error
      await prisma.promptLog.create({
        data: {
          userEmail,
          prompt: promptText,
          status: 'error',
          errorMessage: 'Image generation timed out',
        },
      })

      return NextResponse.json(
        { error: 'Image generation timed out' },
        { status: 408 }
      )
    }

    // Log failed generation
    await prisma.promptLog.create({
      data: {
        userEmail,
        prompt: promptText,
        status: 'failed',
        errorMessage: 'Failed to generate image - no output received',
      },
    })

    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Generation error:', error)

    // Log error
    try {
      await prisma.promptLog.create({
        data: {
          userEmail: userEmail || 'unknown',
          prompt: promptText || 'unknown',
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Internal server error',
        },
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
