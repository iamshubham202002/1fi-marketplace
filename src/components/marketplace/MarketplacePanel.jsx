import { useCallback, useMemo, useState } from 'react';
import MarketplaceSearch from './MarketplaceSearch.jsx';
import ProductGrid from './ProductGrid.jsx';
import LoadingState from '../common/LoadingState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { fetchMarketplaceProducts } from '../../api/marketplaceApi.js';
import { useAsync } from '../../hooks/useAsync.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import styles from './MarketplacePanel.module.css';

export default function MarketplacePanel() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedQuery = useDebouncedValue(searchInput, 300);

  const fetcher = useCallback(
    (signal) => fetchMarketplaceProducts({ query: debouncedQuery, signal }),
    [debouncedQuery]
  );
  const { status, data: products, retry } = useAsync(fetcher, [debouncedQuery]);

  const isSearching = debouncedQuery.trim().length > 0;

  const emptyCopy = useMemo(
    () =>
      isSearching
        ? {
            title: 'No products found',
            message: `We couldn\u2019t find any product matching "${debouncedQuery}". Try a different name or brand.`,
          }
        : { title: 'No products available', message: 'Please check back shortly.' },
    [isSearching, debouncedQuery]
  );

  return (
    <div className={styles.wrap}>
      <MarketplaceSearch value={searchInput} onChange={setSearchInput} placeholder="Search products or brands..." />

      <div className={styles.results}>
        {status === 'loading' && <LoadingState count={4} variant="grid" />}

        {status === 'error' && (
          <ErrorState
            title="Couldn't load the marketplace"
            message="Please check your connection and try again."
            onRetry={retry}
          />
        )}

        {status === 'success' && products.length === 0 && (
          <EmptyState title={emptyCopy.title} message={emptyCopy.message} />
        )}

        {status === 'success' && products.length > 0 && <ProductGrid products={products} />}
      </div>
    </div>
  );
}
