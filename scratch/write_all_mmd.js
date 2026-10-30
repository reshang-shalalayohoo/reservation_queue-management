const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('docs/system-diagrams');

const sources = {
  '01-system-architecture': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
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
        AUTH_UI["Auth Module\\nLogin · Register"]
        CUST_UI["Customer Module\\nReservation · My Reservations · Queue Status\\nDigital Menu · Menu Item Details\\nCart · Order Confirmation · Order Status"]
        STAFF_UI["Staff Module\\nReservation Mgmt · Reservation Details\\nQueue Mgmt · Table Mgmt · Seating Mgmt"]
        KITCHEN_UI["Kitchen Module\\nOrder Mgmt · Order Details\\nOrder Status Mgmt"]
        MGMT_UI["Management Module\\nDashboard"]
        CTX["Contexts: AuthContext · CartContext · SocketContext"]
        SVC["Services: Axios API Client"]
    end

    FE -->|"REST API (HTTP/JSON via Axios)"| BE
    FE <-.->|"Socket.IO (WebSocket / Polling)"| SOCK

    subgraph BE["BACKEND LAYER — Node.js + Express.js (Port 5000)"]
        direction TB
        MW["Middleware\\nJWT Auth · CORS · Role Authorization"]
        subgraph ROUTES["REST API Route Controllers"]
            R1["/api/auth"]
            R2["/api/reservations"]
            R3["/api/queue"]
            R4["/api/tables"]
            R5["/api/seating"]
            R6["/api/menu"]
            R7["/api/orders"]
            R8["/api/dashboard"]
        end
        SOCK["Socket.IO Server\\nReal-Time Signal Broker"]
    end

    BE -->|"SQL Queries (mysql2/promise)"| DB

    subgraph DB["DATABASE LAYER — MySQL 8.0 (Port 3306)"]
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

    subgraph PROPOSED["PROPOSED ENTERPRISE EXTENSIONS"]
        direction LR
        POS["POS & Billing\\nPayments · Receipts · Invoicing"]
        INV["Inventory & Procurement\\nStock Depletion · Suppliers · POs"]
    end

    PROPOSED -.->|"Planned Integration"| BE
`,

  '02-class-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'nodeBorder':'#000000', 'classText':'#000000' }}}%%
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string phone
        +string password_hash
        +enum role
        +datetime created_at
        +register(name, email, password, phone, role)
        +login(email, password)
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
        +updateStatus(status)
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
        +updatePosition(position)
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
        +updateStatus(status)
        +checkAvailability()
    }

    class Seating {
        +int id
        +int reservation_id
        +int table_id
        +datetime seated_at
        +datetime left_at
        +enum status
        +assignTable(reservation_id, table_id)
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
        +placeOrder(items, notes)
        +updateStatus(status)
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
    Reservation "0..*" --> "0..1" RestaurantTable : allocates
    Seating "1" --> "1" RestaurantTable : occupies
    Order "1" --> "1..*" OrderItem : contains
    OrderItem "0..*" --> "1" MenuItem : references
    Order "0..*" --> "0..1" Reservation : linked to
`,

  '03-component-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph Frontend["Frontend Client (React.js + Vite)"]
        RC["React Components\\nNavbar · ProtectedRoute · EmptyState"]
        RP["React Router DOM (17 Views)"]
        CTX["Context Providers\\nAuthContext · CartContext · SocketContext"]
        API_SVC["API Service\\nAxios HTTP Client with Interceptors"]
        SOCK_C["Socket.IO Client\\nsocket.io-client"]
    end

    subgraph Backend["Backend Server (Node.js + Express.js)"]
        EXP["Express Application Server"]
        MW["Middleware Pipeline\\nJWT Auth · CORS · Role Guard"]
        subgraph Controllers["REST API Route Controllers"]
            AC["auth.js Controller"]
            RES_C["reservations.js Controller"]
            QC["queue.js Controller"]
            TC["tables.js Controller"]
            SC["seating.js Controller"]
            MC["menu.js Controller"]
            OC["orders.js Controller"]
            DC["dashboard.js Controller"]
        end
        SOCK_S["Socket.IO Real-Time Engine\\nRoom Broadcaster"]
        DB_POOL["MySQL Connection Pool\\nmysql2/promise"]
    end

    subgraph Database["Database (MySQL 8.0 Engine)"]
        SCHEMA["Relational Schema\\nusers · reservations · queue_entries\\nrestaurant_tables · seating\\nmenu_items · orders · order_items"]
    end

    subgraph ProposedComponents["Proposed ERP Modules"]
        POS_C["POS & Billing Component\\nPayments · Receipts"]
        INV_C["Inventory & Procurement Component\\nStock Depletion · Purchasing"]
    end

    RC --> RP
    RP --> CTX
    CTX --> API_SVC
    CTX --> SOCK_C

    API_SVC -->|"HTTP/JSON"| EXP
    SOCK_C <-.->|"WebSocket / Polling"| SOCK_S

    EXP --> MW --> Controllers
    Controllers --> DB_POOL
    SOCK_S --> DB_POOL
    DB_POOL --> SCHEMA

    POS_C -.->|"Proposed"| EXP
    INV_C -.->|"Proposed"| EXP
`,

  '04-deployment-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph ClientDevice["Client Node: Customer / Staff Device"]
        BROWSER["Modern Web Browser\\n(Chrome / Safari / Firefox / Edge)"]
        REACT["SPA Artifact: React.js Bundle\\n(HTML5 + CSS3 + Transpiled JS)"]
    end

    subgraph DevEnvironment["Development Host Node (localhost)"]
        subgraph ViteNode["Vite HTTP Server (:5173)"]
            VITE["Vite Development Server\\nHot Module Replacement"]
        end

        subgraph ExpressNode["Node.js Application Server (:5000)"]
            EXPRESS["Express.js REST Application"]
            SOCKETIO["Socket.IO WebSocket Server"]
        end

        subgraph MySQLNode["Database Server: MySQL 8.0 (:3306)"]
            MYSQL_DB["Database Schema: resquedb\\nInnoDB Engine · utf8mb4"]
        end
    end

    subgraph ProposedProd["Proposed Cloud Production Topology"]
        CDN["CDN / Edge Static Hosting\\n(Vercel / Cloudflare Pages)"]
        CLOUD_API["Containerized API Cluster\\n(Docker / AWS ECS / Railway)"]
        CLOUD_DB["Managed Cloud MySQL\\n(AWS RDS / PlanetScale)"]
    end

    BROWSER -->|"HTTP :5173"| VITE
    BROWSER <-.->|"WSS / WS (Port 5000)"| SOCKETIO
    VITE -->|"Reverse Proxy /api/* -> :5000"| EXPRESS
    EXPRESS -->|"TCP Socket :3306"| MYSQL_DB
    SOCKETIO --> EXPRESS

    CDN -.->|"HTTPS REST"| CLOUD_API
    CLOUD_API -.->|"Encrypted TLS :3306"| CLOUD_DB
`,

  '05-object-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph Snapshot["Object Diagram Snapshot: Active Seated Order Fulfillment at 19:15"]
        direction TB

        john["john : User\\nid = 1\\nname = 'John Customer'\\nemail = 'customer@viking.com'\\nrole = 'customer'"]

        res1["res1 : Reservation\\nid = 5\\ncustomer_id = 1\\nreservation_date = '2026-10-30'\\nreservation_time = '19:00:00'\\nguests = 4\\ntable_preference = 'main'\\ntable_id = 3\\nstatus = 'seated'"]

        q1["q1 : QueueEntry\\nid = 3\\nreservation_id = 5\\nqueue_number = 12\\nposition = 1\\nstatus = 'seated'"]

        tblM3["tblM3 : RestaurantTable\\nid = 3\\ntable_number = 'M3'\\ncapacity = 4\\narea = 'main'\\nstatus = 'occupied'"]

        seat1["seat1 : Seating\\nid = 7\\nreservation_id = 5\\ntable_id = 3\\nstatus = 'seated'\\nseated_at = '19:15:00'\\nleft_at = null"]

        ord1["ord1 : Order\\nid = 10\\ncustomer_id = 1\\nreservation_id = 5\\nstatus = 'preparing'\\ntotal = 1250.00\\nnotes = 'Medium rare steak'"]

        oi1["oi1 : OrderItem\\nid = 18\\norder_id = 10\\nmenu_item_id = 4\\nquantity = 2\\nunit_price = 350.00\\nsubtotal = 700.00"]

        oi2["oi2 : OrderItem\\nid = 19\\norder_id = 10\\nmenu_item_id = 8\\nquantity = 2\\nunit_price = 275.00\\nsubtotal = 550.00"]

        grill["grill : MenuItem\\nid = 4\\nname = 'Viking Ribeye Steak'\\nprice = 350.00\\ncategory = 'grill'\\navailable = true"]

        bev["bev : MenuItem\\nid = 8\\nname = 'Craft Draft Beer'\\nprice = 275.00\\ncategory = 'beverage'\\navailable = true"]
    end

    john --> res1
    res1 --> q1
    res1 --> seat1
    seat1 --> tblM3
    john --> ord1
    ord1 --> oi1
    ord1 --> oi2
    oi1 --> grill
    oi2 --> bev
    ord1 -.-> res1
`,

  '06-package-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph Root["VikingsERP System Codebase"]
        subgraph FE_PKG["frontend/"]
            subgraph FE_SRC["src/"]
                subgraph COMP_PKG["components/"]
                    N1["Navbar.jsx"]
                    N2["ProtectedRoute.jsx"]
                    N3["EmptyState.jsx"]
                end
                subgraph CTX_PKG["context/"]
                    C1["AuthContext.jsx"]
                    C2["CartContext.jsx"]
                    C3["SocketContext.jsx"]
                end
                subgraph PAGES_PKG["pages/"]
                    P_AUTH["Login.jsx\\nRegister.jsx"]
                    subgraph CUST_PAGES["customer/"]
                        PC1["Reservation.jsx"]
                        PC2["MyReservations.jsx"]
                        PC3["QueueStatus.jsx"]
                        PC4["DigitalMenu.jsx"]
                        PC5["MenuItemDetails.jsx"]
                        PC6["Cart.jsx"]
                        PC7["OrderConfirmation.jsx"]
                        PC8["OrderStatus.jsx"]
                    end
                    subgraph STAFF_PAGES["staff/"]
                        PS1["ReservationManagement.jsx"]
                        PS2["ReservationDetails.jsx"]
                        PS3["QueueManagement.jsx"]
                        PS4["TableManagement.jsx"]
                        PS5["SeatingManagement.jsx"]
                    end
                    subgraph KITCHEN_PAGES["kitchen/"]
                        PK1["OrderManagement.jsx"]
                        PK2["OrderDetails.jsx"]
                        PK3["OrderStatusManagement.jsx"]
                    end
                    subgraph MGMT_PAGES["management/"]
                        PM1["Dashboard.jsx"]
                    end
                end
                subgraph SVC_PKG["services/"]
                    S1["api.js"]
                end
                APP["App.jsx"]
                MAIN["main.jsx"]
            end
        end

        subgraph BE_PKG["backend/"]
            subgraph CFG_PKG["config/"]
                DB1["db.js"]
            end
            subgraph MW_PKG["middleware/"]
                MW1["auth.js"]
            end
            subgraph ROUTES_PKG["routes/"]
                RR1["auth.js"]
                RR2["reservations.js"]
                RR3["queue.js"]
                RR4["tables.js"]
                RR5["seating.js"]
                RR6["menu.js"]
                RR7["orders.js"]
                RR8["dashboard.js"]
            end
            subgraph SOCK_PKG["socket/"]
                SK1["index.js"]
            end
            subgraph DB_PKG["database/"]
                SCH["schema.sql"]
                SEED["seed.js"]
            end
            SRV["server.js"]
        end
    end

    PAGES_PKG ..> CTX_PKG : imports
    PAGES_PKG ..> SVC_PKG : imports
    CTX_PKG ..> SVC_PKG : imports
    SVC_PKG ..> ROUTES_PKG : HTTP /api calls
    CTX_PKG ..> SOCK_PKG : WebSocket signals
    ROUTES_PKG ..> MW_PKG : applies
    ROUTES_PKG ..> CFG_PKG : executes SQL
    SOCK_PKG ..> MW_PKG : authenticates
`,

  '07-composite-structure-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph OrderProcessing["Component: OrderProcessingSystem"]
        direction TB

        subgraph FrontendPort["Frontend Subsystem"]
            DM["DigitalMenu (Catalog Browser)"]
            MID["MenuItemDetails (Item Inspector)"]
            CART["Cart (Item Aggregator)"]
            OC["OrderConfirmation (Submission View)"]
            OS["OrderStatus (Progress Monitor)"]
        end

        subgraph InternalStatePort["Internal State Management"]
            CC["CartContext\\n- items: OrderItem[]\\n- total: Decimal\\n- addItem() · updateQuantity()"]
            SC["SocketContext\\n- socket: Socket\\n- listeners: order:update"]
        end

        subgraph BackendPort["Backend Route Controllers"]
            MENU_CTRL["menu.js Controller\\nGET /api/menu"]
            ORDER_CTRL["orders.js Controller\\nPOST /api/orders · PUT /api/orders/:id/status"]
            SOCK_DISP["Socket.IO Broker\\nemit(order:new) · emit(order:update)"]
        end

        subgraph StoragePort["Database Relational Store"]
            MI_TAB[("menu_items table")]
            O_TAB[("orders table")]
            OI_TAB[("order_items table")]
        end

        DM -->|"Query Catalog"| MENU_CTRL
        MENU_CTRL -->|"Read Records"| MI_TAB
        MID -->|"Dispatch Selection"| CC
        CART -->|"Mutate Quantities"| CC
        CC -->|"Hydrate Submission"| OC
        OC -->|"POST /api/orders"| ORDER_CTRL
        ORDER_CTRL -->|"Validate Prices"| MI_TAB
        ORDER_CTRL -->|"Insert Order Header"| O_TAB
        ORDER_CTRL -->|"Insert Line Items"| OI_TAB
        ORDER_CTRL -->|"Dispatch Signal"| SOCK_DISP
        SOCK_DISP -->|"WebSocket Push"| OS
        OS -->|"Handle Event"| SC
    end
`,

  '08-profile-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph ProfileDef["UML Profile: VikingsERPExtensions"]
        direction TB

        subgraph Stereotypes["Domain Stereotypes"]
            S1["«ReactComponent»\\nExtends: UML Component\\nTag: renderMethod = JSX\\nTag: hasState = Boolean"]
            S2["«APIRoute»\\nExtends: UML Component\\nTag: httpMethod = GET|POST|PUT|DELETE\\nTag: path = String\\nTag: authRequired = Boolean"]
            S3["«MySQLTable»\\nExtends: UML Class\\nTag: engine = InnoDB\\nTag: charset = utf8mb4"]
            S4["«JWTProtected»\\nExtends: UML Interface\\nTag: tokenExpiry = 24h\\nConstraint: RFC 6750 Bearer"]
            S5["«SocketEvent»\\nExtends: UML Signal\\nTag: direction = emit|listen\\nTag: room = String"]
            S6["«RoleGuard»\\nExtends: UML Constraint\\nTag: allowedRoles = RoleEnum[]\\nConstraint: 403 on role mismatch"]
        end

        subgraph AppliedExamples["Concrete Metaclass Applications"]
            A1["«ReactComponent»\\nCart.jsx\\nrenderMethod = JSX\\nhasState = true"]
            A2["«APIRoute»\\nPOST /api/orders\\nhttpMethod = POST\\npath = /api/orders\\nauthRequired = true"]
            A3["«MySQLTable»\\norders\\nengine = InnoDB\\ncharset = utf8mb4"]
            A4["«JWTProtected»\\nAuthentication Middleware\\ntokenExpiry = 24h"]
            A5["«SocketEvent»\\norder:new\\ndirection = emit\\nroom = kitchen"]
            A6["«RoleGuard»\\nDashboard Access Guard\\nallowedRoles = [management, reservation_staff]"]
        end
    end

    S1 -.-> A1
    S2 -.-> A2
    S3 -.-> A3
    S4 -.-> A4
    S5 -.-> A5
    S6 -.-> A6
`,

  '09-data-flow-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph Entities["External Entities"]
        E1["Customer"]
        E2["Reservation Staff"]
        E3["Service/Kitchen Staff"]
        E4["Management"]
    end

    subgraph Processes["System Processes (Level 1 DFD)"]
        P1("1.0 Manage Table Reservations")
        P2("2.0 Manage Queue & Seating")
        P3("3.0 Manage Digital Menu")
        P4("4.0 Process Customer Orders")
        P5("5.0 Fulfill Kitchen Orders")
        P6("6.0 Monitor Operational Telemetry")
    end

    subgraph DataStores["Data Stores"]
        DS1[("D1: users")]
        DS2[("D2: reservations")]
        DS3[("D3: queue_entries")]
        DS4[("D4: restaurant_tables & seating")]
        DS5[("D5: menu_items")]
        DS6[("D6: orders")]
        DS7[("D7: order_items")]
    end

    E1 -->|"Booking Submission"| P1
    P1 -->|"Verify Identity"| DS1
    P1 -->|"Write / Read Booking"| DS2
    P1 -->|"New Booking Signal"| E2
    E2 -->|"Approval / Triage Action"| P1
    P1 -->|"Booking Confirmation"| E1

    P1 -->|"Approved Reservation ID"| P2
    P2 -->|"Record Queue Placement"| DS3
    P2 -->|"Assign Dining Table"| DS4
    P2 -->|"Waitlist Alerts (WebSocket)"| E1
    E2 -->|"Queue & Seating Mutations"| P2

    E1 -->|"Browse Menu Catalog"| P3
    P3 -->|"Fetch Active Dishes"| DS5
    P3 -->|"Display Menu Details"| E1
    E4 -->|"Catalog Add/Edit/Delete"| P3
    P3 -->|"Update Menu Records"| DS5

    E1 -->|"Submit Order Payload"| P4
    P4 -->|"Validate Availability & Pricing"| DS5
    P4 -->|"Store Order Header"| DS6
    P4 -->|"Store Line Items"| DS7
    P4 -->|"Push Ticket (order:new)"| E3

    E3 -->|"Advance Preparation Status"| P5
    P5 -->|"Update Ticket Record"| DS6
    P5 -->|"Live Status Signal (order:update)"| E1

    E4 -->|"Request Operational Metrics"| P6
    DS2 & DS3 & DS4 & DS6 -->|"Read Aggregate Data"| P6
    P6 -->|"Render Visual Metrics"| E4
`,

  '10-use-case-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph LR
    C["Customer"]
    RS["Reservation Staff"]
    KS["Service/Kitchen Staff"]
    MG["Management"]

    subgraph SystemBoundary["VikingsERP System Boundary"]
        UC_AUTH(["Register / Login"])
        
        subgraph Mod1["Module 1: Reservation & Queue Management"]
            UC1(["Create Reservation"])
            UC2(["View My Reservations"])
            UC3(["Track Queue Status"])
            UC10(["Manage Reservations (Approve/Reject)"])
            UC11(["Inspect Reservation Details"])
            UC12(["Manage Queue (Call/Reposition)"])
            UC13(["Manage Tables (Floor Inventory)"])
            UC14(["Assign Seating & Free Tables"])
        end

        subgraph Mod2["Module 2: Digital Menu & Ordering"]
            UC4(["Browse Digital Menu"])
            UC5(["View Menu Item Details"])
            UC6(["Manage Shopping Cart"])
            UC7(["Submit & Confirm Order"])
            UC8(["Track Order Status"])
            UC15(["Manage Kitchen Orders"])
            UC16(["Inspect Order Line Items"])
            UC17(["Update Order Status (Prep/Ready/Complete)"])
        end

        subgraph ModMgmt["Executive Management Subsystem"]
            UC18(["Monitor Operational Dashboard"])
            UC19(["Manage Menu Catalog (CRUD)"])
        end
    end

    C --- UC_AUTH
    C --- UC1
    C --- UC2
    C --- UC3
    C --- UC4
    C --- UC5
    C --- UC6
    C --- UC7
    C --- UC8

    RS --- UC_AUTH
    RS --- UC10
    RS --- UC11
    RS --- UC12
    RS --- UC13
    RS --- UC14
    RS --- UC18

    KS --- UC_AUTH
    KS --- UC15
    KS --- UC16
    KS --- UC17

    MG --- UC_AUTH
    MG --- UC10
    MG --- UC12
    MG --- UC13
    MG --- UC14
    MG --- UC18
    MG --- UC19
`,

  '11-activity-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    START(("● Start")) --> Login["Customer Authenticates (JWT Token Issued)"]
    Login --> Browse["Customer Browses Digital Menu Catalog"]
    Browse --> ViewItem["Inspect Menu Item Details & Options"]
    ViewItem --> AddDecision{"Add Dish to Cart?"}
    
    AddDecision -->|"Yes"| AddToCart["Append Item to CartContext (Update Subtotal)"]
    AddDecision -->|"No"| BrowseMore
    
    AddToCart --> BrowseMore{"Browse More Items?"}
    BrowseMore -->|"Yes"| Browse
    BrowseMore -->|"No"| ReviewCart["Open Cart Interface (/cart)"]

    ReviewCart --> ModifyDecision{"Modify Items or Quantities?"}
    ModifyDecision -->|"Yes"| UpdateQty["Adjust Quantities or Remove Line Items"]
    UpdateQty --> ReviewCart
    ModifyDecision -->|"No"| Checkout["Proceed to Order Confirmation (/order-confirmation)"]

    Checkout --> SubmitOrder["Confirm Order & Submit (POST /api/orders)"]
    SubmitOrder --> ServerValidation["Server: Validate Item Availability & Prices"]
    
    ServerValidation --> ValidDecision{"Validation Passed?"}
    ValidDecision -->|"No"| DisplayError["Display Error Alert (400 Bad Request)"]
    DisplayError --> ReviewCart

    ValidDecision -->|"Yes"| PersistOrder["Insert Header into 'orders' & Rows into 'order_items'"]
    PersistOrder --> SocketBroadcast["Emit 'order:new' to Kitchen Room"]
    
    SocketBroadcast --> ShowConfirmed["Customer UI: Clear Cart & Navigate to /order-status"]
    SocketBroadcast --> KitchenBoard["Kitchen Display: Ticket Appears Live"]

    KitchenBoard --> StartPrep["Kitchen Staff Starts Cooking (PUT status = 'preparing')"]
    StartPrep --> EmitPrep["Server Emits 'order:update' (preparing)"]
    EmitPrep --> CustTracking1["Customer Step Bar: 'Preparing' Highlighted"]

    CustTracking1 --> FinishCook["Kitchen Completes Cooking (PUT status = 'ready')"]
    FinishCook --> EmitReady["Server Emits 'order:update' (ready)"]
    EmitReady --> CustTracking2["Customer Step Bar: 'Ready' Highlighted"]

    CustTracking2 --> ServeFood["Staff Serves Food to Customer Dining Table"]
    ServeFood --> MarkComplete["Staff Concludes Order (PUT status = 'completed')"]
    MarkComplete --> EmitComplete["Server Emits 'order:update' (completed)"]
    EmitComplete --> FinalProgress["Customer Step Bar: 'Completed'"]
    FinalProgress --> END(("◉ Final Node"))
`,

  '12-sequence-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'nodeBorder':'#000000', 'actorBorder':'#000000', 'actorBkg':'#ffffff', 'actorTextColor':'#000000' }}}%%
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant React as React Frontend (OrderConfirmation.jsx)
    participant Axios as Axios API Client (api.js)
    participant Express as Express Server (server.js)
    participant AuthMW as JWT Middleware (auth.js)
    participant OrderCtrl as Orders Controller (orders.js)
    participant MySQL as MySQL Database (resquedb)
    participant SocketIO as Socket.IO Broker (socket/index.js)
    participant Kitchen as Kitchen Display UI (OrderManagement.jsx)

    Customer->>React: Click "Confirm & Place Order"
    React->>React: Retrieve CartContext items & format payload
    React->>Axios: POST /api/orders {items, reservation_id, notes}
    Axios->>Express: HTTP POST /api/orders with Bearer JWT
    Express->>AuthMW: authenticate(req, res, next)
    AuthMW-->>Express: Token Verified (req.user = decoded)
    Express->>OrderCtrl: Invoke POST handler

    loop Validate Each Cart Item
        OrderCtrl->>MySQL: SELECT * FROM menu_items WHERE id = ?
        MySQL-->>OrderCtrl: Return price & available flag
        OrderCtrl->>OrderCtrl: Verify available == true & compute line subtotal
    end

    OrderCtrl->>MySQL: INSERT INTO orders (customer_id, reservation_id, total, notes)
    MySQL-->>OrderCtrl: Return insertId (order_id)

    loop Insert Order Line Items
        OrderCtrl->>MySQL: INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal)
        MySQL-->>OrderCtrl: Row Inserted OK
    end

    OrderCtrl->>MySQL: SELECT order joined with customer & items
    MySQL-->>OrderCtrl: Return committed order payload

    OrderCtrl->>SocketIO: io.to('kitchen').emit('order:new', orderPayload)
    SocketIO-->>Kitchen: Push WebSocket message 'order:new'
    Kitchen->>Kitchen: Prepend new ticket to active orders board

    OrderCtrl-->>Express: Send HTTP 201 Created {message, order}
    Express-->>Axios: HTTP 201 Response Payload
    Axios-->>React: Promise resolved with order data
    React->>React: clearCart() via CartContext
    React-->>Customer: Navigate to /order-status (Display live tracker)
`,

  '13-state-machine-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'nodeBorder':'#000000' }}}%%
stateDiagram-v2
    state "Reservation Lifecycle" as ResLifecycle {
        [*] --> Res_Pending : Customer Submits Booking Form
        
        Res_Pending --> Res_Approved : Staff Approves Request
        Res_Pending --> Res_Cancelled : Customer / Staff Cancels Booking
        
        Res_Approved --> Res_Queued : Staff Enqueues Party (Queue Record Created)
        Res_Approved --> Res_Cancelled : Customer Cancels Booking
        
        Res_Queued --> Res_Seated : Party Called & Assigned to Table
        Res_Queued --> Res_NoShow : Customer Fails to Arrive
        Res_Queued --> Res_Cancelled : Customer Leaves Waitlist
        
        Res_Seated --> Res_Completed : Customer Departs / Seating Finished
        
        Res_Completed --> [*]
        Res_Cancelled --> [*]
        Res_NoShow --> [*]
    }

    state "Queue Waitlist Lifecycle" as QueueLifecycle {
        [*] --> Q_Waiting : Reservation Transitions to Queued
        Q_Waiting --> Q_Waiting : Staff Adjusts Priority Position (moveUp / moveDown)
        Q_Waiting --> Q_Called : Table Becomes Available (Staff Calls Party)
        Q_Called --> Q_Seated : Party Acknowledges & Occupies Dining Table
        Q_Called --> Q_NoShow : Call Timeout Expired
        Q_Waiting --> Q_Cancelled : Booking Cancelled
        
        Q_Seated --> [*]
        Q_NoShow --> [*]
        Q_Cancelled --> [*]
    }

    state "Order Fulfillment Lifecycle" as OrderLifecycle {
        [*] --> Ord_Pending : Customer Submits Order (/order-confirmation)
        
        Ord_Pending --> Ord_Preparing : Kitchen Staff Accepts Ticket (Start Cook)
        Ord_Pending --> Ord_Cancelled : Staff / Customer Cancels Order
        
        Ord_Preparing --> Ord_Ready : Kitchen Staff Concludes Cooking
        Ord_Preparing --> Ord_Cancelled : Kitchen Cancels (Out of Ingredients)
        
        Ord_Ready --> Ord_Completed : Waitstaff Delivers Dish to Table
        
        Ord_Completed --> [*]
        Ord_Cancelled --> [*]
    }
`,

  '14-communication-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph LR
    Customer["1.0 : Customer Web Browser"]
    ReactApp["2.0 : React App (OrderConfirmation)"]
    Axios["3.0 : Axios HTTP Client"]
    ExpressAPI["4.0 : Express Server Gateway"]
    AuthMW["5.0 : JWT Auth Middleware"]
    OrdersCtrl["6.0 : Orders Controller"]
    MySQL["7.0 : MySQL Database"]
    SocketBroker["8.0 : Socket.IO Broker"]
    KitchenBoard["9.0 : Kitchen Display UI"]

    Customer -->|"1: Click Confirm Order"| ReactApp
    ReactApp -->|"2: Extract cart items"| ReactApp
    ReactApp -->|"3: POST /api/orders"| Axios
    Axios -->|"4: HTTP Request + Bearer Token"| ExpressAPI
    ExpressAPI -->|"5: authenticate()"| AuthMW
    AuthMW -->|"6: req.user validated"| ExpressAPI
    ExpressAPI -->|"7: handleCreateOrder()"| OrdersCtrl
    OrdersCtrl -->|"8: SELECT menu_items"| MySQL
    MySQL -->|"9: MenuItem records"| OrdersCtrl
    OrdersCtrl -->|"10: INSERT orders"| MySQL
    MySQL -->|"11: order_id"| OrdersCtrl
    OrdersCtrl -->|"12: INSERT order_items"| MySQL
    OrdersCtrl -->|"13: emit('order:new')"| SocketBroker
    SocketBroker -->|"14: push to kitchen room"| KitchenBoard
    OrdersCtrl -->|"15: 201 Created"| ExpressAPI
    ExpressAPI -->|"16: JSON order payload"| Axios
    Axios -->|"17: Resolve promise"| ReactApp
    ReactApp -->|"18: Redirect to /order-status"| Customer
`,

  '15-interaction-overview-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    START(("● Start")) --> REF_AUTH

    subgraph REF_AUTH["ref: Customer Authentication Sequence"]
        direction TB
        A1["Enter Credentials -> POST /api/auth/login"]
        A2["Issue RFC 6750 Bearer JWT"]
        A3["Establish Socket.IO Handshake Session"]
    end

    REF_AUTH --> DEC_RES{"Has Confirmed Table Booking?"}

    DEC_RES -->|"No"| REF_RES
    subgraph REF_RES["ref: Reservation & Queue Sequence"]
        direction TB
        B1["Submit Booking (POST /api/reservations)"]
        B2["Staff Review & Enqueue (PUT status = queued)"]
        B3["Monitor Waitlist via Socket.IO (queue:update)"]
        B4["Staff Calls Party & Allocates Dining Table"]
        B5["Assign Table & Update Seating (POST /api/seating)"]
    end

    DEC_RES -->|"Yes / Walk-in Seated"| REF_MENU
    REF_RES --> REF_MENU

    subgraph REF_MENU["ref: Menu Exploration & Cart Sequence"]
        direction TB
        C1["Query Catalog (GET /api/menu?category=...)"]
        C2["Inspect Dish Details & Allergens"]
        C3["Mutate In-Memory CartContext"]
    end

    REF_MENU --> REF_ORDER

    subgraph REF_ORDER["ref: Order Submission Sequence"]
        direction TB
        D1["Review Cart & Instructions (/order-confirmation)"]
        D2["Submit Order (POST /api/orders)"]
        D3["Server Pricing Validation & Database Insert"]
        D4["Emit 'order:new' to Kitchen Socket Room"]
    end

    REF_ORDER --> REF_KITCHEN

    subgraph REF_KITCHEN["ref: Kitchen Fulfillment Sequence"]
        direction TB
        E1["Kitchen Receives Real-Time Order Ticket"]
        E2["Update Status to 'preparing' (PUT status)"]
        E3["Emit 'order:update' -> Customer Live Progress"]
        E4["Update Status to 'ready' -> Waitstaff Notified"]
    end

    REF_KITCHEN --> REF_COMPLETE

    subgraph REF_COMPLETE["ref: Dining Conclusion Sequence"]
        direction TB
        F1["Deliver Food to Table"]
        F2["Update Order Status to 'completed'"]
        F3["Conclude Seating & Release Table (PUT /seating/:id/finish)"]
    end

    REF_COMPLETE --> END(("◉ Final Node"))
`,

  '16-timing-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'defaultLinkColor':'#000000' }}}%%
gantt
    title VikingsERP Illustrative Timeline: Customer Visit Lifecycle (18:00 - 19:35)
    dateFormat HH:mm
    axisFormat %H:%M

    section Reservation Lifecycle
    pending (Form Submitted)       :res1, 18:00, 15m
    approved (Staff Triage)        :res2, after res1, 10m
    queued (Waitlist Active)       :res3, after res2, 20m
    called (Host Stand Alert)      :res4, after res3, 5m
    seated (Table Occupied)        :res5, after res4, 45m

    section Order Lifecycle
    Menu Browsing & Cart           :ord1, 18:50, 10m
    pending (Order Placed)         :ord2, after ord1, 2m
    preparing (Kitchen Cooking)    :ord3, after ord2, 20m
    ready (Plated for Service)     :ord4, after ord3, 5m
    completed (Served & Consumed)  :ord5, after ord4, 8m

    section Table M3 Physical State
    available (Idle Floor)         :tbl1, 18:00, 50m
    occupied (Party Dining)        :tbl2, after tbl1, 45m

    section Real-Time Socket Signals
    queue:update (Enqueued)        :sock1, 18:25, 1m
    queue:update (Called Alert)    :sock2, 18:45, 1m
    order:new (Kitchen Ticket)     :sock3, 19:02, 1m
    order:update (Preparing)       :sock4, 19:04, 1m
    order:update (Ready)           :sock5, 19:24, 1m
`,

  '17-requirement-diagram': `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'clusterBkg':'#ffffff', 'clusterBorder':'#000000', 'defaultLinkColor':'#000000', 'nodeBorder':'#000000' }}}%%
graph TB
    subgraph POSReqs["POS & Ordering Functional Requirements"]
        REQ_POS_1["«requirement»\\nREQ-POS-001: Order Processing\\nId: 101\\nText: The system shall enable authenticated customers to browse the digital menu, manage shopping cart quantities, and submit food orders."]
        REQ_POS_2["«requirement»\\nREQ-POS-002: Server-Side Billing Calculation\\nId: 102\\nText: The system shall automatically compute order totals and line subtotals based on database menu prices to prevent client tampering."]
        REQ_POS_3["«requirement»\\nREQ-POS-003: Real-Time Order Tracking\\nId: 103\\nText: The system shall broadcast live order preparation status updates to customer devices via WebSocket connections."]
        REQ_POS_4["«requirement»\\nREQ-POS-004: Kitchen Ticket Management\\nId: 104\\nText: The system shall display incoming tickets to kitchen personnel and support status progression (pending -> preparing -> ready -> completed)."]
        REQ_POS_5["«requirement»\\nREQ-POS-005: Payment Gateway Settlement\\nId: 105\\nText: (PROPOSED) The system shall process digital payments (GCash, Maya, Credit Card) upon order conclusion."]
        REQ_POS_6["«requirement»\\nREQ-POS-006: Fiscal Receipt Printing\\nId: 106\\nText: (PROPOSED) The system shall generate official BIR-compliant sales receipts via thermal ESC/POS hardware."]
    end

    subgraph InvReqs["Inventory & Menu Functional Requirements"]
        REQ_INV_1["«requirement»\\nREQ-INV-001: Menu Catalog Management\\nId: 201\\nText: The system shall maintain dishes categorized by dining course with price, description, and availability flags."]
        REQ_INV_2["«requirement»\\nREQ-INV-002: Real-Time Availability Toggling\\nId: 202\\nText: The system shall allow authorized management staff to instantly toggle menu item availability."]
        REQ_INV_3["«requirement»\\nREQ-INV-003: Recipe-Based Stock Depletion\\nId: 203\\nText: (PROPOSED) The system shall deduct raw ingredient inventory quantities upon customer order confirmation."]
        REQ_INV_4["«requirement»\\nREQ-INV-004: Supplier Catalog Management\\nId: 204\\nText: (PROPOSED) The system shall record raw material supplier profiles, contracts, and contact directories."]
        REQ_INV_5["«requirement»\\nREQ-INV-005: Automated Purchase Requisitions\\nId: 205\\nText: (PROPOSED) The system shall generate purchase orders to suppliers when stock levels reach reorder thresholds."]
        REQ_INV_6["«requirement»\\nREQ-INV-006: Low-Stock Automated Alerts\\nId: 206\\nText: (PROPOSED) The system shall push alerts to kitchen management when ingredient stock falls below safety limits."]
    end

    subgraph ImplComponents["Implementing System Components"]
        COMP_CART["frontend/src/pages/customer/Cart.jsx\\nfrontend/src/context/CartContext.jsx"]
        COMP_ORDER_CTRL["backend/routes/orders.js Controller\\nPOST /api/orders"]
        COMP_SOCKET["backend/socket/index.js\\nfrontend/src/context/SocketContext.jsx"]
        COMP_KITCHEN_UI["frontend/src/pages/kitchen/OrderManagement.jsx\\nOrderStatusManagement.jsx"]
        COMP_MENU_CTRL["backend/routes/menu.js Controller\\nGET/POST/PUT /api/menu"]
        COMP_DB["MySQL Database Schema: resquedb\\norders · order_items · menu_items"]
    end

    REQ_POS_1 -->|"«satisfy»"| COMP_CART
    REQ_POS_2 -->|"«satisfy»"| COMP_ORDER_CTRL
    REQ_POS_3 -->|"«satisfy»"| COMP_SOCKET
    REQ_POS_4 -->|"«satisfy»"| COMP_KITCHEN_UI
    REQ_INV_1 -->|"«satisfy»"| COMP_MENU_CTRL
    REQ_INV_2 -->|"«satisfy»"| COMP_MENU_CTRL

    REQ_POS_1 -->|"«deriveReqt»"| REQ_POS_2
    REQ_POS_2 -->|"«deriveReqt»"| REQ_POS_3
    REQ_POS_4 -->|"«deriveReqt»"| REQ_POS_5
    REQ_POS_5 -->|"«deriveReqt»"| REQ_POS_6
    REQ_INV_1 -->|"«deriveReqt»"| REQ_INV_2
    REQ_INV_1 -->|"«deriveReqt»"| REQ_INV_3
    REQ_INV_3 -->|"«deriveReqt»"| REQ_INV_6
    REQ_INV_4 -->|"«deriveReqt»"| REQ_INV_5

    COMP_ORDER_CTRL -->|"«verify»"| REQ_POS_2
    COMP_DB -->|"«verify»"| REQ_INV_1
`
};

for (const [id, mmdContent] of Object.entries(sources)) {
  const filePath = path.join(baseDir, id, `${id}.mmd`);
  fs.writeFileSync(filePath, mmdContent.trim() + '\n', 'utf8');
  console.log(`Saved ${filePath}`);
}

console.log('All 17 .mmd files written successfully.');

