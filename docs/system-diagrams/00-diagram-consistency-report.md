# VikingsERP: 17-Diagram Consistency & Validation Report
## Cross-Model Verification for Academic System Documentation

---

## 1. Executive Consistency Audit

This audit validates that all **17 System Diagrams** (8 Structural + 9 Behavioral) share a unified, mathematically consistent domain model and reflect the verified codebase of VikingsERP without discrepancies in actor nomenclature, database schema, API routing, state transitions, or real-time signals.

```
+================================================================================================+
|                                      CONSISTENCY MATRIX                                        |
+================================================================================================+
| Dimension                | Verified Canonical Standard                 | Compliance Status     |
+--------------------------+---------------------------------------------+-----------------------+
| User Actors              | Customer, Reservation Staff,                | 100% Consistent       |
|                          | Service/Kitchen Staff, Management           | across all diagrams   |
+--------------------------+---------------------------------------------+-----------------------+
| Database Entities        | users, restaurant_tables, reservations,     | 100% Identical schema |
| (8 Relational Tables)    | queue_entries, seating, menu_items,         | in Class, DFD, Schema,|
|                          | orders, order_items                         | Sequence, & Component |
+--------------------------+---------------------------------------------+-----------------------+
| API Endpoints            | /api/auth, /api/reservations, /api/queue,   | Verified against      |
| (8 REST Route Groups)    | /api/tables, /api/seating, /api/menu,       | Express routes &      |
|                          | /api/orders, /api/dashboard                 | Axios clients         |
+--------------------------+---------------------------------------------+-----------------------+
| Real-Time Events         | reservation:new, reservation:update,        | Canonical Socket.IO   |
| (Socket.IO WebSocket)    | queue:update, table:update, table:deleted,  | events verified       |
|                          | seating:update, order:new, order:update     | in backend & frontend |
+--------------------------+---------------------------------------------+-----------------------+
| Technology Architecture  | React 18 + Vite (5173) ->                   | Accurately modeled    |
|                          | Node + Express (5000) -> MySQL (3306)       | across all tiers      |
+--------------------------+---------------------------------------------+-----------------------+
| Academic Visual Design   | Pure White (#ffffff), Black Lines/Text,    | Zero colored shapes;  |
|                          | Formal UML / SysML / DFD notation           | high-contrast BW      |
+================================================================================================+
```

---

## 2. Actor Nomenclature & Scope Consistency

Four actors interact with VikingsERP. The naming convention is preserved uniformly across Architecture, Use Case, Sequence, Communication, Activity, and Interaction Overview models:

1. **Customer (`customer`):** The dining patron who authenticates, registers booking requests, tracks waitlist queue status, browses the digital menu, builds a line-item shopping cart, submits food/drink orders, and monitors real-time preparation progress.
2. **Reservation Staff (`reservation_staff`):** Front-of-house personnel who inspect booking submissions, confirm or cancel reservations, sequence waitlist entries, manage dining table inventories, assign parties to physical tables, and conclude seating sessions.
3. **Service / Kitchen Staff (`kitchen_staff`):** Culinary and kitchen dispatch personnel who receive incoming order tickets via WebSocket, inspect line-item details, and advance order states through `preparing`, `ready`, and `completed`.
4. **Management (`management`):** Restaurant managers with supervisory oversight who review real-time revenue and table turnover telemetry via the executive dashboard, manage restaurant table capacities, and curate the master digital menu catalog.

---

## 3. Relational Schema & Object Model Alignment

Every entity represented across the **Class Diagram (Diagram 02)**, **Object Diagram (Diagram 05)**, **Composite Structure Diagram (Diagram 07)**, **Data Flow Diagram (Diagram 09)**, and **Sequence Diagram (Diagram 12)** reflects the exact physical tables declared in `backend/database/schema.sql`:

1. `users` (id, name, email, phone, password_hash, role, created_at)
2. `restaurant_tables` (id, table_number, capacity, area, status, created_at)
3. `reservations` (id, customer_id, reservation_date, reservation_time, guests, table_preference, table_id, status, notes, created_at, updated_at)
4. `queue_entries` (id, reservation_id, queue_number, position, status, created_at, updated_at)
5. `seating` (id, reservation_id, table_id, seated_at, left_at, status)
6. `menu_items` (id, name, description, price, category, image_url, available, created_at)
7. `orders` (id, customer_id, reservation_id, status, total, notes, created_at, updated_at)
8. `order_items` (id, order_id, menu_item_id, quantity, unit_price, subtotal)

### Cardinality Invariant Verification:
* `User [1] -> [0..*] Reservation`
* `User [1] -> [0..*] Order`
* `Reservation [1] -> [0..1] QueueEntry` (enforced by `UNIQUE` constraint on `reservation_id`)
* `Reservation [0..*] -> [0..1] RestaurantTable` (via `table_id` foreign key)
* `Reservation [1] -> [0..1] Seating`
* `Seating [1] -> [1] RestaurantTable`
* `Order [1] -> [1..*] OrderItem` (order requires at least one item)
* `OrderItem [0..*] -> [1] MenuItem`
* `Reservation [0..1] -> [0..*] Order`

---

## 4. REST API & WebSocket Signal Alignment

All interactions across behavioral models correspond directly to the Express route declarations:

* **Route Groups:**
  1. `/api/auth` (`register`, `login`, `me`)
  2. `/api/reservations` (`POST /`, `GET /`, `GET /:id`, `PUT /:id`, `PUT /:id/status`, `DELETE /:id`)
  3. `/api/queue` (`GET /`, `GET /my`, `PUT /:id/position`, `PUT /:id/status`)
  4. `/api/tables` (`GET /`, `POST /`, `PUT /:id`, `PUT /:id/status`, `DELETE /:id`)
  5. `/api/seating` (`GET /`, `POST /`, `PUT /:id/finish`)
  6. `/api/menu` (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`)
  7. `/api/orders` (`POST /`, `GET /`, `GET /:id`, `PUT /:id/status`)
  8. `/api/dashboard` (`GET /stats`)

* **Socket.IO Event Names & Payload Symmetry:**
  * Client listeners in `QueueStatus.jsx`, `OrderStatus.jsx`, `ReservationManagement.jsx`, `TableManagement.jsx`, `SeatingManagement.jsx`, `OrderManagement.jsx`, and `Dashboard.jsx` bind to the exact events emitted by backend controllers:
    * `reservation:new` -> Emitted on `POST /api/reservations`
    * `reservation:update` -> Emitted on `PUT /api/reservations/:id/status`, `DELETE /api/reservations/:id`, and `POST /api/seating`
    * `queue:update` -> Emitted on `PUT /api/queue/:id/position`, `PUT /api/queue/:id/status`, and `POST /api/seating`
    * `table:update` -> Emitted on `POST/PUT /api/tables`, `POST /api/seating`, and `PUT /api/seating/:id/finish`
    * `table:deleted` -> Emitted on `DELETE /api/tables/:id`
    * `seating:update` -> Emitted on `POST /api/seating` and `PUT /api/seating/:id/finish`
    * `order:new` -> Emitted on `POST /api/orders`
    * `order:update` -> Emitted on `PUT /api/orders/:id/status`

---

## 5. State Machine Lifecycle Validation

The **State Machine Diagram (Diagram 13)** establishes formal state lifecycle boundaries that are strictly respected in the Activity Diagram (11), Sequence Diagram (12), Communication Diagram (14), and Timing Diagram (16):

### 5.1 Reservation Lifecycle
```
[*] --> pending --> approved --> queued --> seated --> completed --> [*]
          |            |           |
          v            v           v
      cancelled    cancelled    cancelled / no_show
          |            |           |
          v            v           v
         [*]          [*]         [*]
```
* **Guard Conditions:**
  * Customer can only edit/cancel reservations while `status == 'pending'`.
  * Transitioning to `queued` automatically provisions a waitlist entry with incremented `queue_number` and `position`.
  * Seating transitions the reservation to `seated` and locks the allocated table to `occupied`.
  * Concluding dining transitions the reservation to `completed` and returns the table to `available`.

### 5.2 Order Lifecycle
```
[*] --> pending --> preparing --> ready --> completed --> [*]
          |            |
          v            v
      cancelled    cancelled
          |            |
          v            v
         [*]          [*]
```
* **Fulfillment Rules:**
  * Order is submitted by customer in `pending` state with server-validated prices.
  * Kitchen acknowledges ticket by transitioning to `preparing`.
  * Food preparation completion transitions order to `ready`.
  * Service to dining table transitions order to `completed`.

---

## 6. Implementation Scope vs. Proposed Boundary Verification

Every diagram clearly demarcates currently implemented features from proposed ERP expansions:

| Module / Capability | Implemented Subsystem | Proposed Scope Extension | Diagram Traceability |
|---|---|---|---|
| **Reservations & Queue** | Online reservation creation, staff queue sequencing, table layout status, seating assignment. | SMS waitlist gateway notifications, automated table turnaround time estimation algorithms. | System Architecture (1), Profile (8), Use Case (10), SysML Requirements (17) |
| **Ordering & Kitchen** | Digital menu catalog, category filtering, cart state management, multi-item order placement, kitchen live ticket board, multi-stage order tracking. | Integrated POS fiscal payment processing (GCash, Maya, Cards), thermal receipt hardware printing, automatic ingredient stock depletion, automated purchase requisitions. | Architecture (1), Component (3), Deployment (4), Composite Structure (7), SysML Requirements (17) |

---

## 7. Visual Design Standard Compliance Audit

All 17 diagrams conform to the academic design rules:
1. **Background:** Pure white (`#ffffff`).
2. **Foreground:** High-contrast solid black (`#000000`).
3. **Color Palette:** 0% color fills or decorative gradients.
4. **Connectors:** Orthogonal (horizontal and vertical) routing where practical; diagonal paths used strictly when necessary for non-overlapping clarity.
5. **Arrowheads:** Standard open arrows for asynchronous/data flows, solid closed triangles for UML inheritance/generalization, dashed arrows for dependencies and SysML satisfy/derive relationships.
6. **Notation Compliance:** Correct domain notation applied per diagram type (UML 2.5 class/component/state/sequence, SysML requirement blocks, and Gane-Sarson/Yourdon data flow notation).

