import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const country = request.geo?.country || request.headers.get('x-vercel-ip-country');
  
  console.log('Detected country:', country); // Add logging
  

  const allowedCountries = ['TT']

  if (!allowedCountries.includes(country ?? '')) { // Invert the condition
    console.log('Blocking access for country:', country); // Add logging
    return NextResponse.redirect(new URL('/blocked', request.url))
  }

  console.log('Allowing access for country:', country); // Add logging
  return NextResponse.next()
}
