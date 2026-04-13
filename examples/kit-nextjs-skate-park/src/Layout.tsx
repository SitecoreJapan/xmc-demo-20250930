/**
 * This Layout is needed for Starter Kit.
 */
import { JSX, useEffect } from 'react';
import Head from 'next/head';
import { Placeholder, Field, DesignLibrary, Page, LinkField } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';
import { HelloWorld } from '@my/ui';
// import Script from 'next/script';

interface LayoutProps {
  page: Page;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  RedirectUrl?: LinkField;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';

  const typeValue = process.env.SITE_STYLE_TYPE;
  console.log('typeValue: ', typeValue);

  const imagetargetURL = process.env.IMAGE_SITECORE_TARGET_URL;
  console.log('imagetargetURL: ', imagetargetURL);

  const imageCm = process.env.IMAGE_SITECORE_CM;
  console.log('imageCm: ', imageCm);

  const typeValue2 = process.env.NEXT_PUBLIC_SITE_STYLE_TYPE;
  console.log('test: ', typeValue2);

  const imagetargetURL2 = process.env.NEXT_PUBLIC_IMAGE_SITECORE_TARGET_URL;
  console.log('imagetargetURL next.config.js: ', imagetargetURL2);

  const imageCm2 = process.env.NEXT_PUBLIC_IMAGE_SITECORE_CM;
  console.log('imageCm next.config.js: ', imageCm2);

  const redirectTargetUrl = fields?.RedirectUrl?.value?.href?.toString() || '';
  console.log('Redirect Target URL:', redirectTargetUrl);

  useEffect(() => {
    function isValidRedirectUrl(value: string) {
      if (!value || typeof value !== 'string') return false;

      const trimmed = value.trim();
      if (!trimmed) return false;

      // 相対パス
      if (trimmed.startsWith('/')) return true;

      try {
        const parsed = new URL(trimmed);
        return parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }

    if (isValidRedirectUrl(redirectTargetUrl)) {
      window.location.replace(redirectTargetUrl.replace('en-001', 'en-global')); // en-global 対応
    }
  }, [redirectTargetUrl]);

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <Head>
        <title>{fields?.Title?.value?.toString() || 'Page'}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
            var url = "${redirectTargetUrl}";

            function isValidRedirectUrl(value) {
              if (!value || typeof value !== 'string') return false;

              var trimmed = value.trim();
              if (!trimmed) return false;

              // 相対パス許可
              if (trimmed.startsWith('/')) return true;

              try {
                var parsed = new URL(trimmed);
                return parsed.protocol === 'https:';
              } catch (e) {
                return false;
              }
            }

            if (isValidRedirectUrl(url)) {
              window.location.replace(url);
            }
          })();
            `,
          }}
        /> */}
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          <DesignLibrary />
        ) : (
          <>
            <header>
              <div id="header">
                {route && <Placeholder name="headless-header" rendering={route} />}
              </div>
            </header>
            <main>
              <div id="content">
                <h2>{page.siteName}</h2>
                <HelloWorld />
                {route && <Placeholder name="headless-main" rendering={route} />}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && <Placeholder name="headless-footer" rendering={route} />}
              </div>
            </footer>
          </>
        )}
      </div>
      {/* <Script id="redirect-script" strategy="afterInteractive">
        {`
          (function() {
            var url = "${redirectTargetUrl}";

            function isValidRedirectUrl(value) {
              if (!value || typeof value !== 'string') return false;

              var trimmed = value.trim();
              if (!trimmed) return false;

              // 相対パス許可
              if (trimmed.startsWith('/')) return true;

              try {
                var parsed = new URL(trimmed);
                return parsed.protocol === 'https:';
              } catch (e) {
                return false;
              }
            }

            if (isValidRedirectUrl(url)) {
              window.location.replace(url);
            }
          })();
        `}
      </Script> */}
    </>
  );
};

export default Layout;
