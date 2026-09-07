import styles from './LogoTile.module.css';

export default function LogoTile({ bg, color, text, size = 56, rounded = 'md' }) {
  return (
    <div
      className={`${styles.tile} ${rounded === 'sm' ? styles.roundedSm : styles.roundedMd}`}
      style={{ background: bg, width: size, height: size }}
    >
      <span className={styles.text} style={{ color, fontSize: Math.max(9, size / 5.6) }}>
        {text}
      </span>
    </div>
  );
}
