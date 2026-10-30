# Package Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Package Diagram: Codebase Architecture & Modular Packaging**

## 2. Primary Purpose
To organize and document the physical directory structure, module packaging, and high-level architectural dependencies between the frontend React application and the backend Express server.

## 3. Source Files Analyzed
* Complete workspace directory layout (`frontend/`, `backend/`)
* `frontend/src/*` (Components, contexts, pages, services)
* `backend/*` (Config, database, middleware, routes, socket)

## 4. Main Elements
* **Frontend Packages:** `frontend/src/` sub-packages including `components/`, `context/`, `pages/` (further partitioned by actor roles: `customer/`, `staff/`, `kitchen/`, `management/`), and `services/`.
* **Backend Packages:** `backend/` sub-packages including `config/`, `middleware/`, `routes/`, `socket/`, and `database/`.
* **Dependency Connectors:** Dashed dependency arrows (`..>`) with stereotyped usage relationships.

## 5. Complete Flow or Structural Relationships
* `pages/` imports and consumes `context/` providers and dispatches HTTP requests via `services/api.js`.
* `context/` providers configure auth headers in `services/api.js` and bind to `socket/` signals.
* `services/api.js` dispatches REST HTTP requests to backend `routes/`.
* Backend `routes/` apply security filters from `middleware/` and execute pooled queries via `config/db.js`.
* `socket/` verifies handshake tokens using `middleware/auth.js`.

## 6. User Interactions Where Relevant
* Governs developer workflow and software maintainability by enforcing separation of concerns between client UI, state management, and backend endpoints.

## 7. Decision Points and Alternate Paths
* Clean separation prevents circular dependencies; frontend packages never directly access backend database or configuration layers.

## 8. API and Database Operations Where Relevant
* Maps physical file locations for all 8 API controllers and database schema definitions.

## 9. Socket.IO Interactions Where Relevant
* Shows the structural packaging link between frontend `context/SocketContext.jsx` and backend `socket/index.js`.

## 10. Implemented Versus Proposed Details
* **Implemented:** Exactly reflects the 100% verified directory tree in the active repository.
* **Proposed:** No fictitious directories are included.

## 11. Modeling Purpose Compliance
This diagram complies with UML package modeling standards by employing tabbed folder icons, explicit package scoping, and import dependencies, representing codebase layout rather than runtime execution flow.
