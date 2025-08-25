@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 🚀 Script de inicio automático para Rocbird Takehome (Windows)
REM Este script configura la base de datos y levanta el proyecto

echo 🚀 Iniciando Sistema de Gestión de Talentos - Rocbird Takehome
echo ================================================================

REM Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo [ERROR] No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto.
    pause
    exit /b 1
)

echo [INFO] Verificando prerrequisitos...

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado. Por favor instala Node.js 18 o superior.
    pause
    exit /b 1
)

for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=!NODE_VERSION:~1!
if !NODE_VERSION! lss 18 (
    echo [ERROR] Node.js versión !NODE_VERSION! detectada. Se requiere Node.js 18 o superior.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js !NODE_VERSION! detectado

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no está instalado.
    pause
    exit /b 1
)

echo [SUCCESS] npm detectado

echo [INFO] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo [ERROR] Error al instalar dependencias.
    pause
    exit /b 1
)

echo [INFO] Verificando archivo .env...
if not exist ".env" (
    echo [WARNING] Archivo .env no encontrado. Creando...
    echo DATABASE_URL="postgresql://localhost:5432/rocbird_takehome" > .env
    echo [SUCCESS] Archivo .env creado
) else (
    echo [SUCCESS] Archivo .env encontrado
)

echo [INFO] Verificando base de datos...
echo [WARNING] En Windows, asegúrate de que PostgreSQL esté corriendo y la base de datos 'rocbird_takehome' exista.
echo [INFO] Si no tienes PostgreSQL, puedes crearlo con:
echo    docker run --name postgres-rocbird -e POSTGRES_PASSWORD=password -e POSTGRES_DB=rocbird_takehome -p 5432:5432 -d postgres:15

echo [INFO] Generando cliente de Prisma...
call npx prisma generate
if errorlevel 1 (
    echo [ERROR] Error al generar cliente de Prisma.
    pause
    exit /b 1
)

echo [INFO] Sincronizando schema con la base de datos...
call npx prisma db push
if errorlevel 1 (
    echo [ERROR] Error al sincronizar schema. Verifica que PostgreSQL esté corriendo.
    pause
    exit /b 1
)

echo [INFO] Ejecutando seed de datos...
call npm run db:seed
if errorlevel 1 (
    echo [ERROR] Error al ejecutar seed. Verifica la configuración de la base de datos.
    pause
    exit /b 1
)

echo [SUCCESS] ¡Configuración completada exitosamente!
echo.
echo 🎯 Próximos pasos:
echo   1. Ejecuta: npm run dev
echo   2. Abre: http://localhost:3000
echo   3. Prisma Studio: npx prisma studio
echo.
echo 📊 Datos disponibles:
echo   - 5 referentes técnicos
echo   - 20 talentos organizados por equipos
echo   - Interacciones variadas
echo.

set /p START_NOW="¿Quieres levantar el proyecto ahora? (y/n): "
if /i "!START_NOW!"=="y" (
    echo [INFO] Levantando proyecto...
    call npm run dev
) else (
    echo [SUCCESS] ¡Perfecto! Ejecuta 'npm run dev' cuando quieras.
)

pause
