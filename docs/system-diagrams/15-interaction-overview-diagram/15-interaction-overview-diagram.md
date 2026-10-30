# Interaction Overview Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Interaction Overview Diagram: High-Level System Interaction Flow**

## 2. Primary Purpose
To provide an executive bird's-eye view of the entire customer dining lifecycle by nesting interaction sequences within an activity-style control framework utilizing reference frames (`ref`).

## 3. Source Files Analyzed
* `frontend/src/App.jsx`
* `frontend/src/pages/Login.jsx`
* `frontend/src/pages/customer/*`
* `frontend/src/pages/staff/*`
* `frontend/src/pages/kitchen/*`
* Backend route controllers and Socket.IO handlers

## 4. Main Elements
* **Initial Node:** Starting control point.
* **Interaction Use Frames (`ref`):**
  * `ref: Customer Authentication Sequence`
  * `ref: Reservation & Queue Sequence`
  * `ref: Menu Exploration & Cart Sequence`
  * `ref: Order Submission Sequence`
  * `ref: Kitchen Fulfillment Sequence`
  * `ref: Dining Conclusion Sequence`
* **Decision Node:** Diamond evaluating whether customer has a confirmed booking.
* **Final Node:** Terminal completion point.

## 5. Complete Flow or Structural Relationships
1. Flow begins with customer login and authentication token issuance.
2. Decision node evaluates booking status: if customer lacks a reservation, control flows through the Reservation & Queue sequence (booking submission, staff approval, queue waitlist tracking, and table seating).
3. If reservation is confirmed or customer is already seated, control proceeds directly to Menu Exploration & Cart management.
4. Customer submits food order, flowing into the Order Submission sequence.
5. The Kitchen Fulfillment sequence processes the order through cooking, plating, and delivery.
6. The Dining Conclusion sequence completes the order, concludes the seating session, and frees the table for the next customer.

## 6. User Interactions Where Relevant
* Connects the complete multi-actor operational workflow spanning customer, reservation staff, and kitchen personnel.

## 7. Decision Points and Alternate Paths
* Decision gate handles walk-in vs. reserved dining flows.

## 8. API and Database Operations Where Relevant
* Summarizes operations across all 8 REST controllers.

## 9. Socket.IO Interactions Where Relevant
* References real-time signals across queue, table, and order phases.

## 10. Implemented Versus Proposed Details
* **Implemented:** All 6 referenced sequence fragments reflect active codebase workflows.
* **Proposed:** Billing settlement is incorporated conceptually into dining conclusion.

## 11. Modeling Purpose Compliance
This diagram strictly conforms to UML 2.5 interaction overview specifications by combining high-level activity control flow with `ref` frames pointing to granular interaction sequences.
