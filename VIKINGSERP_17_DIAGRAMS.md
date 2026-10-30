# VikingsERP: System Diagrams
## An Integrated Enterprise Resource Planning System for Vikings Grill

> **17 System Diagrams** — 8 Structural + 9 Behavioral
> Technology: React.js + Vite | Node.js + Express.js | MySQL | Socket.IO

---

# PART 1: STRUCTURAL DIAGRAMS (The Static Blueprint)

---

## Diagram 1: System Architecture Diagram

```mermaid
graph TB
    subgraph UL["USER LAYER"]
        direction LR
        U1["Customer"]
        U2["Reservation Staff"]
        U3["Service/Kitchen Staff"]
        U4["Management"]
    end

    U1 & U2 & U3 & U4 -->|"HTTPS / Web Browser"| FE

    subgraph FE["FRONTEND LAYER — React.js + Vite (Port 5173)"]
        direction TB
        AUTH_UI["Auth Module\nLogin · Register"]
        CUST_UI["Customer Module\nReservation · My Reservations · Queue Status\nDigital Menu · Menu Item Details\nCart · Order Confirmation · Order Status"]
        STAFF_UI["Staff Module\nReservation Mgmt · Reservation Details\nQueue Mgmt · Table Mgmt · Seating Mgmt"]
        KITCHEN_UI["Kitchen Module\nOrder Mgmt · Order Details\nOrder Status Mgmt"]
        MGMT_UI["Management Module\nDashboard"]
        CTX["Contexts: AuthContext · CartContext · SocketContext"]
        SVC["Services: Axios API Client"]
    end

    FE -->|"REST API (HTTP/JSON via Axios)"| BE
    FE <-.->|"Socket.IO (WebSocket)"| SOCK

    subgraph BE["BACKEND LAYER — Node.js + Express.js (Port 5000)"]
        direction TB
        MW["Middleware\nJWT Auth · CORS · Role Authorization"]
        subgraph ROUTES["REST API Routes"]
            R1["/api/auth"]
            R2["/api/reservations"]
            R3["/api/queue"]
            R4["/api/tables"]
            R5["/api/seating"]
            R6["/api/menu"]
            R7["/api/orders"]
            R8["/api/dashboard"]
        end
        SOCK["Socket.IO Server\nReal-Time Events"]
    end

    BE -->|"SQL Queries (mysql2)"| DB

    subgraph DB["DATABASE LAYER — MySQL"]
        direction LR
        T1[("users")]
        T2[("reservations")]
        T3[("queue_entries")]
        T4[("restaurant_tables")]
        T5[("seating")]
        T6[("menu_items")]
        T7[("orders")]
        T8[("order_items")]
    end

    subgraph PROPOSED["PROPOSED — POS & Billing / Inventory"]
        direction LR
        POS["POS Dashboard\nBilling · Payments · Receipts"]
        INV["Inventory Dashboard\nStock · Suppliers · Purchase Orders"]
    end

    PROPOSED -.->|"Planned Integration"| BE
```

**Purpose:** Shows the complete layered architecture of VikingsERP — how users access the system through the React.js frontend, which communicates with the Node.js/Express.js backend via REST APIs and Socket.IO WebSocket, and how the backend persists data in MySQL.

**Application to VikingsERP:** The four user roles (Customer, Reservation Staff, Service/Kitchen Staff, Management) access role-specific React modules. The backend exposes 8 REST API route groups and a Socket.IO server for real-time updates. POS & Billing and Inventory & Procurement are identified as proposed future modules.

**Scenario:** A customer opens the web browser at `localhost:5173`, the React app loads, AuthContext checks JWT, Axios calls `/api/auth/me`, and Socket.IO establishes a WebSocket connection for live order status updates.

---

## Diagram 2: Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string phone
        +string password_hash
        +enum role
        +datetime created_at
        +register()
        +login()
        +getProfile()
    }

    class Reservation {
        +int id
        +int customer_id
        +date reservation_date
        +time reservation_time
        +int guests
        +enum table_preference
        +int table_id
        +enum status
        +string notes
        +datetime created_at
        +datetime updated_at
        +create()
        +updateStatus()
        +cancel()
    }

    class QueueEntry {
        +int id
        +int reservation_id
        +int queue_number
        +int position
        +enum status
        +datetime created_at
        +datetime updated_at
        +updatePosition()
        +call()
        +markSeated()
        +markNoShow()
    }

    class RestaurantTable {
        +int id
        +string table_number
        +int capacity
        +enum area
        +enum status
        +datetime created_at
        +updateStatus()
        +checkAvailability()
    }

    class Seating {
        +int id
        +int reservation_id
        +int table_id
        +datetime seated_at
        +datetime left_at
        +enum status
        +assignTable()
        +finishSeating()
    }

    class MenuItem {
        +int id
        +string name
        +string description
        +decimal price
        +enum category
        +string image_url
        +boolean available
        +datetime created_at
        +toggleAvailability()
    }

    class Order {
        +int id
        +int customer_id
        +int reservation_id
        +enum status
        +decimal total
        +string notes
        +datetime created_at
        +datetime updated_at
        +placeOrder()
        +updateStatus()
        +calculateTotal()
    }

    class OrderItem {
        +int id
        +int order_id
        +int menu_item_id
        +int quantity
        +decimal unit_price
        +decimal subtotal
    }

    User "1" --> "0..*" Reservation : creates
    User "1" --> "0..*" Order : places
    Reservation "1" --> "0..1" QueueEntry : generates
    Reservation "1" --> "0..1" Seating : assigned to
    Reservation "0..*" --> "0..1" RestaurantTable : prefers
    Seating "1" --> "1" RestaurantTable : occupies
    Order "1" --> "1..*" OrderItem : contains
    OrderItem "0..*" --> "1" MenuItem : references
    Order "0..*" --> "0..1" Reservation : linked to
```

**Purpose:** Defines the system's core data entities, their attributes, methods, and relationships using standard UML class notation.

**Application to VikingsERP:** Eight classes map directly to the 8 MySQL tables. The diagram shows cardinality — a User creates multiple Reservations, each Reservation may generate one QueueEntry, and each Order contains multiple OrderItems referencing MenuItems.

**Scenario:** Customer John creates a Reservation (1-to-many). The staff approves it and a QueueEntry is generated (1-to-1). When seated, a Seating record links the Reservation to a RestaurantTable. John places an Order with 3 OrderItems referencing menu items.

---

## Diagram 3: Component Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend Application (React.js + Vite)"]
        RC["React Components"]
        RP["React Router (Pages)"]
        CTX["Context Providers\nAuth · Cart · Socket"]
        API_SVC["API Service (Axios)"]
        SOCK_C["Socket.IO Client"]
    end

    subgraph Backend["Backend Application (Node.js + Express.js)"]
        EXP["Express Server"]
        MW["Middleware Layer\nJWT Auth · CORS · Role Guard"]
        subgraph Controllers["API Route Controllers"]
            AC["Auth Controller"]
            RES_C["Reservations Controller"]
            QC["Queue Controller"]
            TC["Tables Controller"]
            SC["Seating Controller"]
            MC["Menu Controller"]
            OC["Orders Controller"]
            DC["Dashboard Controller"]
        end
        SOCK_S["Socket.IO Server"]
        DB_POOL["MySQL Connection Pool (mysql2)"]
    end

    subgraph Database["MySQL Database"]
        SCHEMA["8 Tables\nusers · reservations · queue_entries\nrestaurant_tables · seating\nmenu_items · orders · order_items"]
    end

    subgraph ProposedComponents["Proposed Components"]
        POS_C["POS & Billing Component"]
        INV_C["Inventory & Procurement Component"]
    end

    RC --> RP
    RP --> CTX
    CTX --> API_SVC
    CTX --> SOCK_C

    API_SVC -->|"HTTP/JSON"| EXP
    SOCK_C <-.->|"WebSocket"| SOCK_S

    EXP --> MW --> Controllers
    Controllers --> DB_POOL
    SOCK_S --> DB_POOL
    DB_POOL --> SCHEMA

    POS_C -.->|"Proposed"| EXP
    INV_C -.->|"Proposed"| EXP
```

**Purpose:** Shows the major software components, their responsibilities, internal dependencies, and how they interact at the module level.

**Application to VikingsERP:** The frontend is composed of React Components, Router/Pages, Context Providers (Auth, Cart, Socket), and the Axios API service. The backend has Express Server, Middleware, 8 API Route Controllers, Socket.IO, and the MySQL connection pool. POS & Billing and Inventory & Procurement are shown as proposed components.

**Scenario:** When a customer places an order, the Cart Context feeds data to the API Service, which calls the Orders Controller via Express. The controller validates through Middleware, writes to MySQL via the connection pool, and emits a Socket.IO event to the kitchen.

---

## Diagram 4: Deployment Diagram

```mermaid
graph TB
    subgraph ClientDevice["Client Device (Web Browser)"]
        BROWSER["Chrome / Firefox / Safari"]
        REACT["React.js SPA Bundle\n(HTML + CSS + JS)"]
    end

    subgraph DevServer["Development Server (localhost)"]
        subgraph ViteServer["Vite Dev Server :5173"]
            VITE["React.js + Vite\nHot Module Replacement"]
        end

        subgraph NodeServer["Node.js Server :5000"]
            EXPRESS["Express.js Application"]
            SOCKETIO["Socket.IO Server"]
        end

        subgraph MySQLServer["MySQL Server 8.0 :3306"]
            MYSQL_DB["Database: resquedb\n8 Tables"]
        end
    end

    subgraph ProposedProd["Proposed Production Deployment"]
        CDN["CDN / Static Hosting\n(Vercel / Netlify)"]
        CLOUD_API["Cloud API Server\n(Railway / Render / AWS)"]
        CLOUD_DB["Managed MySQL\n(PlanetScale / RDS)"]
    end

    BROWSER -->|"HTTP :5173"| VITE
    BROWSER <-.->|"WebSocket"| SOCKETIO
    VITE -->|"Proxy /api/* → :5000"| EXPRESS
    EXPRESS -->|"TCP :3306"| MYSQL_DB
    SOCKETIO --> EXPRESS

    CDN -.->|"Proposed"| CLOUD_API
    CLOUD_API -.->|"Proposed"| CLOUD_DB
```

**Purpose:** Shows how VikingsERP software artifacts are deployed onto hardware/infrastructure nodes, distinguishing between verified development deployment and proposed production deployment.

**Application to VikingsERP:** Currently deployed locally — Vite dev server on port 5173 proxies API calls to Express on port 5000, which connects to MySQL 8.0 on port 3306. The proposed production deployment uses CDN hosting for the React SPA, a cloud API server for Express, and managed MySQL.

**Scenario:** Developer runs `npm run dev` in both `/frontend` and `/backend`. The browser loads React from Vite (:5173), API calls are proxied to Express (:5000), and MySQL serves data from the `resquedb` database on :3306.

---

## Diagram 5: Object Diagram

```mermaid
graph TB
    subgraph Snapshot["Object Diagram — Snapshot: Customer Order in Progress"]
        direction TB

        john["john : User\nid = 1\nname = 'John Customer'\nemail = 'customer@viking.com'\nrole = 'customer'"]

        res1["res1 : Reservation\nid = 5\ncustomer_id = 1\ndate = '2026-10-12'\ntime = '19:00'\nguests = 4\nstatus = 'seated'\ntable_preference = 'main'"]

        q1["q1 : QueueEntry\nid = 3\nreservation_id = 5\nqueue_number = 12\nposition = 1\nstatus = 'seated'"]

        tbl["tblM3 : RestaurantTable\nid = 3\ntable_number = 'M3'\ncapacity = 4\narea = 'main'\nstatus = 'occupied'"]

        seat1["seat1 : Seating\nid = 7\nreservation_id = 5\ntable_id = 3\nstatus = 'seated'\nseated_at = '19:15'"]

        ord1["ord1 : Order\nid = 10\ncustomer_id = 1\nreservation_id = 5\nstatus = 'preparing'\ntotal = 1250.00"]

        oi1["oi1 : OrderItem\norder_id = 10\nmenu_item_id = 4\nquantity = 2\nunit_price = 350.00\nsubtotal = 700.00"]

        oi2["oi2 : OrderItem\norder_id = 10\nmenu_item_id = 8\nquantity = 2\nunit_price = 275.00\nsubtotal = 550.00"]

        grill["grill : MenuItem\nid = 4\nname = 'Viking Ribeye Steak'\nprice = 350.00\ncategory = 'grill'\navailable = true"]

        bev["bev : MenuItem\nid = 8\nname = 'Craft Draft Beer'\nprice = 275.00\ncategory = 'beverage'\navailable = true"]
    end

    john --> res1
    res1 --> q1
    res1 --> seat1
    seat1 --> tbl
    john --> ord1
    ord1 --> oi1
    ord1 --> oi2
    oi1 --> grill
    oi2 --> bev
```

**Purpose:** Shows a concrete snapshot of actual object instances and their relationships at a specific moment in time, with illustrative sample attribute values.

**Application to VikingsERP:** Customer John has a seated reservation at Table M3, with an active order containing two items (Viking Ribeye Steak × 2 and Craft Draft Beer × 2) totaling ₱1,250.00. The order status is "preparing" in the kitchen.

**Scenario:** At 7:15 PM, John was seated at Table M3 after being called from queue position 1. He browsed the digital menu, added items to his cart, and confirmed an order that is now being prepared by the kitchen staff.

---

## Diagram 6: Package Diagram

```mermaid
graph TB
    subgraph Root["VikingsERP"]
        subgraph FE["frontend/"]
            subgraph FE_SRC["src/"]
                subgraph FE_COMP["components/"]
                    N1["Navbar.jsx"]
                    N2["ProtectedRoute.jsx"]
                end
                subgraph FE_CTX["context/"]
                    C1["AuthContext.jsx"]
                    C2["CartContext.jsx"]
                    C3["SocketContext.jsx"]
                end
                subgraph FE_PAGES["pages/"]
                    P0["Login.jsx\nRegister.jsx"]
                    subgraph P_CUST["customer/"]
                        PC1["Reservation.jsx"]
                        PC2["MyReservations.jsx"]
                        PC3["QueueStatus.jsx"]
                        PC4["DigitalMenu.jsx"]
                        PC5["MenuItemDetails.jsx"]
                        PC6["Cart.jsx"]
                        PC7["OrderConfirmation.jsx"]
                        PC8["OrderStatus.jsx"]
                    end
                    subgraph P_STAFF["staff/"]
                        PS1["ReservationManagement.jsx"]
                        PS2["ReservationDetails.jsx"]
                        PS3["QueueManagement.jsx"]
                        PS4["TableManagement.jsx"]
                        PS5["SeatingManagement.jsx"]
                    end
                    subgraph P_KITCHEN["kitchen/"]
                        PK1["OrderManagement.jsx"]
                        PK2["OrderDetails.jsx"]
                        PK3["OrderStatusManagement.jsx"]
                    end
                    subgraph P_MGMT["management/"]
                        PM1["Dashboard.jsx"]
                    end
                end
                subgraph FE_SVC["services/"]
                    S1["api.js"]
                end
                APP["App.jsx"]
                MAIN["main.jsx"]
                CSS["index.css"]
            end
            VCF["vite.config.js"]
            IDX["index.html"]
        end

        subgraph BE["backend/"]
            subgraph BE_CFG["config/"]
                DB1["db.js"]
            end
            subgraph BE_MW["middleware/"]
                MW1["auth.js"]
            end
            subgraph BE_ROUTES["routes/"]
                RR1["auth.js"]
                RR2["reservations.js"]
                RR3["queue.js"]
                RR4["tables.js"]
                RR5["seating.js"]
                RR6["menu.js"]
                RR7["orders.js"]
                RR8["dashboard.js"]
            end
            subgraph BE_SOCK["socket/"]
                SK1["index.js"]
            end
            subgraph BE_DB["database/"]
                SCH["schema.sql"]
            end
            SRV["server.js"]
            SEED["seed.js"]
            ENV[".env"]
        end
    end
```

**Purpose:** Shows the organizational structure of VikingsERP's source code packages, separating frontend and backend concerns with clear file groupings.

**Application to VikingsERP:** The frontend (`frontend/`) contains React components, context providers, 17 pages across 4 role-based directories, and the API service. The backend (`backend/`) contains Express configuration, JWT middleware, 8 API route modules, Socket.IO handler, and database files.

**Scenario:** A developer adding a new feature navigates to `frontend/src/pages/customer/` for customer-facing UI and `backend/routes/` for the corresponding API endpoint. The separation ensures frontend and backend can be developed independently.

---

## Diagram 7: Composite Structure Diagram

```mermaid
graph TB
    subgraph OrderProcessing["Order Processing Component — Internal Structure"]
        direction TB

        subgraph FrontendParts["Frontend Parts"]
            DM["DigitalMenu\n(Browse Items)"]
            MID["MenuItemDetails\n(View Item)"]
            CART["Cart\n(Manage Items)"]
            OC["OrderConfirmation\n(Review & Submit)"]
            OS["OrderStatus\n(Track Progress)"]
        end

        subgraph ContextParts["Internal State"]
            CC["CartContext\n- items[]\n- addItem()\n- removeItem()\n- updateQty()\n- clearCart()\n- getTotal()"]
            SC["SocketContext\n- socket connection\n- event listeners"]
        end

        subgraph BackendParts["Backend Parts"]
            MENU_API["Menu API\n/api/menu\nGET items\nGET item/:id"]
            ORDER_API["Orders API\n/api/orders\nPOST create\nGET list\nGET detail\nPUT status"]
            SOCK_SRV["Socket.IO\norder:new event\norder:update event"]
        end

        subgraph DataParts["Data Store"]
            MI_TBL["menu_items table"]
            O_TBL["orders table"]
            OI_TBL["order_items table"]
        end

        DM -->|"Browse"| MENU_API
        MID -->|"Add to Cart"| CC
        CART -->|"Manage"| CC
        CC -->|"Submit"| OC
        OC -->|"POST /api/orders"| ORDER_API
        ORDER_API -->|"Write"| O_TBL
        ORDER_API -->|"Write"| OI_TBL
        ORDER_API -->|"Emit order:new"| SOCK_SRV
        SOCK_SRV -->|"Push update"| OS
        MENU_API -->|"Read"| MI_TBL
        OS -->|"Listen order:update"| SC
    end
```

**Purpose:** Shows the internal structure of a major VikingsERP component — the Order Processing Component — including its internal parts, interfaces, and connections between frontend, backend, and data layers.

**Application to VikingsERP:** The Order Processing component spans from DigitalMenu browsing through Cart management, Order confirmation, backend order creation, and real-time status tracking. CartContext manages client-side state; Socket.IO pushes live updates to the OrderStatus page.

**Scenario:** Customer browses DigitalMenu → views MenuItemDetails → adds to Cart via CartContext → proceeds to OrderConfirmation → submits POST to Orders API → backend writes to orders and order_items tables → emits `order:new` via Socket.IO → kitchen receives live notification.

---

## Diagram 8: Profile Diagram

```mermaid
graph TB
    subgraph VikingsERPProfile["VikingsERP UML Profile"]
        direction TB

        subgraph Stereotypes["Stereotypes"]
            S1["«ReactComponent»\nExtends: UML Component\nTag: renderMethod = JSX\nTag: hasState = boolean"]
            S2["«APIRoute»\nExtends: UML Component\nTag: httpMethod = GET|POST|PUT|DELETE\nTag: path = string\nTag: authRequired = boolean"]
            S3["«MySQLTable»\nExtends: UML Class\nTag: engine = InnoDB\nTag: charset = utf8mb4"]
            S4["«JWTProtected»\nExtends: UML Interface\nTag: tokenExpiry = 24h\nConstraint: Bearer token in Authorization header"]
            S5["«SocketEvent»\nExtends: UML Signal\nTag: direction = emit|listen\nTag: room = string"]
            S6["«RoleGuard»\nExtends: UML Constraint\nTag: allowedRoles = enum[]\nConstraint: 403 if role not in allowedRoles"]
        end

        subgraph Applications["Applied Stereotypes"]
            A1["«ReactComponent»\nCart.jsx\nrenderMethod = JSX\nhasState = true"]
            A2["«APIRoute»\nPOST /api/orders\nhttpMethod = POST\npath = /api/orders\nauthRequired = true"]
            A3["«MySQLTable»\norders\nengine = InnoDB\ncharset = utf8mb4"]
            A4["«JWTProtected»\nAuthentication\ntokenExpiry = 24h"]
            A5["«SocketEvent»\norder:new\ndirection = emit\nroom = kitchen"]
            A6["«RoleGuard»\nDashboard Access\nallowedRoles = [management, reservation_staff]"]
        end
    end

    S1 -.-> A1
    S2 -.-> A2
    S3 -.-> A3
    S4 -.-> A4
    S5 -.-> A5
    S6 -.-> A6
```

**Purpose:** Defines UML stereotypes, tagged values, and constraints specific to the VikingsERP system, extending standard UML metaclasses with domain-specific semantics.

**Application to VikingsERP:** Six stereotypes capture the system's key patterns: «ReactComponent» for frontend JSX components with state, «APIRoute» for Express.js endpoints with HTTP methods and auth requirements, «MySQLTable» for database entities, «JWTProtected» for token-based auth, «SocketEvent» for real-time events, and «RoleGuard» for role-based access constraints.

**Scenario:** When a developer defines a new API endpoint, they apply the «APIRoute» stereotype with tagged values for HTTP method, path, and auth requirement. The «RoleGuard» constraint ensures only authorized roles can access the endpoint.

---

# PART 2: BEHAVIORAL DIAGRAMS (The System in Motion)

---

## Diagram 9: Data Flow Diagram (DFD)

```mermaid
graph TB
    E1["Customer"]
    E2["Reservation Staff"]
    E3["Service/Kitchen Staff"]
    E4["Management"]

    P1("1.0 Manage Reservations")
    P2("2.0 Manage Queue and Seating")
    P3("3.0 Manage Digital Menu")
    P4("4.0 Process Customer Orders")
    P5("5.0 Manage Order Status")
    P6("6.0 Monitor Dashboard")

    DS1[("D1: Users")]
    DS2[("D2: Reservations")]
    DS3[("D3: Queue Entries")]
    DS4[("D4: Tables / Seating")]
    DS5[("D5: Menu Items")]
    DS6[("D6: Orders")]
    DS7[("D7: Order Items")]

    E1 -->|"Reservation Request"| P1
    P1 -->|"Verify User"| DS1
    P1 -->|"Store/Read"| DS2
    P1 -->|"Notification"| E2
    E2 -->|"Approve/Reject"| P1
    P1 -->|"Status Update"| E1

    P1 -->|"Approved Reservation"| P2
    P2 -->|"Store/Read"| DS3
    P2 -->|"Assign Table"| DS4
    P2 -->|"Queue Status (Socket.IO)"| E1
    E2 -->|"Manage Queue"| P2

    E1 -->|"Browse Menu"| P3
    P3 -->|"Read Items"| DS5
    P3 -->|"Menu Display"| E1

    E1 -->|"Place Order"| P4
    P4 -->|"Store Order"| DS6
    P4 -->|"Store Items"| DS7
    P4 -->|"New Order"| E3

    E3 -->|"Update Status"| P5
    P5 -->|"Update"| DS6
    P5 -->|"Order Status (Socket.IO)"| E1

    E4 -->|"Request Stats"| P6
    DS2 & DS3 & DS4 & DS6 -->|"Read Data"| P6
    P6 -->|"Statistics"| E4
```

**Purpose:** Shows how information flows between external entities (users), system processes, and data stores using standard DFD notation.

**Application to VikingsERP:** Six major processes handle the flow of reservation requests, queue/seating management, menu browsing, order processing, order status updates, and dashboard monitoring. Socket.IO delivers real-time queue and order status updates.

**Scenario:** Customer submits a Reservation Request → Process 1.0 stores it in D2 and notifies Staff → Staff approves → Process 2.0 creates a queue entry in D3 → Customer receives Queue Status via Socket.IO → When seated, customer browses menu (Process 3.0) → Places order (Process 4.0) → Kitchen updates status (Process 5.0) → Customer receives live Order Status.

---

## Diagram 10: Use Case Diagram

```mermaid
graph LR
    C["👤 Customer"]
    RS["👤 Reservation\nStaff"]
    KS["👤 Service/Kitchen\nStaff"]
    MG["👤 Management"]

    subgraph VGS["VikingsERP System"]
        UC1(["Create Reservation"])
        UC2(["View/Manage My Reservations"])
        UC3(["View Queue Status"])
        UC4(["Browse Digital Menu"])
        UC5(["View Menu Item Details"])
        UC6(["Manage Cart"])
        UC7(["Confirm Order"])
        UC8(["Track Order Status"])
        UC9(["Register / Login"])

        UC10(["Manage Reservations"])
        UC11(["View Reservation Details"])
        UC12(["Manage Queue"])
        UC13(["Manage Tables"])
        UC14(["Manage Seating"])

        UC15(["Manage Orders"])
        UC16(["View Order Details"])
        UC17(["Update Order Status"])

        UC18(["Monitor Dashboard"])
    end

    C --- UC9
    C --- UC1
    C --- UC2
    C --- UC3
    C --- UC4
    C --- UC5
    C --- UC6
    C --- UC7
    C --- UC8

    RS --- UC9
    RS --- UC10
    RS --- UC11
    RS --- UC12
    RS --- UC13
    RS --- UC14

    KS --- UC9
    KS --- UC15
    KS --- UC16
    KS --- UC17

    MG --- UC9
    MG --- UC18
```

**Purpose:** Identifies all system actors and their authorized use cases within the VikingsERP system boundary.

**Application to VikingsERP:** Four actors — Customer (9 use cases), Reservation Staff (6), Service/Kitchen Staff (4), and Management (2). All actors share Register/Login. Role-based authorization restricts each actor to their permitted functions only.

**Scenario:** A Customer can create reservations, track queue status, browse the menu, manage their cart, and track orders. A Kitchen Staff member can only manage orders, view details, and update statuses. Management has exclusive dashboard access.

---

## Diagram 11: Activity Diagram

```mermaid
graph TB
    START(("●")) --> Login["Customer Logs In"]
    Login --> BrowseMenu["Browse Digital Menu"]
    BrowseMenu --> ViewItem["View Menu Item Details"]
    ViewItem --> AddCart{"Add to Cart?"}
    AddCart -->|"Yes"| AddToCart["Add Item to Cart"]
    AddToCart --> MoreItems{"Browse More?"}
    MoreItems -->|"Yes"| BrowseMenu
    MoreItems -->|"No"| ReviewCart["Review Cart"]
    AddCart -->|"No"| MoreItems

    ReviewCart --> ModifyCart{"Modify Cart?"}
    ModifyCart -->|"Yes"| UpdateQty["Update Quantities / Remove Items"]
    UpdateQty --> ReviewCart
    ModifyCart -->|"No"| Checkout["Proceed to Order Confirmation"]

    Checkout --> ConfirmOrder["Confirm and Submit Order"]
    ConfirmOrder --> CreateOrder["Backend: Create Order Record"]
    CreateOrder --> CreateItems["Backend: Create Order Items"]
    CreateItems --> CalcTotal["Backend: Calculate Total"]
    CalcTotal --> EmitSocket["Backend: Emit order:new via Socket.IO"]
    EmitSocket --> NotifyKitchen["Kitchen Receives New Order"]
    EmitSocket --> ShowConfirmation["Show Order Confirmation to Customer"]

    NotifyKitchen --> PrepareOrder["Kitchen Prepares Order"]
    PrepareOrder --> UpdatePreparing["Update Status: Preparing"]
    UpdatePreparing --> EmitUpdate1["Emit order:update → Customer"]
    EmitUpdate1 --> FinishPrep["Kitchen Finishes Preparation"]
    FinishPrep --> UpdateReady["Update Status: Ready"]
    UpdateReady --> EmitUpdate2["Emit order:update → Customer"]
    EmitUpdate2 --> ServeOrder["Serve Order to Customer"]
    ServeOrder --> UpdateCompleted["Update Status: Completed"]
    UpdateCompleted --> ENDNODE(("◉"))

    ShowConfirmation --> TrackStatus["Customer Tracks Order Status"]
    TrackStatus --> ENDNODE
```

**Purpose:** Shows the complete step-by-step workflow of processing a customer order — from login through menu browsing, cart management, order confirmation, kitchen preparation, and status tracking.

**Application to VikingsERP:** The activity flows through the React frontend (menu browsing, cart, confirmation), Express backend (order creation, total calculation), Socket.IO (real-time notifications), and kitchen staff workflow (status updates).

**Scenario:** Customer logs in → browses menu → adds Viking Ribeye Steak and Craft Beer to cart → reviews cart → confirms order → backend creates order + items + calculates total → Socket.IO notifies kitchen → kitchen updates status to "preparing" → then "ready" → then "completed". Customer tracks live via OrderStatus page.

---

## Diagram 12: Sequence Diagram

```mermaid
sequenceDiagram
    actor Customer
    participant React as React Frontend
    participant Axios as Axios API Client
    participant Express as Express Server
    participant AuthMW as JWT Middleware
    participant OrderCtrl as Orders Controller
    participant MySQL as MySQL Database
    participant SocketIO as Socket.IO Server
    participant Kitchen as Kitchen Staff UI

    Customer->>React: Click "Place Order"
    React->>React: CartContext.getItems()
    React->>Axios: POST /api/orders {items, notes}
    Axios->>Express: HTTP POST /api/orders
    Express->>AuthMW: Verify JWT Token
    AuthMW-->>Express: User authenticated (id=1)
    Express->>OrderCtrl: Handle request

    loop For each cart item
        OrderCtrl->>MySQL: SELECT * FROM menu_items WHERE id=?
        MySQL-->>OrderCtrl: MenuItem data (price, availability)
        OrderCtrl->>OrderCtrl: Validate availability & calculate subtotal
    end

    OrderCtrl->>MySQL: INSERT INTO orders (customer_id, total, notes)
    MySQL-->>OrderCtrl: order_id = 10

    loop For each order item
        OrderCtrl->>MySQL: INSERT INTO order_items (order_id, menu_item_id, qty, price, subtotal)
        MySQL-->>OrderCtrl: OK
    end

    OrderCtrl->>MySQL: SELECT order with customer info WHERE id=10
    MySQL-->>OrderCtrl: Full order data

    OrderCtrl->>SocketIO: io.to('kitchen').emit('order:new', orderData)
    SocketIO-->>Kitchen: Real-time: New order received

    OrderCtrl-->>Express: 201 {order, items}
    Express-->>Axios: HTTP 201 Response
    Axios-->>React: Order data
    React-->>Customer: Show Order Confirmation page
```

**Purpose:** Shows the chronological message interactions between system components during a customer order placement transaction.

**Application to VikingsERP:** Traces the exact code path from React → Axios → Express → JWT Middleware → Orders Controller → MySQL queries (menu validation, order INSERT, order_items INSERT) → Socket.IO notification → Kitchen UI update → Response back to customer.

**Scenario:** Customer clicks "Place Order" with 2 items in cart. The sequence shows JWT validation, menu item availability checks in a loop, order record creation, order items insertion, Socket.IO kitchen notification, and the 201 response with full order data.

---

## Diagram 13: State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> Pending : Customer creates reservation

    Pending --> Approved : Staff approves
    Pending --> Cancelled : Staff declines / Customer cancels

    Approved --> Queued : Staff adds to queue
    Approved --> Cancelled : Customer cancels

    Queued --> Seated : Queue called + Table assigned
    Queued --> NoShow : Customer doesn't arrive
    Queued --> Cancelled : Customer cancels

    Seated --> Completed : Customer finishes visit

    Completed --> [*]
    Cancelled --> [*]
    NoShow --> [*]

    state Queued {
        [*] --> Waiting : Enter queue
        Waiting --> Called : Staff calls customer
        Called --> TableAssigned : Staff assigns table
    }

    state OrderLifecycle {
        [*] --> OrderPending : Customer places order
        OrderPending --> Preparing : Kitchen starts
        Preparing --> Ready : Kitchen finishes
        Ready --> OrderCompleted : Served to customer
        OrderPending --> OrderCancelled : Staff cancels
        Preparing --> OrderCancelled : Staff cancels
    }
```

**Purpose:** Shows the lifecycle state transitions of two key system entities — Reservation and Order — including valid states, transition events, and conditions.

**Application to VikingsERP:** A Reservation progresses through Pending → Approved → Queued (with sub-states Waiting → Called → TableAssigned) → Seated → Completed. An Order follows OrderPending → Preparing → Ready → Completed. Both can be Cancelled at valid points.

**Scenario:** Reservation created (Pending) → Staff approves (Approved) → Added to queue (Queued/Waiting) → Staff calls customer (Called) → Table M3 assigned (Seated) → Customer finishes (Completed). Simultaneously, the order goes from Pending → Preparing → Ready → Completed.

---

## Diagram 14: Communication Diagram

```mermaid
graph LR
    Customer["Customer Browser"]
    React["React App"]
    AxiosClient["Axios Client"]
    ExpressAPI["Express API"]
    AuthMiddleware["Auth Middleware"]
    OrdersRoute["Orders Controller"]
    MySQLDB["MySQL"]
    SocketServer["Socket.IO"]
    KitchenUI["Kitchen UI"]

    Customer -->|"1: Submit order form"| React
    React -->|"2: getCartItems()"| React
    React -->|"3: POST /api/orders"| AxiosClient
    AxiosClient -->|"4: HTTP Request + JWT"| ExpressAPI
    ExpressAPI -->|"5: verifyToken()"| AuthMiddleware
    AuthMiddleware -->|"6: req.user = decoded"| ExpressAPI
    ExpressAPI -->|"7: handleCreateOrder()"| OrdersRoute
    OrdersRoute -->|"8: SELECT menu_items"| MySQLDB
    MySQLDB -->|"9: menuItem data"| OrdersRoute
    OrdersRoute -->|"10: INSERT orders"| MySQLDB
    MySQLDB -->|"11: order_id"| OrdersRoute
    OrdersRoute -->|"12: INSERT order_items"| MySQLDB
    OrdersRoute -->|"13: emit('order:new')"| SocketServer
    SocketServer -->|"14: broadcast to kitchen room"| KitchenUI
    OrdersRoute -->|"15: 201 response"| ExpressAPI
    ExpressAPI -->|"16: JSON response"| AxiosClient
    AxiosClient -->|"17: order data"| React
    React -->|"18: Navigate to confirmation"| Customer
```

**Purpose:** Shows how objects and components communicate during a transaction, using numbered messages to represent the chronological order of interactions.

**Application to VikingsERP:** 18 numbered messages trace the complete communication path from the customer submitting an order form through React → Axios → Express → Auth → Orders Controller → MySQL (multiple queries) → Socket.IO → Kitchen UI → back to customer with confirmation.

**Scenario:** Messages 1-6 handle form submission and authentication. Messages 7-12 handle database operations (menu validation, order + items creation). Message 13-14 handle real-time kitchen notification. Messages 15-18 return the response to the customer.

---

## Diagram 15: Interaction Overview Diagram

```mermaid
graph TB
    START(("●")) --> REF1

    subgraph REF1["ref: Customer Authentication"]
        A1["Customer enters credentials"]
        A2["POST /api/auth/login"]
        A3["JWT token returned"]
        A4["Socket.IO connects with token"]
    end

    REF1 --> DECISION1{"Has Reservation?"}

    DECISION1 -->|"No"| REF2
    subgraph REF2["ref: Create Reservation"]
        B1["Fill reservation form"]
        B2["POST /api/reservations"]
        B3["Wait for approval"]
        B4["Queue entry created"]
        B5["Monitor queue via Socket.IO"]
        B6["Seated at table"]
    end

    DECISION1 -->|"Yes"| REF3

    REF2 --> REF3
    subgraph REF3["ref: Browse Menu and Order"]
        C1["GET /api/menu"]
        C2["Browse categories"]
        C3["Add items to CartContext"]
        C4["Review cart totals"]
    end

    REF3 --> REF4
    subgraph REF4["ref: Process Order"]
        D1["POST /api/orders"]
        D2["Validate menu items"]
        D3["Create order + order_items"]
        D4["Calculate total"]
        D5["Emit order:new"]
    end

    REF4 --> REF5
    subgraph REF5["ref: Kitchen Processing"]
        E1["Kitchen receives order"]
        E2["PUT /api/orders/:id/status → preparing"]
        E3["PUT /api/orders/:id/status → ready"]
        E4["Emit order:update"]
    end

    REF5 --> REF6
    subgraph REF6["ref: Order Completion"]
        F1["Customer sees Ready status"]
        F2["Order served"]
        F3["Status → completed"]
    end

    REF6 --> ENDNODE(("◉"))
```

**Purpose:** Provides a high-level overview of the entire order lifecycle by combining activity-style control flow with references to smaller interaction fragments.

**Application to VikingsERP:** Six interaction fragments cover the full business process: Customer Authentication → Create Reservation (optional) → Browse Menu and Order → Process Order → Kitchen Processing → Order Completion. A decision node handles whether the customer already has a reservation.

**Scenario:** Customer authenticates (REF1), creates reservation and waits in queue (REF2), browses menu and builds cart (REF3), submits order (REF4), kitchen prepares (REF5), order completed (REF6). Socket.IO provides real-time updates throughout REF2, REF5, and REF6.

---

## Diagram 16: Timing Diagram

```mermaid
gantt
    title VikingsERP Transaction Timing — Customer Order Lifecycle
    dateFormat HH:mm
    axisFormat %H:%M

    section Reservation
    Pending (Created)          :res1, 18:00, 15min
    Approved (Staff Action)    :res2, after res1, 10min
    Queued/Waiting             :res3, after res2, 20min
    Called                     :res4, after res3, 5min
    Seated                     :res5, after res4, 90min

    section Order
    Browsing Menu              :ord1, 18:50, 10min
    Cart Building              :ord2, after ord1, 5min
    Order Submitted (Pending)  :ord3, after ord2, 2min
    Preparing (Kitchen)        :ord4, after ord3, 20min
    Ready (Waiting Serve)      :ord5, after ord4, 5min
    Completed (Served)         :ord6, after ord5, 1min

    section Table M3
    Available                  :tbl1, 18:00, 50min
    Occupied (John seated)     :crit, tbl2, after tbl1, 90min

    section Socket.IO Events
    queue:update (position)    :sock1, 18:25, 1min
    queue:update (called)      :sock2, 18:45, 1min
    order:new (kitchen)        :sock3, 19:05, 1min
    order:update (preparing)   :sock4, 19:07, 1min
    order:update (ready)       :sock5, 19:27, 1min
```

**Purpose:** Shows how the states of system entities change over time during a transaction, with illustrative timing values representing a typical customer visit.

**Application to VikingsERP:** Four lanes track the parallel state changes of: Reservation (Pending → Approved → Queued → Called → Seated), Order (Browsing → Cart → Pending → Preparing → Ready → Completed), Table M3 (Available → Occupied), and Socket.IO events fired at key state transitions.

**Scenario (Illustrative Timing):** At 18:00 reservation created → 18:15 approved → 18:25 queued (Socket.IO position update) → 18:45 called (Socket.IO) → 18:50 seated, starts browsing → 19:05 order submitted (Socket.IO `order:new`) → 19:07 preparing (Socket.IO) → 19:27 ready (Socket.IO) → 19:32 completed. Total visit: ~90 minutes.

---

## Diagram 17: Requirement Diagram (SysML)

```mermaid
graph TB
    subgraph POSRequirements["POS & Billing Requirements (Proposed)"]
        REQ1["«requirement»\nREQ-POS-001\nOrder Processing\n—\nThe system shall allow customers\nto create orders from the\ndigital menu with quantity\nselection and cart management."]

        REQ2["«requirement»\nREQ-POS-002\nBilling Calculation\n—\nThe system shall automatically\ncalculate order totals based\non item prices and quantities."]

        REQ3["«requirement»\nREQ-POS-003\nOrder Status Tracking\n—\nThe system shall provide\nreal-time order status updates\nvia Socket.IO WebSocket."]

        REQ4["«requirement»\nREQ-POS-004\nKitchen Order Management\n—\nThe system shall display\nincoming orders to kitchen staff\nand allow status updates."]

        REQ5["«requirement»\nREQ-POS-005\nPayment Processing\n—\n(PROPOSED) The system shall\nrecord payment method and\namount for completed orders."]

        REQ6["«requirement»\nREQ-POS-006\nReceipt Generation\n—\n(PROPOSED) The system shall\ngenerate printable receipts\nfor completed transactions."]
    end

    subgraph InvRequirements["Inventory & Procurement Requirements (Proposed)"]
        REQ7["«requirement»\nREQ-INV-001\nMenu Item Management\n—\nThe system shall maintain\na catalog of menu items with\nname, price, category, and\navailability status."]

        REQ8["«requirement»\nREQ-INV-002\nAvailability Toggle\n—\nThe system shall allow staff\nto mark menu items as\navailable or unavailable."]

        REQ9["«requirement»\nREQ-INV-003\nInventory Tracking\n—\n(PROPOSED) The system shall\ntrack ingredient stock levels\nand deduct on order placement."]

        REQ10["«requirement»\nREQ-INV-004\nSupplier Management\n—\n(PROPOSED) The system shall\nmaintain supplier records\nfor procurement."]

        REQ11["«requirement»\nREQ-INV-005\nPurchase Orders\n—\n(PROPOSED) The system shall\nsupport creating and tracking\npurchase orders to suppliers."]

        REQ12["«requirement»\nREQ-INV-006\nLow-Stock Alerts\n—\n(PROPOSED) The system shall\nalert staff when ingredient\nlevels fall below thresholds."]
    end

    subgraph Components["System Components"]
        COMP1["Cart.jsx\nOrderConfirmation.jsx"]
        COMP2["Orders Controller\n/api/orders"]
        COMP3["SocketContext.jsx\nSocket.IO Server"]
        COMP4["OrderManagement.jsx\nOrderStatusMgmt.jsx"]
        COMP5["Menu Controller\n/api/menu"]
        COMP6["menu_items table\norders table\norder_items table"]
    end

    REQ1 -->|"«satisfy»"| COMP1
    REQ2 -->|"«satisfy»"| COMP2
    REQ3 -->|"«satisfy»"| COMP3
    REQ4 -->|"«satisfy»"| COMP4
    REQ7 -->|"«satisfy»"| COMP5
    REQ8 -->|"«satisfy»"| COMP5

    REQ1 -->|"«deriveReqt»"| REQ2
    REQ2 -->|"«deriveReqt»"| REQ3
    REQ7 -->|"«deriveReqt»"| REQ8
    REQ9 -->|"«deriveReqt»"| REQ12

    COMP2 -->|"«verify»"| REQ2
    COMP6 -->|"«verify»"| REQ7
```

**Purpose:** Traces functional requirements for POS & Billing and Inventory & Procurement to their implementing system components using SysML requirement notation and relationships (satisfy, deriveReqt, verify).

**Application to VikingsERP:** Requirements REQ-POS-001 through REQ-POS-004 and REQ-INV-001 through REQ-INV-002 are satisfied by existing components (Cart, Orders Controller, Socket.IO, Kitchen pages, Menu Controller). Requirements REQ-POS-005/006 and REQ-INV-003 through REQ-INV-006 are clearly marked as PROPOSED.

**Scenario:** REQ-POS-001 (Order Processing) is satisfied by Cart.jsx and OrderConfirmation.jsx. It derives REQ-POS-002 (Billing Calculation), which is satisfied by the Orders Controller. REQ-POS-003 (Real-Time Tracking) is satisfied by SocketContext and the Socket.IO server. Proposed requirements (Payment, Receipts, Inventory, Suppliers, Purchase Orders, Alerts) identify future development needs.

---

## Diagram Legend

| Symbol | Meaning |
|--------|---------|
| Solid Rectangle | External Entity / Component / Class |
| Rounded Rectangle | Process / Activity |
| Cylinder | Database / Data Store |
| Ellipse/Stadium | Use Case |
| Stick Figure | Actor |
| Solid Arrow | Data Flow / Dependency / Association |
| Dashed Arrow | Proposed / Real-Time / Asynchronous |
| `«stereotype»` | UML Stereotype |
| (PROPOSED) | Not yet implemented in current codebase |

---

## Consistency Notes

- All 17 diagrams reference the same **4 actors**: Customer, Reservation Staff, Service/Kitchen Staff, Management
- All diagrams use the same **8 database tables**: users, reservations, queue_entries, restaurant_tables, seating, menu_items, orders, order_items
- All diagrams reference the same **8 API route groups**: auth, reservations, queue, tables, seating, menu, orders, dashboard
- **Socket.IO events** are consistently shown: `order:new`, `order:update`, `queue:update`, `reservation:update`
- **POS & Billing / Inventory & Procurement** proposed features are consistently marked as "(PROPOSED)" across all diagrams
- **Technology stack** is consistently labeled: React.js + Vite (frontend), Node.js + Express.js (backend), MySQL (database), Socket.IO (real-time)
