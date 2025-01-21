import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the environment is production
  if (process.env.NODE_ENV === 'production') {
    const country = request.geo?.country || request.headers.get('x-vercel-ip-country');
    
    console.log('Detected country:', country);

    const allowedCountries = ['TT']

    if (request.nextUrl.hostname === 'localhost' || allowedCountries.includes(country ?? '')) {
      console.log('Allowing access for country:', country);
    } else {
      console.log('Blocking access for country:', country);
      return NextResponse.redirect(new URL('/blocked', request.url));
    }

    console.log('Allowing access for country:', country);
  }

  return NextResponse.next()
}
