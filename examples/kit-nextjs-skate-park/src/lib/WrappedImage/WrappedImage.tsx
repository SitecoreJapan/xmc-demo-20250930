import React from 'react';
import { NextImage as JssImage, ImageField } from '@sitecore-content-sdk/nextjs';
import { transformUrl } from './transformUrl';
interface WrappedImageProps {
  field: ImageField;
}
export const WrappedImage: React.FC<WrappedImageProps> = ({ field }) => {
  // Ensure that src is defined before applying transformUrl
  const src = field.value?.src;
  // Apply transformation only if src exists
  const transformedUrl = src ? transformUrl(src) : ''; // Fallback to empty string if src is undefined
  const modifiedField = {
    ...field,
    value: {
      ...field.value,
      src: transformedUrl, // Replace original URL with transformed URL
    },
  };
  // Return the JssImage component with the updated field
  return <JssImage field={modifiedField} />;
};
