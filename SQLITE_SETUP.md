# GreenTech Amazon Systems - Compatibilidad con SQLite

## 🚀 Instalación y Configuración

Este proyecto ha sido actualizado para ser compatible con **SQLite** como base de datos persistente, reemplazando localStorage.

### Requisitos
- Node.js 16+ (para ejecutar el servidor)
- npm o yarn

### Pasos de Instalación

#### 1. Instalar dependencias
```bash
cd c:\GreeTech
npm install
```

Esto instalará:
- **express**: Servidor web
- **better-sqlite3**: Controlador SQLite performante
- **cors**: Middleware para CORS

#### 2. Inicializar la base de datos SQLite
```bash
npm run init-db
```

Este comando:
- Crea el archivo `greentech.db` en la carpeta del proyecto
- Ejecuta el esquema SQL definido en `schema.sql`
- Carga datos iniciales en las tablas
- Verifica la integridad de la base de datos

#### 3. Iniciar el servidor
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### 📁 Estructura de Archivos

```
c:\GreeTech\
├── package.json              # Dependencias del proyecto
├── server.js                 # Servidor Express con API REST
├── database.js               # Funciones de acceso a SQLite
├── init-database.js          # Script para inicializar la BD
├── schema.sql                # Esquema de la base de datos
├── app-sqlite.js             # Versión compatible con SQLite
├── app.js                    # Versión original (localStorage)
├── index.html                # Interfaz HTML
├── generate_pdfs.py          # Generador de PDFs
└── greentech.db              # Base de datos SQLite (creada automáticamente)
```

## 🗄️ Base de Datos SQLite

### Tablas principales

#### `users`
Almacena credenciales de usuario
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  created_at TIMESTAMP
);
```

#### `kpis`
Almacena los indicadores clave de desempeño
```sql
CREATE TABLE kpis (
  id INTEGER PRIMARY KEY,
  deforestation INTEGER,
  deforestation_change TEXT,
  deforestation_progress INTEGER,
  active_alerts INTEGER,
  sensors_online TEXT,
  carbon_sequestration TEXT,
  updated_at TIMESTAMP
);
```

#### `alerts`
Almacena todas las alertas del sistema
```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY,
  severity TEXT,
  icon TEXT,
  color_class TEXT,
  badge_class TEXT,
  title TEXT,
  message TEXT,
  time_ago TEXT,
  created_at TIMESTAMP
);
```

#### `chart_data`
Almacena datos de gráficos semanales
```sql
CREATE TABLE chart_data (
  id INTEGER PRIMARY KEY,
  day_label TEXT,
  incidents INTEGER,
  previous_week INTEGER,
  week_ending TIMESTAMP
);
```

#### `sessions`
Gestiona sesiones de usuario autenticado
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  session_token TEXT UNIQUE,
  login_time TIMESTAMP,
  last_activity TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### `app_state`
Guarda el estado de la aplicación
```sql
CREATE TABLE app_state (
  id INTEGER PRIMARY KEY,
  active_tab TEXT,
  search_query TEXT,
  state_version INTEGER,
  updated_at TIMESTAMP
);
```

#### `reports`
Almacena reportes generados
```sql
CREATE TABLE reports (
  id INTEGER PRIMARY KEY,
  filename TEXT UNIQUE,
  title TEXT,
  content TEXT,
  generated_at TIMESTAMP
);
```

## 🔌 API REST

### Autenticación

**POST** `/api/auth/login`
```json
{
  "username": "Admin123",
  "password": "admin123"
}
```
Retorna un token de sesión para usar en llamadas posteriores.

**POST** `/api/auth/logout`
Cierra la sesión actual.

**GET** `/api/auth/verify`
Verifica si el token actual es válido.

### KPIs

**GET** `/api/kpis`
Obtiene los KPIs actuales.

**PUT** `/api/kpis`
Actualiza los KPIs (requiere autenticación).

### Gráficos

**GET** `/api/chart-data`
Obtiene datos de gráficos semanales.

**PUT** `/api/chart-data`
Actualiza datos de gráficos (requiere autenticación).

### Alertas

**GET** `/api/alerts?limit=10`
Obtiene las últimas alertas.

**POST** `/api/alerts`
Crea una nueva alerta (requiere autenticación).

**DELETE** `/api/alerts/:id`
Elimina una alerta (requiere autenticación).

### Estado de la App

**GET** `/api/app-state`
Obtiene el estado actual de la aplicación.

**PUT** `/api/app-state`
Actualiza el estado de la aplicación.

## 🌐 Uso del Frontend

### Opción 1: Usar la versión SQLite (recomendado)

En `index.html`, cambiar:
```html
<!-- De esto: -->
<script src="app.js"></script>

<!-- A esto: -->
<script src="app-sqlite.js"></script>
```

El frontend automáticamente:
1. Detectará si el servidor SQLite está disponible
2. Usará la API REST si está disponible
3. Hará fallback a localStorage si el servidor no está disponible

### Opción 2: Mantener localStorage

Seguir usando `app.js` tal como está. El proyecto seguirá funcionando con datos en memoria.

## 🔐 Credenciales de Prueba

- **Usuario**: `Admin123`
- **Contraseña**: `admin123`

## 💾 Persistencia de Datos

Con SQLite, todos los datos se guardan en:
- **Ubicación**: `c:\GreeTech\greentech.db`
- **Permanencia**: Los datos persisten entre reinicios del servidor
- **Backups**: Se recomienda hacer backups regulares del archivo `.db`

## 🐍 Generador de PDFs

El script `generate_pdfs.py` continúa funcionando independientemente:
```bash
python generate_pdfs.py
```

Para integrar SQLite en el generador de PDFs, puede modificarse para:
1. Leer datos de la base de datos
2. Guardar historial de reportes generados
3. Gestionar versiones de reportes

## 🧪 Pruebas

### Verificar servidor
```bash
curl http://localhost:3000/api/status
```

### Obtener KPIs
```bash
curl http://localhost:3000/api/kpis
```

### Obtener alertas
```bash
curl http://localhost:3000/api/alerts
```

## 📊 Migrando datos de localStorage a SQLite

Si tienes datos en localStorage, ejecuta:
```javascript
// En la consola del navegador
const state = JSON.parse(localStorage.getItem('greentechDashboardState'));
console.log(JSON.stringify(state));
```

Luego, inserta esos datos en las tablas correspondientes de SQLite.

## 🔧 Troubleshooting

### Error: "Cannot find module 'better-sqlite3'"
```bash
npm install
```

### Error: "EADDRINUSE: address already in use :::3000"
El puerto 3000 está en uso. Cambiar el puerto:
```bash
PORT=3001 npm start
```

### Error: "Database is locked"
Cierra otros procesos que estén usando la base de datos.

### El servidor no se conecta
Asegúrate de que `http://localhost:3000` sea accesible.

## 📝 Notas

- La base de datos SQLite es más robusta que localStorage
- Los datos están centralizados en el servidor
- Soporte para múltiples usuarios concurrentes
- Mejor escalabilidad y rendimiento
- Historial de cambios más fácil de auditar

## 🚀 Próximos Pasos

1. ✅ Base de datos SQLite configurada
2. ✅ API REST implementada
3. ✅ Frontend compatible con SQLite
4. 📋 Considerar: Migración de datos históricos
5. 📋 Considerar: Backups automáticos
6. 📋 Considerar: Integración con Python para análisis

---

**Versión**: 2.0 con SQLite
**Fecha de actualización**: 2026-07-01
**Compatible con**: Node.js 16+
