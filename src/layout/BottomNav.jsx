import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const ICONS = {
  home: (
    <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h3v-5.5h4V20h3a1 1 0 0 0 1-1v-9" />
  ),
  shop: (
    <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5v9.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5M4 9.5h16M9 13.5a3 3 0 0 0 6 0" />
  ),
  dues: (
    <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-3-1.8-2 1.8-2-1.8-2 1.8-3-1.8V4.5a1 1 0 0 1 1-1ZM9 8h6M9 11.5h6M9 15h3.5" />
  ),
  limit: (
    <path d="M4 19.5V14m5.5 5.5V9.5M15 19.5V6m5.5 13.5V11" />
  ),
  profile: (
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8.5c1-4 4-6 7-6s6 2 7 6" />
  ),
};

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/shop', label: 'Shop', icon: 'shop' },
  { to: '/emi-dues', label: 'EMI Dues', icon: 'dues' },
  { to: '/limit', label: 'Limit', icon: 'limit' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

function NavIcon({ name, active }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

export default function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => (isActive ? `${styles.item} ${styles.itemActive}` : styles.item)}
        >
          {({ isActive }) => (
            <>
              {isActive && <span className={styles.indicator} />}
              <NavIcon name={item.icon} active={isActive} />
              <span className={styles.label}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
