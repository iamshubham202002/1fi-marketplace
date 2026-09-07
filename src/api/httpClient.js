
export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const MIN_LATENCY_MS = 350;
const MAX_LATENCY_MS = 800;

function randomLatency() {
  return MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS);
}

/**
 * @param {() => any} resolver -
 * @param {{ failureRate?: number, signal?: AbortSignal }} [options]
 */
export function simulateRequest(resolver, { failureRate = 0, signal } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal?.aborted) {
        reject(new ApiError('Request aborted', 0));
        return;
      }
      if (Math.random() < failureRate) {
        reject(new ApiError('The marketplace service is taking too long to respond.', 503));
        return;
      }
      try {
        resolve(resolver());
      } catch (err) {
        reject(err);
      }
    }, randomLatency());

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new ApiError('Request aborted', 0));
      });
    }
  });
}
