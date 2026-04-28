import { JSX } from 'react';
import {
  Field,
  Text,
  TextField,
  Link as ContentSdkLink,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import NextLink from 'next/link';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Button: Field<string>;
  TestLink: LinkField;
}

export type MyTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: MyTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const editable: TextField = fields.Button as TextField;
  console.log('TestComponent fields', editable);

  const stringValue = fields.Button.value as string;
  console.log('TestComponent fields', stringValue);

  return (
    <div className={`component  ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {/* <ContentSdkLink field={fields.TestLink} className="test-link">
          <em>HTML</em>
        </ContentSdkLink> */}
        <div> The following uses the ContentSDK component:</div>
        <br />
        <div>
          <ContentSdkLink field={fields.TestLink} className="test-link">
            <Text field={fields.Button} editable={true} />
            <svg viewBox="0 0 60 60">
              <path
                className="arrow"
                d="M26.3,41.9c-0.2,0-0.4-0.1-0.5-0.2c-0.3-0.3-0.3-0.8,0-1.1l10.9-10.9L25.7,18.8c-0.3-0.3-0.3-0.8,0-1.1 s0.8-0.3,1.1,0l11.4,11.4c0.3,0.3,0.3,0.8,0,1.1L26.8,41.7C26.6,41.8,26.5,41.9,26.3,41.9z"
              ></path>
              <circle className="circle" cx="30" cy="30" r="28"></circle>
            </svg>
          </ContentSdkLink>
        </div>
        <br />
        <div> The following uses the NextLink component:</div>
        <br />
        <div>
          <NextLink href={fields.TestLink.value.href as string}>
            <Text field={fields.Button} editable={true} />
            <svg viewBox="0 0 60 60">
              <path
                className="arrow"
                d="M26.3,41.9c-0.2,0-0.4-0.1-0.5-0.2c-0.3-0.3-0.3-0.8,0-1.1l10.9-10.9L25.7,18.8c-0.3-0.3-0.3-0.8,0-1.1 s0.8-0.3,1.1,0l11.4,11.4c0.3,0.3,0.3,0.8,0,1.1L26.8,41.7C26.6,41.8,26.5,41.9,26.3,41.9z"
              ></path>
              <circle className="circle" cx="30" cy="30" r="28"></circle>
            </svg>
          </NextLink>
        </div>
        {/* <div>
          <a href={fields.TestLink.value.href}>
            {stringValue}
            <svg viewBox="0 0 60 60">
              <path
                className="arrow"
                d="M26.3,41.9c-0.2,0-0.4-0.1-0.5-0.2c-0.3-0.3-0.3-0.8,0-1.1l10.9-10.9L25.7,18.8c-0.3-0.3-0.3-0.8,0-1.1 s0.8-0.3,1.1,0l11.4,11.4c0.3,0.3,0.3,0.8,0,1.1L26.8,41.7C26.6,41.8,26.5,41.9,26.3,41.9z"
              ></path>
              <circle className="circle" cx="30" cy="30" r="28"></circle>
            </svg>
          </a>
        </div> */}
      </div>
    </div>
  );
};
