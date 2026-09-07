import styles from './ProductImage.module.css';

export default function ProductImage({ productName, storeLogo }) {
  return (
    <div className={styles.wrap} style={{ background: storeLogo?.bg ?? 'var(--color-primary-50)' }}>
      <span className={styles.initial} style={{ color: storeLogo?.color ?? 'var(--color-primary)' }}>
        {productName.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}
