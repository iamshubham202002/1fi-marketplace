import BottomNav from './BottomNav.jsx';
import styles from './AppShell.module.css';

export default function AppShell({ children }) {
  return (
    <div className={styles.viewport}>
      <div className={styles.frame}>
        <main className={styles.content}>{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
