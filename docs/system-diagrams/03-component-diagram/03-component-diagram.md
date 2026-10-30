# Component Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Component Diagram: Subsystem Modularity & Service Wiring**

## 2. Primary Purpose
To document the modular software components composing the frontend client, backend application server, database persistence layer, and proposed enterprise plugins, detailing interfaces, dependencies, and communication protocols.

## 3. Source Files Analyzed
* `frontend/package.json` & `backend/package.json` (Package dependencies)
* `frontend/src/App.jsx` & `frontend/src/context/*` (Client-side components & contexts)
* `frontend/src/services/api.js` (Axios API client)
* `backend/server.js` (Server routing and middleware composition)
* `backend/middleware/auth.js` (Authentication & Role Guard middleware)
* `backend/routes/*.js` (8 Controller components)
* `backend/socket/index.js` (Socket.IO event broker)
* `backend/config/db.js` (Database connection pool)

## 4. Main Elements
* **Frontend Components:** React UI Components, React Router DOM, Context Providers (`AuthContext`, `CartContext`, `SocketContext`), Axios API Service, and Socket.IO Client.
* **Backend Components:** Express Application Gateway, Middleware Pipeline (JWT Auth, CORS, Role Authorization), 8 Domain REST Controllers, Socket.IO Real-Time Server, and MySQL Connection Pool.
* **Data Component:** Relational schema `resquedb` hosting 8 database tables.
* **Proposed Components:** POS & Billing Module and Inventory & Procurement Module.

## 5. Complete Flow or Structural Relationships
* React Components wire into Context Providers to share global state.
* Context Providers invoke the Axios API Client for HTTP transactions and Socket.IO Client for real-time streams.
* Axios communicates across the network boundary via HTTP/JSON to the Express Server.
* Socket.IO Client maintains a full-duplex WebSocket connection with the Socket.IO Server.
* The Express Server routes inbound requests through the Middleware pipeline into domain Controllers.
* Controllers and Socket.IO dispatch queries through the `mysql2/promise` Connection Pool to the relational database.

## 6. User Interactions Where Relevant
* Component wiring remains transparent to the user; user interactions with React views trigger coordinated inter-component flows (e.g., clicking 'Order' invokes CartContext -> API Service -> Orders Controller).

## 7. Decision Points and Alternate Paths
* Middleware pipeline intercepts requests: invalid JWT tokens or unauthorized roles terminate processing early with 401 or 403 responses.

## 8. API and Database Operations Where Relevant
* Encapsulates all 8 API route groups and database query executions within dedicated controller components.

## 9. Socket.IO Interactions Where Relevant
* Shows the bidirectional event conduit between client-side `SocketContext` and backend `Socket.IO Server`.

## 10. Implemented Versus Proposed Details
* **Implemented:** Frontend SPA, Express API, MySQL Pool, and Socket.IO engine.
* **Proposed:** POS & Billing and Inventory & Procurement components are demarcated with dashed dependencies.

## 11. Modeling Purpose Compliance
This diagram strictly adheres to UML 2.5 component modeling semantics, illustrating software modules, structural packaging, and port interfaces without confusing component architecture with physical hardware.
