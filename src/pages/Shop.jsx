import { useSearchParams } from 'react-router-dom';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader.jsx';
import MarketplacePanel from '../components/marketplace/MarketplacePanel.jsx';
import PillTabs from '../components/common/PillTabs.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import styles from './Shop.module.css';

const TABS = [
  { id: 'topBrands', label: 'Top Brands' },
  { id: 'nearby', label: 'Nearby Stores' },
  { id: 'marketplace', label: '1Fi Marketplace' },
];

// The assignment only requires the "1Fi Marketplace" tab to be built out;
// Top Brands and Nearby Stores are explicitly out of scope and can stay
// blank. Defaulting here so the implemented feature is what's visible
// first rather than one of the two blank tabs.
const DEFAULT_TAB = 'marketplace';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') ?? DEFAULT_TAB;

  const handleTabChange = (tabId) => {
    setSearchParams(tabId === DEFAULT_TAB ? {} : { tab: tabId });
  };

  return (
    <div>
      <MarketplaceHeader title="Shop" subtitle="Shop now, pay later with easy EMIs" />

      <div className={styles.controls}>
        <PillTabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />
      </div>

      {activeTab === 'marketplace' && <MarketplacePanel />}

      {activeTab === 'topBrands' && (
        <div className={styles.blankTab}>
          <EmptyState title="Top Brands" message="This section is coming soon." />
        </div>
      )}

      {activeTab === 'nearby' && (
        <div className={styles.blankTab}>
          <EmptyState title="Nearby Stores" message="This section is coming soon." />
        </div>
      )}
    </div>
  );
}
