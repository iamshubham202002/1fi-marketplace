import { Link } from 'react-router-dom';
import { formatINR } from '../../utils/currency.js';
import { buildEmiPlans } from '../../utils/emi.js';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const storeLogo = product.store?.logo;
  const emiPlans = product.emiPlanTemplates?.length
    ? buildEmiPlans(product.emiPlanTemplates, product.basePrice)
    : [];
  const lowestMonthlyEmi = emiPlans.length
    ? Math.min(...emiPlans.map((plan) => plan.monthlyEmi))
    : null;

  return (
    <Link to={`/shop/product/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap} style={{ background: storeLogo?.bg ?? 'var(--color-primary-50)' }}>
        <span className={styles.imageInitial} style={{ color: storeLogo?.color ?? 'var(--color-primary)' }}>
          {product.name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className={styles.body}>
        {product.store?.name && <span className={styles.brand}>{product.store.name}</span>}
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>{formatINR(product.basePrice)}</span>
        {lowestMonthlyEmi !== null && (
          <span className={styles.emiCost}>
            EMI from {formatINR(lowestMonthlyEmi)}/month
            {product.emiPlanTemplates.some((plan) => plan.isNoCost) && (
              <span className={styles.emiBadge}>No-cost EMI</span>
            )}
          </span>
        )}
      </div>
    </Link>
  );
}
