import { JSX, useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';

interface Results {
  path: string;
}

type MyNavigationResults = {
  search: {
    results: Results[];
  };
};

export const ALL_PAGE = gql`
  query filterByCategory {
    search(
      where: {
        AND: [
          { name: "_path", value: "{19AC6882-9467-4AE0-93D5-E9C16CBC5AD6}", operator: CONTAINS }
          { name: "_language", value: "en" }
          { name: "_templates", value: "0288EEA2-8220-4037-8206-1C472632B504", operator: EQ }
        ]
      }
      first: 5
    ) {
      results {
        ... on CopyPage {
          path
        }
      }
    }
  }
`;

const MyNavigationUsingGraphQL = (): JSX.Element => {
  const [results, setResults] = useState<Results[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const graphQLClient = new GraphQLRequestClient(
        'https://xmc-sitecoresaaa3b4-serviceteamab2a-dev4734.sitecorecloud.io/sitecore/api/graph/edge',
        {
          apiKey: '1b11949d646b4446b848c13308f1cfe0',
        }
      );

      try {
        const result = await graphQLClient.request<MyNavigationResults>(ALL_PAGE);

        setResults(result.search.results);
      } catch (error) {
        console.error('GraphQL fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <ul>
        {results.map((item, index) => (
          <li key={index}>{item?.path ?? 'データがありません'}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyNavigationUsingGraphQL;
