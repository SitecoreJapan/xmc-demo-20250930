import { type NextRequest, NextResponse } from 'next/server';
import {
  defineProxy,
  MultisiteProxy,
  PersonalizeProxy,
  // RedirectsProxy,
} from '@sitecore-content-sdk/nextjs/proxy';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
// import { redirects } from 'next.config';

// type RedirectRule = {
//   pattern: RegExp;
//   destination: string | ((match: RegExpMatchArray) => string);
// };

// // 下記のようなデータは外部Jsonファイルから取得してもよいです。変更があった外部JSON ファイルを更新すればよいです。
// // ただし、await fetch('https://example.com/redirects.json') のように取得する場合は、手前で自分でキャッシュしないとリクエストごとに外部リクエストが発生してしまうため注意してください。
// const redirectRules: RedirectRule[] = [
//   {
//     pattern: /^\/old$/,
//     destination: '/new',
//   },
//   {
//     pattern: /^\/product\/(.*)$/,
//     destination: (match) => `/items/${match[1]}`,
//   },
// ];

export default function proxy(req: NextRequest) {
  // If no Edge server contextId, skip Edge middlewares entirely.
  // (SSR/API can still use Local creds; no crash in Edge runtime.)
  if (!scConfig.api?.edge?.contextId) {
    return NextResponse.next();
  }

  // const url = req.nextUrl;

  // // locale取得（フォールバック付き）
  // const locale = url.locale || req.cookies.get('NEXT_LOCALE')?.value || 'ja';

  // // localeを除いたパスを作る
  // const pathname = url.pathname.replace(`/${locale}`, '') || '/';

  // for (const rule of redirectRules) {
  //   const match = pathname.match(rule.pattern);
  //   if (match) {
  //     let destination =
  //       typeof rule.destination === 'function' ? rule.destination(match) : rule.destination;

  //     // localeを付け直す
  //     destination = `/${locale}${destination}`;

  //     return NextResponse.redirect(new URL(destination, req.url));
  //   }
  // }

  // Instantiate AFTER the guard so constructors don’t run in local-only mode
  const multisite = new MultisiteProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.multisite,
    // This function determines if the middleware should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
    // This is an important performance consideration since Next.js Edge middleware runs on every request.
    skip: () => false,
  });
  // const redirects = new RedirectsProxy({
  //   /**
  //    * List of sites for site resolver to work with
  //    */
  //   sites,
  //   ...scConfig.api.edge,
  //   ...scConfig.redirects,
  //   // This function determines if the middleware should be turned off on per-request basis.
  //   // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  //   // By default it is disabled while in development mode.
  //   // This is an important performance consideration since Next.js Edge middleware runs on every request.
  //   skip: () => false,
  // });

  const personalize = new PersonalizeProxy({
    /**
     * List of sites for site resolver to work with
     */
    sites,
    ...scConfig.api.edge,
    ...scConfig.personalize,
    // This function determines if the middleware should be turned off on per-request basis.
    // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
    // By default it is disabled while in development mode.
    // This is an important performance consideration since Next.js Edge middleware runs on every request.
    skip: () => false,
  });

  return defineProxy(multisite, personalize).exec(req);
  // return defineProxy(multisite, redirects, personalize).exec(req);
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
  matcher: ['/', '/((?!api/|_next/|healthz|sitecore/api/|-/|assets|favicon.ico|sc_logo.svg).*)'],
};
