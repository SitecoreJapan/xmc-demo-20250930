import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import client from 'lib/sitecore-client';
import { GetComponentServerProps } from '@sitecore-content-sdk/nextjs';
import { gql } from 'graphql-request';

type MyQueryResult = {
  data: {
    item: {
      rendered: {
        sitecore: {
          context: {
            itemPath: string;
          };
        };
      };
    };
  };
};

type MyProps = ComponentProps & {
  result: MyQueryResult;
};

export const testQuery = gql`
  query {
    item(path: "{15993DA3-A1CE-4B2D-8047-0BCF8D129D20}", language: "en") {
      rendered
    }
  }
`;

export const getComponentServerProps: GetComponentServerProps = async () => {
  const result = await client.getData<MyQueryResult>(testQuery);

  return { result: result };
};

const Default = (props: MyProps): JSX.Element => {
  const results = props.result.data?.item?.rendered?.sitecore?.context?.itemPath;

  if (results) {
    return (
      <div className="component-content">
        <p>This value is got from XMC GraphQL</p>
        <p>{results}</p>
      </div>
    );
  }

  return (
    <div className="component-content">
      <h3>No data</h3>
    </div>
  );
};

export default Default;
