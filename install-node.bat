@echo off
REM Descargar e instalar Node.js automáticamente

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║      Instalador Automático de Node.js para GreenTech    ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Verificar si CURL o PowerShell están disponibles
echo 📥 Descargando Node.js LTS...
echo.

REM Usar PowerShell para descargar
PowerShell -Command "& {
    $url = 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi'
    $installer = 'nodejs-installer.msi'
    Write-Host 'Descargando desde: $url' -ForegroundColor Green
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    (New-Object System.Net.WebClient).DownloadFile($url, $installer)
    Write-Host '✅ Descarga completada' -ForegroundColor Green
    Write-Host 'Ejecutando instalador...' -ForegroundColor Yellow
    Start-Process $installer -Wait
    Remove-Item $installer
    Write-Host '✅ Node.js instalado correctamente' -ForegroundColor Green
}"

REM Refrescar PATH
echo.
echo 🔄 Actualizando PATH del sistema...

REM Agregar Node.js al PATH actual
set "PATH=%PATH%;C:\Program Files\nodejs"

echo ✅ Node.js debería estar disponible ahora
echo.
echo 📦 Instalando dependencias de GreenTech...
cd /d "%~dp0"
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✨ ¡Todo listo! Ejecuta:
    echo.
    echo    npm run dev
    echo.
) else (
    echo ❌ Error en la instalación
    echo Por favor, intenta manualmente:
    echo 1. Descarga: https://nodejs.org/
    echo 2. Instala la versión LTS
    echo 3. Reinicia PowerShell
    echo 4. Corre: npm run dev
)

pause
