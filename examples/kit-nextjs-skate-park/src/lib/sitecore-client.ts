import { SitePathService } from '@sitecore-content-sdk/nextjs';
import { createGraphQLClientFactory, SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';

const client = new SitecoreClient({
  ...scConfig,
  custom: {
    sitePathService: new SitePathService({
      clientFactory: createGraphQLClientFactory({
        api: scConfig.api,
      }),
      excludedPaths: getExcludePaths(),
    }),
  },
});

function getExcludePaths(): string[] | undefined {
  return ['/About', '/mystory'];
}

export default client;
