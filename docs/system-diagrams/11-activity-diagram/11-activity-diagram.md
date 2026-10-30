# Activity Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Activity Diagram: End-to-End Customer Food Ordering Workflow**

## 2. Primary Purpose
To map the step-by-step procedural logic, decision gates, modification loops, backend transactional persistence, and kitchen fulfillment stages governing a customer dining order.

## 3. Source Files Analyzed
* `frontend/src/pages/customer/DigitalMenu.jsx` & `MenuItemDetails.jsx`
* `frontend/src/context/CartContext.jsx` & `frontend/src/pages/customer/Cart.jsx`
* `frontend/src/pages/customer/OrderConfirmation.jsx`
* `frontend/src/pages/customer/OrderStatus.jsx`
* `frontend/src/pages/kitchen/OrderManagement.jsx` & `OrderStatusManagement.jsx`
* `backend/routes/orders.js`

## 4. Main Elements
* **Initial Node:** Filled black circle.
* **Activity States:** Rounded rectangles representing user actions and system processing.
* **Decision Nodes:** Diamond symbols representing branch conditions.
* **Parallel Broadcasts:** Socket.IO event emissions to customer and kitchen.
* **Final Node:** Concentric bullseye circle.

## 5. Complete Flow or Structural Relationships
1. Customer authenticates and browses the digital menu catalog.
2. Customer inspects dish details; decision node evaluates whether to add the dish to cart.
3. If added, `CartContext` aggregates quantities and recalculates subtotals.
4. Decision node evaluates whether to browse more dishes or review cart.
5. In `/cart`, customer can loop through modifying quantities or removing items.
6. Customer proceeds to `/order-confirmation` and submits order.
7. Backend validates catalog availability and prices; if validation fails, error alert displays and control returns to cart.
8. If passed, order header and line items are written to MySQL.
9. Backend emits `order:new` to kitchen display board and customer UI navigates to `/order-status`.
10. Kitchen staff transitions order to `preparing` -> `ready` -> `completed`, broadcasting updates at each stage until the final node is reached.

## 6. User Interactions Where Relevant
* Traces customer browsing, cart mutations, checkout submission, and live status tracking, alongside kitchen staff status updates.

## 7. Decision Points and Alternate Paths
* Decision: Add dish to cart? (Yes -> mutate cart / No -> continue browsing).
* Decision: Browse more dishes? (Yes -> catalog / No -> review cart).
* Decision: Modify cart items? (Yes -> update loop / No -> checkout).
* Decision: Server pricing validation passed? (Yes -> persist / No -> error return).

## 8. API and Database Operations Where Relevant
* Maps `POST /api/orders`, database inserts into `orders` and `order_items`, and subsequent `PUT /api/orders/:id/status` updates.

## 9. Socket.IO Interactions Where Relevant
* Captures the parallel dispatch of `order:new` and sequential emissions of `order:update`.

## 10. Implemented Versus Proposed Details
* **Implemented:** Fully corresponds to the operational order workflow in the codebase.
* **Proposed:** Payment gateway checkout loops are excluded.

## 11. Modeling Purpose Compliance
This diagram strictly conforms to UML 2.5 activity modeling standards, employing standardized decision diamonds, action states, and initial/final nodes without informal flow notation.
