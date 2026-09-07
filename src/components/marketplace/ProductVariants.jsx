import styles from './ProductVariants.module.css';

/**
 * @param {{ variantGroups: Array, selectedOptions: Record<string,string>, onSelect: (groupId:string, optionId:string) => void }} props
 */
export default function ProductVariants({ variantGroups, selectedOptions, onSelect }) {
  if (!variantGroups?.length) return null;

  return (
    <div className={styles.wrap}>
      {variantGroups.map((group) => (
        <div key={group.id} className={styles.group}>
          <span className={styles.groupLabel}>{group.label}</span>
          <div className={styles.options}>
            {group.options.map((option) => {
              const isSelected = selectedOptions[group.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={isSelected ? `${styles.option} ${styles.optionSelected}` : styles.option}
                  onClick={() => onSelect(group.id, option.id)}
                  aria-pressed={isSelected}
                >
                  {option.label}
                  {option.priceDelta > 0 && <span className={styles.delta}> +₹{option.priceDelta.toLocaleString('en-IN')}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
