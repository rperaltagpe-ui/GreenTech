@echo off
REM Script de inicio rápido para GreenTech con SQLite
REM Para Windows

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     GreenTech Amazon Systems - Configuración SQLite     ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js no está instalado o no está en el PATH
    echo 📥 Descargarlo desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado: & node --version

REM Ir al directorio del proyecto
cd /d %~dp0

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo.
    echo 📦 Instalando dependencias...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
)

REM Verificar si la base de datos existe
if not exist "greentech.db" (
    echo.
    echo 🗄️ Inicializando base de datos SQLite...
    call npm run init-db
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error inicializando la base de datos
        pause
        exit /b 1
    )
    echo ✅ Base de datos creada
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║           ✨ Todo listo para iniciar                   ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 🚀 Iniciando servidor en http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Iniciar el servidor
call npm start

pause
