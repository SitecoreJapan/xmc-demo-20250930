import { useMemo, useState } from 'react';
import { useSearch } from '@sitecore-content-sdk/nextjs/search';
// FacetRequest/FacetField/FacetResult/FacetValue は @sitecore-content-sdk/search からエクスポートされています。
// (参考: Content SDK 2.3 リリースノートで追加された公開型)
import type { FacetField, FacetRequest } from '@sitecore-content-sdk/search';
import { useDebounce } from './useDebounce';
import styles from './SiteSearch.module.css';
import { JSX } from 'react';
import { useRouter } from 'next/router';

/**
 * ==========================================================================
 * SitecoreAI (Content SDK) Search API を使った検索コンポーネントのサンプル
 * --------------------------------------------------------------------------
 * 参照ドキュメント:
 *  - Search API (SearchService)      : https://doc.sitecore.com/sai/en/developers/content-sdk/20/search-api.html
 *  - useSearch フック (ページネーション): https://doc.sitecore.com/sai/en/developers/content-sdk/20/usesearch.html
 *  - facet (FacetRequest) は Content SDK 2.3.0 以降でサポートされています。
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
  type?: string; // ファセット対応フィールド
  itemid?: string; // アイテムID
  image?: string; // 画像URL
};

type SortOrder = 'asc' | 'desc';

// name は SearchDocument のキーに限定する（useSearch<SearchDocument> の sort.name の型と一致させるため）。
// 「関連度順（ソートなし）」の選択肢は name を省略（undefined）することで表現する。
type SortOption = {
  label: string;
  name?: keyof SearchDocument;
  order: SortOrder;
};

const PAGE_SIZE = 10;

// 並び替え候補（フィールド名はインデックスの Attribute 名に合わせてください）
const SORT_OPTIONS: SortOption[] = [
  { label: '関連度順（デフォルト）', order: 'desc' },
  { label: 'タイトル: A → Z', name: 'title', order: 'asc' },
  { label: 'アイテムID', name: 'itemid', order: 'asc' },
];

// --------------------------------------------------------------------------
// 2. ファセット絞り込みの対象フィールド
//    複数のファセットフィールドがある場合はここに追加してください。
//    例: FACETABLE_FIELDS = ['type', 'category']
// --------------------------------------------------------------------------
const FACETABLE_FIELDS: string[] = ['type'];

const SEARCH_INDEX_ID = process.env.NEXT_PUBLIC_SEARCH_INDEX_ID ?? '<YOUR_SEARCH_INDEX_ID>';

export const Default = (): JSX.Element => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [sortIndex, setSortIndex] = useState(0);

  // フィールド名 -> 選択済みの値の配列（例: { type: ['news', 'blog'] }）
  const [facetSelections, setFacetSelections] = useState<Record<string, string[]>>({});

  // ユーザーの入力を 300ms デバウンスしてから実際の検索クエリとして使う
  const debouncedQuery = useDebounce(inputValue, 300);
  const selectedSort = SORT_OPTIONS[sortIndex];

  // --------------------------------------------------------------------------
  // 3. facet リクエストを組み立てる
  //    - 各対象フィールドの件数（カウント）を常に取得する
  //    - ユーザーが値を選択している場合は、その値で結果を絞り込む(filter)
  // --------------------------------------------------------------------------
  const facetFields = useMemo<FacetField[]>(() => {
    return FACETABLE_FIELDS.map((fieldName) => {
      const selectedValues = facetSelections[fieldName];
      return selectedValues?.length
        ? { name: fieldName, filter: { operator: 'or', values: selectedValues } }
        : { name: fieldName };
    });
  }, [JSON.stringify(facetSelections)]);

  const facetRequest = useMemo<FacetRequest>(() => ({ fields: facetFields }), [facetFields]);

  const sortParam = useMemo(() => {
    return selectedSort.name ? { name: selectedSort.name, order: selectedSort.order } : undefined;
  }, [selectedSort.name, selectedSort.order]);

  // --------------------------------------------------------------------------
  // 4. useSearch フックでページネーション・ソート・facet 付きの検索を実行
  //    query が空文字のときは enabled: false にして無駄な API 呼び出しを防止
  // --------------------------------------------------------------------------
  const { results, isLoading, total, totalPages, error, facets } = useSearch<SearchDocument>({
    searchIndexId: SEARCH_INDEX_ID,
    query: debouncedQuery,
    page,
    pageSize: PAGE_SIZE,
    locale: router.locale ?? 'en',
    enabled: debouncedQuery.trim().length > 0,
    keepPreviousData: true, // ページ切替時にちらつきを抑える
    facet: facetRequest,
    ...(sortParam ? { sort: sortParam } : {}),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setPage(1); // 検索語が変わったら1ページ目に戻す
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortIndex(Number(e.target.value));
    setPage(1);
  };

  // ファセットのチェックボックスが切り替わったときのハンドラ
  const handleFacetToggle = (fieldName: string, value: string) => {
    setFacetSelections((prev) => {
      const current = prev[fieldName] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [fieldName]: next };
    });
    setPage(1); // 絞り込み条件が変わったら1ページ目に戻す
  };

  const handleClearFacets = () => {
    setFacetSelections({});
    setPage(1);
  };

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasActiveFacets = Object.values(facetSelections).some((values) => values.length > 0);

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

      {!hasQuery && <p className={styles.helperText}>検索キーワードを入力してください。</p>}

      {hasQuery && isLoading && <p className={styles.helperText}>検索中です…</p>}

      {hasQuery && error && (
        <p className={styles.errorText}>検索中にエラーが発生しました: {error.message}</p>
      )}

      {hasQuery && !isLoading && !error && (
        <div className={styles.resultsLayout}>
          {/* ----------------------------------------------------------- */}
          {/* ファセット絞り込みパネル（左サイドバー）                          */}
          {/* facets は SearchResponse.facets: FacetResult[] を反映しています */}
          {/* ----------------------------------------------------------- */}
          {facets && facets.length > 0 && (
            <aside className={styles.facetPanel} aria-label="絞り込み">
              <div className={styles.facetHeader}>
                <h3 className={styles.facetHeading}>絞り込み</h3>
                {hasActiveFacets && (
                  <button
                    type="button"
                    className={styles.facetClearButton}
                    onClick={handleClearFacets}
                  >
                    クリア
                  </button>
                )}
              </div>

              {facets.map((facet) => (
                <div key={facet.name} className={styles.facetGroup}>
                  <h4 className={styles.facetTitle}>{facet.name}</h4>
                  <ul className={styles.facetList}>
                    {/* FacetResult.value は FacetValue[] 型（値と件数の配列） */}
                    {facet.value.map((facetValue) => {
                      const facetText = (facetValue.text ?? 'Default') as string; // text が undefined の場合は空文字にする
                      const isChecked = (facetSelections[facet.name] ?? []).includes(facetText);
                      return (
                        <li key={facetText} className={styles.facetItem}>
                          <label className={styles.facetLabel}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleFacetToggle(facet.name, facetText)}
                            />
                            <span>{facetText}</span>
                            <span className={styles.facetCount}>({facetValue.count})</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </aside>
          )}

          {/* ----------------------------------------------------------- */}
          {/* 検索結果本体                                                 */}
          {/* ----------------------------------------------------------- */}
          <div className={styles.resultsMain}>
            <p className={styles.resultSummary}>
              「{debouncedQuery}」の検索結果: {total} 件中 {results.length} 件を表示
            </p>

            {results.length === 0 ? (
              <p className={styles.helperText}>
                該当する結果が見つかりませんでした。別のキーワードや絞り込み条件でお試しください。
              </p>
            ) : (
              <ul className={styles.resultList}>
                {results.map((item) => (
                  <li key={item.id} className={styles.resultItem}>
                    <a href={item.url ?? item.image ?? '#'} className={styles.resultTitle}>
                      {item.title}
                    </a>
                    {item.type && <span className={styles.resultType}>{item.type}</span>}
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

            {/* --------------------------------------------------------- */}
            {/* ページネーション（ページ番号方式）                             */}
            {/* --------------------------------------------------------- */}
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
          </div>
        </div>
      )}
    </section>
  );
};

