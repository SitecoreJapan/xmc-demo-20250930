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
      excludedPaths: getExcludePaths(), // ここで更に二つの選択肢があります。後述
    }),
  },
});

function getExcludePaths(): string[] | undefined {
  return ['/About', '/mystory'];
}

export default client;
