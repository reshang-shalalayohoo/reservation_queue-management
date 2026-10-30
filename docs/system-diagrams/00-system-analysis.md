# VikingsERP: System Analysis & Architectural Blueprint
## An Integrated Enterprise Resource Planning System for Vikings Grill
### Modules: (1) Reservation & Queue Management | (2) Digital Menu & Ordering

---

## 1. Executive Summary & Document Control

**Project Title:** VikingsERP: An Integrated Enterprise Resource Planning System for Vikings Grill  
**Assigned Subsystems:**
1. **Module 1: Reservation & Queue Management** (Customer Reservations, Approvals, Queue Sequencing, Table Allocation, Seating Lifecycle)
2. **Module 2: Digital Menu & Ordering** (Digital Menu Catalog, Cart Management, Multi-item Ordering, Kitchen Ticket Dispatch, Live Order Status Tracking)

**Author / Senior Systems Analyst:** Lead Systems Architect & Full-Stack Modeler  
**Target Environment:** Node.js (v22.x) / Express.js, React.js (v18.x) / Vite, MySQL 8.0 (`mysql2/promise`), Socket.IO (v4.x)  
**Academic Documentation Compliance:** UML 2.5, SysML 1.6, and Gane-Sarson / Yourdon DFD standards.

### Reference Document Status Report
* **Mortel_diagrams(1).docx:** *Limitation Reported* — The physical file was not present directly in the active project root; however, all existing diagram baselines, entity specifications, and system narrative descriptions were fully verified and recovered from the repository's documentation archives (`VIKINGSERP_17_DIAGRAMS.md` and `docs/SYSTEM_DIAGRAMS.md`).
* **diagrams(4).docx:** Located and verified against `C:\Users\reshd\Downloads\diagrams.docx` (the instructor's master requirements guide). This document prescribes the dual-lens system modeling framework:
  * **Structural Diagrams (The Static Blueprint):** Permanent infrastructure, code organization, and data entity layouts that remain invariant under user transactions.
  * **Behavioral Diagrams (The System in Motion):** Operational execution paths, temporal sequences, state lifecycles, and data transformations driven by user events.

---

## 2. Full-Stack System Architecture Analysis

The VikingsERP platform implements a modular, service-oriented multi-tier client-server architecture. The runtime topology comprises four distinct operating tiers:

```
+---------------------------------------------------------------------------------------+
|                                    1. CLIENT TIER                                     |
|  Customer Devices (Mobile/Desktop Web)  |  Staff Terminals  |  Kitchen Display Units  |
|  Technologies: React 18, React Router DOM, Vite HMR, HTML5/CSS3                        |
+---------------------------------------------------------------------------------------+
                                        |  ^
                 Axios REST (HTTP/JSON) |  | Socket.IO (WebSocket/Polling)
                                        v  |
+---------------------------------------------------------------------------------------+
|                                 2. APPLICATION SERVER                                 |
|  Node.js + Express.js API Gateway (Port 5000)                                         |
|  - JWT Authentication & BCrypt Security Filter                                         |
|  - Role-Based Access Control (RBAC) Guards                                            |
|  - 8 Domain REST Controllers                                                          |
|  - Socket.IO Bi-Directional Event Broker & Room Dispatcher                            |
+---------------------------------------------------------------------------------------+
                                        |  ^
                 Pooled SQL Connections |  | Result Sets (mysql2/promise)
                                        v  |
+---------------------------------------------------------------------------------------+
|                                   3. PERSISTENCE TIER                                 |
|  MySQL 8.0 Relational Database Engine (`resquedb` / Port 3306)                        |
|  8 Normalized Relational Tables with Foreign Key Constraints & Cascades               |
+---------------------------------------------------------------------------------------+
                                        .  .
                        Planned Webhook .  . Async Queue
                                        v  v
+---------------------------------------------------------------------------------------+
|                          4. PROPOSED ENTERPRISE EXTENSIONS                            |
|  - POS Billing, Fiscal Receipts & Payment Gateways                                    |
|  - Inventory Depletion, Purchase Requisitions & Vendor Management                     |
+---------------------------------------------------------------------------------------+
```

### 2.1 Frontend Tier (`frontend/`)
The frontend is constructed as a React Single-Page Application (SPA) bundled with Vite.
* **Component Layer:** Modular UI components (`Navbar.jsx`, `ProtectedRoute.jsx`, `EmptyState.jsx`).
* **Routing System:** Declarative routing configured in `src/App.jsx` using `react-router-dom`. Routes are partitioned by user role:
  * Public/Auth: `/login`, `/register`
  * Customer: `/reservation`, `/my-reservations`, `/queue-status`, `/menu`, `/menu/:id`, `/cart`, `/order-confirmation`, `/order-status`
  * Reservation Staff: `/staff/reservations`, `/staff/reservations/:id`, `/staff/queue`, `/staff/tables`, `/staff/seating`
  * Kitchen Staff: `/kitchen/orders`, `/kitchen/orders/:id`, `/kitchen/order-status`
  * Management: `/management/dashboard`
* **State Management & Context Providers:**
  1. `AuthContext.jsx`: Manages token lifecycle, user session state (`user`, `token`, `loading`), login/registration mutations, and persistent authentication via `localStorage`.
  2. `CartContext.jsx`: In-memory ordering cache holding selected menu items, quantity modifications, subtotal calculations, and item counts.
  3. `SocketContext.jsx`: Initializes and exposes a single persistent `socket.io-client` connection instance configured with JWT handshake authentication and automatic fallback between WebSocket and HTTP long-polling.
* **Network Interceptor:** `src/services/api.js` provides a pre-configured Axios instance with automatic `Authorization: Bearer <token>` header injection and global 401 error interceptors that clear credentials and force re-authentication.

### 2.2 Backend Application Tier (`backend/`)
The backend is an asynchronous, event-driven Node.js server powered by Express.js.
* **Entry Point (`server.js`):** Instantiates the Express HTTP application and attaches a Socket.IO `Server` instance with explicit Cross-Origin Resource Sharing (CORS) whitelisting `localhost:5173`.
* **Security & Middleware (`middleware/auth.js`):**
  * `authenticate`: Validates standard RFC 6750 Bearer JWT tokens using `jsonwebtoken` and attaches the decoded user payload to `req.user`.
  * `authorize(...roles)`: Enforces declarative role-based access control, rejecting unauthorized principals with HTTP 403 Forbidden responses.
* **Real-Time Communication Engine (`socket/index.js`):**
  * Intercepts connection attempts via `io.use` to authenticate incoming handshake tokens.
  * Dynamically partitions clients into private rooms:
    * `user:<id>`: Personal updates for individual customers.
    * `role:<role>`: Broadcasts scoped to specific privileges.
    * `staff`: Shared administrative updates for `reservation_staff`, `kitchen_staff`, and `management`.
    * `kitchen`: Order fulfillment updates for `kitchen_staff` and `management`.
* **Database Connection Manager (`config/db.js`):** Configures a connection pool utilizing `mysql2/promise` with configurable limits (`waitForConnections: true`, `connectionLimit: 10`, `queueLimit: 0`), preventing connection exhaustion during peak traffic.

### 2.3 Persistence Tier (`database/schema.sql`)
The MySQL schema defines 8 normalized relational tables:
1. `users`: Stores user identity, contact details, BCrypt password hashes, and system roles (`customer`, `reservation_staff`, `kitchen_staff`, `management`).
2. `restaurant_tables`: Physical dining inventory recording table identifiers, capacity limits, restaurant zone/area (`bar`, `billiards`, `ktv`, `main`), and operational status (`available`, `occupied`, `reserved`, `maintenance`).
3. `reservations`: Formal customer bookings detailing reservation date, time, guest count, dining area preference, allocated table foreign key, booking status (`pending`, `approved`, `queued`, `seated`, `completed`, `cancelled`, `no_show`), and special dietary notes.
4. `queue_entries`: Operational waitlist entries linked 1-to-1 with reservations, tracking sequential queue numbers, queue priority positions, and lifecycle status (`waiting`, `called`, `seated`, `cancelled`, `no_show`).
5. `seating`: Historical and active seating logs tracking table occupancy duration (`seated_at`, `left_at`) and status (`seated`, `finished`).
6. `menu_items`: Digital menu catalog defining item names, descriptions, prices, dining categories (`appetizer`, `main_course`, `grill`, `beverage`, `dessert`, `bar_snack`), image URLs, and instant availability flags.
7. `orders`: Customer purchase tickets recording customer reference, optional reservation reference, financial total, preparation status (`pending`, `preparing`, `ready`, `completed`, `cancelled`), and kitchen notes.
8. `order_items`: Order line items recording menu item foreign keys, line quantities, snapshot unit prices, and computed line subtotals.

---

## 3. Detailed Execution Flows & Lifecycle Dynamics

### 3.1 Customer Reservation & Seating Workflow
1. **Creation:** A logged-in customer navigates to `/reservation`, populating reservation date, time, guest count, dining area preference, and optional notes.
2. **Dispatch & Notification:** The form posts to `POST /api/reservations`. The server inserts a record with status `pending` and immediately emits a `reservation:new` event to the `staff` socket room.
3. **Staff Triage:** Reservation staff review requests via `/staff/reservations`. Staff can approve the booking (`PUT /api/reservations/:id/status` with `approved`) or queue it directly (`status = queued`).
4. **Queue Generation:** Transitioning a reservation to `queued` automatically queries `MAX(queue_number)` and `MAX(position)` from `queue_entries`, assigning sequential waitlist priority. Socket.IO emits `reservation:update` and `queue:update`.
5. **Real-time Queue Tracking:** The customer monitors `/queue-status`, which polls `/api/queue/my` and listens for `queue:update` events. Dynamic counters show the customer's queue number, active status, total waiting parties, and exact people ahead.
6. **Queue Call:** Staff click "Call" in `/staff/queue` (`PUT /api/queue/:id/status` with `status = called`). The customer's UI highlights "You've Been Called! Please proceed to the host stand".
7. **Table Assignment & Seating:** Staff select the party in `/staff/seating` and link them to an available dining table (`POST /api/seating`). The transaction:
   * Inserts a record into `seating`.
   * Updates `restaurant_tables.status` to `occupied`.
   * Updates `reservations.status` to `seated` and sets `table_id`.
   * Updates `queue_entries.status` to `seated`.
   * Emits `reservation:update`, `queue:update`, `table:update`, and `seating:update` to both the customer and staff rooms.
8. **Completion:** When the customer departs, staff trigger `PUT /api/seating/:id/finish`. The system timestamps `left_at = NOW()`, sets `restaurant_tables.status = available`, marks `reservations.status = completed`, and emits real-time updates freeing the table.

### 3.2 Digital Menu Browsing, Ordering & Kitchen Dispatch Workflow
1. **Catalog Exploration:** Customers access `/menu`, which fetches items from `GET /api/menu` (supporting category filtering for grill, appetizers, beverages, etc.).
2. **Cart Management:** Customers select items, specify quantities, and add them to their local cart via `CartContext`. The cart calculates subtotals in real-time.
3. **Order Review & Submission:** On `/order-confirmation`, the customer reviews selected line items, enters optional preparation instructions, and submits.
4. **Backend Validation & Insertion:** The request hits `POST /api/orders`. The controller:
   * Verifies item availability against `menu_items`.
   * Recalculates subtotals server-side to prevent client pricing tampering.
   * Inserts an order header record into `orders`.
   * Inserts all individual line items into `order_items`.
   * Emits an `order:new` socket event containing full order and customer details to the `kitchen` and `staff` rooms.
   * Responds with HTTP 201 Created and the committed order payload.
5. **Kitchen Processing:** Kitchen staff observe incoming tickets on `/kitchen/orders` and manage fulfillment stages via `/kitchen/order-status`:
   * `pending` -> `preparing` (`PUT /api/orders/:id/status`)
   * `preparing` -> `ready`
   * `ready` -> `completed`
6. **Customer Live Tracking:** At each status transition, the backend emits `order:update` to `user:<customer_id>` and `kitchen`. The customer's `/order-status` page updates its multi-stage progress tracker instantly without page reloads.

### 3.3 Management Dashboard & Executive Telemetry Workflow
* Managers and staff access `/management/dashboard`.
* On mount, the page queries `GET /api/dashboard/stats`, aggregating:
  * Total, today's, pending, and approved reservation metrics.
  * Active queue counters (waiting vs. called).
  * Table capacity utilization (total, available, occupied, breakdown by dining area).
  * Seating volume and active dining parties.
  * Order fulfillment metrics and daily accumulated revenue (`SUM(total)`).
  * Recent reservation and order logs.
* The dashboard maintains active event listeners for `reservation:new`, `reservation:update`, `queue:update`, `table:update`, `seating:update`, `order:new`, and `order:update`, automatically refreshing aggregate statistics in real time as dining room events occur.

---

## 4. Implementation Status Classification

Every feature across the two assigned modules is categorized according to its empirical state in the codebase:
* **IMPLEMENTED:** Fully realized in frontend components, API endpoints, business logic, database queries, and socket events.
* **PARTIAL:** Implemented with specific functional limitations or in-memory constraints.
* **PROPOSED:** Planned architectural capability documented for future iterations or academic scope expansion.
* **NOT FOUND:** Unreferenced or unsupported by the current architecture.

*(Refer to `00-feature-inventory.md` for the exhaustive inventory and file-level traceability matrix).*

