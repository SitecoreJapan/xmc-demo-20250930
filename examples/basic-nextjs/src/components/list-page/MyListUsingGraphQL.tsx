import React, { JSX } from 'react';
import { GetComponentServerProps } from '@sitecore-content-sdk/nextjs';
import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';
import { gql } from 'graphql-request';

interface Results {
  path: string;
}

type MyNavigationResults = {
  search: {
    results: Results[];
  };
};

type MyNavigationProps = {
  props: {
    result: MyNavigationResults;
  };
};

export const ALL_PAGE = gql`
  query filterByCategory {
    search(
      where: {
        AND: [
          { name: "_path", value: "{61049744-D383-46BD-9D3C-1E329BD68E59}", operator: CONTAINS }
          { name: "_language", value: "en" }
          { name: "_templates", value: "D8B4695C-5FDA-4044-9952-14429535F2B6", operator: EQ }
        ]
      }
      first: 4
    ) {
      results {
        ... on Page_d8b4695c5fda4044995214429535f2b6 {
          path
        }
      }
      pageInfo {
        endCursor
        hasNext
      }
      total
    }
  }
`;

export const getComponentServerProps: GetComponentServerProps = async () => {
  console.log('Fetching data for MyNavigationUsingGraphQL component');
  const graphqlendpoint = `https://edge.sitecorecloud.io/api/graphql/v1`;
  const graphQLClient = new GraphQLRequestClient(graphqlendpoint, {
    apiKey:
      'SjNyOXBDaXpBZkpPSTgwY3NjRVZyVnhsWEdDZU5kbWJqcklScDAwQzJUUT18c2l0ZWNvcmVzYWE3NDMyLXhtY2RlbW8yMDI1NGE2Yi1kZXY4ZGMwLTNlMjk=',
  });

  console.log('GraphQL Endpoint:', graphqlendpoint);
  console.log('Using API Key:', scConfig.api.local.apiKey);

  try {
    const result = await graphQLClient.request<MyNavigationResults>(ALL_PAGE);
    return {
      props: {
        result,
      },
    };
  } catch {
    return {
      props: {
        result: null,
      },
    };
  }
};

const MyNavigationUsingGraphQL = (props: MyNavigationProps): JSX.Element => {
  const results = props.props?.result?.search?.results;

  if (results) {
    const list = results.map((element: Results, index: number) => {
      return <li key={index}>{element.path}</li>;
    });

    return (
      <div className="component-content">
        <h3>自作Navigation（SXA ComponentにGraphQLを使っているv2）</h3>
        <ul>{list}</ul>
      </div>
    );
  }

  return (
    <div className="component-content">
      <h3>自作Navigation（SXA ComponentにGraphQLを使っている）</h3>
    </div>
  );
};

export default MyNavigationUsingGraphQL;
