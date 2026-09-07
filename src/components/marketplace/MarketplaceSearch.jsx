import styles from './MarketplaceSearch.module.css';

export default function MarketplaceSearch({ value, onChange, placeholder = 'Search online stores...' }) {
  return (
    <div className={styles.wrap}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="var(--color-text-muted)"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search marketplace stores"
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
