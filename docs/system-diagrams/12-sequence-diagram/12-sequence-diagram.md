# Sequence Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Sequence Diagram: Chronological Order Submission & Kitchen Dispatch**

## 2. Primary Purpose
To coordinate the exact chronological sequence of asynchronous and synchronous messages exchanged between client, server, middleware, database, and real-time entities during order submission.

## 3. Source Files Analyzed
* `frontend/src/pages/customer/OrderConfirmation.jsx`
* `frontend/src/services/api.js`
* `backend/server.js` & `backend/middleware/auth.js`
* `backend/routes/orders.js`
* `backend/socket/index.js`
* `frontend/src/pages/kitchen/OrderManagement.jsx`

## 4. Main Elements
* **Lifelines:** Customer, React Frontend (`OrderConfirmation.jsx`), Axios API Client (`api.js`), Express Server (`server.js`), JWT Middleware (`auth.js`), Orders Controller (`orders.js`), MySQL Database (`resquedb`), Socket.IO Broker (`socket/index.js`), and Kitchen Display UI (`OrderManagement.jsx`).
* **Message Types:** Synchronous call arrows, asynchronous signal arrows, dashed return arrows, and `loop` interaction fragments.

## 5. Complete Flow or Structural Relationships
1. Customer clicks "Confirm & Place Order".
2. React extracts cart items from `CartContext` and formats payload.
3. React invokes Axios `POST /api/orders`.
4. Axios transmits HTTP request with RFC 6750 Bearer token.
5. Express routes request through JWT Middleware; middleware verifies token and attaches `req.user`.
6. Express executes `orders.js` controller handler.
7. Controller loops through cart items, querying `menu_items` to validate availability and compute line subtotals.
8. Controller inserts header record into `orders`, receiving `order_id`.
9. Controller loops through items, inserting line items into `order_items`.
10. Controller queries the full committed order joined with customer details.
11. Controller triggers `Socket.IO Broker` to emit `order:new` to the `kitchen` room.
12. Kitchen Display UI receives WebSocket message and updates ticket board.
13. Controller returns HTTP 201 Created to Express -> Axios -> React.
14. React clears `CartContext` and navigates customer to `/order-status`.

## 6. User Interactions Where Relevant
* Triggered by customer checkout action; updates kitchen UI and customer progress tracker.

## 7. Decision Points and Alternate Paths
* In-loop validation: if any dish is unavailable, controller aborts processing and returns HTTP 400 Bad Request.

## 8. API and Database Operations Where Relevant
* Traces `SELECT FROM menu_items`, `INSERT INTO orders`, and `INSERT INTO order_items`.

## 9. Socket.IO Interactions Where Relevant
* Documents the out-of-band asynchronous WebSocket push from server to kitchen terminal.

## 10. Implemented Versus Proposed Details
* **Implemented:** Exactly reflects the execution path in `orders.js` and `OrderConfirmation.jsx`.
* **Proposed:** Payment gateway roundtrips are omitted.

## 11. Modeling Purpose Compliance
This diagram strictly follows UML 2.5 sequence notation, featuring vertical time lifelines, activation bars, formal message arrows, and numbered chronological steps.
