# GearHouse POS Implementation Tasklist

## ✅ Implemented (Frontend & Backend)

### 1. Vendor Setup & Configuration
- [x] **POS Settings:** `POSConfigSection` implemented for configuring tax rates and loyalty rules.
- [x] **Tills Management:** `POSTillsSection` implemented for creating and managing physical registers.
- [x] **Staff Management:** `POSStaffSection` implemented for creating restricted cashier accounts.

### 2. POS Register (Cashier Operations)
- [x] **Shift Management:** Cashiers are forced to open a shift with an opening float (`OpenShiftModal`) before making sales.
- [x] **Shift Protection:** Product grid and checkout are strictly disabled if no shift is currently open.
- [x] **Product Grid & Search:** Cashiers can search inventory by name or SKU and add them to the cart.
- [x] **Customer Lookup (Autocomplete):** Dynamic searching by Name or Phone to quickly attach walk-in customers to sales.
- [x] **Loyalty Integration:** Cashiers can view customer points, redeem points against the cart total, and seamlessly enroll new walk-in customers.
- [x] **Checkout & Payments:** Support for Cash, Card, and M-Pesa.
- [x] **M-Pesa STK Push:** Integrated direct STK push to customer phones with polling for completion (`CheckoutModal`).
- [x] **Shift Closing:** Cashiers can close their shift and declare their final counted float (`CloseShiftModal`).
- [x] **Today's Sales & Voiding:** Cashiers can view recent sales in the register and void them (which automatically restores stock and loyalty points).

### 3. Vendor Tracking & Audit Logs
- [x] **POS Sales History (`/vendor/pos-sales`):** Comprehensive log of every physical transaction.
- [x] **Receipt Details (`/vendor/pos-sales/[reference]`):** Full breakdown of line items, taxes, and applied discounts for any sale.
- [x] **POS Shift Logs (`/vendor/pos-shifts`):** Financial audit trail tracking opening floats, expected cash, and declared cash.
- [x] **Discrepancy Highlighting:** Automatic calculation of `cash_discrepancy`, highlighting shortages in red and overages in amber.

---

## ⏳ Yet To Be Implemented / Pending

### 1. Advanced POS Features
- [ ] **Split Payments Backend Support:** The UI allows adding multiple payment methods (e.g., half cash, half card), but the backend currently only processes a single primary payment method per sale.
- [ ] **POS Bundles:** Support for selling grouped items (e.g., gift hampers) under a single barcode/SKU.
- [ ] **Partial Refunds/Returns:** Currently, only full sale voiding is supported. Need the ability to refund specific line items from a receipt.
- [ ] **Physical Receipt Printing:** A printable receipt view or automatic thermal printer integration to trigger after a successful checkout.

### 2. Authentication & Security
- [ ] **Strict POS Staff Routing:** Ensure middleware forces users with `is_pos_staff=True` directly to `/pos/register` and strictly blocks them from accessing `/vendor/*` routes.
- [ ] **Manager Overrides:** PIN prompt for managers to authorize restricted actions on the register (e.g., voiding past sales, applying large discounts).