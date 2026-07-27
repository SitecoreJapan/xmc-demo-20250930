import { NextRequest } from 'next/server';

const EXPERIENCE_EDGE =
  '"https://edge.sitecorecloud.io/sitecoresaa6daf-xmcdemo20253162-test6f9c-330c';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  // lang だけ引き継ぐ
  const lang = request.nextUrl.searchParams.get('lang');

  const mediaUrl = new URL(`${EXPERIENCE_EDGE}/media/${path.join('/')}`);

  if (lang) {
    mediaUrl.searchParams.set('lang', lang);
  }

  // Range は動画等のために引き継ぐ
  const headers: HeadersInit = {};

  const range = request.headers.get('range');
  if (range) {
    headers['Range'] = range;
  }

  const response = await fetch(mediaUrl.toString(), {
    cache: 'no-store',
    headers,
  });

  const responseHeaders = new Headers();

  const copyHeaders = [
    'Content-Type',
    'Content-Length',
    'Content-Disposition',
    'Content-Encoding',
    'ETag',
    'Last-Modified',
    'Accept-Ranges',
    'Content-Range',
  ];

  for (const name of copyHeaders) {
    const value = response.headers.get(name);
    if (value) {
      responseHeaders.set(name, value);
    }
  }

  // Cloudflare の Set-Cookie はコピーしない

  responseHeaders.set('Cache-Control', 'public, s-maxage=14400, stale-while-revalidate=86400');

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
