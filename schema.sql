-- Esquema de base de datos SQLite para GreenTech

-- Tabla de usuarios y sesiones
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  session_token TEXT UNIQUE NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de KPIs del dashboard
CREATE TABLE IF NOT EXISTS kpis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deforestation INTEGER,
  deforestation_change TEXT,
  deforestation_progress INTEGER,
  active_alerts INTEGER,
  sensors_online TEXT,
  carbon_sequestration TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de gráficos de datos
CREATE TABLE IF NOT EXISTS chart_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_label TEXT,
  incidents INTEGER,
  previous_week INTEGER,
  week_ending TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alertas
CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  severity TEXT,
  icon TEXT,
  color_class TEXT,
  badge_class TEXT,
  title TEXT,
  message TEXT,
  time_ago TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estado del aplicativo
CREATE TABLE IF NOT EXISTS app_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  active_tab TEXT DEFAULT 'dashboard',
  search_query TEXT DEFAULT '',
  state_version INTEGER DEFAULT 2,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes generados
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_chart_data_week ON chart_data(week_ending);

-- Inserts iniciales
INSERT OR IGNORE INTO users (username, password) VALUES ('Admin123', 'admin123');

INSERT OR IGNORE INTO kpis (deforestation, deforestation_change, deforestation_progress, active_alerts, sensors_online, carbon_sequestration)
VALUES (1248, '+12% vs año anterior', 78, 42, '99.2%', '4.2k');

INSERT OR IGNORE INTO chart_data (day_label, incidents, previous_week)
VALUES 
  ('Lun', 120, 100),
  ('Mar', 190, 140),
  ('Mié', 150, 130),
  ('Jue', 240, 200),
  ('Vie', 210, 180),
  ('Sáb', 280, 220),
  ('Dom', 248, 210);

INSERT OR IGNORE INTO app_state (active_tab, search_query) VALUES ('dashboard', '');

INSERT OR IGNORE INTO alerts (severity, icon, color_class, badge_class, title, message, time_ago)
VALUES 
  ('CRÍTICO', 'warning', 'border-emergency-red-border', 'bg-error/10 text-error', 'Pico térmico: Sector I-12', 'Posible quema ilegal detectada. Respuesta dron iniciada.', '2m'),
  ('ADVERTENCIA', 'sensors', 'border-tertiary', 'bg-tertiary/10 text-tertiary', 'Sensor desconectado: X-Alpha 4', 'Señal perdida en Iquitos, región Loreto. Revisión técnica pendiente.', '14m'),
  ('RESUELTO', 'check_circle', 'border-primary', 'bg-primary/10 text-primary', 'Reforestación verificada', 'Plantones del vivero del sector B-4 en Loreto confirmados por satélite.', '1h'),
  ('ADVERTENCIA', 'water_drop', 'border-tertiary', 'bg-tertiary/10 text-tertiary', 'Humedad baja detectada', 'Condiciones extremadamente secas en la cuenca superior. Riesgo de incendio en aumento.', '4h');
