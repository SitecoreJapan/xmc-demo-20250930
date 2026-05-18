import type { NextApiRequest, NextApiResponse } from 'next';
import client from 'lib/sitecore-client';
import { ALL_PAGE, MyListResults } from 'src/graphql/listpage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { password } = req.query;

    const isAuthorized = password === 'sitecore123'; // 環境変数にする

    const result = await client.getData<MyListResults>(ALL_PAGE);

    const data = result.search.results.map((item) => ({
      ...item,
      path: isAuthorized ? item.path : 'ダミー',
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'GraphQL fetch error',
    });
  }
}
