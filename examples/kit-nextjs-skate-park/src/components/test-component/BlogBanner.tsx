import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';

const BlogBanner = ({ params }: ComponentProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div className={`component  ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        <h1>Blog Banner の本体です</h1>
      </div>
    </div>
  );
};

export default BlogBanner;
