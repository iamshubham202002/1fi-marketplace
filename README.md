# 1Fi Marketplace

A responsive React and Vite shopping experience inspired by the 1Fi mobile UI. The app includes product browsing, product variants, calculated EMI plans, full-payment checkout, two-stage EMI checkout, validation, loading/error states, and order confirmation screens.
## Project Status

This is a frontend-only development project. The API layer currently simulates backend requests with latency and occasional failures. No database, real payment gateway, or production backend is included.
The mock payment flow never sends raw card details in the final order payload. A real deployment should replace it with a PCI-compliant payment provider and tokenization flow.
## Features

### Marketplace
- Shop page with Marketplace, Top Brands, and Nearby Stores tabs.
- Product search with debounce behavior.
- Product cards with brand, price, and starting monthly EMI.
- Product details with store information, description, variants, and rating.
- Responsive 1Fi-style layout using CSS Modules and shared design tokens.

### EMI
- EMI plans are calculated from the selected product price and variant price deltas.
- Existing reducing-balance EMI calculation is preserved in `src/utils/emi.js`.
- No-cost and interest-bearing plans are supported.
- Customers select an EMI plan before starting EMI checkout.
- EMI customer and payment details are validated in the browser.
- Card expiry validates `MM/YY`, month range, and past dates.
- The flow is intentionally split into two actions:

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

### Full Payment

- Buy Now opens a separate customer-details checkout.
- Required delivery fields are validated before placing an order.
- The full-payment order is created only after Place Order is submitted.
- Duplicate submission is prevented while the request is processing.

### Order confirmation

The final confirmation shows:

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
- No Tailwind CSS or external state-management library is currently installed

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

Vite prints the local development URL, normally:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

To preview the production build locally:

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

## Main Project Structure

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

The simulated client adds network-like latency and a small failure rate so loading, retry, and error states can be exercised during development.

### Full-payment order data

The full-payment flow sends product, variant, quantity, price, customer, delivery address, payment type, and creation timestamp to the mock order function.

### EMI order data

The final EMI order is created only after the user clicks Buy Now in the EMI Applied success state. It includes product information, customer and delivery data, EMI tenure, monthly amount, total amount, EMI status, payment type, payment status, transaction reference, and creation timestamp.

Raw card number, CVV, PIN, and OTP are not stored in the order payload.

## EMI Calculation

EMI plans are defined as product templates containing tenure, interest rate, processing fee, and no-cost status. `buildEmiPlans()` calculates:

- Monthly EMI
- Total payable amount
- Interest payable

The principal is recalculated whenever a product variant changes, so the displayed EMI plans always match the selected configuration.

## Validation and Error Handling

- Required fields cannot be empty.
- Indian mobile numbers must contain 10 digits and start with 6-9.
- Email is required for EMI checkout and must have valid formatting.
- Pincode must contain exactly six digits.
- Card number must contain 16 digits.
- CVV must contain 3 or 4 digits.
- Card expiry must use `MM/YY`, have a month from `01` to `12`, and not be expired.
- Submit buttons are disabled while forms are invalid or requests are processing.
- User-facing messages hide internal API errors.
- Variant changes clear the selected EMI plan and any in-progress checkout state.

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
# 1Fi Marketplace

Implements the Shop page exactly as specified in the assignment PDF: **three**
tabs — **Top Brands** (blank, unimplemented by design), **Nearby Stores**
(blank, unimplemented by design), and **1Fi Marketplace** (fully designed and
implemented) — inside a minimal stand-in for the existing 1Fi app.

> **Note on scope:** no existing 1Fi repository was provided — only the
> assignment PDF and a reference screenshot. So this project includes a
> minimal "existing app" shell (Home / Shop / EMI Dues / Limit / Profile with
> bottom navigation) purely as a realistic host, and the actual assignment
> work — the 1Fi Marketplace tab — is built inside it.

---

## 1. What was implemented

**Shop page** (`/shop`) with three pill tabs, per the PDF:

- **Top Brands** — intentionally blank ("This section is coming soon"), as
  the assignment states no implementation is required.
- **Nearby Stores** — intentionally blank, same reasoning.
- **1Fi Marketplace** — fully built: search, product grid (image, name,
  price, brand, no-cost EMI badge) → product details (image, name, price,
  description, variant selection, EMI plan selector with a clear selected
  state, order summary, and a sticky "Proceed with EMI" CTA that's disabled
  until required selections are made).

The Marketplace tab is the default active tab on load, since it's the only
one with real functionality to evaluate — Top Brands and Nearby Stores are a
tap away if you want to see their blank states.

## 2. Files created

```
1fi-marketplace/
├── package.json, vite.config.js, index.html
└── src/
    ├── main.jsx, App.jsx
    ├── styles/tokens.css               # design tokens (colour, radius, shadow)
    ├── layout/
    │   ├── AppShell.jsx / .module.css  # mobile-first frame
    │   └── BottomNav.jsx / .module.css # Home/Shop/EMI Dues/Limit/Profile
    ├── api/
    │   ├── httpClient.js               # simulated latency + failures
    │   └── marketplaceApi.js           # fetchMarketplaceProducts, fetchStore,
    │                                   #   fetchProduct, fetchEmiPlans, submitEmiOrder
    ├── data/marketplaceData.js         # mock stores + products (source of truth)
    ├── hooks/
    │   ├── useAsync.js                 # loading/success/error/retry lifecycle
    │   └── useDebouncedValue.js        # debounced search
    ├── utils/
    │   ├── currency.js                 # INR formatting
    │   └── emi.js                      # reducing-balance EMI maths
    ├── components/
    │   ├── common/                     # LoadingState, ErrorState, EmptyState,
    │   │                               #   LogoTile, PillTabs (generic 3-tab switcher)
    │   └── marketplace/                # MarketplaceHeader, MarketplacePanel,
    │                                   #   MarketplaceSearch, ProductCard, ProductGrid,
    │                                   #   ProductImage, ProductVariants, EmiPlanCard,
    │                                   #   EmiPlanSelector, OrderSummary, ProceedButton
    └── pages/
        ├── Shop.jsx                    # the Shop page: 3 tabs + routes to Marketplace panel
        ├── ProductDetails.jsx          # variant + EMI selection + CTA
        └── Home.jsx, EmiDues.jsx, Limit.jsx, Profile.jsx  # minimal existing-app stand-ins
```

No files were "modified" in the traditional sense since there was no existing
repository to modify — everything above is new, structured so only
`api/marketplaceApi.js` would need to change to point at a real backend.

## 3. Architecture

- **React 18 + Vite**, **react-router-dom v6**. No state library — the
  Marketplace's state fits comfortably in local component state plus one
  small `useAsync` hook.
- **CSS Modules** everywhere, plus a shared `tokens.css` for the palette,
  radius, and shadow variables so the whole app (including the two blank
  tabs) reads as one design system.
- **Data flow:** `pages/Shop.jsx` and `components/marketplace/MarketplacePanel.jsx`
  call `api/marketplaceApi.js` → resolved through `httpClient.js`'s
  `simulateRequest` (adds latency + a small random failure rate) → purely
  presentational components (`ProductCard`, `EmiPlanCard`, etc.) receive data
  only through props.

## 4. Data / API approach

```
fetchMarketplaceProducts({ query })     → GET /marketplace/products
fetchStore(storeId)                     → GET /marketplace/stores/:id  (shown on product details)
fetchProduct(productId)                 → GET /marketplace/products/:id
fetchEmiPlans(productId, principal)     → GET /marketplace/products/:id/emi-plans
submitEmiOrder(payload)                 → POST /marketplace/orders (mocked, no real payment)
```

EMI amounts are **never hardcoded** — `utils/emi.js` implements the standard
reducing-balance EMI formula and derives monthly EMI / total payable /
interest from whichever price is currently selected (base price + variant
deltas), so switching a variant recalculates every plan shown.

## 5. State management

Local component state only, via a small `useAsync` hook that standardises
loading/success/error/retry for every fetch, plus `useDebouncedValue` for
search. The active Shop tab is kept in the URL (`?tab=marketplace`) via
`useSearchParams` so it survives navigation into a product and back. State
tracked: active tab, search query, selected product (route param), selected
variant options, selected EMI plan, and submit status.

## 6. User flow

Home → **Shop** tab → lands on **1Fi Marketplace** by default → search or
scroll the product grid → tap a product → pick variant(s) → pick an EMI plan
(clear selected state) → review the order summary → **Proceed with EMI**
(disabled until a variant + plan are chosen; shows a spinner, then a success
state — no real payment is processed) → back button returns to the
Marketplace tab specifically.

Search for something that doesn't exist to see the empty state. A ~6%
simulated failure rate on every mock request means you'll occasionally see
the retry-capable error state too.

## 7. How to run

```bash
cd 1fi-marketplace
npm install
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`) at a phone
width for the primary experience — it's also responsive through
tablet/desktop, where the app renders as a centered mobile-width card.

## 8. Assumptions

- Per the PDF, Top Brands and Nearby Stores are left as clearly-labelled
  blank/"coming soon" panels rather than fully blank white screens, since a
  totally empty screen with no tab content is harder to distinguish from a
  bug during review.
- 1Fi Marketplace browses products directly (no store drill-down) since the
  PDF's requirement list (image, name, price, variants, EMI options, details,
  EMI selection, CTA) is entirely product-level; each product still carries
  its selling store for the details page and for context on the card.
- Brand/product imagery uses styled colour tiles instead of external image
  URLs, so the UI never breaks due to a dead image link.
- "1Fi Marketplace" is the default active tab on `/shop` so the built feature
  is what's visible first, rather than one of the two blank tabs.

## 9. Known limitations

- This sandbox has no network access, so `npm install` / `npm run dev` could
  not be executed here to produce a live screenshot — the code has been
  syntax-checked file-by-file and cross-checked for import/export
  consistency, but please run it locally to do a final visual pass.
- There's no persistence layer — refreshing mid-flow resets selections.
- Because there's no real existing 1Fi codebase to extend, exact pixel parity
  (fonts, precise colour hex values, spacing) is an approximation from the
  reference screenshot rather than a guaranteed match to the production app.
