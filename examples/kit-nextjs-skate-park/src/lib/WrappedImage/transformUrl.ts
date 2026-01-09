// Custom URL transformation function using environment variables
export const transformUrl = (url: string): string => {
  const oldPreviewBaseUrl = process.env.IMAGE_SITECORE_TARGET_URL ?? '';
  const newPreviewBaseUrl = process.env.IMAGE_SITECORE_CM ?? '';

  // If we are on the preview env and the preview URL starts with the old base URL, replace it with the new one
  if (process.env.IS_PREVIEW === 'true' && url.startsWith(oldPreviewBaseUrl)) {
    return url.replace(oldPreviewBaseUrl, newPreviewBaseUrl);
  }

  return url;
};
