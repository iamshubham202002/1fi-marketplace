import styles from './EmptyState.module.css';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.iconCircle} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.6">
          <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5v9.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5M4 9.5h16" />
          <path d="M9.5 13.5h5" strokeDasharray="1 3.4" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {actionLabel && onAction && (
        <button type="button" className={styles.actionButton} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
