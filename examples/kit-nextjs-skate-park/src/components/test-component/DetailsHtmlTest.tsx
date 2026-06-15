import { JSX } from 'react';
import {
  ComponentRendering,
  Field,
  GetComponentServerProps,
  Item,
  LayoutServiceData,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { NextContext } from '@sitecore-content-sdk/nextjs/types/sharedTypes/component-props';

interface Fields {
  ButtonField: Field<string>;
  TitleField: Field<string>;
}

export type MyTextProps = ComponentProps & {
  fields: Fields;
};

export const getComponentServerProps: GetComponentServerProps = async (
  rendering: ComponentRendering,
  layoutdata: LayoutServiceData,
  context: NextContext
) => {
  const renderingFields = rendering?.fields as unknown;

  console.log('DetailsHtmlTest rendering fields', layoutdata.sitecore.route?.placeholders);

  return { result: '' };
};

export const Default = (prop: MyTextProps): JSX.Element => {
  console.log('DetailsHtmlTest props', prop);

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
