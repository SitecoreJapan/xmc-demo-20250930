import { JSX, useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import client from 'lib/sitecore-client';
import { GetComponentServerProps } from '@sitecore-content-sdk/nextjs';

export interface QueryResult {
  item: {
    id: string;
    children: {
      results: {
        id: string;
        children: {
          results: {
            path: string;
            idisShow: {
              boolValue: boolean;
            } | null;
          }[];
        };
      }[];
    };
  } | null;
}

export const ALL_PAGE = gql`
  query GetFooterItem($id: String!, $language: String!, $targetTemplateID: [String!]!) {
    item(path: $id, language: $language) {
      id
      children(includeTemplateIDs: $targetTemplateID) {
        results {
          id
          children {
            results {
              path
              idisShow: field(name: "Is Show") {
                ... on CheckboxField {
                  boolValue
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getComponentServerProps: GetComponentServerProps = async () => {
  // プレビューではない環境のみ、静的データを取得する。ここで取得したデータは HTMLソースの末尾に JSON形式で埋め込まれる。

  const result = await client.getData<QueryResult>(ALL_PAGE, {
    id: '{F885E693-1E97-499C-B898-980CEA8D5CFC}',
    language: 'en',
    targetTemplateID: ['{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}'],
  });

  console.log(
    'getComponentServerProps result2:',
    result.item?.children?.results[0]?.children?.results
  );

  return { staticResults: result };
};

const MyNavigationUsingGraphQL = (): JSX.Element => {
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="component-content">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="component-content">
      <h3>自作Navigation（SXA ComponentにGraphQLを使っている v2）</h3>
    </div>
  );
};

export default MyNavigationUsingGraphQL;
