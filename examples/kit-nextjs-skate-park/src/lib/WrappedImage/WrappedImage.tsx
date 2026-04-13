import React from 'react';
import { NextImage as JssImage, ImageField } from '@sitecore-content-sdk/nextjs';
import { transformUrl } from './transformUrl';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  // Return the JssImage component with the updated field
  //console.log('modifiedField URL:', modifiedField.value?.src);

  return (
    <>
      <div>IS_PREVIEW: {router.locale}</div>
      <div>IMAGE_SITECORE_TARGET_URL: {process.env.IMAGE_SITECORE_TARGET_URL}</div>
      <div>IMAGE_SITECORE_CM: {process.env.IMAGE_SITECORE_CM}</div>
      <div>SITE_STYLE_TYPE: {process.env.SITE_STYLE_TYPE}</div>
      <div>IMAGE_SITECORE_TARGET_URL: {process.env.NEXT_PUBLIC_IMAGE_SITECORE_TARGET_URL}</div>
      <div>IMAGE_SITECORE_CM: {process.env.NEXT_PUBLIC_IMAGE_SITECORE_CM}</div>
      <div>SITE_STYLE_TYPE: {process.env.NEXT_PUBLIC_SITE_STYLE_TYPE}</div>
      <JssImage field={modifiedField} />
    </>
  );
};
