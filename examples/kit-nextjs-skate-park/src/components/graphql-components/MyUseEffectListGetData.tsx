import { JSX, useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import client from 'lib/sitecore-client';

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
          { name: "_path", value: "{CBBBDF33-7AB8-47D8-88F2-26058A157CB8}", operator: CONTAINS }
          { name: "_language", value: "en" }
          { name: "_templates", value: "B1202BFF-0B7E-4703-914A-A3740642A1D2", operator: EQ }
        ]
      }
      first: 5
    ) {
      results {
        ... on C__Page_b1202bff0b7e4703914aa3740642a1d2 {
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
      try {
        const result = await client.getData<MyNavigationResults>(ALL_PAGE);

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
