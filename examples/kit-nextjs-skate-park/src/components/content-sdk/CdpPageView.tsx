import { CdpHelper, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useEffect } from 'react';
import { pageView, identity, event } from '@sitecore-content-sdk/events';
import config from 'sitecore.config';
import { JSX } from 'react';

/**
 * This is the CDP page view component.
 * It uses the Sitecore Cloud SDK to enable page view events on the client-side.
 * See Sitecore Cloud SDK documentation for details.
 * https://www.npmjs.com/package/@sitecore-cloudsdk/events
 */
const CdpPageView = (): JSX.Element => {
  const {
    page: { layout, siteName, mode },
  } = useSitecore();
  const { route, context } = layout.sitecore;

  /**
   * Determines if the page view events should be turned off.
   * IMPORTANT: You should implement based on your cookie consent management solution of choice.
   * By default it is disabled in development mode
   */
  const disabled = () => {
    return process.env.NODE_ENV === 'development';
  };

  useEffect(() => {
    // Do not create events in editing or preview mode or if missing route data
    if (!mode.isNormal || !route?.itemId) {
      return;
    }
    // Do not create events if disabled (e.g. we don't have consent)
    if (disabled()) {
      return;
    }

    const language = route.itemLanguage || config.defaultLanguage;
    const scope = config.personalize?.scope;

    const pageVariantId = CdpHelper.getPageVariantId(
      route.itemId,
      language,
      context.variantId as string,
      scope
    );
    // there can be cases where Events are not initialized which are expected to reject
    pageView({
      channel: 'WEB',
      currency: 'USD',
      page: route.name,
      pageVariantId,
      language,
    }).catch((e) => console.debug(e));

    event({
      type: 'myPageView',
      language: 'EN',
      page: 'home',
      channel: 'WEB',
      currency: 'EUR',
      customData: { myfield: 'customValue' },
      extensionData: { customKey: 'customValue' },
    });

    identity({
      language: 'EN',
      page: 'home',
      channel: 'WEB',
      currency: 'EUR',
      email: 'jane.doe@myretailsite.com',
      title: 'Miss',
      firstName: 'Jane',
      lastName: 'Doe',
      gender: 'female',
      mobile: '+3531234567',
      phone: '+3531234567',
      city: 'Dublin',
      country: 'IE',
      identifiers: [
        {
          id: 'jane.doe@email.com',
          provider: 'test2',
        },
      ],
      extensionData: { myfield: 'customValue' },
    }).catch((e) => console.debug(e));
  }, [mode, route, context.variantId, siteName]);

  return <></>;
};

export default CdpPageView;
