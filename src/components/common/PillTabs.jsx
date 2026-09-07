import styles from './PillTabs.module.css';

/**
 
 * @param {{ tabs: Array<{id: string, label: string}>, activeTab: string, onChange: (id: string) => void }} props
 */
export default function PillTabs({ tabs, activeTab, onChange }) {
  return (
    <div className={styles.track} role="tablist" aria-label="Shop sections">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
