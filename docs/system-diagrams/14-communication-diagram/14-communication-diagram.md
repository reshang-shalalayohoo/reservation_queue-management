# Communication Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Communication Diagram: Object Collaboration Network during Order Placement**

## 2. Primary Purpose
To illustrate the network of collaborating objects and freeform structural links involved in customer order submission, using numbered directional messages to represent chronological sequencing.

## 3. Source Files Analyzed
* `frontend/src/pages/customer/OrderConfirmation.jsx`
* `frontend/src/services/api.js`
* `backend/server.js`
* `backend/middleware/auth.js`
* `backend/routes/orders.js`
* `backend/socket/index.js`
* `frontend/src/pages/kitchen/OrderManagement.jsx`

## 4. Main Elements
* **Collaborating Objects:**
  * `Customer Web Browser`
  * `React App (OrderConfirmation)`
  * `Axios HTTP Client`
  * `Express Server Gateway`
  * `JWT Auth Middleware`
  * `Orders Controller`
  * `MySQL Database`
  * `Socket.IO Broker`
  * `Kitchen Display UI`
* **Numbered Messages (1 to 18):** Directional messages indicating exact message flow order.

## 5. Complete Flow or Structural Relationships
1. Customer submits checkout form.
2. React App extracts cart items.
3. React App calls Axios.
4. Axios dispatches HTTP POST with JWT token to Express.
5. Express invokes JWT Middleware.
6. Middleware validates token and returns decoded principal.
7. Express routes call to Orders Controller.
8. Orders Controller queries menu items from MySQL.
9. MySQL returns menu item pricing.
10. Orders Controller inserts order header into MySQL.
11. MySQL returns new `order_id`.
12. Orders Controller inserts order line items into MySQL.
13. Orders Controller triggers Socket.IO Broker.
14. Socket.IO Broker broadcasts `order:new` to Kitchen Display UI.
15. Orders Controller returns HTTP 201 response to Express.
16. Express returns JSON payload to Axios.
17. Axios resolves promise to React App.
18. React App navigates customer browser to `/order-status`.

## 6. User Interactions Where Relevant
* Models customer order submission and simultaneous kitchen ticket reception.

## 7. Decision Points and Alternate Paths
* Highlights object link density: Orders Controller acts as the central hub communicating with Database, Middleware, and Socket Broker.

## 8. API and Database Operations Where Relevant
* Traces messages 8-12 corresponding to SQL queries.

## 9. Socket.IO Interactions Where Relevant
* Traces messages 13-14 corresponding to WebSocket push.

## 10. Implemented Versus Proposed Details
* **Implemented:** Accurately reflects existing application code links.
* **Proposed:** No hypothetical external integrations.

## 11. Modeling Purpose Compliance
This diagram adheres to UML communication diagram rules by focusing on structural object links and numbered messages rather than linear time lifelines.
