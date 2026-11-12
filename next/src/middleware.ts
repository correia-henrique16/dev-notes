import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Lê o cookie 'token' que o Fastify enviou
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = request.nextUrl.pathname.startsWith('/sign')


  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL('/sign', request.url))
  }

  // Se já tiver token e tentar ir para o sign -> vai para o dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// barra os ficheiros estaticos, e os restantes vao para a funçao middleware verificar
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|logo).*)",
  ],
}