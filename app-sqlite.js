// GreenTech app - Compatible con SQLite
// Versión 2.0 con soporte para API REST

// Configuración de API
const API_BASE_URL = 'http://localhost:3000/api';
let AUTH_TOKEN = null;

// Cliente API para interactuar con SQLite
const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en request:', error);
      throw error;
    }
  },

  // Autenticación
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) {
      AUTH_TOKEN = data.token;
      localStorage.setItem('greentechToken', data.token);
      localStorage.setItem('greentechLoggedIn', 'true');
    }
    return data;
  },

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Error en logout:', error);
    }
    AUTH_TOKEN = null;
    localStorage.removeItem('greentechToken');
    localStorage.removeItem('greentechLoggedIn');
  },

  async verifyToken() {
    try {
      return await this.request('/auth/verify');
    } catch (error) {
      return null;
    }
  },

  // KPIs
  async getKpis() {
    return await this.request('/kpis');
  },

  async updateKpis(kpiData) {
    return await this.request('/kpis', {
      method: 'PUT',
      body: JSON.stringify(kpiData)
    });
  },

  // Gráficos
  async getChartData() {
    return await this.request('/chart-data');
  },

  async updateChartData(data) {
    return await this.request('/chart-data', {
      method: 'PUT',
      body: JSON.stringify({ data })
    });
  },

  // Alertas
  async getAlerts(limit = 10) {
    return await this.request(`/alerts?limit=${limit}`);
  },

  async addAlert(alertData) {
    return await this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });
  },

  async deleteAlert(alertId) {
    return await this.request(`/alerts/${alertId}`, {
      method: 'DELETE'
    });
  },

  // Estado de la app
  async getAppState() {
    return await this.request('/app-state');
  },

  async updateAppState(activeTab, searchQuery) {
    return await this.request('/app-state', {
      method: 'PUT',
      body: JSON.stringify({ activeTab, searchQuery })
    });
  },

  // Verificar disponibilidad del servidor
  async checkServerStatus() {
    try {
      const response = await this.request('/status');
      return response.status === 'active';
    } catch (error) {
      return false;
    }
  }
};

// Capa de dominio
const domain = {
  STORAGE_KEY: 'greentechDashboardState',
  defaultState: {
    kpis: {
      deforestation: 1248,
      deforestationChange: '+12% vs año anterior',
      deforestationProgress: 78,
      activeAlerts: 42,
      sensorsOnline: '99.2%',
      carbonSequestration: '4.2k'
    },
    chart: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      incidents: [120, 190, 150, 240, 210, 280, 248],
      previousWeek: [100, 140, 130, 200, 180, 220, 210]
    },
    activeTab: 'dashboard',
    stateVersion: 2,
    alerts: [
      {
        severity: 'CRÍTICO',
        icon: 'warning',
        colorClass: 'border-emergency-red-border',
        badgeClass: 'bg-error/10 text-error',
        title: 'Pico térmico: Sector I-12',
        message: 'Posible quema ilegal detectada. Respuesta dron iniciada.',
        time: '2m'
      },
      {
        severity: 'ADVERTENCIA',
        icon: 'sensors',
        colorClass: 'border-tertiary',
        badgeClass: 'bg-tertiary/10 text-tertiary',
        title: 'Sensor desconectado: X-Alpha 4',
        message: 'Señal perdida en Iquitos, región Loreto. Revisión técnica pendiente.',
        time: '14m'
      },
      {
        severity: 'RESUELTO',
        icon: 'check_circle',
        colorClass: 'border-primary',
        badgeClass: 'bg-primary/10 text-primary',
        title: 'Reforestación verificada',
        message: 'Plantones del vivero del sector B-4 en Loreto confirmados por satélite.',
        time: '1h'
      },
      {
        severity: 'ADVERTENCIA',
        icon: 'water_drop',
        colorClass: 'border-tertiary',
        badgeClass: 'bg-tertiary/10 text-tertiary',
        title: 'Humedad baja detectada',
        message: 'Condiciones extremadamente secas en la cuenca superior. Riesgo de incendio en aumento.',
        time: '4h'
      }
    ],
    search: ''
  },
  TAB_LABELS: {
    dashboard: 'Control de Misión',
    map: 'Mapa Ecológico',
    alerts: 'Centro de alertas',
    reports: 'Informes científicos',
    sensors: 'Malla de sensores'
  },
  LOGIN_USERNAME: 'Admin123',
  LOGIN_PASSWORD: 'admin123',
  whatsappNumber: '51956359772',
  whatsappReports: [
    'Estudio Iquitos diciembre 2009',
    'Informe semanal de impacto',
    'Reporte de sensores',
    'Resumen de alertas'
  ],
  tabNames: {
    dashboard: 'Tablero',
    map: 'Mapa Ecológico',
    alerts: 'Centro de alertas',
    reports: 'Informes científicos',
    sensors: 'Malla de sensores'
  },

  buildWhatsAppMessage(state) {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const alertLines = state.alerts.slice(0, 6).map(alert => `• ${alert.severity} | ${alert.title} | ${alert.time}`);
    const reportLines = this.whatsappReports.map(report => `- ${report}`);
    const searchInfo = state.search ? `Filtro de búsqueda activo: "${state.search}"` : 'No hay filtro de búsqueda activo.';
    const message = [
      'Greentech Amazon Systems - Mensaje automático de estado desde Iquitos, Loreto.',
      `Fecha: ${formattedDate}`,
      `Pantalla actual: ${this.tabNames[state.activeTab] || state.activeTab}`,
      '',
      'Métricas clave:',
      `• Deforestación total detectada: ${state.kpis.deforestation.toLocaleString()} ha`,
      `• Cambio estimado: ${state.kpis.deforestationChange}`,
      `• Progreso de monitoreo: ${state.kpis.deforestationProgress}%`,
      `• Alertas activas: ${state.kpis.activeAlerts}`,
      `• Sensores en línea: ${state.kpis.sensorsOnline}`,
      `• Secuestro de carbono estimado: ${state.kpis.carbonSequestration}`,
      '',
      'Alertas recientes:',
      ...alertLines,
      '',
      'Reportes disponibles:',
      ...reportLines,
      '',
      searchInfo,
      '',
      'Acción recomendada: revisar inmediatamente los puntos críticos de Iquitos y coordinar patrullaje adicional.'
    ].join('\n');
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },

  generateRandomAlert() {
    const items = [
      {
        severity: 'CRÍTICO',
        icon: 'warning',
        colorClass: 'border-emergency-red-border',
        badgeClass: 'bg-error/10 text-error',
        title: 'Pico térmico: Sector I-12',
        message: 'Posible quema ilegal detectada. Respuesta dron iniciada.',
        time: '2m'
      },
      {
        severity: 'ADVERTENCIA',
        icon: 'sensors',
        colorClass: 'border-tertiary',
        badgeClass: 'bg-tertiary/10 text-tertiary',
        title: 'Sensor desconectado: X-Alpha 4',
        message: 'Señal perdida en Iquitos, región Loreto. Revisión técnica pendiente.',
        time: '14m'
      },
      {
        severity: 'RESUELTO',
        icon: 'check_circle',
        colorClass: 'border-primary',
        badgeClass: 'bg-primary/10 text-primary',
        title: 'Reforestación verificada',
        message: 'Plantones del vivero del sector B-4 en Loreto confirmados por satélite.',
        time: '1h'
      },
      {
        severity: 'ADVERTENCIA',
        icon: 'water_drop',
        colorClass: 'border-tertiary',
        badgeClass: 'bg-tertiary/10 text-tertiary',
        title: 'Humedad baja detectada',
        message: 'Condiciones extremadamente secas en la cuenca superior. Riesgo de incendio en aumento.',
        time: '4h'
      }
    ];
    return items[Math.floor(Math.random() * items.length)];
  },

  updateStateWithSimulation(state, searchInput) {
    state.kpis.deforestation += Math.floor(Math.random() * 30 + 5);
    state.kpis.activeAlerts = Math.max(1, state.kpis.activeAlerts + Math.floor(Math.random() * 5 - 2));
    state.kpis.sensorsOnline = (99 + Math.random() * 0.8).toFixed(1) + '%';
    state.kpis.carbonSequestration = (parseFloat(state.kpis.carbonSequestration) + Math.random() * 0.2).toFixed(1) + 'k';
    state.kpis.deforestationProgress = Math.min(100, state.kpis.deforestationProgress + Math.floor(Math.random() * 4 + 1));

    state.chart.incidents = state.chart.incidents.map(value => Math.max(80, value + Math.floor(Math.random() * 21 - 10)));
    state.chart.previousWeek = state.chart.previousWeek.map(value => Math.max(80, value + Math.floor(Math.random() * 17 - 8)));

    state.alerts.unshift(this.generateRandomAlert());
    if (state.alerts.length > 6) {
      state.alerts.pop();
    }

    state.search = searchInput.value.trim();
    return state;
  }
};

// Capa de aplicación
const application = {
  useApi: false, // Se establecerá en true si el servidor está disponible

  async loadState(storage) {
    if (this.useApi) {
      try {
        const kpis = await apiClient.getKpis();
        const chartData = await apiClient.getChartData();
        const alerts = await apiClient.getAlerts(10);
        const appState = await apiClient.getAppState();

        return {
          kpis,
          chart: chartData,
          activeTab: appState.activeTab,
          stateVersion: domain.defaultState.stateVersion,
          alerts,
          search: appState.searchQuery
        };
      } catch (error) {
        console.warn('Error cargando desde API, usando localStorage:', error);
        this.useApi = false;
      }
    }

    // Fallback a localStorage
    try {
      const stored = JSON.parse(storage.getItem(domain.STORAGE_KEY));
      if (!stored || !stored.alerts || stored.alerts.length === 0 || stored.stateVersion !== domain.defaultState.stateVersion) {
        return Object.assign(JSON.parse(JSON.stringify(domain.defaultState)), {
          activeTab: stored && stored.activeTab ? stored.activeTab : domain.defaultState.activeTab,
          search: stored && stored.search ? stored.search : domain.defaultState.search
        });
      }
      return stored;
    } catch (error) {
      return Object.assign(JSON.parse(JSON.stringify(domain.defaultState)), {
        activeTab: domain.defaultState.activeTab,
        search: domain.defaultState.search
      });
    }
  },

  async saveState(storage, state) {
    if (this.useApi && AUTH_TOKEN) {
      try {
        await apiClient.updateKpis(state.kpis);
        await apiClient.updateChartData(
          state.chart.labels.map((label, index) => ({
            dayLabel: label,
            incidents: state.chart.incidents[index],
            previousWeek: state.chart.previousWeek[index]
          }))
        );
        await apiClient.updateAppState(state.activeTab, state.search);
        return;
      } catch (error) {
        console.warn('Error guardando en API, usando localStorage:', error);
        this.useApi = false;
      }
    }

    // Fallback a localStorage
    storage.setItem(domain.STORAGE_KEY, JSON.stringify(state));
  },

  renderKpis(kpis) {
    const kpiDeforestation = document.getElementById('kpi-deforestation');
    const kpiChange = document.getElementById('kpi-deforestation-change');
    const kpiProgress = document.getElementById('kpi-deforestation-progress');
    const kpiAlerts = document.getElementById('kpi-active-alerts');
    const kpiSensors = document.getElementById('kpi-sensors-online');
    const kpiCarbon = document.getElementById('kpi-carbon-sequestration');

    if (kpiDeforestation) kpiDeforestation.textContent = kpis.deforestation.toLocaleString();
    if (kpiChange) kpiChange.textContent = kpis.deforestationChange;
    if (kpiProgress) kpiProgress.style.width = kpis.deforestationProgress + '%';
    if (kpiAlerts) kpiAlerts.textContent = kpis.activeAlerts;
    if (kpiSensors) kpiSensors.textContent = kpis.sensorsOnline;
    if (kpiCarbon) kpiCarbon.textContent = kpis.carbonSequestration;
  },

  formatAlertCard(alert) {
    return `
      <div class="flex gap-4 p-3 rounded-lg bg-surface-container-low/50 ${alert.colorClass}">
          <div class="shrink-0 w-10 h-10 rounded-full ${alert.badgeClass} flex items-center justify-center">
              <span class="material-symbols-outlined">${alert.icon}</span>
          </div>
          <div class="flex-1">
              <div class="flex justify-between">
                  <p class="font-label-caps text-label-caps text-[10px] ${alert.badgeClass.includes('text-error') ? 'text-error' : alert.badgeClass.includes('text-primary') ? 'text-primary' : 'text-tertiary'}">${alert.severity}</p>
                  <p class="text-on-surface-variant text-[10px]">${alert.time}</p>
              </div>
              <p class="font-body-md text-body-md font-bold text-on-surface mt-1">${alert.title}</p>
              <p class="text-label-sm text-label-sm text-on-surface-variant mt-1">${alert.message}</p>
          </div>
      </div>
    `;
  },

  renderAlerts(alerts, searchTerm, containerId = 'alertsContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const normalizedTerm = (searchTerm || '').trim().toLowerCase();
    const filteredAlerts = normalizedTerm
      ? alerts.filter(alert => alert.title.toLowerCase().includes(normalizedTerm) || alert.message.toLowerCase().includes(normalizedTerm) || alert.severity.toLowerCase().includes(normalizedTerm))
      : alerts;

    if (filteredAlerts.length === 0) {
      container.innerHTML = '<div class="rounded-lg bg-surface-container-low/50 p-4 text-on-surface-variant">Supervisa eventos críticos y responde a las notificaciones más recientes.</div>';
      return;
    }

    container.innerHTML = filteredAlerts.map(this.formatAlertCard).join('');
  },

  renderChart(impactChart, state) {
    if (!impactChart) return;
    impactChart.data.labels = state.chart.labels;
    impactChart.data.datasets[0].data = state.chart.incidents;
    impactChart.data.datasets[1].data = state.chart.previousWeek;
    impactChart.update();
  },

  setActiveTab(tabId, state, tabButtons, tabPanels, pageTitle) {
    if (!tabId) return;
    state.activeTab = tabId;
    this.saveState(infrastructure.storage, state);
    tabButtons.forEach(btn => {
      const active = btn.dataset.tab === tabId;
      btn.classList.toggle('text-primary', active);
      btn.classList.toggle('font-bold', active);
      btn.classList.toggle('bg-surface-container-high', active);
      btn.classList.toggle('text-on-surface-variant', !active);
      btn.classList.toggle('hover:text-on-surface', !active);
      btn.classList.toggle('hover:bg-surface-container-highest', !active);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== `tab-${tabId}`);
    });
    if (pageTitle) {
      pageTitle.textContent = domain.TAB_LABELS[tabId] || pageTitle.textContent;
    }
    if (tabId === 'map') {
      setTimeout(() => {
        infrastructure.initLeafletMap();
        infrastructure.refreshLeafletMap();
      }, 50);
    }
  },

  renderState(state, impactChart, searchInput) {
    this.renderKpis(state.kpis);
    this.renderAlerts(state.alerts, state.search, 'alertsContainer');
    this.renderAlerts(state.alerts, state.search, 'dashboardAlertsContainer');
    this.renderChart(impactChart, state);
    if (searchInput) {
      searchInput.value = state.search;
    }
  },

  initWhatsAppButton(state) {
    const sendAlertsButton = document.getElementById('btn-send-alerts');
    if (!sendAlertsButton) return;
    sendAlertsButton.addEventListener('click', () => {
      window.open(domain.buildWhatsAppMessage(state), '_blank');
    });
  }
};

// Capa de infraestructura
const infrastructure = {
  storage: window.localStorage,

  showApp(pageSidebar, pageMain, loginScreen) {
    if (pageSidebar) pageSidebar.removeAttribute('hidden');
    if (pageMain) pageMain.removeAttribute('hidden');
    if (loginScreen) loginScreen.classList.add('hidden');
  },

  showLogin(pageSidebar, pageMain, loginScreen) {
    if (pageSidebar) pageSidebar.setAttribute('hidden', '');
    if (pageMain) pageMain.setAttribute('hidden', '');
    if (loginScreen) loginScreen.classList.remove('hidden');
  },

  async handleLoginSubmit(event, loginError, loginScreen, pageSidebar, pageMain) {
    event.preventDefault();
    const username = document.getElementById('loginUser')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    try {
      if (application.useApi) {
        const result = await apiClient.login(username, password);
        if (result.success) {
          if (loginError) loginError.classList.add('hidden');
          this.showApp(pageSidebar, pageMain, loginScreen);
          return;
        }
      } else {
        // Fallback local
        if (username === domain.LOGIN_USERNAME && password === domain.LOGIN_PASSWORD) {
          this.storage.setItem('greentechLoggedIn', 'true');
          if (loginError) loginError.classList.add('hidden');
          this.showApp(pageSidebar, pageMain, loginScreen);
          return;
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
    }

    if (loginError) loginError.classList.remove('hidden');
  },

  async handleLogout(loginScreen, pageSidebar, pageMain) {
    try {
      if (application.useApi) {
        await apiClient.logout();
      }
    } catch (error) {
      console.warn('Error en logout:', error);
    }
    this.storage.removeItem('greentechLoggedIn');
    this.showLogin(pageSidebar, pageMain, loginScreen);
  },

  initLeafletMap() {
    const mapContainer = document.getElementById('leafletMap');
    if (!mapContainer || this.leafletMap) return;

    this.leafletMap = L.map(mapContainer, {
      center: [-3.7437, -73.2516],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.leafletMap);

    L.marker([-3.7437, -73.2516])
      .addTo(this.leafletMap)
      .bindPopup('Iquitos, Perú')
      .openPopup();
  },

  refreshLeafletMap() {
    if (this.leafletMap) {
      setTimeout(() => {
        this.leafletMap.invalidateSize();
      }, 200);
    }
  },

  leafletMap: null
};

// Punto de entrada
window.addEventListener('DOMContentLoaded', async function() {
  // Verificar disponibilidad del servidor
  const serverAvailable = await apiClient.checkServerStatus();
  application.useApi = serverAvailable;

  if (application.useApi) {
    // Restaurar token si existe
    const savedToken = localStorage.getItem('greentechToken');
    if (savedToken) {
      AUTH_TOKEN = savedToken;
    }
  }

  const searchInput = document.getElementById('missionSearch');
  const refreshButtons = Array.from(document.querySelectorAll('[data-action="refresh-data"]'));
  const resetButtons = Array.from(document.querySelectorAll('[data-action="reset-data"]'));
  const chartCanvas = document.getElementById('impactChart');
  const chartCtx = chartCanvas ? chartCanvas.getContext('2d') : null;
  const tabButtons = Array.from(document.querySelectorAll('[data-tab]'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
  const pageTitle = document.getElementById('pageTitle');
  const loginScreen = document.getElementById('loginScreen');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutButton = document.getElementById('logoutButton');
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const pageSidebar = document.querySelector('aside');
  const pageMain = document.querySelector('main');

  Chart.defaults.font.family = "'Hanken Grotesk', sans-serif";
  Chart.defaults.color = '#bdcaba';

  const impactChart = chartCtx ? new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: domain.defaultState.chart.labels,
      datasets: [
        {
          label: 'Incidentes (ha)',
          data: domain.defaultState.chart.incidents,
          borderColor: '#62df7d',
          backgroundColor: 'rgba(98, 223, 125, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#62df7d'
        },
        {
          label: 'Semana anterior',
          data: domain.defaultState.chart.previousWeek,
          borderColor: 'rgba(189, 202, 186, 0.2)',
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#171f33',
          titleColor: '#62df7d',
          bodyColor: '#dae2fd',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            callback: value => value + ' ha'
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  }) : null;

  async function handleLoginSubmit(event) {
    await infrastructure.handleLoginSubmit(event, loginError, loginScreen, pageSidebar, pageMain);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
  if (logoutButton) {
    logoutButton.addEventListener('click', () => infrastructure.handleLogout(loginScreen, pageSidebar, pageMain));
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuButton) return;
    mobileMenu.classList.remove('is-open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenuButton.querySelector('.material-symbols-outlined').textContent = 'menu';
  }

  function toggleMobileMenu() {
    if (!mobileMenu || !mobileMenuButton) return;
    const isOpen = mobileMenu.classList.toggle('is-open');
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
    mobileMenuButton.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'menu';
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', event => {
      event.stopPropagation();
      toggleMobileMenu();
    });
  }
  document.addEventListener('click', event => {
    if (!mobileMenu || !mobileMenuButton) return;
    if (mobileMenu.contains(event.target) || mobileMenuButton.contains(event.target)) return;
    closeMobileMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });

  const isAuthenticated = infrastructure.storage.getItem('greentechLoggedIn') === 'true';
  if (isAuthenticated) {
    infrastructure.showApp(pageSidebar, pageMain, loginScreen);
  } else {
    infrastructure.showLogin(pageSidebar, pageMain, loginScreen);
  }

  async function init() {
    let state = await application.loadState(infrastructure.storage);
    if (!state || !state.alerts) {
      state = domain.defaultState;
    }
    if (!state.activeTab) {
      state.activeTab = 'dashboard';
    }
    application.renderState(state, impactChart, searchInput);
    application.setActiveTab(state.activeTab, state, tabButtons, tabPanels, pageTitle);
    if (state.activeTab === 'map') {
      setTimeout(() => {
        infrastructure.initLeafletMap();
        infrastructure.refreshLeafletMap();
      }, 50);
    }
    await application.saveState(infrastructure.storage, state);

    tabButtons.forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        const tabId = button.dataset.tab;
        if (!tabId) return;
        application.setActiveTab(tabId, state, tabButtons, tabPanels, pageTitle);
        closeMobileMenu();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', async () => {
        state.search = searchInput.value.trim();
        await application.saveState(infrastructure.storage, state);
        application.renderAlerts(state.alerts, state.search, 'alertsContainer');
        application.renderAlerts(state.alerts, state.search, 'dashboardAlertsContainer');
      });
    }

    refreshButtons.forEach(refreshButton => {
      refreshButton.addEventListener('click', async () => {
        state = await application.loadState(infrastructure.storage);
        state = domain.updateStateWithSimulation(state, searchInput);
        await application.saveState(infrastructure.storage, state);
        application.renderState(state, impactChart, searchInput);
        application.setActiveTab(state.activeTab, state, tabButtons, tabPanels, pageTitle);
      });
    });

    resetButtons.forEach(resetButton => {
      resetButton.addEventListener('click', async () => {
        infrastructure.storage.removeItem(domain.STORAGE_KEY);
        state = domain.defaultState;
        await application.saveState(infrastructure.storage, state);
        application.renderState(state, impactChart, searchInput);
        application.setActiveTab(state.activeTab, state, tabButtons, tabPanels, pageTitle);
      });
    });

    application.initWhatsAppButton(state);
  }

  init();
});
