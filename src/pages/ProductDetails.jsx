import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader.jsx';
import ProductImage from '../components/marketplace/ProductImage.jsx';
import ProductVariants from '../components/marketplace/ProductVariants.jsx';
import EmiPlanSelector from '../components/marketplace/EmiPlanSelector.jsx';
import OrderSummary from '../components/marketplace/OrderSummary.jsx';
import CheckoutForm from '../components/marketplace/CheckoutForm.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import {
  fetchProduct,
  fetchEmiPlans,
  fetchStore,
  processMockPayment,
  submitEmiOrder,
  submitFullPaymentOrder,
} from '../api/marketplaceApi.js';
import { useAsync } from '../hooks/useAsync.js';
import { formatINR } from '../utils/currency.js';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const productFetcher = useCallback((signal) => fetchProduct(productId, { signal }), [productId]);
  const product = useAsync(productFetcher, [productId]);

  const storeId = product.data?.storeId;
  const storeFetcher = useCallback(
    (signal) => (storeId ? fetchStore(storeId, { signal }) : Promise.resolve(null)),
    [storeId]
  );
  const store = useAsync(storeFetcher, [storeId]);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [checkoutMode, setCheckoutMode] = useState(null); // null | full | emi
  const [checkoutStatus, setCheckoutStatus] = useState('idle'); // idle | submitting | error | success
  const [checkoutError, setCheckoutError] = useState('');
  const [emiStatus, setEmiStatus] = useState('idle'); // idle | submitting | applied | error
  const [emiError, setEmiError] = useState('');
  const [emiApplication, setEmiApplication] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState('idle'); // idle | submitting | error
  const [order, setOrder] = useState(null);

  const variantGroups = product.data?.variantGroups ?? [];
  const isVariantSelectionComplete = variantGroups.every((group) => selectedOptions[group.id]);

  const principal = useMemo(() => {
    if (!product.data) return 0;
    const deltaTotal = variantGroups.reduce((sum, group) => {
      const chosenId = selectedOptions[group.id];
      const option = group.options.find((o) => o.id === chosenId);
      return sum + (option?.priceDelta ?? 0);
    }, 0);
    return product.data.basePrice + deltaTotal;
  }, [product.data, variantGroups, selectedOptions]);

  const emiFetcher = useCallback(
    (signal) => (product.data ? fetchEmiPlans(productId, principal, { signal }) : Promise.resolve([])),
    [productId, principal, product.data]
  );
  const emiPlans = useAsync(emiFetcher, [productId, principal, Boolean(product.data)]);

  const selectedPlan = emiPlans.data?.find((plan) => plan.id === selectedPlanId) ?? null;

  const variantLabel = variantGroups
    .map((group) => {
      const option = group.options.find((o) => o.id === selectedOptions[group.id]);
      return option?.label;
    })
    .filter(Boolean)
    .join(' · ');

  const handleSelectVariant = (groupId, optionId) => {
    setSelectedOptions((prev) => ({ ...prev, [groupId]: optionId }));
    setSelectedPlanId(null);
    setCheckoutMode(null);
    setCheckoutStatus('idle');
    setCheckoutError('');
    setEmiStatus('idle');
    setEmiError('');
    setEmiApplication(null);
    setPurchaseStatus('idle');
    setOrder(null);
  };

  const openCheckout = (mode) => {
    setCheckoutMode(mode);
    setCheckoutStatus('idle');
    setCheckoutError('');
    setEmiStatus('idle');
    setEmiError('');
    setEmiApplication(null);
    setPurchaseStatus('idle');
  };

  const handleCheckoutSubmit = async ({ customer, deliveryAddress, payment }) => {
    if (checkoutMode === 'emi') {
      setEmiStatus('submitting');
      setEmiError('');
      try {
        const paymentResult = await processMockPayment({ payment, amount: selectedPlan.totalAmount });
        setEmiApplication({ customer, deliveryAddress, paymentResult });
        setEmiStatus('applied');
      } catch {
        setEmiStatus('error');
        setEmiError('We could not apply EMI right now. Please try again.');
      }
      return;
    }

    setCheckoutStatus('submitting');
    setCheckoutError('');
    try {
      let createdOrder;
      const commonOrder = {
        productId,
        productName: product.data.name,
        variant: variantLabel || 'Standard variant',
        quantity: 1,
        productPrice: principal,
        customer,
        deliveryAddress,
        createdAt: new Date().toISOString(),
      };

      createdOrder = await submitFullPaymentOrder({
        ...commonOrder,
        paymentType: 'FULL_PAYMENT',
      });

      setOrder(createdOrder);
      setCheckoutStatus('success');
    } catch {
      setCheckoutStatus('error');
      setCheckoutError('We could not complete your request. Please try again.');
    }
  };

  const handleEmiBuyNow = async () => {
    if (!emiApplication || purchaseStatus === 'submitting') return;
    setPurchaseStatus('submitting');
    try {
      const createdOrder = await submitEmiOrder({
        productId,
        productName: product.data.name,
        variant: variantLabel || 'Standard variant',
        quantity: 1,
        productPrice: principal,
        customer: emiApplication.customer,
        deliveryAddress: emiApplication.deliveryAddress,
        paymentType: 'EMI',
        emiStatus: 'APPLIED',
        emiTenure: selectedPlan.tenureMonths,
        monthlyEmi: selectedPlan.monthlyEmi,
        totalAmount: selectedPlan.totalAmount,
        interestRate: selectedPlan.interestRate,
        transactionId: emiApplication.paymentResult.transactionId,
        createdAt: new Date().toISOString(),
      });
      setOrder(createdOrder);
      setPurchaseStatus('success');
    } catch {
      setPurchaseStatus('error');
    }
  };

  const goBackToMarketplace = () => navigate('/shop?tab=marketplace');

  if (product.status === 'loading') {
    return (
      <div>
        <MarketplaceHeader title="Product" onBack={goBackToMarketplace} />
        <div className={styles.section}>
          <LoadingState count={1} variant="grid" />
        </div>
      </div>
    );
  }

  if (product.status === 'error') {
    return (
      <div>
        <MarketplaceHeader title="Product" onBack={goBackToMarketplace} />
        <div className={styles.section}>
          <ErrorState title="Couldn't load this product" onRetry={product.retry} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <MarketplaceHeader title={store.data?.name ?? 'Product'} onBack={goBackToMarketplace} />

      <div className={styles.section}>
        <ProductImage productName={product.data.name} storeLogo={store.data?.logo} />

        <div className={styles.titleBlock}>
          <h1 className={styles.name}>{product.data.name}</h1>
          {product.data.rating && (
            <span className={styles.rating}>★ {product.data.rating.toFixed(1)}</span>
          )}
        </div>

        <span className={styles.price}>{formatINR(principal)}</span>
        <p className={styles.description}>{product.data.description}</p>

        {variantGroups.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Select variant</h2>
            <ProductVariants
              variantGroups={variantGroups}
              selectedOptions={selectedOptions}
              onSelect={handleSelectVariant}
            />
          </section>
        )}

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Choose your EMI plan</h2>
          {!isVariantSelectionComplete && variantGroups.length > 0 ? (
            <p className={styles.hint}>Select a variant above to see EMI options for this configuration.</p>
          ) : (
            <EmiPlanSelector
              status={emiPlans.status}
              plans={emiPlans.data}
              selectedPlanId={selectedPlanId}
              onSelect={setSelectedPlanId}
              onRetry={emiPlans.retry}
            />
          )}
        </section>

        {!(checkoutMode === 'emi' && emiStatus === 'applied') && (
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Order summary</h2>
            <OrderSummary
              productName={product.data.name}
              variantLabel={variantLabel || undefined}
              price={principal}
              plan={selectedPlan}
            />
          </section>
        )}

        {!checkoutMode && (
          <section className={styles.purchaseOptions} aria-label="Purchase options">
            <button
              type="button"
              className={styles.buyNowButton}
              onClick={() => openCheckout('full')}
              disabled={!isVariantSelectionComplete}
            >
              Buy Now
            </button>
            <button
              type="button"
              className={styles.emiButton}
              onClick={() => openCheckout('emi')}
              disabled={!isVariantSelectionComplete || !selectedPlan}
            >
              Proceed with EMI
            </button>
            {!isVariantSelectionComplete && variantGroups.length > 0 && (
              <p className={styles.actionHint}>Select all product options before continuing.</p>
            )}
            {isVariantSelectionComplete && !selectedPlan && (
              <p className={styles.actionHint}>Select an EMI plan to use EMI checkout.</p>
            )}
          </section>
        )}

        {checkoutMode === 'full' && checkoutStatus !== 'success' && (
          <CheckoutForm
            mode="full"
            product={product.data}
            variantLabel={variantLabel}
            price={principal}
            plan={selectedPlan}
            status={checkoutStatus}
            errorMessage={checkoutError}
            onSubmit={handleCheckoutSubmit}
            onCancel={() => setCheckoutMode(null)}
          />
        )}

        {checkoutMode === 'emi' && emiStatus !== 'applied' && (
          <CheckoutForm
            mode="emi"
            product={product.data}
            variantLabel={variantLabel}
            price={principal}
            plan={selectedPlan}
            status={emiStatus === 'submitting' ? 'submitting' : 'idle'}
            errorMessage={emiError}
            onSubmit={handleCheckoutSubmit}
            onCancel={() => setCheckoutMode(null)}
          />
        )}

        {checkoutMode === 'emi' && emiStatus === 'applied' && !order && (
          <div className={styles.emiApplied} role="status">
            <span className={styles.successIcon} aria-hidden="true">✓</span>
            <h2>EMI Applied Successfully 🎉</h2>
            <div className={styles.orderDetails}>
              <span>Product <strong>{product.data.name}</strong></span>
              <span>EMI tenure <strong>{selectedPlan.tenureMonths} months</strong></span>
              <span>Monthly EMI <strong>{formatINR(selectedPlan.monthlyEmi)}/month</strong></span>
              <span>Total payable <strong>{formatINR(selectedPlan.totalAmount)}</strong></span>
              <span>EMI status <strong>Applied</strong></span>
            </div>
            {purchaseStatus === 'error' && (
              <p className={styles.submitError}>We could not complete the purchase. Please try again.</p>
            )}
            <button type="button" className={styles.continueButton} onClick={handleEmiBuyNow} disabled={purchaseStatus === 'submitting'}>
              {purchaseStatus === 'submitting' ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        )}

        {order && (checkoutStatus === 'success' || purchaseStatus === 'success') && (
          <div className={styles.orderSuccess} role="status">
            <span className={styles.successIcon} aria-hidden="true">✓</span>
            <h2>{order.paymentType === 'EMI' ? 'Bought Successfully 🎉' : 'Order Placed Successfully 🎉'}</h2>
            <p>Your order is confirmed and will be processed shortly.</p>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.orderDetails}>
              <span>Product <strong>{order.productName}</strong></span>
              {order.paymentType === 'EMI' ? (
                <>
                  <span>Product price <strong>{formatINR(order.productPrice)}</strong></span>
                  <span>EMI tenure <strong>{order.emiTenure} months</strong></span>
                  <span>Monthly EMI <strong>{formatINR(order.monthlyEmi)}/month</strong></span>
                  <span>Total payable <strong>{formatINR(order.totalAmount)}</strong></span>
                  <span>Payment type <strong>EMI</strong></span>
                  <span>Payment status <strong>Success</strong></span>
                </>
              ) : (
                <span>Amount <strong>{formatINR(order.productPrice)}</strong></span>
              )}
              <span>Delivery address <strong>{order.deliveryAddress.address}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</strong></span>
              <span>Mobile <strong>{order.customer.mobile}</strong></span>
              <span>Order status <strong>Placed</strong></span>
              <span>Order ID <strong>{order.orderId}</strong></span>
            </div>
            <button type="button" className={styles.continueButton} onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
