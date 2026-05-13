import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  apiKey: string | undefined;
  apiUrl: string | undefined;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  console.log(req.url);
  const apiUrl = process.env.SEARCH_API_URL;
  const apiKey = process.env.SEARCH_API_KEY;

  if (!apiUrl) {
    return res.status(500).json({
      apiUrl: 'SEARCH_API_URL is not defined',
      apiKey,
    });
  }

  if (!apiKey) {
    return res.status(500).json({
      apiUrl,
      apiKey: 'SEARCH_API_KEY is not defined',
    });
  }

  res.status(200).json({
    apiUrl,
    apiKey,
  });
}
