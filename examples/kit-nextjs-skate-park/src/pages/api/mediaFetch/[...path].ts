import type { NextApiRequest, NextApiResponse } from 'next';

const EXPERIENCE_EDGE =
  'https://edge.sitecorecloud.io/sitecoresaa6daf-xmcdemo20253162-test6f9c-330c';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  // /api/media/xxx/yyy
  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path ?? '');

  // lang だけ転送
  const mediaUrl = new URL(`${EXPERIENCE_EDGE}/media/${path}`);
  console.log(`mediaUrl: ${mediaUrl.toString()}`);

  if (typeof req.query.sc_lang === 'string') {
    mediaUrl.searchParams.set('sc_lang', req.query.sc_lang);
  }

  const response = await fetch(mediaUrl);

  // 必要なヘッダーだけコピー
  ['content-type', 'content-length', 'etag', 'last-modified'].forEach((name) => {
    const value = response.headers.get(name);
    if (value) {
      res.setHeader(name, value);
    }
  });

  // Vercel CDN キャッシュ
  res.setHeader('CDN-Cache-Control', 'public, s-maxage=100, stale-while-revalidate=300');

  res.status(response.status);

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    res.write(Buffer.from(value));
  }

  res.end();
}
