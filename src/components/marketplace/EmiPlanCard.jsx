import { formatINR } from '../../utils/currency.js';
import styles from './EmiPlanCard.module.css';

export default function EmiPlanCard({ plan, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={isSelected ? `${styles.card} ${styles.cardSelected}` : styles.card}
      onClick={() => onSelect(plan.id)}
      aria-pressed={isSelected}
    >
      <span className={styles.radio} aria-hidden="true">
        {isSelected && <span className={styles.radioDot} />}
      </span>

      <div className={styles.details}>
        <div className={styles.topRow}>
          <span className={styles.tenure}>{plan.tenureMonths} months</span>
          {plan.isNoCost ? (
            <span className={styles.noCostBadge}>No-Cost EMI</span>
          ) : (
            <span className={styles.interestBadge}>{plan.interestRate}% p.a.</span>
          )}
        </div>
        <span className={styles.monthly}>{formatINR(plan.monthlyEmi)}/month</span>
        <span className={styles.meta}>
          Total {formatINR(plan.totalAmount)}
          {plan.processingFee > 0 && ` · ${formatINR(plan.processingFee)} processing fee`}
        </span>
      </div>
    </button>
  );
}
