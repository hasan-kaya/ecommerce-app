import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sessionToken = request.cookies.get('session_token')?.value;
  if (sessionToken) {
    response.headers.set('x-session-token', sessionToken);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
