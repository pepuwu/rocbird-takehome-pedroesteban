#!/bin/bash

# 🚀 Script de inicio automático para Rocbird Takehome
# Este script configura la base de datos y levanta el proyecto

set -e  # Salir si hay algún error

echo "🚀 Iniciando Sistema de Gestión de Talentos - Rocbird Takehome"
echo "================================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Verificando prerrequisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18 o superior."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js versión $NODE_VERSION detectada. Se requiere Node.js 18 o superior."
    exit 1
fi

print_success "Node.js $(node -v) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado."
    exit 1
fi

print_success "npm $(npm -v) detectado"

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    print_warning "psql no está disponible. Verificando si PostgreSQL está corriendo..."
    
    # Intentar conectar a PostgreSQL
    if ! pg_isready -h localhost -p 5432 &> /dev/null; then
        print_error "PostgreSQL no está disponible. Por favor:"
        echo "  1. Instala PostgreSQL 15 o superior"
        echo "  2. Asegúrate de que esté corriendo"
        echo "  3. O usa Docker: docker run --name postgres-rocbird -e POSTGRES_PASSWORD=password -e POSTGRES_DB=rocbird_takehome -p 5432:5432 -d postgres:15"
        exit 1
    fi
else
    print_success "PostgreSQL detectado"
fi

print_status "Instalando dependencias..."
npm install

print_status "Verificando archivo .env..."
if [ ! -f ".env" ]; then
    print_warning "Archivo .env no encontrado. Creando..."
    echo 'DATABASE_URL="postgresql://localhost:5432/rocbird_takehome"' > .env
    print_success "Archivo .env creado"
else
    print_success "Archivo .env encontrado"
fi

print_status "Verificando base de datos..."
if ! psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw rocbird_takehome; then
    print_warning "Base de datos 'rocbird_takehome' no encontrada. Creando..."
    
    # Intentar crear la base de datos
    if createdb rocbird_takehome 2>/dev/null; then
        print_success "Base de datos 'rocbird_takehome' creada"
    else
        print_error "No se pudo crear la base de datos. Verifica que:"
        echo "  1. PostgreSQL esté corriendo"
        echo "  2. Tengas permisos para crear bases de datos"
        echo "  3. O crea manualmente: createdb rocbird_takehome"
        exit 1
    fi
else
    print_success "Base de datos 'rocbird_takehome' encontrada"
fi

print_status "Generando cliente de Prisma..."
npx prisma generate

print_status "Sincronizando schema con la base de datos..."
npx prisma db push

print_status "Ejecutando seed de datos..."
npm run db:seed

print_success "¡Configuración completada exitosamente!"
echo ""
echo "🎯 Próximos pasos:"
echo "  1. Ejecuta: npm run dev"
echo "  2. Abre: http://localhost:3000"
echo "  3. Prisma Studio: npx prisma studio"
echo ""
echo "📊 Datos disponibles:"
echo "  - 5 referentes técnicos"
echo "  - 20 talentos organizados por equipos"
echo "  - Interacciones variadas"
echo ""

# Preguntar si quiere levantar el proyecto ahora
read -p "¿Quieres levantar el proyecto ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Levantando proyecto..."
    npm run dev
else
    print_success "¡Perfecto! Ejecuta 'npm run dev' cuando quieras."
fi
