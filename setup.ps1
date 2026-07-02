Write-Host "`n=== Buscando Node.js ===" -ForegroundColor Cyan

$nodePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs"
)

$nodeFound = $false

foreach ($path in $nodePaths) {
    if (Test-Path "$path\node.exe") {
        Write-Host "✅ Node.js encontrado en: $path" -ForegroundColor Green
        $env:PATH = "$path;$env:PATH"
        $nodeFound = $true
        break
    }
}

if (-not $nodeFound) {
    Write-Host "❌ Node.js no encontrado" -ForegroundColor Red
    Write-Host "Instala desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
node --version
npm --version

cd C:\GreeTech

Write-Host "`nInstalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "`n✅ Listo! Usa: npm run dev" -ForegroundColor Green
