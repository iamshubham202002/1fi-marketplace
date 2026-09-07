# 1Fi Marketplace

A responsive React and Vite shopping application inspired by the 1Fi mobile UI. It includes marketplace browsing, product variants, calculated EMI plans, full-payment checkout, two-stage EMI checkout, validation, loading/error states, and order confirmation screens.

## Project Status

This is a frontend-only development project. The API layer simulates backend requests with network-like latency and occasional failures. There is currently no database, production backend, or real payment gateway.

The mock payment flow does not send raw card details in the final order payload. A production deployment should use a PCI-compliant payment provider and tokenization.

## Features

### Marketplace

- Shop page with Marketplace, Top Brands, and Nearby Stores tabs.
- Debounced search by product, brand, or category.
- Product cards with brand, price, and starting monthly EMI.
- Product details with store, description, rating, and variants.
- Responsive 1Fi-style UI using CSS Modules and shared design tokens.

### EMI checkout

- EMI plans are calculated from the selected product price and variant price changes.
- Existing reducing-balance EMI calculations are preserved in `src/utils/emi.js`.
- Supports no-cost and interest-bearing EMI plans.
- Customer and payment details are validated in the browser.
- Card expiry validates `MM/YY`, month range, and past dates.
- EMI follows a two-stage purchase flow:

```text
Select EMI plan
  -> Fill EMI and customer details
  -> Proceed with EMI
  -> EMI Applied Successfully
  -> Buy Now
  -> Bought Successfully
  -> Order Summary
  -> Continue Shopping
```

### Full payment

- Buy Now opens a separate customer-details checkout.
- Required delivery fields are validated before placing an order.
- The full-payment order is created only after Place Order is submitted.
- Duplicate submission is prevented while a request is processing.

### Order confirmation

Final confirmation displays:

- Product and selected variant
- Product price
- EMI tenure, monthly EMI, and total payable for EMI orders
- Payment type and payment status
- Order status
- Delivery address and mobile number
- Generated order ID
- Continue Shopping navigation back to `/shop`

## Technology

- React 18
- Vite 5
- React Router 6
- CSS Modules
- Native React state and custom hooks
- No Tailwind CSS or external state-management library is installed

## Requirements

- Node.js 18 or newer
- npm

## Installation

```bash
npm install
```

## Environment Configuration

The current app uses a local simulated API and does not require environment variables. Copy `.env.example` to `.env` only when adding a real backend or other environment-specific configuration.

Never commit `.env` or secrets. Vite variables intended for browser code must use the `VITE_` prefix and should contain only values that are safe to expose publicly.

## Development

```bash
npm run dev
```

Vite normally serves the app at:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

Preview the production build locally with:

```bash
npm run preview
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home screen |
| `/shop` | Marketplace and product listing |
| `/shop/product/:productId` | Product details, EMI selection, and checkout |
| `/emi-dues` | EMI dues placeholder screen |
| `/limit` | Limit placeholder screen |
| `/profile` | Profile placeholder screen |

## Project Structure

```text
src/
├── api/
│   ├── httpClient.js             # Simulated request client
│   └── marketplaceApi.js         # Product, EMI, payment, and order API functions
├── components/
│   ├── common/                   # Loading, error, empty, logo, and tab components
│   └── marketplace/
│       ├── CheckoutForm.jsx      # Full-payment and EMI checkout form
│       ├── EmiPlanCard.jsx       # Selectable EMI plan card
│       ├── EmiPlanSelector.jsx   # EMI plan list and states
│       ├── OrderSummary.jsx       # Pre-checkout product and EMI summary
│       ├── ProductCard.jsx
│       ├── ProductVariants.jsx
│       └── ...
├── data/
│   └── marketplaceData.js        # Mock stores and products
├── hooks/
│   ├── useAsync.js               # Loading, success, error, and retry lifecycle
│   └── useDebouncedValue.js      # Debounced marketplace search
├── layout/
│   ├── AppShell.jsx
│   └── BottomNav.jsx
├── pages/
│   ├── ProductDetails.jsx        # Product, EMI, and checkout flow
│   ├── Shop.jsx
│   └── ...
├── styles/
│   └── tokens.css                # Shared 1Fi colors, spacing, radii, and shadows
└── utils/
    ├── currency.js               # INR formatting
    └── emi.js                    # EMI calculation and plan derivation
```

## API Layer

`src/api/marketplaceApi.js` currently exposes simulated functions for:

- Loading marketplace products
- Loading stores and products
- Building EMI plans for the current principal
- Processing mock EMI payment data
- Creating full-payment orders
- Creating final EMI orders

The simulated HTTP client adds latency and a small failure rate so loading, retry, and error states can be tested during development.

### Full-payment order

The full-payment flow sends product, variant, quantity, price, customer, delivery address, payment type, and creation timestamp to the mock order function.

### Final EMI order

The final EMI order is created only after the user clicks Buy Now inside the EMI Applied success state. It includes product information, customer and delivery data, EMI tenure, monthly amount, total amount, EMI status, payment type, payment status, transaction reference, and creation timestamp.

Raw card number, CVV, PIN, and OTP are not stored in the final order payload.

## EMI Calculation

EMI plans are defined as product templates containing tenure, interest rate, processing fee, and no-cost status. `buildEmiPlans()` calculates:

- Monthly EMI
- Total payable amount
- Interest payable

The principal is recalculated whenever a product variant changes, so displayed EMI plans match the selected configuration.

## Validation and Error Handling

- Required fields cannot be empty.
- Indian mobile numbers must contain 10 digits and start with 6-9.
- Email is required for EMI checkout and must use valid formatting.
- Pincode must contain exactly six digits.
- Card number must contain 16 digits.
- CVV must contain 3 or 4 digits.
- Card expiry must use `MM/YY`, have a month from `01` to `12`, and not be expired.
- Submit buttons are disabled while forms are invalid or requests are processing.
- User-facing messages hide internal API errors.
- Variant changes clear the selected EMI plan and in-progress checkout state.

## Production Notes

Before production use:

1. Replace `simulateRequest()` with real authenticated HTTP calls.
2. Add a backend order model and persistent order endpoints.
3. Integrate a PCI-compliant payment gateway for EMI payments.
4. Tokenize payment details through the gateway instead of handling raw card data in application APIs.
5. Add authentication, authorization, server-side validation, inventory checks, idempotency keys, and payment webhook verification.
6. Add automated unit, integration, and end-to-end tests for checkout and payment failure cases.

## Current Limitations

- Orders are not persisted after a page refresh.
- Payment processing is a development mock, not a real financial transaction.
- Top Brands, Nearby Stores, EMI Dues, Limit, and Profile contain placeholder or intentionally limited screens.
- There is no backend or database in this repository.
