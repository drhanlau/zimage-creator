import { NextResponse } from 'next/server'

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
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
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
      return NextResponse.json({ imageUrl: data.data.outputs[0] })
    }

    // If we got a task ID, poll for the result
    if (data.data?.id) {
      console.log('Got task ID, polling for result:', data.data.id)
      const imageUrl = await pollForResult(data.data.id)

      if (imageUrl) {
        return NextResponse.json({ imageUrl })
      }

      return NextResponse.json(
        { error: 'Image generation timed out' },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}