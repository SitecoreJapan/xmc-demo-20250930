import { gql } from 'graphql-request';

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

export interface Results {
  path: string;
}

export type MyListResults = {
  search: {
    results: Results[];
  };
};
