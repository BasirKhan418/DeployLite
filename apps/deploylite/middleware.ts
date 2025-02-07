import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 import { cookies } from 'next/headers'
import {  redirect } from 'next/navigation';
// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  return NextResponse.next()
  }
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
}