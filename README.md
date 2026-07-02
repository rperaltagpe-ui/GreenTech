# 🌍 GreenTech Amazon Systems
## Control de Misión - Monitoreo Ambiental Avanzado

Sistema integral de monitoreo ambiental y telemetría satelital para protección de biomas amazónicos con arquitectura hexagonal, SQLite persistente y API REST.

---

## 📊 Arquitectura del Sistema

### Componentes en Hexágono (Gemini/Mermaid)

Para generar un diagrama hexagonal con Gemini, usa este prompt:

> "Crea un diagrama hexagonal que muestre los 6 componentes principales del sistema GreenTech:
> 1. PRESENTATION (Frontend - HTML/CSS/JS)
> 2. APPLICATION (Lógica de negocio - app-sqlite.js)
> 3. API GATEWAY (Express.js - Rutas y middleware)
> 4. INFRASTRUCTURE (Configuración y utilidades)
> 5. DOMAIN (Entidades y reglas de negocio)
> 6. DATABASE (SQLite3 - Persistencia)
> 
> Coloca cada componente en una esquina del hexágono, con flechas que muestren la comunicación entre capas. El centro debe decir 'GreenTech Sistema Hexagonal'."

### Diagrama ASCII del Hexágono
```
                    ┌─────────────────────┐
                    │  PRESENTATION       │
                    │  (Frontend)         │
                    │  HTML/CSS/JS        │
                    └────────┬────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────────┐    ┌────▼────────┐    ┌────▼────────┐
    │APPLICATION  │    │ API GATEWAY │    │INFRASTRUCTURE
    │(Business)   │    │ (Express)   │    │ (Config)    │
    └────┬────────┘    └────┬────────┘    └────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────▼────────┐
                    │ DOMAIN LAYER    │
                    │ (Rules/Entities)│
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────┐
                    │ DATABASE (SQLite3)      │
                    │ - Persistencia Completa │
                    └─────────────────────────┘
```

---

## 🏗️ Componentes del Sistema

### 1. **PRESENTATION LAYER** (Frontend)
- **Archivo**: `index.html`, `app-sqlite.js`, `style.css`
- **Responsabilidad**: Interfaz de usuario
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+
- **Características**: 
  - UI responsive
  - Chart.js para gráficos
  - Leaflet.js para mapas
  - Autenticación de usuario

### 2. **APPLICATION LAYER**
- **Archivo**: `app-sqlite.js` (función `application`)
- **Responsabilidad**: Orquestación de casos de uso
- **Características**:
  - Gestión de estado
  - Renderizado de componentes
  - Manejo de eventos
  - Lógica de negocio cliente

### 3. **API GATEWAY** (Express.js)
- **Archivo**: `server.js`
- **Responsabilidad**: Exposición de API REST
- **Rutas**:
  - `/api/auth/*` - Autenticación
  - `/api/kpis` - Métricas
  - `/api/chart-data` - Gráficos
  - `/api/alerts` - Alertas
  - `/api/app-state` - Estado
  - `/api/status` - Salud del servidor
- **Middleware**:
  - `authenticateToken` - Validación de sesión
  - `express.json()` - Parseo de JSON
  - `cors()` - Control de origen

### 4. **INFRASTRUCTURE LAYER**
- **Archivo**: `index.html`, `style.css`
- **Responsabilidad**: Adaptadores externos
- **Incluye**:
  - DOM manipulation
  - localStorage
  - Configuración de servidor
  - Utilidades y helpers

### 5. **DOMAIN LAYER**
- **Archivo**: `app-sqlite.js` (función `domain`)
- **Responsabilidad**: Reglas de negocio
- **Incluye**:
  - Estados por defecto
  - KPIs
  - Alertas
  - Datos de gráficos
  - Validaciones

### 6. **DATABASE LAYER** (SQLite3)
- **Archivo**: `database-sqlite3.js`, `greentech.db`, `schema.sql`
- **Responsabilidad**: Persistencia de datos
- **Tablas**:
  - `users` - Credenciales
  - `sessions` - Tokens activos
  - `kpis` - Métricas
  - `alerts` - Alertas
  - `chart_data` - Datos de gráficos
  - `app_state` - Estado persistente
  - `reports` - Reportes

---

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa credenciales (Admin123/admin123)
   ↓
2. Frontend envía POST a /api/auth/login
   ↓
3. Backend valida en tabla users
   ↓
4. Si válido: genera token aleatorio
   ↓
5. Token se guarda en tabla sessions
   ↓
6. Frontend recibe token → localStorage
   ↓
7. Requests posteriores incluyen: Authorization: Bearer <token>
   ↓
8. Middleware authenticateToken valida
   ↓
9. Acceso permitido a endpoints protegidos
```

---

## 📱 Endpoints de API

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/auth/login` | ❌ No | Autenticar usuario |
| POST | `/api/auth/logout` | ✅ Sí | Cerrar sesión |
| GET | `/api/auth/verify` | ✅ Sí | Verificar token válido |
| GET | `/api/kpis` | ❌ No | Obtener KPIs actuales |
| PUT | `/api/kpis` | ✅ Sí | Actualizar KPIs |
| GET | `/api/chart-data` | ❌ No | Obtener datos de gráficos |
| PUT | `/api/chart-data` | ✅ Sí | Actualizar datos de gráficos |
| GET | `/api/alerts` | ❌ No | Obtener alertas recientes |
| POST | `/api/alerts` | ✅ Sí | Agregar nueva alerta |
| DELETE | `/api/alerts/:id` | ✅ Sí | Eliminar alerta |
| GET | `/api/app-state` | ❌ No | Obtener estado de app |
| PUT | `/api/app-state` | ✅ Sí | Actualizar estado de app |
| GET | `/api/status` | ❌ No | Verificar estado del servidor |

---

## 🗂️ Estructura de Carpetas

```
GreeTech/
├── server.js                 # API Gateway (Express)
├── database-sqlite3.js       # Database Layer (Acceso a datos)
├── schema.sql               # Esquema de SQLite3
├── init-database.js         # Inicializador de BD
├── index.html               # Presentation Layer
├── app-sqlite.js            # Application + Domain Layers
├── style.css                # Infrastructure (Estilos)
├── greentech.db             # SQLite Database (persistencia)
├── package.json             # Dependencias
├── README.md                # Documentación
└── node_modules/            # Paquetes instalados
```

---

## 💾 Stack Tecnológico

### Backend
- **Node.js** v24.18.0 - Runtime
- **Express.js** ^4.18.2 - Framework web
- **SQLite3** ^5.1.6 - Base de datos relacional
- **CORS** ^2.8.5 - Cross-Origin Resource Sharing
- **Nodemon** ^3.1.14 - Recarga automática

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos responsive
- **JavaScript ES6+** - Lógica
- **Chart.js** - Gráficos interactivos
- **Leaflet.js** - Mapas ecológicos

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js v24.18.0+
- npm v11.16.0+

### Instalación

```bash
cd c:\GreeTech
npm install
npm run dev
```

Accede a: **http://localhost:3000**

### Credenciales de Prueba
- **Usuario**: Admin123
- **Contraseña**: admin123

---

## 📊 KPIs Monitoreados

| KPI | Valor | Unidad |
|-----|-------|--------|
| Deforestación | 1,248 | Hectáreas |
| Cambio vs Año Anterior | +12% | Porcentaje |
| Progreso | 78% | Completado |
| Alertas Activas | 42 | Incidentes |
| Sensores en Línea | 99.2% | Disponibilidad |
| Secuestro de Carbono | 4.2k | Mt CO2e |

---

## ✨ Características Principales

✅ Autenticación segura con tokens de sesión  
✅ Base de datos SQLite3 persistente  
✅ API REST con validación y middleware  
✅ Frontend responsive (mobile-first)  
✅ Gráficos interactivos (Chart.js)  
✅ Mapas ecológicos (Leaflet.js)  
✅ Sistema de alertas configurable  
✅ Fallback a localStorage sin servidor  
✅ Async/await en todas las operaciones  
✅ CORS habilitado para desarrollo  

---

## 🛠️ Comandos Disponibles

```bash
npm run dev       # Inicia con nodemon (recomendado desarrollo)
npm start         # Inicia servidor sin autoreload
npm run init-db   # Inicializa/reinicia base de datos
```

---

## 🔒 Seguridad

- ✅ Tokens de sesión aleatorios (32 bytes hex)
- ✅ Validación de entrada en endpoints
- ✅ Middleware de autenticación
- ✅ CORS configurado
- ✅ Manejo seguro de errores
- ✅ Promesas con async/await

---

## 📈 Ciclo de Datos

```
1. Apertura de http://localhost:3000
2. Verificación de disponibilidad del servidor
3. Autenticación (login)
4. Validación en BD SQLite
5. Generación de token de sesión
6. Almacenamiento en localStorage
7. Carga del dashboard
8. Sincronización de datos (API ↔ localStorage)
9. Actualización de estado
10. Renderizado en UI
```

---

## 📞 Soporte Técnico

Para problemas o sugerencias, revisa:
- `server.js` - Lógica del servidor
- `database-sqlite3.js` - Operaciones de BD
- `app-sqlite.js` - Lógica del frontend
- `schema.sql` - Estructura de datos

---

## 📄 Licencia

© 2024 GreenTech Amazon Systems. Todos los derechos reservados.

---

## 🎯 Mejoras Futuras

- [ ] Autenticación OAuth2/LDAP
- [ ] Exportación a PDF de reportes
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Machine Learning para predicción
- [ ] Panel administrativo
- [ ] Multi-idioma
- [ ] Modo oscuro
- [ ] Integración con APIs geoespaciales

---

**Arquitectura Hexagonal**: Este diseño permite testeo independiente de cada capa, fácil mantenibilidad y escalabilidad futura del sistema.
