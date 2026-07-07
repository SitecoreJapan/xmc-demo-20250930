import { JSX } from 'react';
import { Field, GetComponentServerProps, Text } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  ButtonField: Field<string>;
  TitleField: Field<string>;
}

export type MyTextProps = ComponentProps & {
  fields: Fields;
};

export const getComponentServerProps: GetComponentServerProps = async () => {
  return { result: '' };
};

export const Default = (prop: MyTextProps): JSX.Element => {
  // console.log('DetailsHtmlTest props', prop);

  return (
    <div>
      <details>
        <summary>
          <span>
            <Text field={prop.fields.ButtonField} />
          </span>
        </summary>
        <div>
          <Text field={prop.fields.TitleField} />
        </div>
      </details>
    </div>
  );
};
