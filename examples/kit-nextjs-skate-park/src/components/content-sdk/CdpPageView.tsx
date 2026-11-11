import { CdpHelper, useSitecore } from '@sitecore-content-sdk/nextjs';
import { useEffect, useState } from 'react';
import { pageView, identity, event } from '@sitecore-content-sdk/events';
import config from 'sitecore.config';
import { JSX } from 'react';
import { personalize } from '@sitecore-content-sdk/personalize';

interface PersonalizeResponse {
  message: string;
}

const CdpPageView = (): JSX.Element => {
  const {
    page: { layout, siteName, mode },
  } = useSitecore();

  const { route, context } = layout.sitecore;

  // ユーザーが入力する email
  const [email, setEmail] = useState('');

  // identity の実行結果を表示するため
  const [identityMessage, setIdentityMessage] = useState('');

  const disabled = () => {
    return process.env.NODE_ENV === 'development';
  };

  /*
   * Loginボタン押下時に実行
   */
  const handleLogin = async (): Promise<void> => {
    if (!email.trim()) {
      setIdentityMessage('Email を入力してください。');
      return;
    }

    try {
      await identity({
        language: 'EN',
        page: 'home',
        channel: 'WEB',
        currency: 'EUR',

        // 入力された email を使用
        email: email.trim(),

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
            id: email.trim(),
            provider: 'test2',
          },
        ],

        extensionData: {
          myfield: 'customValue',
        },
      });

      console.log('Identity sent:', email);

      setIdentityMessage(`Identity sent: ${email}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Identity failed:', error.message);
        setIdentityMessage(`Identity failed: ${error.message}`);
      } else {
        console.error('Identity failed:', error);
        setIdentityMessage('Identity failed');
      }
    }
  };

  useEffect(() => {
    // Do not create events in editing or preview mode
    if (!mode.isNormal || !route?.itemId) {
      return;
    }

    // Do not create events if disabled
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
      extensionData: {
        customKey1: 'extValue1',
        customKey2: 'extValue2',
      },
      myData: {
        customKey1: 'myValue1',
        customKey2: 'myValue2',
      },
    }).catch((e) => console.debug(e));

    const loadData = async (): Promise<void> => {
      try {
        const response = await personalize({
          channel: 'WEB',
          friendlyId: 'testheadlessper',
        });

        const typedResponse = response as PersonalizeResponse;

        console.log(typedResponse.message);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Failed to load products:', error.message);
        } else {
          console.error('Failed to load products:', error);
        }
      }
    };

    void loadData();
  }, [mode, route, context.variantId, siteName, email]);

  return (
    <div>
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="button" onClick={() => void handleLogin()}>
        Login
      </button>

      {identityMessage && <p>{identityMessage}</p>}
    </div>
  );
};

export default CdpPageView;
