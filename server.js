import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
  userFunctions,
  sessionFunctions,
  kpiFunctions,
  chartFunctions,
  alertFunctions,
  appStateFunctions,
  initializeDatabase
} from './database-sqlite3.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const session = await sessionFunctions.getSession(token);
    if (!session) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    await sessionFunctions.updateSessionActivity(token);
    req.sessionToken = token;
    req.userId = session.user_id;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al autenticar' });
  }
};

// =================== RUTAS DE AUTENTICACIÓN ===================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const user = await userFunctions.authenticate(username, password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    await sessionFunctions.createSession(user.id, sessionToken);

    res.json({
      success: true,
      token: sessionToken,
      userId: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al autenticar' });
  }
});

// Verificar sesión
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await userFunctions.getUserById(req.userId);
    res.json({
      valid: true,
      userId: req.userId,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar sesión' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await sessionFunctions.deleteSession(req.sessionToken);
    res.json({ success: true, message: 'Sesión cerrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
});

// =================== RUTAS DE KPIs ===================

// Obtener KPIs actuales
app.get('/api/kpis', async (req, res) => {
  try {
    const kpi = await kpiFunctions.getLatestKpi();
    if (!kpi) {
      return res.status(404).json({ error: 'KPIs no encontrados' });
    }

    res.json({
      deforestation: kpi.deforestation,
      deforestationChange: kpi.deforestation_change,
      deforestationProgress: kpi.deforestation_progress,
      activeAlerts: kpi.active_alerts,
      sensorsOnline: kpi.sensors_online,
      carbonSequestration: kpi.carbon_sequestration
    });
  } catch (error) {
    console.error('Error obteniendo KPIs:', error);
    res.status(500).json({ error: 'Error al obtener KPIs' });
  }
});

// Actualizar KPIs
app.put('/api/kpis', authenticateToken, async (req, res) => {
  try {
    const { deforestation, deforestationChange, deforestationProgress, activeAlerts, sensorsOnline, carbonSequestration } = req.body;

    await kpiFunctions.updateKpi({
      deforestation,
      deforestationChange,
      deforestationProgress,
      activeAlerts,
      sensorsOnline,
      carbonSequestration
    });

    res.json({
      success: true,
      message: 'KPIs actualizados'
    });
  } catch (error) {
    console.error('Error actualizando KPIs:', error);
    res.status(500).json({ error: 'Error al actualizar KPIs' });
  }
});

// =================== RUTAS DE GRÁFICOS ===================

// Obtener datos de gráficos
app.get('/api/chart-data', async (req, res) => {
  try {
    const data = await chartFunctions.getWeeklyData();

    const labels = [];
    const incidents = [];
    const previousWeek = [];

    data.forEach(row => {
      labels.push(row.day_label);
      incidents.push(row.incidents);
      previousWeek.push(row.previous_week);
    });

    res.json({
      labels,
      incidents,
      previousWeek
    });
  } catch (error) {
    console.error('Error obteniendo datos de gráficos:', error);
    res.status(500).json({ error: 'Error al obtener datos de gráficos' });
  }
});

// Actualizar datos de gráficos
app.put('/api/chart-data', authenticateToken, async (req, res) => {
  try {
    const { data } = req.body;
    await chartFunctions.updateWeeklyData(data);

    res.json({
      success: true,
      message: 'Datos de gráficos actualizados'
    });
  } catch (error) {
    console.error('Error actualizando datos de gráficos:', error);
    res.status(500).json({ error: 'Error al actualizar datos de gráficos' });
  }
});

// =================== RUTAS DE ALERTAS ===================

// Obtener todas las alertas
app.get('/api/alerts', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const alerts = await alertFunctions.getAllAlerts(limit);

    // Transformar nombres de columnas
    const formattedAlerts = alerts.map(alert => ({
      id: alert.id,
      severity: alert.severity,
      icon: alert.icon,
      colorClass: alert.colorClass,
      badgeClass: alert.badgeClass,
      title: alert.title,
      message: alert.message,
      time: alert.time
    }));

    res.json(formattedAlerts);
  } catch (error) {
    console.error('Error obteniendo alertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

// Agregar nueva alerta
app.post('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const { severity, icon, colorClass, badgeClass, title, message, time } = req.body;

    await alertFunctions.addAlert({
      severity,
      icon,
      colorClass,
      badgeClass,
      title,
      message,
      time
    });

    res.json({
      success: true,
      message: 'Alerta agregada'
    });
  } catch (error) {
    console.error('Error agregando alerta:', error);
    res.status(500).json({ error: 'Error al agregar alerta' });
  }
});

// Eliminar alerta
app.delete('/api/alerts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await alertFunctions.deleteAlert(id);

    res.json({
      success: true,
      message: 'Alerta eliminada'
    });
  } catch (error) {
    console.error('Error eliminando alerta:', error);
    res.status(500).json({ error: 'Error al eliminar alerta' });
  }
});

// =================== RUTAS DE ESTADO DE LA APP ===================

// Obtener estado de la aplicación
app.get('/api/app-state', async (req, res) => {
  try {
    const state = await appStateFunctions.getAppState();

    res.json({
      activeTab: state.active_tab || 'dashboard',
      searchQuery: state.search_query || ''
    });
  } catch (error) {
    console.error('Error obteniendo estado:', error);
    res.status(500).json({ error: 'Error al obtener estado' });
  }
});

// Actualizar estado de la aplicación
app.put('/api/app-state', async (req, res) => {
  try {
    const { activeTab, searchQuery } = req.body;

    await appStateFunctions.updateAppState(activeTab || 'dashboard', searchQuery || '');

    res.json({
      success: true,
      message: 'Estado de la aplicación actualizado'
    });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// =================== RUTA DE ESTADO DEL SERVIDOR ===================

// Verificar si el servidor está activo
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    message: 'Servidor GreenTech funcionando',
    timestamp: new Date().toISOString()
  });
});

// =================== SERVIDOR ===================

// Inicializar base de datos y luego iniciar servidor
(async () => {
  try {
    await initializeDatabase();
    console.log('✅ Base de datos inicializada');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   GreenTech Amazon Systems             ║
║   Servidor con SQLite iniciado         ║
╠════════════════════════════════════════╣
║ 🌍 URL: http://localhost:${PORT}
║ 🗄️  Base de datos: greentech.db
║ 📡 API disponible en /api/*
╚════════════════════════════════════════╝
    `);
  });
})();
