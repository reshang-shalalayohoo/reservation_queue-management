# VikingsERP: API Route & Database Dictionary Map
## System Mapping: REST Endpoints, Database Schemas, and Real-Time WebSocket Signals

---

## 1. Complete REST API Route Catalog

The backend exposes 8 RESTful route modules under the base path `/api`. Every protected endpoint validates an RFC 6750 Bearer token via `authenticate` middleware, and role-guarded endpoints enforce permissions via `authorize(...roles)`.

| Route Group | HTTP | Endpoint Path | Middleware Guards | Permitted Roles | Request Parameters / Body | Response Status & Payload | Emitted Socket.IO Signals |
|---|---|---|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | None | Public | **Body:** `{name, email, phone?, password, role?}` | `201 Created`: `{message, token, user}` | None |
| | `POST` | `/api/auth/login` | None | Public | **Body:** `{email, password}` | `200 OK`: `{message, token, user}` | None |
| | `GET` | `/api/auth/me` | `authenticate` | All Authenticated | None (Bearer Token) | `200 OK`: `{user: {id, name, email, phone, role, created_at}}` | None |
| **Reservations** | `POST` | `/api/reservations` | `authenticate` | `customer` | **Body:** `{reservation_date, reservation_time, guests, table_preference, notes}` | `201 Created`: `{message, reservation}` | `io.to('staff').emit('reservation:new', reservation)` |
| | `GET` | `/api/reservations` | `authenticate` | All (Scoped) | None (Customer filtered by `customer_id`; Staff sees all) | `200 OK`: `{reservations: [...]}` | None |
| | `GET` | `/api/reservations/:id` | `authenticate` | All (Customer: own only) | **Params:** `id` | `200 OK`: `{reservation, queue, seating}` | None |
| | `PUT` | `/api/reservations/:id` | `authenticate` | Customer (pending only) / Staff | **Params:** `id`<br>**Body:** `{reservation_date, reservation_time, guests, table_preference, notes, table_id}` | `200 OK`: `{message, reservation}` | `io.to('user:<id>').emit('reservation:update')`<br>`io.to('staff').emit('reservation:update')` |
| | `PUT` | `/api/reservations/:id/status` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Params:** `id`<br>**Body:** `{status: 'pending'\|'approved'\|'queued'\|'seated'\|'completed'\|'cancelled'\|'no_show'}` | `200 OK`: `{message, reservation}` | `io.to('user:<id>').emit('reservation:update')`<br>`io.to('staff').emit('reservation:update')` |
| | `DELETE` | `/api/reservations/:id` | `authenticate` | Customer (own only) / Staff | **Params:** `id` | `200 OK`: `{message: 'Reservation cancelled.'}` | `io.to('user:<id>').emit('reservation:update')`<br>`io.to('staff').emit('reservation:update')` |
| **Queue** | `GET` | `/api/queue` | `authenticate` | All (Scoped) | None | `200 OK`: `{queue: [...]}` | None |
| | `GET` | `/api/queue/my` | `authenticate` | `customer` | None | `200 OK`: `{queue, totalWaiting, peopleAhead}` | None |
| | `PUT` | `/api/queue/:id/position` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Params:** `id`<br>**Body:** `{position: int >= 1}` | `200 OK`: `{message, entry}` | `io.to('user:<id>').emit('queue:update')`<br>`io.to('staff').emit('queue:update')` |
| | `PUT` | `/api/queue/:id/status` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Params:** `id`<br>**Body:** `{status: 'waiting'\|'called'\|'seated'\|'cancelled'\|'no_show'}` | `200 OK`: `{message, entry}` | `io.to('user:<id>').emit('queue:update')`<br>`io.to('staff').emit('queue:update')` |
| **Tables** | `GET` | `/api/tables` | `authenticate` | All Authenticated | None | `200 OK`: `{tables: [...]}` | None |
| | `POST` | `/api/tables` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Body:** `{table_number, capacity, area}` | `201 Created`: `{message, table}` | `io.to('staff').emit('table:update', table)` |
| | `PUT` | `/api/tables/:id` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Params:** `id`<br>**Body:** `{table_number, capacity, area}` | `200 OK`: `{message, table}` | `io.to('staff').emit('table:update', table)` |
| | `PUT` | `/api/tables/:id/status` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Params:** `id`<br>**Body:** `{status: 'available'\|'occupied'\|'reserved'\|'maintenance'}` | `200 OK`: `{message, table}` | `io.to('staff').emit('table:update', table)` |
| | `DELETE` | `/api/tables/:id` | `authenticate`, `authorize` | `management` (Only) | **Params:** `id` | `200 OK`: `{message: 'Table deleted.'}` | `io.to('staff').emit('table:deleted', {id})` |
| **Seating** | `GET` | `/api/seating` | `authenticate`, `authorize` | `reservation_staff`, `management` | None | `200 OK`: `{seating: [...]}` | None |
| | `POST` | `/api/seating` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Body:** `{reservation_id, table_id}` | `201 Created`: `{message, seating}` | `io.to('user:<id>').emit('reservation:update')`<br>`io.to('user:<id>').emit('queue:update')`<br>`io.to('staff').emit('seating:update')`<br>`io.to('staff').emit('table:update')` |
| | `PUT` | `/api/seating/:id/finish` | `authenticate`, `authorize` | `reservation_staff`, `management` | **Params:** `id` | `200 OK`: `{message: 'Seating finished. Table freed.'}` | `io.to('user:<id>').emit('reservation:update')`<br>`io.to('staff').emit('table:update')`<br>`io.to('staff').emit('seating:update')` |
| **Menu** | `GET` | `/api/menu` | None | Public | **Query:** `category?` | `200 OK`: `{items: [...]}` | None |
| | `GET` | `/api/menu/:id` | None | Public | **Params:** `id` | `200 OK`: `{item: {...}}` | None |
| | `POST` | `/api/menu` | `authenticate`, `authorize` | `management` (Only) | **Body:** `{name, description, price, category, image_url}` | `201 Created`: `{message, item}` | None |
| | `PUT` | `/api/menu/:id` | `authenticate`, `authorize` | `management` (Only) | **Params:** `id`<br>**Body:** `{name, description, price, category, image_url, available}` | `200 OK`: `{message, item}` | None |
| | `DELETE` | `/api/menu/:id` | `authenticate`, `authorize` | `management` (Only) | **Params:** `id` | `200 OK`: `{message: 'Menu item deleted.'}` | None |
| **Orders** | `POST` | `/api/orders` | `authenticate` | `customer` | **Body:** `{items: [{menu_item_id, quantity}], reservation_id?, notes?}` | `201 Created`: `{message, order: {..., items: [...]}}` | `io.to('kitchen').emit('order:new', order)`<br>`io.to('staff').emit('order:new', order)` |
| | `GET` | `/api/orders` | `authenticate` | All (Scoped) | None | `200 OK`: `{orders: [...]}` | None |
| | `GET` | `/api/orders/:id` | `authenticate` | All (Customer: own only) | **Params:** `id` | `200 OK`: `{order: {..., items: [...]}}` | None |
| | `PUT` | `/api/orders/:id/status` | `authenticate`, `authorize` | `kitchen_staff`, `reservation_staff`, `management` | **Params:** `id`<br>**Body:** `{status: 'pending'\|'preparing'\|'ready'\|'completed'\|'cancelled'}` | `200 OK`: `{message, order}` | `io.to('user:<id>').emit('order:update')`<br>`io.to('kitchen').emit('order:update')`<br>`io.to('staff').emit('order:update')` |
| **Dashboard** | `GET` | `/api/dashboard/stats` | `authenticate`, `authorize` | `management`, `reservation_staff` | None | `200 OK`: `{reservations, queue, tables, seating, orders, recentReservations, recentOrders}` | None |
| **System** | `GET` | `/api/health` | None | Public | None | `200 OK`: `{status: 'ok', timestamp}` | None |

---

## 2. Database Dictionary & Relational Schema

### Table 1: `users`
Primary storage for authenticated principals and roles.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `name` VARCHAR(100) NOT NULL
* `email` VARCHAR(100) UNIQUE NOT NULL
* `phone` VARCHAR(20) NULL
* `password_hash` VARCHAR(255) NOT NULL
* `role` ENUM('customer', 'reservation_staff', 'kitchen_staff', 'management') DEFAULT 'customer'
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Table 2: `restaurant_tables`
Physical dining floor layout and capacity.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `table_number` VARCHAR(10) UNIQUE NOT NULL
* `capacity` INT NOT NULL
* `area` ENUM('bar', 'billiards', 'ktv', 'main') DEFAULT 'main'
* `status` ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available'
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Table 3: `reservations`
Customer booking records and preferences.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `customer_id` INT NOT NULL (FK -> `users.id` ON DELETE CASCADE)
* `reservation_date` DATE NOT NULL
* `reservation_time` TIME NOT NULL
* `guests` INT NOT NULL
* `table_preference` ENUM('bar', 'billiards', 'ktv', 'main', 'any') DEFAULT 'any'
* `table_id` INT NULL (FK -> `restaurant_tables.id` ON DELETE SET NULL)
* `status` ENUM('pending', 'approved', 'queued', 'seated', 'completed', 'cancelled', 'no_show') DEFAULT 'pending'
* `notes` TEXT NULL
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### Table 4: `queue_entries`
Dynamic waitlist tracking for table allocation.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `reservation_id` INT NOT NULL UNIQUE (FK -> `reservations.id` ON DELETE CASCADE)
* `queue_number` INT NOT NULL
* `position` INT NOT NULL
* `status` ENUM('waiting', 'called', 'seated', 'cancelled', 'no_show') DEFAULT 'waiting'
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### Table 5: `seating`
Physical dining occupancy logs.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `reservation_id` INT NOT NULL (FK -> `reservations.id` ON DELETE CASCADE)
* `table_id` INT NOT NULL (FK -> `restaurant_tables.id` ON DELETE CASCADE)
* `seated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `left_at` TIMESTAMP NULL
* `status` ENUM('seated', 'finished') DEFAULT 'seated'

### Table 6: `menu_items`
Digital dining menu and item availability.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `name` VARCHAR(100) NOT NULL
* `description` TEXT NULL
* `price` DECIMAL(10, 2) NOT NULL
* `category` ENUM('appetizer', 'main_course', 'grill', 'beverage', 'dessert', 'bar_snack') DEFAULT 'main_course'
* `image_url` VARCHAR(500) NULL
* `available` BOOLEAN DEFAULT TRUE
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Table 7: `orders`
Header purchase tickets for food and beverages.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `customer_id` INT NOT NULL (FK -> `users.id` ON DELETE CASCADE)
* `reservation_id` INT NULL (FK -> `reservations.id` ON DELETE SET NULL)
* `status` ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending'
* `total` DECIMAL(10, 2) DEFAULT 0.00
* `notes` TEXT NULL
* `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
* `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### Table 8: `order_items`
Line item records referencing individual menu items.
* `id` INT AUTO_INCREMENT PRIMARY KEY
* `order_id` INT NOT NULL (FK -> `orders.id` ON DELETE CASCADE)
* `menu_item_id` INT NOT NULL (FK -> `menu_items.id` ON DELETE CASCADE)
* `quantity` INT NOT NULL DEFAULT 1
* `unit_price` DECIMAL(10, 2) NOT NULL
* `subtotal` DECIMAL(10, 2) NOT NULL

---

## 3. Entity-Relationship & Cardinality Matrix

| Parent Entity | Multiplicity | Relationship Verb | Child Entity | Multiplicity | Foreign Key & Referential Integrity | Business Rule |
|---|---|---|---|---|---|---|
| `users` | 1 | creates | `reservations` | 0..* | `customer_id` -> `users.id` (ON DELETE CASCADE) | A registered user may make multiple dining bookings over time. |
| `users` | 1 | places | `orders` | 0..* | `customer_id` -> `users.id` (ON DELETE CASCADE) | A customer can place multiple dining orders across different visits. |
| `reservations` | 1 | generates | `queue_entries` | 0..1 | `reservation_id` -> `reservations.id` (ON DELETE CASCADE, UNIQUE) | An approved reservation yields exactly one active or historical waitlist entry. |
| `reservations` | 0..* | prefers / allocates | `restaurant_tables` | 0..1 | `table_id` -> `restaurant_tables.id` (ON DELETE SET NULL) | A reservation can specify a preferred area or hold a pre-assigned dining table. |
| `reservations` | 1 | logs | `seating` | 0..1 | `reservation_id` -> `reservations.id` (ON DELETE CASCADE) | When seated, a reservation links directly to an active physical seating session. |
| `restaurant_tables` | 1 | accommodates | `seating` | 0..* | `table_id` -> `restaurant_tables.id` (ON DELETE CASCADE) | A physical table accommodates many seating sessions across its operational lifetime. |
| `orders` | 1 | contains | `order_items` | 1..* | `order_id` -> `orders.id` (ON DELETE CASCADE) | Every placed order must contain at least one line item. |
| `menu_items` | 1 | specified in | `order_items` | 0..* | `menu_item_id` -> `menu_items.id` (ON DELETE CASCADE) | A menu item may be referenced across multiple past and present orders. |
| `reservations` | 0..1 | associated with | `orders` | 0..* | `reservation_id` -> `reservations.id` (ON DELETE SET NULL) | Orders placed while seated link optionally to the active dining reservation. |

---

## 4. Socket.IO Real-Time Signal Matrix

The system leverages WebSocket events with automatic fallback to HTTP polling. Handshake tokens authenticate the socket connection before room allocation:

| Event Name | Direction | Originating Controller | Target Socket Room | Event Payload Data Schema | Receiving Frontend Component & Behavior |
|---|---|---|---|---|---|
| `reservation:new` | Server -> Client | `backend/routes/reservations.js` (`POST /`) | `staff` | Full reservation object joined with user details: `{id, customer_id, customer_name, reservation_date, reservation_time, guests, table_preference, notes, status}` | `ReservationManagement.jsx`, `Dashboard.jsx`: Appends new reservation and updates pending counter. |
| `reservation:update` | Server -> Client | `backend/routes/reservations.js`, `seating.js` | `user:<customer_id>`, `staff` | Updated reservation object: `{id, status, table_id, ...}` | `MyReservations.jsx`, `ReservationDetails.jsx`, `QueueStatus.jsx`, `SeatingManagement.jsx`: Refreshes status badges and re-renders table assignments. |
| `queue:update` | Server -> Client | `backend/routes/queue.js`, `seating.js` | `user:<customer_id>`, `staff` | Updated queue entry object: `{id, reservation_id, queue_number, position, status, customer_name}` | `QueueStatus.jsx`, `QueueManagement.jsx`, `Dashboard.jsx`: Re-calculates position counters and triggers "Called" visual alerts. |
| `table:update` | Server -> Client | `backend/routes/tables.js`, `seating.js` | `staff` | Updated restaurant table object: `{id, table_number, capacity, area, status}` | `TableManagement.jsx`, `SeatingManagement.jsx`, `Dashboard.jsx`: Updates floor plan availability in real-time. |
| `table:deleted` | Server -> Client | `backend/routes/tables.js` | `staff` | `{id: int}` | `TableManagement.jsx`: Removes table card from DOM. |
| `seating:update` | Server -> Client | `backend/routes/seating.js` | `staff` | Seating record joined with table & customer info: `{id, reservation_id, table_id, status, table_number, customer_name}` | `SeatingManagement.jsx`, `Dashboard.jsx`: Updates active seated list and floor occupancy counters. |
| `order:new` | Server -> Client | `backend/routes/orders.js` (`POST /`) | `kitchen`, `staff` | Full order object with nested items: `{id, customer_id, customer_name, customer_phone, total, notes, status, items: [...]}` | `OrderManagement.jsx`, `Dashboard.jsx`: Instantly pushes new ticket to the top of the kitchen display board with audio/visual notification. |
| `order:update` | Server -> Client | `backend/routes/orders.js` (`PUT /:id/status`) | `user:<customer_id>`, `kitchen`, `staff` | Order object with new status: `{id, customer_id, customer_name, status, total, ...}` | `OrderStatus.jsx`, `OrderStatusManagement.jsx`, `OrderManagement.jsx`, `Dashboard.jsx`: Advances multi-stage preparation step indicator. |

