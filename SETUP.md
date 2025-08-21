# 🚀 Guía de Setup - Sistema de Gestión de Talentos

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **PostgreSQL** v12 o superior
- **Git**

## 🛠️ Instalación Paso a Paso

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd rocbird-takehome
git checkout develop
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar PostgreSQL

#### Opción A: Homebrew (macOS)
```bash
# Instalar PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Crear la base de datos
createdb rocbird_takehome
```

#### Opción B: Docker
```bash
# Ejecutar PostgreSQL en Docker
docker run --name postgres-rocbird \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=rocbird_takehome \
  -p 5432:5432 -d postgres:15
```

### 4. Configurar variables de entorno
```bash
# Crear archivo .env
echo 'DATABASE_URL="postgresql://TU_USUARIO@localhost:5432/rocbird_takehome"' > .env

# Para Docker, usar:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/rocbird_takehome"
```

### 5. Configurar la base de datos
```bash
# Generar cliente de Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma db push

# Poblar con datos de ejemplo
npm run db:seed
```

### 6. Ejecutar el proyecto
```bash
# Levantar el servidor de desarrollo
npm run dev
```

### 7. Verificar que funciona
- **Frontend**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (ejecutar `npx prisma studio`)
- **API Health**: http://localhost:3000/api/health

## 📊 Comandos Útiles

```bash
# Scripts de base de datos
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Poblar con datos de ejemplo
npm run db:studio    # Abrir Prisma Studio
npm run db:reset     # Reset completo + seed

# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 🗄️ Estructura de la Base de Datos

### Entidades Principales
- **talentos**: Personas del staff (nombre, seniority, rol, estado)
- **referentes_tecnicos**: Líderes y mentores
- **interacciones**: Seguimiento de actividades

### Relaciones
- Un talento puede tener un líder y/o mentor
- Un referente técnico puede liderar/mentorar múltiples talentos
- Un talento puede tener múltiples interacciones

## 🎯 Funcionalidades Implementadas

- ✅ CRUD completo de talentos
- ✅ Dashboard con estadísticas
- ✅ Filtros y búsqueda en tiempo real
- ✅ Paginación
- ✅ Validaciones frontend y backend
- ✅ APIs REST completas
- ✅ UI moderna con shadcn/ui

## 🐛 Solución de Problemas

### Error de conexión a base de datos
1. Verificar que PostgreSQL esté corriendo
2. Verificar la URL de conexión en `.env`
3. Verificar que la base de datos existe

### Error al instalar dependencias
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error en Prisma
```bash
# Regenerar cliente de Prisma
npx prisma generate
npx prisma db push
```

## 📞 Contacto
Si tienes problemas, verifica:
1. Versión de Node.js
2. PostgreSQL corriendo
3. Variables de entorno correctas
4. Dependencias instaladas
