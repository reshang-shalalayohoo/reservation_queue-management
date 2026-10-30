# Profile Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Profile Diagram: Domain-Specific Extensions for VikingsERP**

## 2. Primary Purpose
To extend standard UML 2.5 metamodel semantics with domain-specific stereotypes, tagged values, and OCL-style constraints tailored to the modern React, Express, MySQL, and Socket.IO technology stack.

## 3. Source Files Analyzed
* `frontend/src/components/*` & `frontend/src/pages/*` (React components)
* `backend/routes/*` (Express route definitions)
* `backend/middleware/auth.js` (JWT & RBAC guards)
* `backend/database/schema.sql` (InnoDB MySQL tables)
* `backend/socket/index.js` (Socket.IO event rooms)

## 4. Main Elements
* **Stereotypes Defined:**
  * `«ReactComponent»` (extends UML Component; tagged values: `renderMethod`, `hasState`)
  * `«APIRoute»` (extends UML Component; tagged values: `httpMethod`, `path`, `authRequired`)
  * `«MySQLTable»` (extends UML Class; tagged values: `engine`, `charset`)
  * `«JWTProtected»` (extends UML Interface; tagged value: `tokenExpiry`; constraint: RFC 6750)
  * `«SocketEvent»` (extends UML Signal; tagged values: `direction`, `room`)
  * `«RoleGuard»` (extends UML Constraint; tagged value: `allowedRoles`; constraint: 403 on mismatch)
* **Concrete Applied Instances:** Stereotypes mapped directly to `Cart.jsx`, `POST /api/orders`, `orders` table, authentication middleware, and `order:new` event.

## 5. Complete Flow or Structural Relationships
* Shows UML metaclass extensions using solid arrows with open triangles from stereotypes to metaclasses, and dashed dependency arrows illustrating applied stereotypes on concrete system artifacts.

## 6. User Interactions Where Relevant
* Custom constraints enforce security boundaries during user transactions (e.g., `«RoleGuard»` restricting management dashboard access).

## 7. Decision Points and Alternate Paths
* Evaluates tagged constraints: if a principal's token fails `«JWTProtected»` or violates `«RoleGuard»`, access is denied.

## 8. API and Database Operations Where Relevant
* Defines formal metadata standards applied across all 8 REST controllers and 8 MySQL tables.

## 9. Socket.IO Interactions Where Relevant
* Formalizes WebSocket message signals using the `«SocketEvent»` stereotype.

## 10. Implemented Versus Proposed Details
* **Implemented:** All 6 stereotypes capture patterns actively implemented across the codebase.
* **Proposed:** Future microservice or RPC stereotypes are omitted.

## 11. Modeling Purpose Compliance
This diagram conforms to formal UML profile modeling rules by extending base metaclasses with guillemet-enclosed stereotypes and explicit tagged values, providing architectural rigor.
