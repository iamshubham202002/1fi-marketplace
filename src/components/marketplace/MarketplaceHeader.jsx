import { useNavigate } from 'react-router-dom';
import styles from './MarketplaceHeader.module.css';

/**
 * @param {{ title: string, subtitle?: string, onBack?: () => void }} props
 
 */
export default function MarketplaceHeader({ title, subtitle, onBack }) {
  const navigate = useNavigate();

  return (
    <header className={styles.banner}>
      {onBack && (
        <button
          type="button"
          className={styles.backButton}
          onClick={() => (onBack === true ? navigate(-1) : onBack())}
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <div className={styles.textBlock}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}
