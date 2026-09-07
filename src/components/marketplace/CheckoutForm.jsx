import { useState } from 'react';
import { formatINR } from '../../utils/currency.js';
import styles from './CheckoutForm.module.css';

const initialValues = {
  fullName: '',
  mobile: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

function validate(values, isEmi) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.';
  if (!/^[6-9]\d{9}$/.test(values.mobile.replace(/\s/g, ''))) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  }
  if (isEmi && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.address.trim()) errors.address = 'Enter your complete address.';
  if (!values.city.trim()) errors.city = 'Enter your city.';
  if (!values.state.trim()) errors.state = 'Enter your state.';
  if (!/^\d{6}$/.test(values.pincode)) errors.pincode = 'Pincode must be exactly 6 digits.';

  if (isEmi) {
    if (!values.cardholderName.trim()) errors.cardholderName = 'Enter the cardholder name.';
    if (!/^\d{16}$/.test(values.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Enter a valid 16-digit test card number.';
    }
    if (!/^\d{2}\/\d{2}$/.test(values.expiry)) {
      errors.expiry = 'Use MM/YY format.';
    } else {
      const [month, year] = values.expiry.split('/').map(Number);
      const now = new Date();
      const expiryDate = new Date(2000 + year, month, 0);
      if (month < 1 || month > 12) {
        errors.expiry = 'Month must be between 01 and 12.';
      } else if (expiryDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
        errors.expiry = 'Card expiry date cannot be in the past.';
      }
    }
    if (!/^\d{3,4}$/.test(values.cvv)) errors.cvv = 'Enter a valid CVV.';
  }
  return errors;
}

function Field({ label, name, value, onChange, onBlur, error, type = 'text', inputMode }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <small id={`${name}-error`} className={styles.fieldError}>{error}</small>}
    </label>
  );
}

export default function CheckoutForm({ mode, product, variantLabel, price, plan, status, errorMessage, onSubmit, onCancel }) {
  const isEmi = mode === 'emi';
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const isSubmitting = status === 'submitting';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values, isEmi);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const customer = {
      name: values.fullName.trim(),
      mobile: values.mobile.replace(/\s/g, ''),
      ...(isEmi ? { email: values.email.trim() } : {}),
      address: values.address.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      pincode: values.pincode,
    };

    onSubmit({
      customer,
      deliveryAddress: customer,
      ...(isEmi ? {
        payment: {
          cardholderName: values.cardholderName.trim(),
          cardNumber: values.cardNumber.replace(/\s/g, ''),
          expiry: values.expiry,
          cvv: values.cvv,
        },
      } : {}),
    });
  };

  const handleBlur = () => setErrors(validate(values, isEmi));
  const isFormValid = Object.keys(validate(values, isEmi)).length === 0;

  return (
    <section className={styles.checkout} aria-labelledby={`${mode}-checkout-title`}>
      <div className={styles.checkoutHeader}>
        <div>
          <p className={styles.eyebrow}>{isEmi ? 'EMI checkout' : 'Full payment checkout'}</p>
          <h2 id={`${mode}-checkout-title`}>{isEmi ? 'Complete your EMI purchase' : 'Enter delivery details'}</h2>
        </div>
        <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={isSubmitting}>Back</button>
      </div>

      <div className={styles.checkoutSummary}>
        <strong>{product.name}</strong>
        <span>{variantLabel || 'Standard variant'} · {formatINR(isEmi ? plan.totalAmount : price)}</span>
        {isEmi && <span>{plan.tenureMonths} months · {formatINR(plan.monthlyEmi)}/month</span>}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          <Field label="Full name" name="fullName" value={values.fullName} onChange={handleChange} onBlur={handleBlur} error={errors.fullName} />
          <Field label="Mobile number" name="mobile" value={values.mobile} onChange={handleChange} onBlur={handleBlur} error={errors.mobile} inputMode="numeric" />
          {isEmi && <Field label="Email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} type="email" />}
          <Field label="Complete address" name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} error={errors.address} />
          <Field label="City" name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} error={errors.city} />
          <Field label="State" name="state" value={values.state} onChange={handleChange} onBlur={handleBlur} error={errors.state} />
          <Field label="Pincode" name="pincode" value={values.pincode} onChange={handleChange} onBlur={handleBlur} error={errors.pincode} inputMode="numeric" />
        </div>

        {isEmi && (
          <fieldset className={styles.paymentBox}>
            <legend>Test payment details</legend>
            <p className={styles.securityNote}>Demo payment only. Card details are tokenized in memory and are never sent to or stored by this app.</p>
            <div className={styles.formGrid}>
              <Field label="Cardholder name" name="cardholderName" value={values.cardholderName} onChange={handleChange} onBlur={handleBlur} error={errors.cardholderName} />
              <Field label="Card number" name="cardNumber" value={values.cardNumber} onChange={handleChange} onBlur={handleBlur} error={errors.cardNumber} inputMode="numeric" />
              <Field label="Expiry (MM/YY)" name="expiry" value={values.expiry} onChange={handleChange} onBlur={handleBlur} error={errors.expiry} inputMode="numeric" />
              <Field label="CVV" name="cvv" value={values.cvv} onChange={handleChange} onBlur={handleBlur} error={errors.cvv} inputMode="numeric" type="password" />
            </div>
          </fieldset>
        )}

        {errorMessage && <p className={styles.submitError} role="alert">{errorMessage}</p>}
        <button type="submit" className={styles.submitButton} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Processing...' : isEmi ? 'Proceed with EMI' : 'Place Order'}
        </button>
      </form>
    </section>
  );
}
