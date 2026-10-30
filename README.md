# Viking Grill - Reservation & Queue Management System

A full-stack restaurant reservation, queue management, and digital ordering system for Viking Grill (Bar, Billiards, KTV).

**Frontend:** React.js + Vite | **Backend:** Node.js + Express.js | **Database:** MySQL | **Real-Time:** Socket.IO

---

## Project File Structure

```
Reservation_Queue-Management/
|
|-- frontend/                                 # FRONTEND - React.js + Vite
|   |-- index.html                          #   HTML entry point
|   |-- package.json                        #   Frontend dependencies and scripts
|   |-- vite.config.js                      #   Vite build configuration
|   +-- src/
|       |-- main.jsx                        #   React entry point (renders App)
|       |-- App.jsx                         #   Root component with routing
|       |-- index.css                       #   Global design system (1600+ lines)
|       |
|       |-- components/                     #   Reusable UI components
|       |   |-- Navbar.jsx                  #     Role-based navigation bar
|       |   +-- ProtectedRoute.jsx          #     Auth and role guard wrapper
|       |
|       |-- context/                        #   React Context providers
|       |   |-- AuthContext.jsx             #     Authentication state (JWT)
|       |   |-- CartContext.jsx             #     Shopping cart state
|       |   +-- SocketContext.jsx           #     Socket.IO connection
|       |
|       |-- services/                       #   API communication
|       |   +-- api.js                      #     Axios instance + interceptors
|       |
|       +-- pages/                          #   Page components (by role)
|           |-- Login.jsx                   #     User login
|           |-- Register.jsx                #     User registration
|           |
|           |-- customer/                   #   Customer pages
|           |   |-- Reservation.jsx         #     Create new reservation
|           |   |-- MyReservations.jsx      #     View/manage reservations
|           |   |-- QueueStatus.jsx         #     Real-time queue tracking
|           |   |-- DigitalMenu.jsx         #     Browse menu by category
|           |   |-- MenuItemDetails.jsx     #     Single item detail view
|           |   |-- Cart.jsx                #     Cart / current order
|           |   |-- OrderConfirmation.jsx   #     Order review and submit
|           |   +-- OrderStatus.jsx         #     Real-time order tracking
|           |
|           |-- staff/                      #   Reservation Staff pages
|           |   |-- ReservationManagement.jsx    # View and approve reservations
|           |   |-- ReservationDetails.jsx       # Edit reservation details
|           |   |-- QueueManagement.jsx          # Manage queue and call customers
|           |   |-- TableManagement.jsx          # View/manage table status
|           |   +-- SeatingManagement.jsx        # Assign customers to tables
|           |
|           |-- kitchen/                    #   Service/Kitchen Staff pages
|           |   |-- OrderManagement.jsx     #     View and manage orders
|           |   |-- OrderDetails.jsx        #     Itemized order breakdown
|           |   +-- OrderStatusManagement.jsx #   Update order status
|           |
|           +-- management/                 #   Management pages
|               +-- Dashboard.jsx           #     Real-time statistics dashboard
|
|-- backend/                                 # BACKEND - Node.js + Express.js
|   |-- server.js                           #   Express + Socket.IO entry point
|   |-- package.json                        #   Backend dependencies and scripts
|   |-- seed.js                             #   Database seeder (test data)
|   |-- .env                                #   Environment variables
|   |
|   |-- config/                             #   Configuration
|   |   +-- db.js                           #     MySQL connection pool (mysql2)
|   |
|   |-- middleware/                          #   Express middleware
|   |   +-- auth.js                         #     JWT verification and role check
|   |
|   |-- routes/                             #   REST API route handlers
|   |   |-- auth.js                         #     POST /api/auth (login/register)
|   |   |-- reservations.js                 #     /api/reservations (CRUD + status)
|   |   |-- queue.js                        #     /api/queue (queue operations)
|   |   |-- tables.js                       #     /api/tables (CRUD + status)
|   |   |-- seating.js                      #     /api/seating (assign/finish)
|   |   |-- menu.js                         #     /api/menu (CRUD)
|   |   |-- orders.js                       #     /api/orders (place + track)
|   |   +-- dashboard.js                    #     /api/dashboard (statistics)
|   |
|   +-- socket/                             #   Real-time communication
|       +-- index.js                        #     Socket.IO event handlers
|
|-- backend/database/                               # DATABASE - MySQL
|   +-- schema.sql                          #   Table definitions (8 tables)
|
|-- docs/                                   # DOCUMENTATION
|   |-- SYSTEM_DIAGRAMS.md                  #   Diagram descriptions and Mermaid code
|   +-- diagrams/                           #   Generated diagram images
|       |-- architecture_diagram.jpg        #     System Architecture Diagram
|       |-- usecase_diagram.jpg             #     Use Case Diagram
|       +-- dfd_diagram.jpg                 #     Data Flow Diagram
|
+-- README.md                              # Project documentation (this file)
```

---

## Test Accounts

All accounts use password: password123

| Role               | Email                | Access                             |
|--------------------|----------------------|------------------------------------|
| Customer           | customer@viking.com  | Reservation, Menu, Orders          |
| Customer 2         | maria@viking.com     | Reservation, Menu, Orders          |
| Reservation Staff  | staff@viking.com     | Reservation, Queue, Tables, Seating|
| Kitchen Staff      | kitchen@viking.com   | Order Management, Status Updates   |
| Management         | admin@viking.com     | Full Dashboard + All Views         |

---

## Setup Instructions

1. Create MySQL database: CREATE DATABASE resquedb;
2. Import schema: mysql -u root -p resquedb < backend/database/schema.sql
3. Edit backend/.env with your MySQL credentials
4. Install dependencies: cd backend && npm install && cd ../frontend && npm install
5. Seed test data: cd backend && node seed.js
6. Start backend: cd backend && npm run dev (runs on port 5000)
7. Start frontend: cd frontend && npm run dev (runs on port 5173)
8. Open http://localhost:5173 in your browser

---

Developed for ITE 412 - Systems Integration and Architecture 2.
Viking Grill - Bar, Billiards, KTV
