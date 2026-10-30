# Use Case Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Use Case Diagram: Functional Scope & Actor Boundaries**

## 2. Primary Purpose
To define the complete functional scope of the VikingsERP system, mapping system capabilities (use cases) within the system boundary to authorized human actors.

## 3. Source Files Analyzed
* `frontend/src/App.jsx` & `frontend/src/components/ProtectedRoute.jsx` (Role route guards)
* `backend/middleware/auth.js` (`authorize(...roles)`)
* All 17 frontend page views across customer, staff, kitchen, and management directories

## 4. Main Elements
* **Actors:** Customer, Reservation Staff, Service/Kitchen Staff, Management.
* **Common Use Cases:** Register / Login (UC_AUTH).
* **Module 1 Use Cases:** Create Reservation, View My Reservations, Track Queue Status, Manage Reservations (Approve/Reject), Inspect Reservation Details, Manage Queue (Call/Reposition), Manage Tables (Floor Inventory), Assign Seating & Free Tables.
* **Module 2 Use Cases:** Browse Digital Menu, View Menu Item Details, Manage Shopping Cart, Submit & Confirm Order, Track Order Status, Manage Kitchen Orders, Inspect Order Line Items, Update Order Status.
* **Executive Use Cases:** Monitor Operational Dashboard, Manage Menu Catalog (CRUD).

## 5. Complete Flow or Structural Relationships
* Solid association lines connect actors to their authorized use cases based on role guards in `ProtectedRoute.jsx` and `middleware/auth.js`.
* Customer is bounded to customer self-service capabilities.
* Reservation Staff accesses booking approvals, queue management, and seating allocation.
* Kitchen Staff accesses ticket inspection and order status updates.
* Management exercises supervisory authority over dashboard telemetry and menu catalog management.

## 6. User Interactions Where Relevant
* Encapsulates the entire scope of end-user functionality available through the web client.

## 7. Decision Points and Alternate Paths
* Role-based authorization ensures that attempting unauthorized actions redirects to the actor's default home route or returns HTTP 403 Forbidden.

## 8. API and Database Operations Where Relevant
* Every use case maps directly to one or more verified REST API endpoints.

## 9. Socket.IO Interactions Where Relevant
* Real-time push updates enhance use cases such as Track Queue Status and Track Order Status.

## 10. Implemented Versus Proposed Details
* **Implemented:** All 19 mapped use cases are 100% operational in the codebase.
* **Proposed:** Payment processing and purchase ordering use cases are excluded to reflect current functional reality.

## 11. Modeling Purpose Compliance
This diagram adheres to UML 2.5 use case conventions, featuring stick figures for actors, horizontal ovals for use cases, a solid system boundary box, and valid associations without confusing use cases with sequential workflows.
