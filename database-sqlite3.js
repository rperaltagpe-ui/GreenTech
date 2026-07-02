import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'greentech.db');

// Inicializar base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err);
  }
});

db.configure('busyTimeout', 30000, () => {});
db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) console.error('Error setting foreign keys:', err);
});

// Promisify db.run y db.get
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbExec = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Funciones de usuario
export const userFunctions = {
  async authenticate(username, password) {
    return dbGet(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
  },

  async getUserById(userId) {
    return dbGet(
      'SELECT id, username FROM users WHERE id = ?',
      [userId]
    );
  }
};

// Funciones de sesión
export const sessionFunctions = {
  async createSession(userId, sessionToken) {
    return dbRun(
      'INSERT INTO sessions (user_id, session_token) VALUES (?, ?)',
      [userId, sessionToken]
    );
  },

  async getSession(sessionToken) {
    return dbGet(
      'SELECT * FROM sessions WHERE session_token = ?',
      [sessionToken]
    );
  },

  async updateSessionActivity(sessionToken) {
    return dbRun(
      'UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = ?',
      [sessionToken]
    );
  },

  async deleteSession(sessionToken) {
    return dbRun(
      'DELETE FROM sessions WHERE session_token = ?',
      [sessionToken]
    );
  }
};

// Funciones de KPIs
export const kpiFunctions = {
  async getLatestKpi() {
    return dbGet(
      'SELECT * FROM kpis ORDER BY updated_at DESC LIMIT 1'
    );
  },

  async updateKpi(data) {
    return dbRun(`
      UPDATE kpis SET 
        deforestation = ?,
        deforestation_change = ?,
        deforestation_progress = ?,
        active_alerts = ?,
        sensors_online = ?,
        carbon_sequestration = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [
      data.deforestation,
      data.deforestationChange,
      data.deforestationProgress,
      data.activeAlerts,
      data.sensorsOnline,
      data.carbonSequestration
    ]);
  }
};

// Funciones de gráficos
export const chartFunctions = {
  async getWeeklyData() {
    return dbAll(`
      SELECT day_label, incidents, previous_week 
      FROM chart_data 
      ORDER BY ROWID ASC
    `);
  },

  async updateWeeklyData(data) {
    for (const item of data) {
      await dbRun(`
        UPDATE chart_data 
        SET incidents = ?, previous_week = ? 
        WHERE day_label = ?
      `, [item.incidents, item.previousWeek, item.dayLabel]);
    }
    return data;
  }
};

// Funciones de alertas
export const alertFunctions = {
  async getAllAlerts(limit = 10) {
    return dbAll(`
      SELECT 
        id, severity, icon, color_class as colorClass, badge_class as badgeClass,
        title, message, time_ago as time, created_at
      FROM alerts 
      ORDER BY created_at DESC 
      LIMIT ?
    `, [limit]);
  },

  async addAlert(alertData) {
    return dbRun(`
      INSERT INTO alerts (severity, icon, color_class, badge_class, title, message, time_ago)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      alertData.severity,
      alertData.icon,
      alertData.colorClass,
      alertData.badgeClass,
      alertData.title,
      alertData.message,
      alertData.time
    ]);
  },

  async deleteAlert(alertId) {
    return dbRun('DELETE FROM alerts WHERE id = ?', [alertId]);
  }
};

// Funciones de estado de la app
export const appStateFunctions = {
  async getAppState() {
    return dbGet('SELECT * FROM app_state WHERE id = 1');
  },

  async updateAppState(activeTab, searchQuery) {
    return dbRun(`
      UPDATE app_state 
      SET active_tab = ?, search_query = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [activeTab, searchQuery]);
  }
};

// Inicializar base de datos al importar
export const initializeDatabase = async () => {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = schema.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      await dbExec(statement);
    }
  }
};

export default db;
