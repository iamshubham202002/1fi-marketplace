import styles from './PlaceholderScreen.module.css';
export default function PlaceholderScreen({ title, message }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
