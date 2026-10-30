# System Architecture Diagram — VikingsERP

## 1. Diagram Title
**High-Level System Architecture Diagram: VikingsERP Enterprise Dining Platform**

## 2. Primary Purpose
To provide an architectural macro-blueprint of the VikingsERP system, mapping user roles and client devices to the React SPA presentation layer, the Node.js/Express.js application server tier, the MySQL persistence tier, the Socket.IO real-time event pipeline, and proposed enterprise ERP integrations.

## 3. Source Files Analyzed
* `frontend/src/App.jsx` (Root presentation router and role-based module partitions)
* `frontend/src/services/api.js` (Axios HTTP client configuration and interceptors)
* `frontend/src/context/SocketContext.jsx` (Socket.IO client initialization)
* `backend/server.js` (Express application bootstrap, CORS whitelisting, Socket.IO server attachment)
* `backend/config/db.js` (MySQL connection pooling with mysql2/promise)
* `backend/database/schema.sql` (Relational table definitions)
* `backend/routes/*.js` (8 domain REST controllers)

## 4. Main Elements
* **User Layer:** 4 distinct actors — Customer, Reservation Staff, Service/Kitchen Staff, and Management.
* **Frontend Layer (Port 5173):** React Single-Page Application partitioned into Auth Module, Customer Module (8 views), Reservation Staff Module (5 views), Kitchen Module (3 views), and Management Dashboard (1 view), underpinned by AuthContext, CartContext, SocketContext, and Axios API services.
* **Backend Layer (Port 5000):** Express.js API gateway hosting JWT Authentication & Role Authorization middleware, 8 REST controller modules, and a Socket.IO real-time event dispatcher.
* **Database Layer (Port 3306):** MySQL 8.0 relational database holding 8 normalized tables: `users`, `reservations`, `queue_entries`, `restaurant_tables`, `seating`, `menu_items`, `orders`, and `order_items`.
* **Proposed ERP Extensions:** Future Point-of-Sale (POS) & Billing (payments, thermal receipts) and Inventory & Procurement (stock depletion, purchase orders) modules.

## 5. Complete Flow or Structural Relationships
1. Users interact with the React.js Single-Page Application via HTTPS/Web Browser.
2. The React client executes HTTP/JSON transactions against the Node.js Express API server via Axios.
3. The Express server validates JWT Bearer tokens and role access, dispatching requests to controllers.
4. Controllers execute transactional SQL queries against MySQL 8.0 using `mysql2/promise` connection pooling.
5. Live state mutations trigger asynchronous WebSocket broadcasts via Socket.IO, pushing notifications to subscribed client browser instances without page refreshes.

## 6. User Interactions Where Relevant
* **Customer:** Submits bookings, checks queue position, browses menu dishes, configures carts, submits orders, and monitors preparation timers.
* **Reservation Staff:** Reviews pending bookings, approves and enqueues guests, monitors table occupancy, and assigns dining parties.
* **Kitchen Staff:** Receives live tickets, inspects line items, and updates cooking progress.
* **Management:** Analyzes dining revenue, table utilization, and configures menu catalogs.

## 7. Decision Points and Alternate Paths
* **Client Routing:** `App.jsx` evaluates authentication state; unauthenticated requests redirect to `/login`, while authenticated users are directed to role-specific default landing routes.
* **Network Protocol:** Static views communicate via HTTP REST; dynamic, latency-critical status feeds bypass polling and bind to persistent WebSocket event handlers with HTTP polling fallback.

## 8. API and Database Operations Where Relevant
* Express exposes 8 REST route groups: `/api/auth`, `/api/reservations`, `/api/queue`, `/api/tables`, `/api/seating`, `/api/menu`, `/api/orders`, and `/api/dashboard`.
* Database transactions span 8 normalized tables with foreign key cascades and integrity enforcement.

## 9. Socket.IO Interactions Where Relevant
* Server emits real-time events (`reservation:new`, `reservation:update`, `queue:update`, `table:update`, `table:deleted`, `seating:update`, `order:new`, `order:update`) targeting partitioned rooms (`user:<id>`, `staff`, `kitchen`).

## 10. Implemented Versus Proposed Details
* **Implemented:** The core 4-tier stack (Client, Presentation, Application/API Gateway, Persistence, WebSocket Broker) across the 2 assigned modules.
* **Proposed:** POS & Billing (payment gateways, fiscal invoicing) and Inventory & Procurement (raw material depletion, purchase order generation).

## 11. Modeling Purpose Compliance
This diagram strictly satisfies the requirements of an architectural system layout diagram by presenting a high-level static taxonomy of client devices, frontends, APIs, networking bridges, persistent databases, and real-time buses, adhering to monochrome academic presentation standards.
