import { simulateRequest, ApiError } from './httpClient.js';
import { getStoreById, getProductById, getAllProductsWithStore } from '../data/marketplaceData.js';
import { buildEmiPlans } from '../utils/emi.js';

const DEFAULT_FAILURE_RATE = 0.06;

export function fetchMarketplaceProducts({ query = '', signal } = {}) {
  return simulateRequest(
    () => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) return getAllProductsWithStore();
      return getAllProductsWithStore().filter((product) => {
        return (
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.store?.name.toLowerCase().includes(normalizedQuery) ||
          product.store?.category.toLowerCase().includes(normalizedQuery)
        );
      });
    },
    { failureRate: DEFAULT_FAILURE_RATE, signal }
  );
}
export function fetchStore(storeId, { signal } = {}) {
  return simulateRequest(
    () => {
      const store = getStoreById(storeId);
      if (!store) throw new ApiError('Store not found', 404);
      return store;
    },
    { failureRate: DEFAULT_FAILURE_RATE, signal }
  );
}

export function fetchProduct(productId, { signal } = {}) {
  return simulateRequest(
    () => {
      const product = getProductById(productId);
      if (!product) throw new ApiError('Product not found', 404);
      return product;
    },
    { failureRate: DEFAULT_FAILURE_RATE, signal }
  );
}


export function fetchEmiPlans(productId, principal, { signal } = {}) {
  return simulateRequest(
    () => {
      const product = getProductById(productId);
      if (!product) throw new ApiError('Product not found', 404);
      return buildEmiPlans(product.emiPlanTemplates, principal);
    },
    { failureRate: DEFAULT_FAILURE_RATE, signal }
  );
}


export function submitEmiOrder(payload, { signal } = {}) {
  return simulateRequest(
    () => ({
      orderId: `1FI-${Date.now().toString(36).toUpperCase()}`,
      orderStatus: 'PLACED',
      paymentStatus: 'SUCCESS',
      ...payload,
    }),
    { failureRate: DEFAULT_FAILURE_RATE, signal }
  );
}

export function submitFullPaymentOrder(payload, { signal } = {}) {
  return simulateRequest(
    () => ({
      orderId: `1FI-${Date.now().toString(36).toUpperCase()}`,
      orderStatus: 'PLACED',
      paymentStatus: 'PENDING',
      ...payload,
    }),
    { failureRate: DEFAULT_FAILURE_RATE, signal }
  );
}

export function processMockPayment({ payment, amount, signal } = {}) {
  return simulateRequest(
    () => ({
      transactionId: `TEST-${Date.now().toString(36).toUpperCase()}`,
      paymentStatus: 'SUCCESS',
      amount,
      cardLastFour: payment.cardNumber.slice(-4),
    }),
    { failureRate: DEFAULT_FAILURE_RATE, signal }
  );
}
