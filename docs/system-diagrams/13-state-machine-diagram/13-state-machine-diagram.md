# State Machine Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 State Machine Diagram: Entity Lifecycles & State Transitions**

## 2. Primary Purpose
To model the discrete operational states, transition events, guard conditions, and terminal states governing the independent lifecycles of Reservations, Waitlist Queue Entries, and Food Orders.

## 3. Source Files Analyzed
* `backend/database/schema.sql` (ENUM declarations for `reservations.status`, `queue_entries.status`, `orders.status`)
* `backend/routes/reservations.js` (`PUT /:id/status`, `DELETE /:id`)
* `backend/routes/queue.js` (`PUT /:id/status`, `PUT /:id/position`)
* `backend/routes/seating.js` (`POST /`, `PUT /:id/finish`)
* `backend/routes/orders.js` (`PUT /:id/status`)

## 4. Main Elements
* **States:** Rounded state rectangles grouped into three composite lifecycle compartments.
* **Initial & Final States:** Standard solid circles and circled bullseyes.
* **Transitions:** Directed transition arrows labeled with trigger events and guard conditions.

## 5. Complete Flow or Structural Relationships
* **Reservation Lifecycle:**
  * Initial -> `pending` (submission)
  * `pending` -> `approved` (staff review) or `cancelled`
  * `approved` -> `queued` (enqueued by staff) or `cancelled`
  * `queued` -> `seated` (table assigned) or `no_show` or `cancelled`
  * `seated` -> `completed` (dining finished) -> Final
* **Queue Waitlist Lifecycle:**
  * Initial -> `waiting` (reservation queued)
  * `waiting` -> `waiting` (position updated via moveUp/moveDown)
  * `waiting` -> `called` (staff summons party)
  * `called` -> `seated` (party arrives) or `no_show`
* **Order Fulfillment Lifecycle:**
  * Initial -> `pending` (order submitted)
  * `pending` -> `preparing` (kitchen starts cooking) or `cancelled`
  * `preparing` -> `ready` (plating finished) or `cancelled`
  * `ready` -> `completed` (served to dining table) -> Final

## 6. User Interactions Where Relevant
* Transitions are driven by customer submissions, staff queue triage, seating assignments, and kitchen status updates.

## 7. Decision Points and Alternate Paths
* Guard: Customer can only cancel reservations while in `pending` or `approved` status.
* Guard: Table seating can only occur if assigned table status is `available`.

## 8. API and Database Operations Where Relevant
* Each state transition corresponds to an SQL `UPDATE status = ?` statement in the database.

## 9. Socket.IO Interactions Where Relevant
* Every state transition emits a corresponding WebSocket update (`reservation:update`, `queue:update`, `order:update`).

## 10. Implemented Versus Proposed Details
* **Implemented:** Exactly mirrors the SQL ENUM values and controller transition routes.
* **Proposed:** Hypothetical states like `refunded` or `partially_fulfilled` are excluded.

## 11. Modeling Purpose Compliance
This diagram conforms to UML 2.5 state machine semantics by clearly isolating independent lifecycles into distinct state compartments with formal trigger events and guards.
