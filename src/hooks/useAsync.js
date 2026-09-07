import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Wraps an async fetch in the standard idle/loading/success/error lifecycle
 * so pages don't each reinvent loading flags and abort handling.
 *
 * @param {(signal: AbortSignal) => Promise<any>} fetcher
 * @param {Array<any>} deps - re-runs the fetch when any of these change
 */
export function useAsync(fetcher, deps = []) {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    setStatus('loading');
    setError(null);

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (!isCurrent) return;
        setData(result);
        setStatus('success');
      })
      .catch((err) => {
        if (!isCurrent || controller.signal.aborted) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryToken]);

  const retry = useCallback(() => setRetryToken((token) => token + 1), []);

  return { status, data, error, retry, isLoading: status === 'loading', isError: status === 'error' };
}
