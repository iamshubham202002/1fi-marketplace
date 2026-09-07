import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.greeting}>Hi there 👋</h1>
      <p className={styles.subtext}>This home screen is a placeholder standing in for the rest of the existing 1Fi app.</p>

      <Link to="/shop" className={styles.promo}>
        <div className={styles.promoText}>
          <span className={styles.promoTitle}>1Fi Marketplace</span>
          <span className={styles.promoSubtitle}>Shop top brands with no-cost EMIs</span>
        </div>
        <svg className={styles.promoArrow} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
