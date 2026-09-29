# 🍖 Viking Grill — Reservation & Queue Management System

A professional, full-stack restaurant reservation, queue management, and digital ordering system built for **Viking Grill** (Bar • Billiards • KTV).

![Tech Stack](https://img.shields.io/badge/React-18-8B1A1A?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-Express-333?style=flat-square&logo=node.js)
![Tech Stack](https://img.shields.io/badge/MySQL-Database-8B1A1A?style=flat-square&logo=mysql)
![Tech Stack](https://img.shields.io/badge/Socket.IO-Realtime-333?style=flat-square&logo=socket.io)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Test Accounts](#-test-accounts)
- [User Roles](#-user-roles)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Real-Time Events](#-real-time-events)

---

## ✨ Features

### Customer Features
- **Online Reservation** — Book a table with date, time, guest count, and area preference
- **My Reservations** — View, track, and cancel reservations in real-time
- **Queue Status** — Live queue position tracking with automatic updates
- **Digital Menu** — Browse food & beverages by category with images and descriptions
- **Cart System** — Add items, adjust quantities, and review before ordering
- **Order Tracking** — Real-time order status progress (Pending → Preparing → Ready → Completed)

### Reservation Staff Features
- **Reservation Management** — View, approve, decline, and queue customer reservations
- **Reservation Details** — Edit reservation info, view customer details, queue & seating data
- **Queue Management** — Call customers, reorder queue positions, mark no-shows
- **Table Management** — Visual grid of all tables with status controls and area filters
- **Seating Management** — Drag-and-drop style assignment of queued customers to available tables

### Kitchen Staff Features
- **Order Management** — View incoming orders with status filters and one-click status updates
- **Order Details** — Full order breakdown with item images, quantities, and customer info
- **Order Status Management** — Card-based workflow with visual progress bars

### Management Features
- **Dashboard** — Real-time overview of reservations, queue, tables, seating, orders, and revenue
- **Full Access** — Access to all staff and kitchen views

### System-Wide
- **Real-Time Updates** — Socket.IO-powered live updates across all connected clients
- **JWT Authentication** — Secure token-based auth with role-based access control
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme** — Professional dark charcoal/black with dark red and white accents

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Vite |
| **Styling** | Vanilla CSS (custom design system) |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Real-Time** | Socket.IO |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
Reservation_Queue-Management/
├── database/
│   └── schema.sql              # Database schema (8 tables)
├── server/
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js             # JWT & role-based access middleware
│   ├── routes/
│   │   ├── auth.js             # Login & registration
│   │   ├── reservations.js     # CRUD + status management
│   │   ├── queue.js            # Queue operations
│   │   ├── tables.js           # Table CRUD & status
│   │   ├── seating.js          # Seating assignments
│   │   ├── menu.js             # Menu items CRUD
│   │   ├── orders.js           # Order placement & tracking
│   │   └── dashboard.js        # Aggregated statistics
│   ├── socket/
│   │   └── index.js            # Socket.IO event handling
│   ├── server.js               # Express + Socket.IO entry point
│   ├── seed.js                 # Database seeder script
│   ├── .env                    # Environment variables
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Role-based navigation
│   │   │   └── ProtectedRoute.jsx  # Auth & role guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   ├── CartContext.jsx # Shopping cart state
│   │   │   └── SocketContext.jsx   # Socket.IO connection
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── customer/       # 8 customer pages
│   │   │   ├── staff/          # 5 staff pages
│   │   │   ├── kitchen/        # 3 kitchen pages
│   │   │   └── management/     # 1 dashboard page
│   │   ├── services/
│   │   │   └── api.js          # Axios instance + interceptors
│   │   ├── App.jsx             # Root routing
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Complete design system (1600+ lines)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 📦 Prerequisites

- **Node.js** v18 or later
- **MySQL** v8.0 or later
- **npm** v9 or later

---

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
cd Reservation_Queue-Management
```

### 2. Create the MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE resquedb;
```

Then import the schema:

```bash
mysql -u root -p resquedb < database/schema.sql
```

Or open `database/schema.sql` in MySQL Workbench and execute it against the `resquedb` database.

### 3. Configure Environment

Edit `server/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=resquedb
JWT_SECRET=viking_grill_jwt_secret_key_2024
PORT=5000
```

### 4. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Seed the Database

```bash
cd server
node seed.js
```

This creates test accounts, 14 restaurant tables, and 18 menu items.

### 6. Start the Application

Open **two terminals**:

**Terminal 1 — Backend Server:**
```bash
cd server
npm run dev
```
> Server starts at `http://localhost:5000`

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
```
> Client starts at `http://localhost:5173`

### 7. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 🔑 Test Accounts

All test accounts use the password: **`password123`**

| Role | Name | Email | Password |
|------|------|-------|----------|
| **Customer** | John Customer | `customer@viking.com` | `password123` |
| **Customer 2** | Maria Santos | `maria@viking.com` | `password123` |
| **Reservation Staff** | Jane Staff | `staff@viking.com` | `password123` |
| **Kitchen Staff** | Chef Mike | `kitchen@viking.com` | `password123` |
| **Management** | Admin Viking | `admin@viking.com` | `password123` |

---

## 👥 User Roles

### Customer
- Make and manage reservations
- View queue position in real-time
- Browse digital menu and place orders
- Track order status live

### Reservation Staff
- Approve/decline/queue reservations
- Manage queue (call, seat, no-show)
- Manage table availability and status
- Assign customers to tables

### Kitchen Staff
- View and manage incoming orders
- Update order preparation status
- View detailed order breakdowns

### Management
- Full dashboard with live statistics
- Access to all staff and kitchen features
- Revenue and operations overview

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user profile |

### Reservations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | List reservations (filtered by role) |
| GET | `/api/reservations/:id` | Get reservation details |
| POST | `/api/reservations` | Create new reservation |
| PUT | `/api/reservations/:id` | Update reservation |
| PUT | `/api/reservations/:id/status` | Update status (staff) |
| DELETE | `/api/reservations/:id` | Cancel reservation |

### Queue
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queue` | List queue entries (staff) |
| GET | `/api/queue/my` | Get customer's queue entry |
| PUT | `/api/queue/:id/status` | Update queue status |
| PUT | `/api/queue/:id/position` | Reorder queue position |

### Tables
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tables` | List all tables |
| POST | `/api/tables` | Add new table (staff) |
| PUT | `/api/tables/:id/status` | Update table status |
| DELETE | `/api/tables/:id` | Remove table |

### Seating
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seating` | List active seating |
| POST | `/api/seating` | Assign customer to table |
| PUT | `/api/seating/:id/finish` | Mark seating as finished |

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | List all menu items |
| GET | `/api/menu/:id` | Get single menu item |
| POST | `/api/menu` | Add menu item (management) |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Remove menu item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders (filtered by role) |
| GET | `/api/orders/:id` | Get order details with items |
| POST | `/api/orders` | Place new order |
| PUT | `/api/orders/:id/status` | Update order status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Aggregated statistics |

---

## 🗄 Database Schema

The system uses **8 tables**:

| Table | Purpose |
|-------|---------|
| `users` | User accounts with role-based access |
| `restaurant_tables` | Physical tables with capacity and area |
| `reservations` | Customer reservations with status workflow |
| `queue_entries` | Queue positions for approved reservations |
| `seating` | Active table assignments |
| `menu_items` | Food and beverage catalog |
| `orders` | Customer orders with totals |
| `order_items` | Individual items within orders |

### Status Workflows

**Reservation:** `pending` → `approved` → `queued` → `seated` → `completed` / `cancelled`

**Queue:** `waiting` → `called` → `seated` / `no_show`

**Order:** `pending` → `preparing` → `ready` → `completed` / `cancelled`

**Table:** `available` ↔ `occupied` / `reserved` / `maintenance`

---

## ⚡ Real-Time Events

The system uses Socket.IO for live updates across all connected clients:

| Event | Description |
|-------|-------------|
| `reservation:new` | New reservation created |
| `reservation:update` | Reservation status changed |
| `queue:update` | Queue position or status changed |
| `table:update` | Table status changed |
| `seating:update` | Customer seated or finished |
| `order:new` | New order placed |
| `order:update` | Order status updated |

Clients are organized into rooms by role:
- `user:{id}` — Individual customer updates
- `staff` — Reservation staff updates
- `kitchen` — Kitchen staff updates

---

## 🎨 Design System

The application follows a strict color palette:

| Element | Color |
|---------|-------|
| Background | `#121212` (Dark Charcoal) |
| Surfaces | `#222222` |
| Primary Accent | `#8B1A1A` (Dark Red) |
| Primary Text | `#FFFFFF` (White) |
| Muted Text | `#888888` |
| Borders | `#333333` |

**Typography:**
- Headings: Cinzel (serif)
- Body: Inter (sans-serif)

---

## 📄 License

This project was developed for **ITE 412 — Systems Integration & Architecture 2**.

---

> **Viking Grill** — Bar • Billiards • KTV
