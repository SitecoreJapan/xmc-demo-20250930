const path = require('path');

const typeValue = process.env.SITE_STYLE_TYPE;
console.log('in next.config.js: ', typeValue);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // Enable Turbopack file system caching for faster dev startup (beta)
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  // experimental: {
  //   turbopackFileSystemCacheForDev: true,
  // },

  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    // locales: ['en', 'ja-JP', 'en-001', 'en-002', 'de-DE'],
    locales: ['en', 'ja-JP', 'en-001', 'en-150', 'en-029', 'vai-Vaii-LR'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/about`.
    defaultLocale: process.env.DEFAULT_LANGUAGE || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/mymedia/:path*',
        destination:
          'https://edge.sitecorecloud.io/sitecoresaa6daf-xmcdemo20253162-test6f9c-330c/media/Project/demo/:path*?sc_lang=en',
      },
      {
        source: '/sitecoresaa6daf-xmcdemo20253162-test6f9c-330c/media/:path*',
        destination:
          'https://edge.sitecorecloud.io/sitecoresaa6daf-xmcdemo20253162-test6f9c-330c/media/:path*',
      },
      // {
      //   source: '/en-global/:path*',
      //   destination: '/en-001/:path*',
      //   locale: false,
      // },
      // // ★ data 用（重要：locale=en はそのまま）
      // {
      //   source: '/_next/data/:buildId/en/en-global/:path*.json',
      //   destination: '/_next/data/:buildId/en/en-001/:path*.json',
      // },
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      {
        source: '/-/media/:path*',
        destination:
          'https://xmc-sitecoresaa6daf-xmcdemo20253162-test6f9c.sitecorecloud.io/-/media/:path*',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      // sitemap route
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap',
      },
      // feaas api route
      {
        source: '/feaas-render',
        destination: '/api/editing/feaas/render',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/mymedia/:path*',
        headers: [
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, s-maxage=3600',
          },
          {
            key: 'Vercel-Cache-Tag',
            value: 'mymedia',
          },
        ],
      },
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },

  webpack: (config, options) => {
    // const styleType = process.env.SITE_STYLE_TYPE || 'hq';
    // console.log(`Setting up webpack alias for style type: ${styleType}`);

    // const publichstyleType = process.env.NEXT_PUBLIC_SITE_STYLE_TYPE || 'public_hq';
    // console.log(`Public Setting up webpack alias for style type: ${publichstyleType}`);

    // const target = path.resolve(__dirname, `src/assets/${styleType}/main.css`);
    // console.log('@theme-styles =>', target);

    // // alias を追加
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@theme-styles': path.resolve(__dirname, `src/assets/${styleType}/main.css`),
    // };

    if (!options.isServer) {
      // Add a loader to strip out getComponentServerProps from components in the client bundle
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        use: ['@sitecore-content-sdk\\nextjs\\component-props-loader'],
      });
    } else {
      // Force use of CommonJS on the server for FEAAS SDK since Content SDK also uses CommonJS entrypoint to FEAAS SDK.
      // This prevents issues arising due to FEAAS SDK's dual CommonJS/ES module support on the server (via conditional exports).
      // See https://nodejs.org/api/packages.html#dual-package-hazard.
      config.externals = [
        {
          '@sitecore-feaas/clientside/react': 'commonjs @sitecore-feaas/clientside/react',
          '@sitecore/byoc': 'commonjs @sitecore/byoc',
          '@sitecore/byoc/react': 'commonjs @sitecore/byoc/react',
        },
        ...config.externals,
      ];
    }

    return config;
  },
};

module.exports = nextConfig;
