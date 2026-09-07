import styles from './LoadingState.module.css';

export default function LoadingState({ count = 4, variant = 'card' }) {
  return (
    <div className={styles.stack} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={variant === 'grid' ? styles.gridSkeleton : styles.rowSkeleton}>
          <div className={styles.thumb} />
          <div className={styles.lines}>
            <div className={styles.lineWide} />
            <div className={styles.lineNarrow} />
          </div>
        </div>
      ))}
    </div>
  );
}
