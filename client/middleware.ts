import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // List of public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/']

  // Check if the request is for an image or other static asset
  const isStaticAsset = request.nextUrl.pathname.match(/\.(jpe?g|png|gif|svg|webp|ico)$/i)

  if (!token && !publicPaths.includes(request.nextUrl.pathname) && !isStaticAsset) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}