# Class Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Class Diagram: Domain Entity & Data Model Blueprint**

## 2. Primary Purpose
To specify the object-oriented structure, entity attributes, data types, operational signatures, and relational associations governing backend models and database persistence.

## 3. Source Files Analyzed
* `backend/database/schema.sql` (Table declarations, primary/foreign keys, ENUM specifications)
* `backend/routes/auth.js` (User model behavior and authentication methods)
* `backend/routes/reservations.js` (Reservation lifecycle methods)
* `backend/routes/queue.js` (Queue position and status logic)
* `backend/routes/tables.js` (Table inventory status management)
* `backend/routes/seating.js` (Seating assignment logic)
* `backend/routes/menu.js` (Menu catalog operations)
* `backend/routes/orders.js` (Order total calculation and item line management)

## 4. Main Elements
* **Classes:** `User`, `Reservation`, `QueueEntry`, `RestaurantTable`, `Seating`, `MenuItem`, `Order`, and `OrderItem`.
* **Attributes:** Explicitly typed with SQL/JavaScript mappings (`int`, `string`, `decimal`, `datetime`, `enum`, `boolean`).
* **Methods:** Functional operations mirroring controller actions (`register()`, `login()`, `create()`, `updateStatus()`, `calculateTotal()`, `assignTable()`).
* **Multiplicities:** UML-compliant cardinalities (`1`, `0..*`, `1..*`, `0..1`).

## 5. Complete Flow or Structural Relationships
* `User [1] --> [0..*] Reservation`: A registered customer creates zero or many reservations.
* `User [1] --> [0..*] Order`: A customer places zero or many dining orders.
* `Reservation [1] --> [0..1] QueueEntry`: An approved booking generates at most one waitlist entry.
* `Reservation [1] --> [0..1] Seating`: A seated booking links to an active seating instance.
* `Reservation [0..*] --> [0..1] RestaurantTable`: Reservations allocate an optional table.
* `Seating [1] --> [1] RestaurantTable`: An active seating session occupies exactly one table.
* `Order [1] --> [1..*] OrderItem`: An order aggregates one or more item lines.
* `OrderItem [0..*] --> [1] MenuItem`: Line items reference one catalog dish.
* `Order [0..*] --> [0..1] Reservation`: In-store orders link optionally to a dining reservation.

## 6. User Interactions Where Relevant
* Users trigger class instantiation and state modifications via REST mutations (e.g., customer creates `Reservation`, staff invokes `Seating.assignTable()`, customer invokes `Order.placeOrder()`).

## 7. Decision Points and Alternate Paths
* `QueueEntry` generation is conditional upon `Reservation.status == 'queued'`.
* `RestaurantTable.checkAvailability()` enforces table capacity matching before seating assignment.
* `MenuItem.available` boolean guards line item addition during order placement.

## 8. API and Database Operations Where Relevant
* Corresponds directly to MySQL tables in `resquedb` with foreign key cascades and automatic timestamp updates.

## 9. Socket.IO Interactions Where Relevant
* Invocation of state-mutating class methods (`updateStatus()`, `assignTable()`) triggers backend WebSocket event emissions.

## 10. Implemented Versus Proposed Details
* **Implemented:** All 8 entities and their relational mappings are fully active in the production SQL database.
* **Proposed:** Payment, Receipt, and Stock entities are omitted from the active class model to reflect empirical codebase fidelity.

## 11. Modeling Purpose Compliance
This diagram conforms to formal UML 2.5 class modeling syntax, defining structural data types, visibility indicators (`+`), and exact multiplicities without informal flowcharts.
