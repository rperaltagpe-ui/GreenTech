@echo off
REM Buscar Node.js en localizaciones comunes
setlocal enabledelayedexpansion

set "NODE_FOUND=0"

REM Localizaciones comunes de Node.js
set "PATHS=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;C:\Users\%USERNAME%\AppData\Roaming\npm"

for %%P in (%PATHS%) do (
    if exist "%%P\node.exe" (
        set "PATH=%%P;!PATH!"
        set "NODE_FOUND=1"
        echo ✅ Node.js encontrado en: %%P
    )
)

if !NODE_FOUND! equ 0 (
    echo ❌ Node.js no encontrado en PATH
    echo.
    echo 📥 Por favor, instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

cd /d "%~dp0"

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo.
    echo 📦 Instalando dependencias...
    call npm install
)

REM Inicializar BD si no existe
if not exist "greentech.db" (
    echo.
    echo 🗄️ Inicializando base de datos...
    call npm run init-db
)

echo.
echo 🚀 Iniciando servidor en desarrollo...
echo.
call npm run dev

pause
