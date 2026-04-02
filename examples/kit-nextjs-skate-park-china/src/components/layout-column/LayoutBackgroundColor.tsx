import React, { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

type LayoutBackgroundColorProps = ComponentProps & {
  children?: React.ReactNode;
};

const ComponentContent = (props: LayoutBackgroundColorProps): JSX.Element => {
  return (
    <div className={props.params?.styles || ''} id={props.params?.RenderingIdentifier}>
      <div>
        <div className="component-content">{props.children}</div>
      </div>
    </div>
  );
};

const LayoutBackgroundColor = (props: LayoutBackgroundColorProps): JSX.Element => {
  const phKey = `layoutBackgroundColor-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <Placeholder key={phKey} name={phKey} rendering={props.rendering} />
    </ComponentContent>
  );
};

export default LayoutBackgroundColor;

// export default LayoutBackgroundColor;

// const Default = (props: ComponentProps): JSX.Element => {
//   console.log('7KFArea component props:', props);
//   return <div>test</div>;
// };

// export default Default;
