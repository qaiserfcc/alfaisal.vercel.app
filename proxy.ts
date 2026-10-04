import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const publicPaths = ['/sign-in', '/api/auth']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (publicPaths.some((item) => path === item || path.startsWith(`${item}/`))) return NextResponse.next()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.redirect(new URL('/sign-in', request.url))
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
