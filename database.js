import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'greentech.db');

// Inicializar base de datos
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Crear tablas si no existen
const initializeDatabase = () => {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = schema.split(';').filter(s => s.trim());
  
  statements.forEach(statement => {
    if (statement.trim()) {
      db.exec(statement);
    }
  });
};

// Funciones de usuario
export const userFunctions = {
  authenticate(username, password) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
    return stmt.get(username, password);
  },

  getUserById(userId) {
    const stmt = db.prepare('SELECT id, username FROM users WHERE id = ?');
    return stmt.get(userId);
  }
};

// Funciones de sesión
export const sessionFunctions = {
  createSession(userId, sessionToken) {
    const stmt = db.prepare(
      'INSERT INTO sessions (user_id, session_token) VALUES (?, ?)'
    );
    return stmt.run(userId, sessionToken);
  },

  getSession(sessionToken) {
    const stmt = db.prepare('SELECT * FROM sessions WHERE session_token = ?');
    return stmt.get(sessionToken);
  },

  updateSessionActivity(sessionToken) {
    const stmt = db.prepare(
      'UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = ?'
    );
    return stmt.run(sessionToken);
  },

  deleteSession(sessionToken) {
    const stmt = db.prepare('DELETE FROM sessions WHERE session_token = ?');
    return stmt.run(sessionToken);
  }
};

// Funciones de KPIs
export const kpiFunctions = {
  getLatestKpi() {
    const stmt = db.prepare('SELECT * FROM kpis ORDER BY updated_at DESC LIMIT 1');
    return stmt.get();
  },

  updateKpi(data) {
    const stmt = db.prepare(`
      UPDATE kpis SET 
        deforestation = ?,
        deforestation_change = ?,
        deforestation_progress = ?,
        active_alerts = ?,
        sensors_online = ?,
        carbon_sequestration = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `);
    return stmt.run(
      data.deforestation,
      data.deforestationChange,
      data.deforestationProgress,
      data.activeAlerts,
      data.sensorsOnline,
      data.carbonSequestration
    );
  }
};

// Funciones de gráficos
export const chartFunctions = {
  getWeeklyData() {
    const stmt = db.prepare(`
      SELECT day_label, incidents, previous_week 
      FROM chart_data 
      ORDER BY ROWID ASC
    `);
    return stmt.all();
  },

  updateWeeklyData(data) {
    const stmt = db.prepare(`
      UPDATE chart_data 
      SET incidents = ?, previous_week = ? 
      WHERE day_label = ?
    `);

    data.forEach(item => {
      stmt.run(item.incidents, item.previousWeek, item.dayLabel);
    });

    return data;
  }
};

// Funciones de alertas
export const alertFunctions = {
  getAllAlerts(limit = 10) {
    const stmt = db.prepare(`
      SELECT 
        id, severity, icon, color_class as colorClass, badge_class as badgeClass,
        title, message, time_ago as time, created_at
      FROM alerts 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  },

  addAlert(alertData) {
    const stmt = db.prepare(`
      INSERT INTO alerts (severity, icon, color_class, badge_class, title, message, time_ago)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      alertData.severity,
      alertData.icon,
      alertData.colorClass,
      alertData.badgeClass,
      alertData.title,
      alertData.message,
      alertData.time
    );
  },

  deleteAlert(alertId) {
    const stmt = db.prepare('DELETE FROM alerts WHERE id = ?');
    return stmt.run(alertId);
  }
};

// Funciones de estado de la app
export const appStateFunctions = {
  getAppState() {
    const stmt = db.prepare('SELECT * FROM app_state WHERE id = 1');
    return stmt.get();
  },

  updateAppState(activeTab, searchQuery) {
    const stmt = db.prepare(`
      UPDATE app_state 
      SET active_tab = ?, search_query = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `);
    return stmt.run(activeTab, searchQuery);
  }
};

// Inicializar base de datos al importar
initializeDatabase();

export default db;
