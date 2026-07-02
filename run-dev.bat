@echo off
cd /d C:\GreeTech

REM Agregar Node.js al PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

echo Installing dependencies...
npm install

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Dependencias instaladas correctamente
    echo.
    echo Iniciando servidor en desarrollo...
    npm run dev
) else (
    echo ❌ Error en la instalación
    pause
)
