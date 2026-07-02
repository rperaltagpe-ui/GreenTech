# 📖 Índice de Documentación - GreenTech

## 📚 Documentación Disponible

### 🎯 Comienza Aquí

1. **[README.md](README.md)** ⭐ PRINCIPAL
   - Descripción general del proyecto
   - Stack tecnológico completo
   - Instrucciones de inicio rápido
   - Endpoints de API
   - Características principales
   
   **Ideal para**: Onboarding, visión general

---

### 🏗️ Arquitectura Detallada

2. **[ARQUITECTURA_EXPLICADA.md](ARQUITECTURA_EXPLICADA.md)** 🏛️ RECOMENDADO
   - Los 6 hexágonos explicados en detalle
   - Flujo completo de login a dashboard
   - Tabla de responsabilidades por capa
   - Autenticación paso a paso
   - Árbol de archivos comentado
   - Ventajas de arquitectura hexagonal
   
   **Ideal para**: Entender el sistema en profundidad, debugging

---

### 📊 Diagramas Visuales

3. **[DIAGRAMAS_HEXAGONALES.md](DIAGRAMAS_HEXAGONALES.md)** 🔷 VISUAL
   - 6 diagramas Mermaid interactivos
   - Hexágono arquitectónico
   - Flujo de datos vertical
   - Arquitectura de carpetas
   - Secuencia de autenticación
   - Stack tecnológico por capa
   - Endpoints y componentes
   
   **Ideal para**: Presentaciones, visualización

   **Formatos soportados**:
   - Renderizado automático en GitHub
   - Exportable a PNG/SVG via mermaid.live
   - Integrable en presentaciones

---

### 🤖 Prompts para Gemini/IA

4. **[GEMINI_PROMPT_HEXAGON.md](GEMINI_PROMPT_HEXAGON.md)** 🔮 GENERACIÓN IA
   - Prompts listos para copiar-pegar en Gemini
   - Instrucciones detalladas
   - Alternativas simplificadas
   - Código Mermaid optimizado
   - Métodos de exportación
   
   **Ideal para**: Generar diagrama hexagonal con Gemini/Claude

---

### 📋 Documentación de Implementación

5. **[SQLITE_SETUP.md](SQLITE_SETUP.md)**
   - Setup inicial de SQLite
   - Configuración de base de datos
   - Inicialización de tablas

6. **[CAMBIOS_SQLITE.md](CAMBIOS_SQLITE.md)**
   - Resumen de cambios SQLite
   - Migraciones realizadas
   - Versiones anteriores

7. **[PRODUCT.md](PRODUCT.md)**
   - Especificaciones del producto
   - Requisitos funcionales
   - Casos de uso

---

## 🚀 Guía Rápida de Lectura

### Para Nuevos Desarrolladores
```
1. Lee: README.md (5 min)
2. Lee: ARQUITECTURA_EXPLICADA.md (15 min)
3. Ve: DIAGRAMAS_HEXAGONALES.md (5 min)
4. Corre: npm run dev (2 min)
5. Experimenta: Abre http://localhost:3000 (10 min)
```

### Para Presentaciones
```
1. Usa: DIAGRAMAS_HEXAGONALES.md
2. Con: GEMINI_PROMPT_HEXAGON.md
3. Genera: Diagrama en Gemini
4. Exporta: A PNG/SVG
```

### Para Debugging
```
1. Referencia: ARQUITECTURA_EXPLICADA.md
2. Diagramas: DIAGRAMAS_HEXAGONALES.md
3. Código: database-sqlite3.js, server.js, app-sqlite.js
```

---

## 📁 Estructura de Carpetas

```
GreenTech/
├── 📚 DOCUMENTACIÓN
│   ├── README.md                    ← Principal
│   ├── ARQUITECTURA_EXPLICADA.md    ← Detalle
│   ├── DIAGRAMAS_HEXAGONALES.md     ← Visuales
│   ├── GEMINI_PROMPT_HEXAGON.md     ← Prompts IA
│   ├── SQLITE_SETUP.md              ← Setup BD
│   ├── CAMBIOS_SQLITE.md            ← Historial
│   ├── PRODUCT.md                   ← Specs
│   └── INDICE_DOCUMENTACION.md      ← Este archivo
│
├── 💻 CÓDIGO FUENTE
│   ├── index.html                   ← Frontend HTML
│   ├── app-sqlite.js                ← Frontend Logic
│   ├── style.css                    ← Estilos
│   ├── server.js                    ← API Gateway
│   ├── database-sqlite3.js          ← Database Layer
│   ├── init-database.js             ← DB Inicialización
│   ├── schema.sql                   ← DB Schema
│   └── app.js                       ← Backup
│
├── 📦 CONFIGURACIÓN
│   ├── package.json                 ← Dependencies
│   ├── package-lock.json            ← Lock file
│   └── node_modules/                ← Paquetes
│
├── 🗄️ DATA
│   └── greentech.db                 ← SQLite Database
│
└── 🛠️ SCRIPTS
    ├── run-dev.ps1                  ← PowerShell dev
    ├── run-dev.bat                  ← Windows batch
    ├── setup.ps1                    ← Setup inicial
    └── generate_pdfs.py             ← PDF generator
```

---

## 🔍 Cómo Navegar

### ¿Quieres entender la arquitectura?
→ Lee **ARQUITECTURA_EXPLICADA.md**

### ¿Quieres un diagrama hexagonal?
→ Ve a **DIAGRAMAS_HEXAGONALES.md**

### ¿Quieres generar un diagrama con IA?
→ Usa **GEMINI_PROMPT_HEXAGON.md**

### ¿Quieres empezar a desarrollar?
→ Lee **README.md** y ejecuta `npm run dev`

### ¿Necesitas información sobre endpoints?
→ Ve a **README.md** → "Endpoints de API"

### ¿Quieres entender el flujo de datos?
→ Lee **ARQUITECTURA_EXPLICADA.md** → "Flujo Completo"

---

## 💡 Tips de Uso

### En GitHub
Los diagramas Mermaid se renderizan automáticamente. Solo necesitas hacer push.

### En Presentaciones
1. Abre mermaid.live
2. Copia código de DIAGRAMAS_HEXAGONALES.md
3. Exporta a PNG
4. Inserta en PowerPoint/Google Slides

### Con Gemini
1. Copia prompt de GEMINI_PROMPT_HEXAGON.md
2. Pega en gemini.google.com
3. Gemini genera diagrama
4. Descarga imagen

### Para Onboarding
Comparte estos 3 archivos con nuevos devs:
1. README.md
2. ARQUITECTURA_EXPLICADA.md
3. DIAGRAMAS_HEXAGONALES.md

---

## 📊 Comparativa de Documentos

| Documento | Audiencia | Longitud | Formato | Contenido |
|-----------|-----------|----------|---------|-----------|
| README.md | Todos | 2-3 min | Markdown | General + Setup |
| ARQUITECTURA_EXPLICADA.md | Devs | 15-20 min | Markdown + Tablas | Profundo |
| DIAGRAMAS_HEXAGONALES.md | Visual | 5-10 min | Mermaid | Diagramas |
| GEMINI_PROMPT_HEXAGON.md | IA Users | 3-5 min | Prompts | Instrucciones |
| SQLITE_SETUP.md | DevOps | 5-10 min | Tutorial | Setup técnico |

---

## 🎯 Próximos Pasos

**Para Desarrolladores**:
1. [ ] Leer README.md
2. [ ] Leer ARQUITECTURA_EXPLICADA.md
3. [ ] Ver DIAGRAMAS_HEXAGONALES.md
4. [ ] Clonar repo y `npm install`
5. [ ] `npm run dev` y experimentar
6. [ ] Revisar código fuente

**Para Presentadores**:
1. [ ] Leer README.md
2. [ ] Generar diagrama con GEMINI_PROMPT_HEXAGON.md
3. [ ] Crear presentación
4. [ ] Usar ARQUITECTURA_EXPLICADA.md para explicar

**Para Managers/PO**:
1. [ ] Leer README.md (sección "Características")
2. [ ] Ver DIAGRAMAS_HEXAGONALES.md
3. [ ] Revisar roadmap en PRODUCT.md

---

## 📞 Contacto y Soporte

Para preguntas sobre:
- **Arquitectura** → Ver ARQUITECTURA_EXPLICADA.md
- **Setup** → Ver SQLITE_SETUP.md
- **Endpoints** → Ver README.md
- **Visual** → Ver DIAGRAMAS_HEXAGONALES.md

---

## 🏆 GreenTech Amazon Systems

**Sistema de Monitoreo Ambiental con Arquitectura Hexagonal**

```
              ╔═══════════════════════╗
              ║  GreenTech Amazon     ║
              ║  Systems              ║
              ║  Arquitectura         ║
              ║  Hexagonal            ║
              ╚═══════════════════════╝
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼────┐  ┌───▼────┐  ┌───▼────┐
    │Frontend │  │Backend │  │Database│
    └────────┘  └────────┘  └────────┘
```

**Documentación Completa • Diagramas Visuales • Prompts IA • Listo para Producción**

---

*Última actualización: 2026-07-02*  
*GreenTech Amazon Systems © 2024*
