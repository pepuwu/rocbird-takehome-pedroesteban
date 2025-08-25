#!/bin/sh

echo "🚀 Iniciando Sistema de Gestión de Talentos..."

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
until pg_isready -h postgres -U postgres -d rocbird_takehome; do
  echo "PostgreSQL no está listo, esperando..."
  sleep 2
done

echo "✅ PostgreSQL está listo!"

# Generar cliente Prisma si no existe
if [ ! -f "/app/node_modules/.prisma/client/index.js" ]; then
  echo "🔧 Generando cliente Prisma..."
  npx prisma generate
fi

# Aplicar migraciones
echo "📊 Aplicando migraciones..."
npx prisma db push

# Ejecutar seed si la base está vacía
echo "🌱 Verificando si necesitamos poblar la base de datos..."
TALENTOS_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM talentos;" 2>/dev/null | tail -n 1 || echo "0")

if [ "$TALENTOS_COUNT" -eq "0" ]; then
  echo "🌱 Poblando base de datos con datos de ejemplo..."
  npx prisma db seed
else
  echo "✅ Base de datos ya tiene datos"
fi

echo "🚀 Iniciando aplicación..."
exec node server.js
