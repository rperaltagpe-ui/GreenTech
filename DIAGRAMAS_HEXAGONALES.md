# 🔷 Diagramas Hexagonales - GreenTech Architecture

## Diagrama 1: Hexágono Interactivo (Mermaid)

```mermaid
graph TB
    Center["<b>🌍 GreenTech<br/>Arquitectura Hexagonal</b>"]
    
    subgraph Presentation["📱 PRESENTATION<br/>LAYER"]
        P1["Frontend HTML/CSS"]
        P2["app-sqlite.js"]
        P3["index.html"]
    end
    
    subgraph Application["⚙️ APPLICATION<br/>LAYER"]
        A1["Gestión Estado"]
        A2["Casos de Uso"]
        A3["Eventos"]
    end
    
    subgraph Gateway["🌐 API GATEWAY<br/>EXPRESS.JS"]
        G1["REST API"]
        G2["Auth Middleware"]
        G3["CORS"]
    end
    
    subgraph Database["💾 DATABASE<br/>SQLITE3"]
        D1["users"]
        D2["sessions"]
        D3["kpis"]
        D4["alerts"]
    end
    
    subgraph Infrastructure["🔧 INFRASTRUCTURE"]
        I1["Configuración"]
        I2["Utilidades"]
        I3["Helpers"]
    end
    
    subgraph Domain["📋 DOMAIN<br/>RULES"]
        B1["Validaciones"]
        B2["Entidades"]
        B3["Business Logic"]
    end
    
    Center -.-> Presentation
    Center -.-> Application
    Center -.-> Gateway
    Center -.-> Database
    Center -.-> Infrastructure
    Center -.-> Domain
    
    Presentation <--> Application
    Application <--> Gateway
    Gateway <--> Database
    Database <--> Infrastructure
    Infrastructure <--> Domain
    Domain <--> Presentation
    
    style Presentation fill:#4a90e2,stroke:#2c5aa0,stroke-width:3px,color:#fff
    style Application fill:#7b68ee,stroke:#5a4fa5,stroke-width:3px,color:#fff
    style Gateway fill:#50c878,stroke:#2d7a4a,stroke-width:3px,color:#fff
    style Database fill:#ff6b6b,stroke:#cc5555,stroke-width:3px,color:#fff
    style Infrastructure fill:#ffa500,stroke:#cc8400,stroke-width:3px,color:#fff
    style Domain fill:#9b59b6,stroke:#6c3d7f,stroke-width:3px,color:#fff
    style Center fill:#f0f0f0,stroke:#333,stroke-width:2px,color:#000
```

---

## Diagrama 2: Flujo de Datos (Vertical)

```mermaid
graph TD
    U["👤 Usuario Final"]
    U -->|"Ingresa credenciales<br/>(Admin123/admin123)"| P["📱 PRESENTATION<br/>index.html"]
    
    P -->|"Evento: Click Login"| A["⚙️ APPLICATION<br/>Gestión Estado"]
    
    A -->|"POST /api/auth/login"| G["🌐 API GATEWAY<br/>Express.js"]
    
    G -->|"SELECT users WHERE"| DB["💾 DATABASE<br/>SQLite3"]
    
    DB -->|"Usuario encontrado"| G
    
    G -->|"Genera Token"| GA["🔧 INFRASTRUCTURE<br/>crypto.randomBytes"]
    
    GA -->|"INSERT sessions"| DB
    
    DB -->|"Token guardado"| G
    
    G -->|"JSON {token}"| A
    
    A -->|"localStorage.setItem"| I["💾 localStorage<br/>Browser"]
    
    A -->|"Renderiza Dashboard"| P
    
    P -->|"Muestra KPIs, Alertas, Gráficos"| U
    
    style U fill:#e8f4f8,stroke:#333
    style P fill:#4a90e2,stroke:#2c5aa0,stroke-width:2px,color:#fff
    style A fill:#7b68ee,stroke:#5a4fa5,stroke-width:2px,color:#fff
    style G fill:#50c878,stroke:#2d7a4a,stroke-width:2px,color:#fff
    style DB fill:#ff6b6b,stroke:#cc5555,stroke-width:2px,color:#fff
    style GA fill:#ffa500,stroke:#cc8400,stroke-width:2px,color:#fff
    style I fill:#f0f0f0,stroke:#333
```

---

## Diagrama 3: Arquitectura de Carpetas

```mermaid
graph LR
    ROOT["GreeTech/<br/>Proyecto Principal"]
    
    ROOT --> SERVER["server.js<br/>API Gateway<br/>Express.js"]
    ROOT --> DB_LAYER["database-sqlite3.js<br/>Database Layer<br/>SQLite Access"]
    ROOT --> DB_FILE["greentech.db<br/>SQLite Database<br/>Persistencia"]
    ROOT --> SCHEMA["schema.sql<br/>Database Schema<br/>7 Tablas"]
    ROOT --> HTML["index.html<br/>Presentation<br/>HTML Structure"]
    ROOT --> JS["app-sqlite.js<br/>Application Layer<br/>Frontend Logic"]
    ROOT --> CSS["style.css<br/>Infrastructure<br/>Styles"]
    ROOT --> PKG["package.json<br/>Dependencies<br/>npm config"]
    
    SERVER -->|"usa"| DB_LAYER
    JS -->|"fetch"| SERVER
    HTML -->|"load"| JS
    HTML -->|"load"| CSS
    PKG -->|"configura"| SERVER
    
    style SERVER fill:#50c878,stroke:#2d7a4a,stroke-width:2px,color:#fff
    style DB_LAYER fill:#ff6b6b,stroke:#cc5555,stroke-width:2px,color:#fff
    style DB_FILE fill:#ff6b6b,stroke:#cc5555,stroke-width:2px,color:#fff
    style SCHEMA fill:#ff6b6b,stroke:#cc5555,stroke-width:2px,color:#fff
    style HTML fill:#4a90e2,stroke:#2c5aa0,stroke-width:2px,color:#fff
    style JS fill:#7b68ee,stroke:#5a4fa5,stroke-width:2px,color:#fff
    style CSS fill:#ffa500,stroke:#cc8400,stroke-width:2px,color:#fff
    style PKG fill:#9b59b6,stroke:#6c3d7f,stroke-width:2px,color:#fff
    style ROOT fill:#f0f0f0,stroke:#333,stroke-width:2px
```

---

## Diagrama 4: Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant F as 📱 Frontend<br/>app-sqlite.js
    participant A as 🌐 API<br/>server.js
    participant D as 💾 Database<br/>SQLite3
    
    U->>F: Ingresa Admin123/admin123
    F->>F: Valida formato
    F->>A: POST /api/auth/login<br/>{username, password}
    
    A->>A: Recibe request
    A->>D: SELECT * FROM users<br/>WHERE username=? AND password=?
    D-->>A: Usuario encontrado {id, username}
    
    A->>A: Genera token:<br/>crypto.randomBytes(32)
    A->>D: INSERT INTO sessions<br/>(user_id, session_token)
    D-->>A: Session creada
    
    A-->>F: JSON {token, userId, username}
    F->>F: localStorage.setItem<br/>('greentechToken')
    F->>F: Renderiza Dashboard
    F-->>U: Muestra interfaz principal
    
    Note over A,D: Token guardado en sesión activa
    Note over F: Token listo para próximas requests
```

---

## Diagrama 5: Componentes y Endpoints

```mermaid
graph LR
    API["🌐 API EXPRESS.JS<br/>http://localhost:3000"]
    
    AUTH["🔐 Auth Module"]
    KPI["📊 KPI Module"]
    CHART["📈 Chart Module"]
    ALERT["⚠️ Alert Module"]
    STATE["⚙️ State Module"]
    
    API --> AUTH
    API --> KPI
    API --> CHART
    API --> ALERT
    API --> STATE
    
    AUTH -->|"/api/auth/login (POST)"| LOGIN["Login"]
    AUTH -->|"/api/auth/logout (POST)"| LOGOUT["Logout"]
    AUTH -->|"/api/auth/verify (GET)"| VERIFY["Verify Token"]
    
    KPI -->|"/api/kpis (GET)"| GETKPI["Get KPIs"]
    KPI -->|"/api/kpis (PUT)"| PUTKPI["Update KPIs"]
    
    CHART -->|"/api/chart-data (GET)"| GETCHART["Get Chart Data"]
    CHART -->|"/api/chart-data (PUT)"| PUTCHART["Update Chart Data"]
    
    ALERT -->|"/api/alerts (GET)"| GETALERT["Get Alerts"]
    ALERT -->|"/api/alerts (POST)"| POSTALERT["Add Alert"]
    ALERT -->|"/api/alerts/:id (DELETE)"| DELALERT["Delete Alert"]
    
    STATE -->|"/api/app-state (GET)"| GETSTATE["Get State"]
    STATE -->|"/api/app-state (PUT)"| PUTSTATE["Update State"]
    
    style API fill:#f0f0f0,stroke:#333,stroke-width:2px
    style AUTH fill:#4a90e2,stroke:#2c5aa0,stroke-width:2px,color:#fff
    style KPI fill:#50c878,stroke:#2d7a4a,stroke-width:2px,color:#fff
    style CHART fill:#7b68ee,stroke:#5a4fa5,stroke-width:2px,color:#fff
    style ALERT fill:#ff6b6b,stroke:#cc5555,stroke-width:2px,color:#fff
    style STATE fill:#ffa500,stroke:#cc8400,stroke-width:2px,color:#fff
```

---

## Diagrama 6: Stack Tecnológico por Capa

```mermaid
graph TB
    subgraph Frontend["FRONTEND (Presentation)"]
        H["HTML5"]
        C["CSS3"]
        JS["JavaScript ES6+"]
        CHART["Chart.js"]
        LEAFLET["Leaflet.js"]
    end
    
    subgraph Backend["BACKEND (API Gateway)"]
        NODE["Node.js v24.18.0"]
        EXPRESS["Express.js ^4.18.2"]
        CORS["CORS Middleware"]
    end
    
    subgraph Storage["DATA (Database)"]
        SQLITE["SQLite3 ^5.1.6"]
        SCHEMA["Schema.sql"]
        ASYNC["Async/Await Wrapper"]
    end
    
    subgraph Tools["TOOLS & CONFIG"]
        NPM["npm v11.16.0"]
        NODEMON["Nodemon ^3.1.14"]
        PACKAGE["package.json"]
    end
    
    Frontend --> Backend
    Backend --> Storage
    Tools -.-> Backend
    
    style Frontend fill:#4a90e2,stroke:#2c5aa0,stroke-width:2px,color:#fff
    style Backend fill:#50c878,stroke:#2d7a4a,stroke-width:2px,color:#fff
    style Storage fill:#ff6b6b,stroke:#cc5555,stroke-width:2px,color:#fff
    style Tools fill:#ffa500,stroke:#cc8400,stroke-width:2px,color:#fff
```

---

## Cómo Usar Estos Diagramas

1. **En GitHub**: Los diagramas Mermaid se renderizan automáticamente en README.md
2. **En Gemini**: Copia el código Mermaid y pide "mejora este diagrama" o "conviertelo a imagen"
3. **En Obsidian/Notion**: Usa bloques de código con lenguaje `mermaid`
4. **Exportar a PNG**: Usa [mermaid.live](https://mermaid.live) para exportar

---

## Exportar a Imagen

1. Abre https://mermaid.live
2. Copia y pega cualquier diagrama arriba
3. Click en "Download" → PNG/SVG
4. Guarda en tu carpeta del proyecto

---

**Todos estos diagramas representan la arquitectura hexagonal del GreenTech con diferentes perspectivas para mejor comprensión.**
