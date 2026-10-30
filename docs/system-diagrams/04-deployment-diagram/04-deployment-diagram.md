# Deployment Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Deployment Diagram: Physical Nodes, Runtime Environments & Network Topologies**

## 2. Primary Purpose
To map software artifacts (React SPA bundle, Node/Express runtime, MySQL database) to physical and virtual execution nodes, defining ports, protocols, and deployment environments for local development and proposed cloud production.

## 3. Source Files Analyzed
* `backend/.env` & `backend/server.js` (Port allocations: 5000, CORS origins)
* `backend/config/db.js` (MySQL port 3306, host configuration)
* `frontend/vite.config.js` (Vite dev server port 5173, proxy rules)
* `docker-compose.yml` (Containerized service orchestration)

## 4. Main Elements
* **Client Device Node:** User workstation/smartphone hosting a web browser execution environment and the React.js SPA bundle artifact.
* **Development Server Node (localhost):**
  * Vite Dev Server (Port 5173): Hosts frontend bundle with Hot Module Replacement.
  * Node.js Server (Port 5000): Executes Express.js API and Socket.IO Server.
  * MySQL 8.0 Server (Port 3306): Hosts the relational database schema `resquedb`.
* **Proposed Cloud Production Node:** Global Edge CDN, Containerized Cloud API Cluster (Docker/AWS ECS), and Managed Cloud MySQL (RDS/PlanetScale).

## 5. Complete Flow or Structural Relationships
* Client Browser downloads the React bundle from Vite on `HTTP :5173`.
* The client dispatches REST requests proxied to the Express backend on `HTTP :5000`.
* The client maintains persistent bi-directional `WSS / WS` connections to Socket.IO on port 5000.
* The Express server connects to MySQL across local `TCP Socket :3306`.

## 6. User Interactions Where Relevant
* End users access the system transparently via web browsers over standard HTTP/HTTPS protocols.

## 7. Decision Points and Alternate Paths
* In development, Vite proxies `/api` calls to Express; in proposed production, client traffic routes through a Content Delivery Network (CDN) directly to cloud load balancers.

## 8. API and Database Operations Where Relevant
* Shows physical transport protocols: HTTP/JSON on port 5000 and binary MySQL wire protocol on port 3306.

## 9. Socket.IO Interactions Where Relevant
* WebSocket upgrade handshakes occur over port 5000 with fallbacks to HTTP long-polling.

## 10. Implemented Versus Proposed Details
* **Implemented:** Verified development topology running locally across ports 5173, 5000, and 3306.
* **Proposed:** Multi-region CDN distribution and containerized cloud deployment topologies.

## 11. Modeling Purpose Compliance
This diagram strictly represents a physical UML deployment model, using 3D node notation and explicit network transport channels, avoiding conceptual or logical software abstractions.
