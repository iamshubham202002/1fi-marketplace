import styles from './ErrorState.module.css';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\u2019t load this right now. Please try again.',
  onRetry,
}) {
  return (
    <div className={styles.wrap} role="alert">
      <div className={styles.iconCircle} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--color-danger)" strokeWidth="1.8">
          <path d="M12 8.5v5M12 17h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
