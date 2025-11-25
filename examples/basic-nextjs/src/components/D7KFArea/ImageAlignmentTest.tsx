import React, { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import type { Field, Item } from '@sitecore-content-sdk/nextjs';

type TopAreaBETransparentVisionProps = ComponentProps & {
  fields: {
    ImageAlignment: ImageAlignmentItem;
  };
};

type ImageAlignmentItem = Item & {
  fields: {
    Alignment: Field<string>;
  };
};

const Default = (props: TopAreaBETransparentVisionProps): JSX.Element => {
  const imageAlignmentClass = (props.fields.ImageAlignment?.fields?.Alignment as Field<string>)
    ?.value;

  console.log('TopAreaBETransparentVisionProps component props111:', imageAlignmentClass);
  return (
    <div className="component-content">
      <h3>{props.fields.ImageAlignment?.fields?.Alignment?.value}</h3>
    </div>
  );
};

export default Default;
