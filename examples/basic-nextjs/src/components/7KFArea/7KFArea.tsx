import React, { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';

const Default = (props: ComponentProps): JSX.Element => {
  console.log('7KFArea component props:', props);
  return (
    <div className="component-content">
      <h3>7KFArea</h3>
    </div>
  );
};

export default Default;
