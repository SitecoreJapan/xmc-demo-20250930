import { JSX } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
// import { useRouter } from 'next/router';

interface Fields {
  HtmlCode: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;
  // const router = useRouter();
  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <div dangerouslySetInnerHTML={{ __html: fields.HtmlCode.value }} />
        ) : (
          <span className="is-empty-hint">HtmlCode</span>
        )}
      </div>
    </div>
  );
};
