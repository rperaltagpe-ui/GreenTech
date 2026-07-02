# Script para agregar Node.js al PATH en PowerShell y ejecutar npm

Write-Host "`n=== Agregando Node.js al PATH ===" -ForegroundColor Green

# Agregar Node.js al PATH de la sesión actual
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Verificar que npm está disponible
Write-Host ""
node --version
npm --version

Write-Host "`n=== Iniciando servidor de desarrollo ===" -ForegroundColor Cyan
Write-Host ""

# Cambiar a la carpeta del proyecto
cd C:\GreeTech

# Ejecutar npm run dev
npm run dev
