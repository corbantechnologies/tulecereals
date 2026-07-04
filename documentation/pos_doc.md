# GearHouse POS Implementation Guide

This document explains the architecture, operational flow, and core concepts behind the Point of Sale (POS) system in GearHouse. It covers the purpose of core entities (Tills, Shifts, Staff) and the standard operating procedures for both Vendors (Owners) and POS Staff (Cashiers).

## 1. Core Concepts

### POS Tills
**What is a Till?** A Till represents a physical cash register, payment terminal, or checkout counter in a brick-and-mortar shop (e.g., "Main Counter", "Kiosk 1", "Drive-thru").
**Why do we need them?** Tills allow a vendor to run multiple checkout points simultaneously. They are essential for tracking where a sale occurred and tying cash drawers to specific physical locations in the store.

### POS Shifts
**What is a Shift?** A Shift is a defined period of work for a cashier at a specific Till. 
**Why do we need them?** Shifts are critical for cash management and accountability. 
- When a cashier starts work, they **Open a Shift** and declare an `opening_float` (the amount of loose change currently in the cash drawer).
- All sales they make are tied to this Shift.
- When they finish work, they **Close the Shift** and declare a `closing_float` (the final amount of cash physically counted in the drawer).
- The system then calculates the expected cash (Opening Float + Cash Sales) and compares it against the declared Closing Float to easily identify overages or shortages (theft/errors).

### POS Staff
**What is POS Staff?** These are restricted user accounts created by the Vendor specifically for cashiers. 
**Why do we need them?** Cashiers only need access to the POS Register to make sales. They should not have access to the Vendor Dashboard to change product prices, view overall revenue analytics, or modify shop configurations.

---

## 2. Standard Operating Procedure (SOP)

The POS lifecycle is divided into two distinct roles: **The Vendor (Manager/Owner)** and **The POS Staff (Cashier)**.

### Phase 1: Vendor Setup (One-time or occasional)
Before any sales can happen, the Vendor must configure the POS environment.
1. **Configure POS Settings:** The Vendor navigates to `POS Settings` to define global rules, such as the `tax_rate` and the `loyalty_points_per_unit`.
2. **Create Tills:** The Vendor creates one or more `POSTill` records corresponding to their physical checkout counters.
3. **Create POS Staff:** The Vendor creates accounts for their cashiers. The system automatically sends an email to the cashier with their temporary login credentials.

### Phase 2: Opening the Store (Cashier)
1. **Login:** The Cashier logs into GearHouse. Because their account is flagged as `is_pos_staff`, the system automatically routes them directly to the POS Register (`/pos/register`), bypassing the Vendor Dashboard.
2. **Open a Shift:** The system will lock the register and force the cashier to open a shift. The cashier selects which **Till** they are operating today and enters the **Opening Float** (e.g., KES 5,000 in coins and notes).

### Phase 3: Making Sales (Cashier)
While the shift is open, the Cashier can process transactions:
1. **Scan/Search Items:** Add products or pre-configured `POSBundle`s to the cart.
2. **Assign Customer (Optional):** Attach the sale to a `WalkInCustomer` to award loyalty points or keep a record of the purchase.
3. **Checkout:** Select the payment method (Cash, M-Pesa, Card). 
   - *Note on M-Pesa:* For POS, M-Pesa can trigger an STK push directly to the customer's phone if the callback URL is configured.
4. **Receipt:** The sale is recorded as a `POSSale` tied to the current open Shift, and a receipt is generated.

### Phase 3.5: Accidental Logouts / Taking Breaks (Cashier)
What happens if a cashier logs out, loses internet, or refreshes the page?
- The backend API (`/api/v1/posshifts/current/`) constantly tracks the `OPEN` shift for each cashier. 
- When the cashier logs back in, the system detects their existing open shift and automatically resumes it. 
- They **do not** need to open a new shift, and they will be blocked from opening a second shift until they close the first one.

### Phase 4: Closing the Store (Cashier)
At the end of their workday, the Cashier must close out their register.
1. **Count the Cash:** The Cashier physically counts the cash in their drawer.
2. **Close Shift:** The Cashier clicks "Close Shift" and enters the final cash amount (**Closing Float**).
3. **End of Shift:** The register is locked again until a new shift is opened (either by the next cashier or the next morning).

---

## 3. Data Relationships (Backend Architecture)

To understand how the data ties together, here is the hierarchy:

* **Shop** (1) ──has many──> (∞) **POSTills**
* **Shop** (1) ──has many──> (∞) **POSStaff** (Users)
* **POSTill** (1) ──has many──> (∞) **POSShifts**
* **POSStaff** (1) ──has many──> (∞) **POSShifts** (A shift belongs to the cashier who opened it)
* **POSShift** (1) ──has many──> (∞) **POSSales** (Every transaction belongs to the shift it occurred during)

### Why this architecture?
If a Vendor notices that "Till 2" is constantly short of cash by KES 500 at the end of the week, they can look at the `POSShifts` for Till 2. They will see exactly which `POSStaff` member was running Till 2 during the shifts where the shortages occurred. This provides complete auditability and financial security for the shop owner.

---

## 4. Vendor Tracking & Logs

The POS system natively records every action into auditable logs accessible via the **Vendor Dashboard**.

### POS Sales History
- **Path:** `/vendor/pos-sales`
- Provides a comprehensive log of every physical transaction made at the tills.
- **Details Page (`/vendor/pos-sales/[reference]`):** Vendors can click into any sale to view the complete receipt breakdown (line items, tax, discounts, split payments).
- **Voiding:** If a sale is marked as `VOIDED`, a database signal (`pre_save` hook on `POSSale`) automatically triggers an atomic transaction that:
  1. Restores the exact stock quantities of all items back into inventory.
  2. Reverses any loyalty points the customer earned from that sale.
  3. Refunds any loyalty points the customer spent on that sale.

### POS Shift Logs
- **Path:** `/vendor/pos-shifts`
- Provides a financial audit trail of till activity and cash handling.
- Displays opening floats, expected cash, and declared closing floats.
- **Discrepancy Calculation:** The system calculates `cash_discrepancy` = `closing_float - expected_cash`. The dashboard highlights shortages in Red and overages in Amber, instantly alerting the vendor to cash mismanagement.