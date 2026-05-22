import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';

export const Banner = ({ params }: ComponentProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div className={`component  ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        <h1>Banner の本体です</h1>
      </div>
    </div>
  );
};

export default Banner;
