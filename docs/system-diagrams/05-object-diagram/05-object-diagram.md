# Object Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Object Diagram: Concrete System State Snapshot at 19:15**

## 2. Primary Purpose
To capture an empirical, instantiated snapshot of real-world object instances, their attribute values, and relational links during an active customer dining transaction at 19:15 on October 30, 2026.

## 3. Source Files Analyzed
* `backend/database/schema.sql` (Attribute naming and types)
* `backend/seed.js` (Sample database data)
* `backend/routes/orders.js` & `backend/routes/seating.js` (Object relationship creation)

## 4. Main Elements
* `john : User` (id = 1, role = 'customer')
* `res1 : Reservation` (id = 5, guests = 4, status = 'seated', table_id = 3)
* `q1 : QueueEntry` (id = 3, queue_number = 12, position = 1, status = 'seated')
* `tblM3 : RestaurantTable` (id = 3, table_number = 'M3', capacity = 4, status = 'occupied')
* `seat1 : Seating` (id = 7, status = 'seated', seated_at = '19:15:00')
* `ord1 : Order` (id = 10, total = 1250.00, status = 'preparing', notes = 'Medium rare steak')
* `oi1 : OrderItem` (quantity = 2, unit_price = 350.00, subtotal = 700.00)
* `oi2 : OrderItem` (quantity = 2, unit_price = 275.00, subtotal = 550.00)
* `grill : MenuItem` (id = 4, name = 'Viking Ribeye Steak', price = 350.00)
* `bev : MenuItem` (id = 8, name = 'Craft Draft Beer', price = 275.00)

## 5. Complete Flow or Structural Relationships
* Customer `john` is linked to reservation `res1` and order `ord1`.
* Reservation `res1` links to waitlist entry `q1` and seating session `seat1`.
* Seating session `seat1` occupies physical dining table `tblM3`.
* Order `ord1` links to line items `oi1` and `oi2`, which reference catalog items `grill` and `bev`.
* Order `ord1` is linked to reservation `res1`.

## 6. User Interactions Where Relevant
* Represents the state following John's table seating and order submission, currently under kitchen preparation.

## 7. Decision Points and Alternate Paths
* Snapshot displays a successful happy-path state where table assignment was fulfilled and the order accepted without cancellation.

## 8. API and Database Operations Where Relevant
* Directly mirrors row instances across the 8 MySQL tables at a single frozen transaction timestamp.

## 9. Socket.IO Interactions Where Relevant
* State captured immediately after `order:new` was received by the kitchen and `order:update` transitioned the ticket to `preparing`.

## 10. Implemented Versus Proposed Details
* **Implemented:** All instantiated attributes match the active database schema precisely.
* **Proposed:** No hypothetical billing or stock records are present.

## 11. Modeling Purpose Compliance
This diagram adheres to UML object diagram standards by depicting concrete named instances (`instanceName : ClassName`) with specific attribute values rather than abstract class declarations.
