import { JSX } from 'react';
import { Field, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  ButtonField: Field<string>;
  TitleField: Field<string>;
}

export type MyTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = (prop: MyTextProps): JSX.Element => {
  return (
    <div>
      <details>
        <summary>
          <span>
            <Text field={prop.fields.ButtonField} />
          </span>
        </summary>
        <div>
          <p>
            <Text field={prop.fields.TitleField} />
          </p>
        </div>
      </details>
    </div>
  );
};
