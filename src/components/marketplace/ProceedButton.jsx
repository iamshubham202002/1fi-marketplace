import styles from './ProceedButton.module.css';

/**
 * @param {{
 *   monthlyEmiLabel?: string,
 *   disabled: boolean,
 *   status: 'idle' | 'submitting' | 'success' | 'error',
 *   onProceed: () => void,
 *   label?: string,
 * }} props
 */
export default function ProceedButton({ monthlyEmiLabel, disabled, status, onProceed, label = 'Proceed with EMI' }) {
  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';

  return (
    <div className={styles.bar}>
      {monthlyEmiLabel && !isSuccess && (
        <div className={styles.priceBlock}>
          <span className={styles.priceLabel}>Pay</span>
          <span className={styles.priceValue}>{monthlyEmiLabel}</span>
        </div>
      )}
      <button
        type="button"
        className={isSuccess ? `${styles.button} ${styles.buttonSuccess}` : styles.button}
        disabled={disabled || isSubmitting || isSuccess}
        onClick={onProceed}
        aria-busy={isSubmitting}
      >
        {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
        {isSuccess ? 'Request submitted ✓' : isSubmitting ? 'Processing…' : label}
      </button>
    </div>
  );
}
