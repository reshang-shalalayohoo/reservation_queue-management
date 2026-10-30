# Data Flow Diagram (DFD) — VikingsERP

## 1. Diagram Title
**Level 1 Data Flow Diagram: Dining Operations & Information Pipelines**

## 2. Primary Purpose
To trace the logical movement, transformation, and storage of operational data as it flows between external actors, business processes, and persistent data stores.

## 3. Source Files Analyzed
* Complete `backend/routes/*.js` controllers
* `backend/database/schema.sql` (Data stores D1-D7)
* All frontend transaction forms and views

## 4. Main Elements
* **External Entities:** Customer, Reservation Staff, Service/Kitchen Staff, and Management.
* **Processes (Level 1):**
  * 1.0 Manage Table Reservations
  * 2.0 Manage Queue & Seating
  * 3.0 Manage Digital Menu
  * 4.0 Process Customer Orders
  * 5.0 Fulfill Kitchen Orders
  * 6.0 Monitor Operational Telemetry
* **Data Stores:** D1: users, D2: reservations, D3: queue_entries, D4: restaurant_tables & seating, D5: menu_items, D6: orders, D7: order_items.

## 5. Complete Flow or Structural Relationships
1. Customer sends booking submission to Process 1.0; Process 1.0 verifies against D1, persists in D2, and alerts Reservation Staff.
2. Staff sends approval to Process 1.0, which forwards confirmed bookings to Process 2.0.
3. Process 2.0 assigns queue priority in D3, allocates dining tables in D4, and pushes waitlist alerts to Customer.
4. Customer queries Process 3.0, reading active dishes from D5.
5. Customer submits order payload to Process 4.0, which validates prices in D5, records headers in D6, records line items in D7, and dispatches tickets to Kitchen Staff.
6. Kitchen Staff updates cooking stages in Process 5.0, modifying D6 and streaming live updates to Customer.
7. Management queries Process 6.0, which aggregates telemetry across D2, D3, D4, and D6.

## 6. User Interactions Where Relevant
* Captures all operational touchpoints across customer booking, dining room seating, food ordering, and kitchen preparation.

## 7. Decision Points and Alternate Paths
* Process 4.0 validates catalog availability before writing orders; unavailable dishes trigger error responses and prevent corrupt writes.

## 8. API and Database Operations Where Relevant
* Processes map directly to backend controllers; data stores map to the 8 MySQL tables.

## 9. Socket.IO Interactions Where Relevant
* Real-time notification flows (waitlist updates, kitchen ticket dispatch, order status streams) are represented as labeled directional data flows.

## 10. Implemented Versus Proposed Details
* **Implemented:** Covers all active transactional pipelines across the two assigned modules.
* **Proposed:** External payment gateway and supplier procurement pipelines are omitted from Level 1 core flows.

## 11. Modeling Purpose Compliance
This diagram strictly adheres to Gane-Sarson / Yourdon DFD standards, utilizing open-ended rectangles for data stores, rounded rectangles for processes, and labeled directional arrows without flowchart control diamonds.
