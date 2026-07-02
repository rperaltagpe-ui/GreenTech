# 🏗️ Guía de Arquitectura - GreenTech Amazon Systems

## 📚 Resumen Ejecutivo

GreenTech es un sistema de **monitoreo ambiental amazónico** construido con **arquitectura hexagonal**. Separa claramente:
- **Frontend** (lo que ves)
- **Backend** (lo que procesa)
- **Base de datos** (lo que persiste)

---

## 🔷 Los 6 Hexágonos Explicados

### 1️⃣ PRESENTATION LAYER (Capa de Presentación)
**¿Qué es?** Lo que ves en pantalla  
**¿Dónde está?** `index.html`, `app-sqlite.js`, `style.css`  
**¿Qué hace?**
- Muestra dashboard con KPIs
- Dibuja gráficos con Chart.js
- Renderiza mapas con Leaflet
- Captura clics de usuario
- Envía datos al servidor

**Tecnologías**: HTML5, CSS3, JavaScript ES6+

---

### 2️⃣ APPLICATION LAYER (Capa de Aplicación)
**¿Qué es?** La lógica que orquesta todo  
**¿Dónde está?** Funciones en `app-sqlite.js`  
**¿Qué hace?**
- Gestiona el estado de la app
- Maneja eventos de usuario
- Coordina entre Frontend y Backend
- Renderiza componentes

**Flujo**: Usuario clica → Evento → Aplicación procesa → Actualiza UI

---

### 3️⃣ API GATEWAY (Puerta de Entrada)
**¿Qué es?** El servidor que recibe requests  
**¿Dónde está?** `server.js` (Express.js)  
**¿Qué hace?**
- Escucha en puerto 3000
- Recibe requests del Frontend
- Valida autenticación
- Dirige a la base de datos
- Devuelve respuestas JSON

**Rutas principales**:
- `/api/auth/login` - Autenticar
- `/api/kpis` - Obtener métricas
- `/api/alerts` - Obtener alertas
- `/api/chart-data` - Datos de gráficos

---

### 4️⃣ DATABASE LAYER (Guardián de Datos)
**¿Qué es?** Funciones para acceder a la BD  
**¿Dónde está?** `database-sqlite3.js`  
**¿Qué hace?**
- Promisifica callbacks de SQLite
- Ejecuta queries SQL
- Inserta, actualiza, elimina datos
- Devuelve resultados al Gateway

**Función clave**: Convierte callbacks en Promesas para usar async/await

---

### 5️⃣ DOMAIN LAYER (Reglas del Negocio)
**¿Qué es?** Las reglas que definen cómo funciona GreenTech  
**¿Dónde está?** Objeto `domain` en `app-sqlite.js`  
**¿Qué hace?**
- Define estados por defecto
- Establece KPIs iniciales
- Define alertas tipos
- Validaciones de negocio

**Ejemplo**: "Los sensores se consideran offline si no reportan en 5 minutos"

---

### 6️⃣ INFRASTRUCTURE LAYER (Configuración y Soporte)
**¿Qué es?** Todo lo que hace que el sistema funcione  
**¿Dónde está?** `server.js`, `style.css`, `package.json`  
**¿Qué hace?**
- Configura Express
- Define puertos
- Gestiona dependencias
- Estilos CSS
- Utilidades generales

---

## 🔄 Flujo Completo: De Login a Dashboard

```
1. Usuario abre localhost:3000
   ↓
2. Carga index.html (PRESENTATION)
   ↓
3. app-sqlite.js inicia (APPLICATION)
   ↓
4. Verifica si hay servidor disponible (API GATEWAY)
   ↓
5. Muestra pantalla de login
   ↓
6. Usuario entra: Admin123 / admin123
   ↓
7. Frontend envía POST a /api/auth/login (API GATEWAY)
   ↓
8. API GATEWAY valida en BD (DATABASE LAYER)
   ↓
9. Si válido, genera token y guarda en tabla sessions
   ↓
10. Devuelve token al Frontend
   ↓
11. Frontend guarda token en localStorage
   ↓
12. Frontend pide GET /api/kpis (SIN token necesario)
   ↓
13. API GATEWAY consulta BD
   ↓
14. DATABASE LAYER ejecuta: SELECT * FROM kpis
   ↓
15. Devuelve datos
   ↓
16. Frontend renderiza dashboard
   ↓
17. Usuario ve KPIs, alertas, gráficos, mapas
```

---

## 📊 Tabla de Responsabilidades

| Capa | Responsabilidad | Archivo | Tecnología |
|------|-----------------|---------|------------|
| **PRESENTATION** | Mostrar UI, capturar eventos | index.html, app-sqlite.js | HTML/CSS/JS |
| **APPLICATION** | Coordinar casos de uso | app-sqlite.js | JavaScript |
| **API GATEWAY** | Recibir requests, validar, responder | server.js | Express.js |
| **DATABASE LAYER** | Acceder a BD con async/await | database-sqlite3.js | Node.js + SQLite3 |
| **DOMAIN** | Reglas de negocio, estados | app-sqlite.js | JavaScript |
| **INFRASTRUCTURE** | Configuración, dependencias | server.js, package.json | Node.js config |

---

## 🔐 Autenticación Paso a Paso

```
┌─────────────────────────────────────────────────────┐
│ 1. Usuario escribe Admin123 / admin123              │
├─────────────────────────────────────────────────────┤
│ 2. Frontend: apiClient.login(username, password)    │
├─────────────────────────────────────────────────────┤
│ 3. POST http://localhost:3000/api/auth/login        │
│    Body: { username: "Admin123", password: "admin123" }
├─────────────────────────────────────────────────────┤
│ 4. server.js recibe request                         │
│    app.post('/api/auth/login', async (req, res))   │
├─────────────────────────────────────────────────────┤
│ 5. database-sqlite3.js:                             │
│    userFunctions.authenticate(username, password)  │
│    → Ejecuta: SELECT * FROM users                   │
│      WHERE username = ? AND password = ?            │
├─────────────────────────────────────────────────────┤
│ 6. greentech.db devuelve: {id: 1, username: "Admin123"} │
├─────────────────────────────────────────────────────┤
│ 7. server.js genera token:                          │
│    const token = crypto.randomBytes(32).toString('hex') │
│    → "a1b2c3d4e5f6..." (64 caracteres hex)          │
├─────────────────────────────────────────────────────┤
│ 8. Guarda sesión en DB:                             │
│    INSERT INTO sessions (user_id, session_token)   │
│    VALUES (1, "a1b2c3d4e5f6...")                   │
├─────────────────────────────────────────────────────┤
│ 9. Responde al Frontend:                            │
│    JSON { token, userId, username, success: true } │
├─────────────────────────────────────────────────────┤
│ 10. Frontend guarda token:                          │
│     localStorage.setItem('greentechToken', token)  │
│     AUTH_TOKEN = token                              │
├─────────────────────────────────────────────────────┤
│ 11. Frontend renderiza dashboard                    │
│     showApp() en lugar de showLogin()               │
├─────────────────────────────────────────────────────┤
│ 12. Para requests posteriores:                      │
│     Header: Authorization: Bearer <token>          │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Árbol de Archivos

```
GreenTech/
│
├─ 📱 PRESENTATION LAYER
│  ├─ index.html              ← HTML estructura
│  ├─ app-sqlite.js           ← Lógica Frontend + Domain
│  └─ style.css               ← Estilos
│
├─ 🌐 API GATEWAY
│  └─ server.js               ← Express.js servidor
│
├─ 💾 DATABASE LAYER
│  ├─ database-sqlite3.js     ← Acceso async a BD
│  ├─ greentech.db            ← Archivo de BD (SQLite)
│  └─ schema.sql              ← Estructura de tablas
│
├─ ⚙️ INFRASTRUCTURE
│  ├─ package.json            ← Dependencias npm
│  ├─ package-lock.json       ← Lock file
│  └─ node_modules/           ← Paquetes instalados
│
└─ 📚 DOCUMENTACIÓN
   ├─ README.md               ← Este archivo (mejorado)
   ├─ DIAGRAMAS_HEXAGONALES.md ← Diagramas visuales
   └─ GEMINI_PROMPT_HEXAGON.md ← Prompts para Gemini
```

---

## 🚀 Comandos Clave

```bash
# Instalar dependencias
npm install

# Iniciar servidor (con autoreload)
npm run dev

# Iniciar servidor (sin autoreload)
npm start

# Inicializar base de datos
npm run init-db
```

---

## 🔒 Seguridad en Capas

| Capa | Medida de Seguridad |
|------|---------------------|
| PRESENTATION | Valida formato de entrada |
| APPLICATION | Limpia datos antes de enviar |
| API GATEWAY | Middleware autenticación, validación |
| DATABASE | No ejecuta queries con datos sin validar |
| INFRASTRUCTURE | CORS configurado, PORT definido |

---

## 💡 Ventajas de Arquitectura Hexagonal

✅ **Independencia**: Cada capa puede testearse sola  
✅ **Mantenibilidad**: Fácil encontrar y corregir bugs  
✅ **Escalabilidad**: Agregar nuevas features sin afectar existentes  
✅ **Flexibilidad**: Cambiar BD sin tocar Frontend  
✅ **Testabilidad**: Mock objects fáciles de crear  

---

## 🎯 Flujos de Datos Principales

### Flujo de Lectura (GET)
```
User → Frontend → API Gateway → Database Layer → DB 
→ Database Layer → API Gateway → Frontend → User
```

### Flujo de Escritura (POST/PUT)
```
User → Frontend → [Validar] → API Gateway → [Autenticar] 
→ Database Layer → [Guardar] → DB → Database Layer 
→ API Gateway → Frontend → [Renderizar] → User
```

---

## 📞 Debugging por Capa

**¿No ves el dashboard?**  
→ Revisa `server.js` y la consola del navegador

**¿El login no funciona?**  
→ Verifica tabla `users` en `greentech.db`

**¿Los KPIs no se actualizan?**  
→ Chequea `database-sqlite3.js` y la query

**¿Errores de red?**  
→ Asegúrate que `npm run dev` está activo en puerto 3000

---

## 🔮 Futuro de la Arquitectura

```
ACTUALMENTE:
Frontend ↔ Backend ↔ SQLite

FUTURO:
Frontend ↔ Backend ↔ SQLite + Redis + Kafka
          ↓
        Microservicios
          ↓
        Machine Learning
```

---

**¡Entendiendo esta arquitectura, puedes escalar GreenTech a millones de usuarios!**
