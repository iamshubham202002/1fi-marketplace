import EmiPlanCard from './EmiPlanCard.jsx';
import LoadingState from '../common/LoadingState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import styles from './EmiPlanSelector.module.css';


export default function EmiPlanSelector({ status, plans, selectedPlanId, onSelect, onRetry }) {
  if (status === 'loading') {
    return <LoadingState count={3} />;
  }

  if (status === 'error') {
    return <ErrorState title="Couldn't load EMI plans" message="Please try again." onRetry={onRetry} />;
  }

  if (!plans?.length) {
    return <p className={styles.noPlans}>No EMI plans are available for this product.</p>;
  }

  return (
    <div className={styles.list}>
      {plans.map((plan) => (
        <EmiPlanCard key={plan.id} plan={plan} isSelected={plan.id === selectedPlanId} onSelect={onSelect} />
      ))}
    </div>
  );
}
