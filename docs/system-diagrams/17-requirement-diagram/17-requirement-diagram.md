# Requirement Diagram (SysML) — VikingsERP

## 1. Diagram Title
**SysML 1.6 Requirement Diagram: Traceability Matrix & Architectural Satisfaction**

## 2. Primary Purpose
To formally specify functional system requirements for the POS & Ordering and Inventory & Menu subsystems, tracing requirements to implementing software components using SysML relationships (`«satisfy»`, `«deriveReqt»`, `«verify»`).

## 3. Source Files Analyzed
* Master requirements specification (`diagrams.docx`)
* `frontend/src/pages/customer/Cart.jsx` & `OrderConfirmation.jsx`
* `backend/routes/orders.js` & `backend/routes/menu.js`
* `backend/socket/index.js`
* `frontend/src/pages/kitchen/*`
* `backend/database/schema.sql`

## 4. Main Elements
* **POS Requirements:**
  * `REQ-POS-001: Order Processing` (Implemented)
  * `REQ-POS-002: Server-Side Billing Calculation` (Implemented)
  * `REQ-POS-003: Real-Time Order Tracking` (Implemented)
  * `REQ-POS-004: Kitchen Ticket Management` (Implemented)
  * `REQ-POS-005: Payment Gateway Settlement` (PROPOSED)
  * `REQ-POS-006: Fiscal Receipt Printing` (PROPOSED)
* **Inventory & Menu Requirements:**
  * `REQ-INV-001: Menu Catalog Management` (Implemented)
  * `REQ-INV-002: Real-Time Availability Toggling` (Implemented)
  * `REQ-INV-003: Recipe-Based Stock Depletion` (PROPOSED)
  * `REQ-INV-004: Supplier Catalog Management` (PROPOSED)
  * `REQ-INV-005: Automated Purchase Requisitions` (PROPOSED)
  * `REQ-INV-006: Low-Stock Automated Alerts` (PROPOSED)
* **Implementing Components:** `Cart.jsx`, `orders.js Controller`, `Socket.IO Server`, `OrderManagement.jsx`, `menu.js Controller`, and MySQL tables.
* **Relationships:** `«satisfy»` (component satisfies requirement), `«deriveReqt»` (derived requirement hierarchy), and `«verify»` (component verifies requirement).

## 5. Complete Flow or Structural Relationships
* REQ-POS-001 is satisfied by `Cart.jsx` and derives REQ-POS-002.
* REQ-POS-002 is satisfied by `orders.js Controller` and verified by its server-side calculation logic.
* REQ-POS-002 derives REQ-POS-003, which is satisfied by `Socket.IO Server`.
* REQ-POS-004 is satisfied by `OrderManagement.jsx` and derives proposed REQ-POS-005 and REQ-POS-006.
* REQ-INV-001 is satisfied by `menu.js Controller`, verified by `resquedb` schema, and derives REQ-INV-002 and proposed REQ-INV-003.
* Proposed REQ-INV-003 derives proposed REQ-INV-006 (Low-Stock Alerts).
* Proposed REQ-INV-004 derives proposed REQ-INV-005 (Purchase Orders).

## 6. User Interactions Where Relevant
* Proves that system features built for customers and staff fulfill formal engineering requirements.

## 7. Decision Points and Alternate Paths
* Explicitly distinguishes implemented capabilities from proposed enterprise extensions using clear `(PROPOSED)` tags.

## 8. API and Database Operations Where Relevant
* Traces backend endpoints and database schemas directly to the requirement IDs they satisfy.

## 9. Socket.IO Interactions Where Relevant
* Traces WebSocket broadcasting components directly to REQ-POS-003.

## 10. Implemented Versus Proposed Details
* **Implemented:** REQ-POS-001 to 004, REQ-INV-001 to 002.
* **Proposed:** REQ-POS-005 to 006 (Payment/Receipts), REQ-INV-003 to 006 (Stock Depletion, Suppliers, Purchase Orders, Alerts).

## 11. Modeling Purpose Compliance
This diagram strictly obeys SysML 1.6 requirement diagram standards, featuring standardized requirement callout boxes with `id` and `text` fields and valid dependency stereotypes.
