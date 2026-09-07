import { formatINR } from '../../utils/currency.js';
import styles from './OrderSummary.module.css';

/**
 * @param {{ productName: string, variantLabel?: string, price: number, plan: object|null }} props
 */
export default function OrderSummary({ productName, variantLabel, price, plan }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.label}>Product</span>
        <span className={styles.value}>{productName}</span>
      </div>
      {variantLabel && (
        <div className={styles.row}>
          <span className={styles.label}>Selected variant</span>
          <span className={styles.value}>{variantLabel}</span>
        </div>
      )}
      <div className={styles.row}>
        <span className={styles.label}>Price</span>
        <span className={styles.value}>{formatINR(price)}</span>
      </div>

      {plan ? (
        <>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.label}>EMI tenure</span>
            <span className={styles.value}>{plan.tenureMonths} months</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Monthly EMI</span>
            <span className={styles.valueEmphasis}>{formatINR(plan.monthlyEmi)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Total payable</span>
            <span className={styles.value}>{formatINR(plan.totalAmount)}</span>
          </div>
          {plan.processingFee > 0 && (
            <div className={styles.row}>
              <span className={styles.label}>Processing fee</span>
              <span className={styles.value}>{formatINR(plan.processingFee)}</span>
            </div>
          )}
          <div className={styles.row}>
            <span className={styles.label}>Interest</span>
            <span className={styles.value}>
              {plan.isNoCost ? <span className={styles.freeTag}>₹0 · No-Cost EMI</span> : formatINR(plan.interestPayable)}
            </span>
          </div>
        </>
      ) : (
        <p className={styles.hint}>Select an EMI plan to see your monthly payment and total cost.</p>
      )}
    </div>
  );
}
