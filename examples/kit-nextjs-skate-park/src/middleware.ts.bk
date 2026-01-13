import { type NextRequest, type NextFetchEvent, NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log(req.url);
  console.log(ev.sourcePage);
  return NextResponse.next();
}

export const config = {
  /*
   * Match all paths except for:
   * 1. /api routes
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   * 7. all root files inside /public
   */
  matcher: ['/', '/((?!api/|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg).*)'],
};
