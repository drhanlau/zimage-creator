import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block access to /logs route
  if (pathname.startsWith('/logs')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Block access to /api/logs route
  if (pathname.startsWith('/api/logs')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Apply NextAuth middleware for protected routes
  const token = await getToken({ req: request })

  if (!token && (pathname === '/' || pathname.startsWith('/api/generate'))) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/api/generate',
    '/logs/:path*',
    '/api/logs/:path*',
  ],
}


