import { ChangeEvent, JSX, useEffect, useState } from 'react';
import client from 'lib/sitecore-client';
import { GetComponentServerProps } from '@sitecore-content-sdk/nextjs';
import { ALL_PAGE, MyListResults, Results } from 'src/graphql/listpage';

const isPreview = process.env.NEXT_PUBLIC_IsPreview === 'true';

type Props = {
  staticResults?: Results[];
};

export const getComponentServerProps: GetComponentServerProps = async () => {
  // プレビューではない環境のみ、静的データを取得する。ここで取得したデータは HTMLソースの末尾に JSON形式で埋め込まれる。
  if (isPreview) {
    return { staticResults: [] };
  } else {
    const result = await client.getData<MyListResults>(ALL_PAGE);

    return { staticResults: result.search.results };
  }
};

const MyListUsingGraphQL = (props: Props): JSX.Element => {
  const [results, setResults] = useState<Results[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
  };

  // プレビューではない環境では、最初から静的データをセットしておく
  useEffect(() => {
    if (!isPreview) {
      setResults(props.staticResults || []);
    }
    setLoading(false);
  }, []);

  // パスワードの認証状態が変わるたびに、データを再取得して表示を更新する
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (!isPreview) return;

        const response = await fetch(`/api/getlistdata?password=${password}`);

        const data: Results[] = await response.json();

        setResults(data);
      } catch (error) {
        console.error('API fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [password]);

  if (loading) {
    return (
      <div className="component-content">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="component-content">
      <h3>自作List</h3>

      <ul>
        {results.map((item, index) => (
          <li key={index}>{item?.path ?? 'データがありません'}</li>
        ))}
      </ul>

      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
    </div>
  );
};

export default MyListUsingGraphQL;
