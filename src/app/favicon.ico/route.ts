import { NextResponse } from 'next/server';

/** Compatibilidade com navegadores e extensões que pedem /favicon.ico. */
export function GET(request: Request) {
  return NextResponse.redirect(new URL('/logo-girabola.png', request.url), 307);
}
