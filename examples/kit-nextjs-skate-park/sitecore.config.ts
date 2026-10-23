import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See the documentation for `defineConfig`:
 * https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 */
export default defineConfig({
  redirects: {
    enabled: false,
    locales: ['en', 'ja-JP', 'en-001', 'en-150', 'en-029', 'vai-Vaii-LR'],
  },
  multisite: {
    enabled: false,
    useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
  },
  personalize: {
    enabled: false,
  },
  rewriteMediaUrls: true,
});
