import { JSX } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/react';

interface Fields {
  ButtonField: Field<string>;
  TitleField: Field<string>;
}

export type MyTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields, rendering }: MyTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const phKey = `${RenderingIdentifier}-ph`;
  return (
    <div className={`component  ${styles}`} id={RenderingIdentifier}>
      <details>
        <summary>
          <span>
            <Text field={fields.ButtonField} />
          </span>
        </summary>
        <div>
          <p>
            <Text field={fields.TitleField} />
          </p>
        </div>
        <div>
          <Placeholder key={phKey} name={phKey} rendering={rendering} />
        </div>
      </details>
    </div>
  );
};
