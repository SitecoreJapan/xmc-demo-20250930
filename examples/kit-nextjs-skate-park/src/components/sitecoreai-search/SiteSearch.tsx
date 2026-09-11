import { useState } from 'react';
import { useSearch } from '@sitecore-content-sdk/nextjs/search';
import { useDebounce } from './useDebounce';
import styles from './SiteSearch.module.css';
import { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';

export type RichTextProps = ComponentProps & {};

/**
 * ==========================================================================
 * SitecoreAI (Content SDK) Search API を使った検索コンポーネントのサンプル
 * --------------------------------------------------------------------------
 * 参照ドキュメント:
 *  - Search API (SearchService)      : https://doc.sitecore.com/sai/en/developers/content-sdk/20/search-api.html
 *  - useSearch フック (ページネーション): https://doc.sitecore.com/sai/en/developers/content-sdk/20/usesearch.html
 *  - useInfiniteSearch フック (無限スクロール): 上記と同じ「Search hooks for React and Next.js」配下
 *
 * 前提条件:
 *  1. `npm install @sitecore-content-sdk/nextjs` 済みであること
 *  2. アプリ全体（_app.tsx など）が <SitecoreProvider> でラップされていること
 *     → useSearch / useInfiniteSearch は SitecoreProvider の contextId 等の設定を
 *       内部で利用するため、Provider の外では動作しません。
 *  3. SitecoreAI Deploy App の [Developer settings] タブから検索対象の
 *     searchIndexId を取得しておくこと（環境変数化を推奨）。
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. 検索結果ドキュメントの型（Generics で型安全にする）
//    実際のインデックスに合わせてフィールドを調整してください。
// --------------------------------------------------------------------------
type SearchDocument = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  publishDate?: string;
};

type SortOrder = 'asc' | 'desc';

type SortOption = {
  label: string;
  name?: keyof SearchDocument; // string ではなく keyof SearchDocument に限定
  order: SortOrder;
};

const PAGE_SIZE = 10;

// 並び替え候補（フィールド名はインデックスの Attribute 名に合わせてください）
const SORT_OPTIONS: SortOption[] = [
  { label: '関連度順（デフォルト）', order: 'desc' },
  { label: '公開日: 新しい順', name: 'publishDate', order: 'desc' },
  { label: '公開日: 古い順', name: 'publishDate', order: 'asc' },
  { label: 'タイトル: A → Z', name: 'title', order: 'asc' },
];

const SEARCH_INDEX_ID = process.env.NEXT_PUBLIC_SEARCH_INDEX_ID ?? '<YOUR_SEARCH_INDEX_ID>';

export const Default = (props: RichTextProps): JSX.Element => {
  console.log('SiteSearch props:', props);

  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [sortIndex, setSortIndex] = useState(0);

  // ユーザーの入力を 300ms デバウンスしてから実際の検索クエリとして使う
  const debouncedQuery = useDebounce(inputValue, 300);
  const selectedSort = SORT_OPTIONS[sortIndex];

  // --------------------------------------------------------------------------
  // 2. useSearch フックでページネーション付きの検索を実行
  //    query が空文字のときは enabled: false にして無駄な API 呼び出しを防止
  // --------------------------------------------------------------------------
  const { results, isLoading, total, totalPages, error } = useSearch<SearchDocument>({
    searchIndexId: SEARCH_INDEX_ID,
    query: debouncedQuery,
    page,
    pageSize: PAGE_SIZE,
    locale: 'ja-JP', // 必要に応じて変更
    enabled: debouncedQuery.trim().length > 0,
    keepPreviousData: true, // ページ切替時にちらつきを抑える
    ...(selectedSort.name ? { sort: { name: selectedSort.name, order: selectedSort.order } } : {}),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setPage(1); // 検索語が変わったら1ページ目に戻す
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortIndex(Number(e.target.value));
    setPage(1);
  };

  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <section className={styles.searchWrapper} aria-label="サイト内検索">
      {/* --------------------------------------------------------------- */}
      {/* 検索ボックス                                                     */}
      {/* --------------------------------------------------------------- */}
      <form className={styles.searchForm} role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="キーワードを入力してください"
          value={inputValue}
          onChange={handleInputChange}
          aria-label="検索キーワード"
        />

        <select
          className={styles.sortSelect}
          value={sortIndex}
          onChange={handleSortChange}
          aria-label="並び替え"
        >
          {SORT_OPTIONS.map((option, index) => (
            <option key={option.label} value={index}>
              {option.label}
            </option>
          ))}
        </select>
      </form>

      {/* --------------------------------------------------------------- */}
      {/* 状態表示（未入力 / ローディング / エラー）                          */}
      {/* --------------------------------------------------------------- */}
      {!hasQuery && <p className={styles.helperText}>検索キーワードを入力してください。</p>}

      {hasQuery && isLoading && <p className={styles.helperText}>検索中です…</p>}

      {hasQuery && error && (
        <p className={styles.errorText}>検索中にエラーが発生しました: {error.message}</p>
      )}

      {/* --------------------------------------------------------------- */}
      {/* 検索結果                                                        */}
      {/* --------------------------------------------------------------- */}
      {hasQuery && !isLoading && !error && (
        <>
          <p className={styles.resultSummary}>
            「{debouncedQuery}」の検索結果: {total} 件中 {results.length} 件を表示
          </p>

          {results.length === 0 ? (
            <p className={styles.helperText}>
              該当する結果が見つかりませんでした。別のキーワードでお試しください。
            </p>
          ) : (
            <ul className={styles.resultList}>
              {results.map((item) => (
                <li key={item.id} className={styles.resultItem}>
                  <a href={item.url ?? '#'} className={styles.resultTitle}>
                    {item.title}
                  </a>
                  {item.description && (
                    <p className={styles.resultDescription}>{item.description}</p>
                  )}
                  {item.publishDate && (
                    <time className={styles.resultDate} dateTime={item.publishDate}>
                      {new Date(item.publishDate).toLocaleDateString('ja-JP')}
                    </time>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* ------------------------------------------------------------- */}
          {/* ページネーション（ページ番号方式）                                */}
          {/* ------------------------------------------------------------- */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="検索結果のページ">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                前へ
              </button>

              <span className={styles.pageStatus}>
                {page} / {totalPages} ページ
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                次へ
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
};

