import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import {
  Field,
  LinkField,
  Text,
  Link,
  useSitecore,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { useI18n } from 'next-localization';

type TextLinkProps = ComponentProps & {
  fields: {
    Text: Field<string>;
    URL: LinkField;
  };
};

const TextLink = (props: TextLinkProps): JSX.Element => {
  const { t } = useI18n();
  console.log('App rendered with pageProps2:', t('Test'));

  //console.log('TextLink props fields:', props.fields);
  console.log('props.rendering.uid is:', `${props.rendering.uid?.replace(/{|}/g, '')}`);
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const hasDataSource = props.fields && Object.keys(props.fields).length > 0;

  const hasText = props.fields?.Text?.value && props.fields.Text.value !== '';
  const hasUrl = props.fields?.URL?.value?.href && props.fields.URL.value.href !== '';

  return (
    <div className={`component ${props.params?.styles || 'default'}`}>
      <div>
        <Placeholder name="TextAndImage" rendering={props.rendering} />
        {/* <Placeholder
          name={`TextAndImage-${props.rendering.uid?.replace(/{|}/g, '')}`}
          rendering={props.rendering}
        /> */}
        {/* <Placeholder name="TextAndImage" rendering={props.rendering} /> */}
        {/* <Placeholder
          name={`Text And Image-${props.params.DynamicPlaceholderId}`}
          rendering={props.rendering}
        /> */}
      </div>
      <div>
        {hasDataSource ? (
          <div className="component-content">
            {(isEditing || (hasUrl && hasText)) && (
              <div className="c-link">
                <Link
                  field={props.fields.URL}
                  className="c-link__link"
                  showLinkTextWithChildrenPresent={false}
                >
                  <Text field={props.fields.Text} />
                  <span className="c-link-icon">
                    <svg viewBox="0 0 60 60">
                      <path
                        className="arrow"
                        d="M26.3,41.9c-0.2,0-0.4-0.1-0.5-0.2c-0.3-0.3-0.3-0.8,0-1.1l10.9-10.9L25.7,18.8c-0.3-0.3-0.3-0.8,0-1.1 s0.8-0.3,1.1,0l11.4,11.4c0.3,0.3,0.3,0.8,0,1.1L26.8,41.7C26.6,41.8,26.5,41.9,26.3,41.9z"
                      ></path>
                      <circle className="circle" cx="30" cy="30" r="28"></circle>
                    </svg>
                  </span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TextLink;
