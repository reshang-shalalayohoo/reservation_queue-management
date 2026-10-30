# Composite Structure Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Composite Structure Diagram: Internal Architecture of Order Processing**

## 2. Primary Purpose
To deconstruct the internal parts, ports, and connectors governing the `OrderProcessingSystem` component, detailing how menu browsing, cart state, order submission, backend validation, database storage, and real-time push updates interlock.

## 3. Source Files Analyzed
* `frontend/src/pages/customer/DigitalMenu.jsx` & `MenuItemDetails.jsx`
* `frontend/src/context/CartContext.jsx` & `SocketContext.jsx`
* `frontend/src/pages/customer/Cart.jsx` & `OrderConfirmation.jsx`
* `frontend/src/pages/customer/OrderStatus.jsx`
* `backend/routes/menu.js` & `backend/routes/orders.js`
* `backend/database/schema.sql` (`orders`, `order_items`, `menu_items`)
* `backend/socket/index.js`

## 4. Main Elements
* **Internal Frontend Parts:** `DigitalMenu`, `MenuItemDetails`, `Cart`, `OrderConfirmation`, and `OrderStatus`.
* **Internal State Parts:** `CartContext` (in-memory order state) and `SocketContext` (event subscription).
* **Internal Backend Parts:** `menu.js` Controller, `orders.js` Controller, and `Socket.IO Broker`.
* **Internal Storage Parts:** `menu_items`, `orders`, and `order_items` tables.
* **Ports & Connectors:** Internal data buses linking views to contexts, controllers, and database tables.

## 5. Complete Flow or Structural Relationships
1. `DigitalMenu` queries dishes via `menu.js Controller` from `menu_items`.
2. `MenuItemDetails` and `Cart` feed dish selections and quantities into `CartContext`.
3. `CartContext` hydrates `OrderConfirmation`, which dispatches a POST request to `orders.js Controller`.
4. The controller validates prices against `menu_items`, writes order headers to `orders`, and writes line items to `order_items`.
5. The controller signals `Socket.IO Broker`, which pushes `order:new` and `order:update` events to `OrderStatus` via `SocketContext`.

## 6. User Interactions Where Relevant
* Traces customer interactions through dish inspection, cart aggregation, order submission, and progress tracking within a single unified component boundary.

## 7. Decision Points and Alternate Paths
* Server-side price recalculation rejects tampering if client payload prices diverge from the catalog database.

## 8. API and Database Operations Where Relevant
* Traces multi-table atomic operations across `orders`, `order_items`, and `menu_items`.

## 9. Socket.IO Interactions Where Relevant
* Captures internal event handoffs from controller emissions to client-side listeners.

## 10. Implemented Versus Proposed Details
* **Implemented:** Fully realized across active React pages, contexts, controllers, and database tables.
* **Proposed:** Payment gateway and fiscal printing ports are excluded from this internal structure.

## 11. Modeling Purpose Compliance
This diagram strictly satisfies UML composite structure semantics by examining the inner composition of a single classifier, utilizing ports and connectors rather than external class hierarchies.
