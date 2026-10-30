# Timing Diagram — VikingsERP

## 1. Diagram Title
**UML 2.5 Timing Diagram: Temporal State Changes & Real-Time Signal Waveforms**

## 2. Primary Purpose
To model the exact state and value changes of system entities across an explicit horizontal timeline (18:00 to 19:35), utilizing formal UML state/value stepped lifelines rather than Gantt bars to verify temporal constraints and real-time responsiveness.

## 3. Source Files Analyzed
* `backend/routes/reservations.js` & `backend/routes/queue.js`
* `backend/routes/seating.js` & `backend/routes/tables.js`
* `backend/routes/orders.js`
* `backend/socket/index.js`

## 4. Main Elements
* **Horizontal Time Axis:** Scaled time markers at 18:00, 18:15, 18:25, 18:45, 18:50, 19:02, 19:04, 19:24, 19:32, and 19:35 (assumed illustrative timing).
* **Lifeline 1 (`res : Reservation`):** State waveform tracking `Pending` -> `Approved` -> `Queued` -> `Called` -> `Seated` -> `Completed`.
* **Lifeline 2 (`ord : Order`):** State waveform tracking `Idle / Cart` -> `Pending` -> `Preparing` -> `Ready` -> `Completed`.
* **Lifeline 3 (`tblM3 : RestaurantTable`):** Discrete value waveform tracking `Available` -> `Occupied` -> `Available`.
* **Lifeline 4 (`io : Socket.IO Events`):** Signal impulse lane documenting event triggers (`reservation:new`, `reservation:update`, `queue:update`, `seating:update`, `order:new`, `order:update`).

## 5. Complete Flow or Structural Relationships
* **18:00:** Customer submits reservation; `res` enters `Pending`; `reservation:new` signal fires.
* **18:15:** Staff approves; `res` enters `Approved`; `reservation:update` fires.
* **18:25:** Staff enqueues party; `res` enters `Queued`; `queue:update` fires.
* **18:45:** Table prepares; staff calls party; `res` enters `Called`; `queue:update (called)` fires.
* **18:50:** Party seated at Table M3; `res` enters `Seated`; `tblM3` steps from `Available` to `Occupied`; `seating:update` fires.
* **18:50-19:02:** Customer browses menu and configures cart (`ord` in `Idle / Cart`).
* **19:02:** Customer places order; `ord` steps to `Pending`; `order:new` fires to kitchen.
* **19:04:** Kitchen begins cooking; `ord` steps to `Preparing`; `order:update` fires.
* **19:24:** Kitchen finishes cooking; `ord` steps to `Ready`; `order:update` fires.
* **19:32:** Food served and meal completed; `ord` steps to `Completed`; `res` steps to `Completed`; `tblM3` returns to `Available`; final `order:update` and `table:update` fire.

## 6. User Interactions Where Relevant
* Visualizes the temporal progression of a complete 95-minute customer dining experience.

## 7. Decision Points and Alternate Paths
* Stepped lines emphasize instantaneous state transitions triggered by user or staff transactions.

## 8. API and Database Operations Where Relevant
* State level transitions correspond to database timestamp commits (`created_at`, `seated_at`, `left_at`).

## 9. Socket.IO Interactions Where Relevant
* Signal impulses map the exact real-time WebSocket notifications emitted across state transitions.

## 10. Implemented Versus Proposed Details
* **Implemented:** Lifelines and states reflect active SQL enums and real-time socket events.
* **Proposed:** Timestamps represent realistic illustrative operational benchmarks.

## 11. Modeling Purpose Compliance
This diagram strictly obeys UML 2.5 timing diagram syntax by using stepped black lines to represent discrete state transitions over an explicit time axis, adhering to instructor requirements and avoiding Gantt bar misrepresentations.
