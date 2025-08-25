# 🚀 Sistema de Gestión de Talentos - Rocbird Takehome

**Herramienta interna para control de staffing y seguimiento de talentos en Rocbird**

Sistema fullstack desarrollado con **Next.js 15**, **TypeScript**, **Prisma ORM**, **PostgreSQL** y **shadcn/ui** para la gestión completa de talentos, referentes técnicos e interacciones.

## ✨ Características Implementadas

- ✅ **CRUD completo** de talentos con filtros y paginación
- ✅ **Gestión de referentes técnicos** (líderes y mentores)
- ✅ **Sistema de interacciones** con seguimiento de estados
- ✅ **Dashboard dinámico** con estadísticas en tiempo real
- ✅ **Validaciones robustas** con Zod en frontend y backend
- ✅ **UI moderna** con shadcn/ui y TailwindCSS
- ✅ **Dockerizado** para fácil deployment
- ✅ **Base de datos** con Prisma y PostgreSQL

## 🛠️ Tecnologías

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM
- **Base de Datos:** PostgreSQL
- **UI:** shadcn/ui, TailwindCSS
- **Validación:** Zod
- **Containerización:** Docker & Docker Compose

## 🚀 Instalación Rápida

### 📋 Prerrequisitos

- **Node.js** 18 o superior
- **PostgreSQL** 15 o superior
- **Docker** (opcional, para containerización)



### 🐳 **Opción 1: Docker (Recomendado)**

**🚀 Instalación paso a paso para Docker:**

```bash
# 1. Clonar el repositorio
git clone https://github.com/pepuwu/rocbird-takehome-pedroesteban.git
cd rocbird-takehome-pedroesteban

# 2. Cambiar a la rama main
git checkout main

# 3. Levantar todo el stack
docker-compose up -d

# 5. Esperar a que PostgreSQL esté listo (ver "Container rocbird-postgres Healthy")

# 6. Generar cliente Prisma
docker exec rocbird-app npx prisma generate

# 7. Ejecutar migraciones
docker exec rocbird-app npx prisma db push

# 8. Poblar con datos de ejemplo
docker exec rocbird-app npx prisma db seed

# ✅ ¡Listo! La aplicación estará en http://localhost:3000
```

**🔑 Credenciales por defecto:**
- **Usuario:** `postgres`
- **Contraseña:** `postgres`
- **Base de datos:** `rocbird_takehome`
- **Puerto:** `5432`

**⚠️ IMPORTANTE:**
- **Espera** a que PostgreSQL esté "Healthy" antes de ejecutar comandos
- **Si algo falla**, usa `docker-compose down -v && docker-compose up -d --build`



### 🚨 **Solución de problemas comunes en Docker:**

**Error: "Authentication failed"**
```bash
# Limpiar volúmenes y recrear
docker-compose down -v
docker-compose up -d
```

**Error: "Cannot find module"**
```bash
# Reconstruir contenedor
docker-compose down
docker-compose up -d --build
```

**Error: "Prisma Client did not initialize"**
```bash
# Generar cliente Prisma
docker exec rocbird-app npx prisma generate
```



### 💻 **Opción 2: Instalación Local**

```bash
# 1. Clonar el repositorio
git clone https://github.com/pepuwu/rocbird-takehome-pedroesteban.git
cd rocbird-takehome-pedroesteban

# 2. Cambiar a la rama main
git checkout main

# 3. Instalar dependencias
npm install

# 4. Configurar PostgreSQL
brew install postgresql@15
brew services start postgresql@15
createdb rocbird_takehome

# 5. Configurar base de datos
npx prisma generate
npx prisma db push
npm run db:seed

# 7. Ejecutar en desarrollo
npm run dev

# ✅ ¡Listo! La aplicación estará en http://localhost:3000
```

**⚠️ Nota importante:** Asegúrate de que PostgreSQL esté corriendo y que la base de datos `rocbird_takehome` exista antes de ejecutar los comandos de Prisma.

### 🔍 **Verificación de Configuración**

**Para verificar que todo esté configurado correctamente:**

```bash
# 1. Verificar que el archivo .env existe
ls -la | grep .env

# 2. Verificar el contenido del .env
cat .env

# 3. Probar conexión a la base de datos
npx prisma db pull

# 4. Si hay errores de autenticación, verificar credenciales
```

### 🪟 **Para Usuarios de Windows**

**🚀 Instalación con Docker (RECOMENDADO para Windows):**

```bash
# 1. Clonar el repositorio
git clone https://github.com/pepuwu/rocbird-takehome-pedroesteban.git
cd rocbird-takehome-pedroesteban

# 2. Cambiar a la rama main
git checkout main

# 3. Levantar con Docker
docker-compose up -d

# 5. Esperar a que PostgreSQL esté "Healthy"

# 6. Generar cliente Prisma
docker exec rocbird-app npx prisma generate

# 7. Ejecutar migraciones
docker exec rocbird-app npx prisma db push

# 8. Poblar con datos
docker exec rocbird-app npx prisma db seed

# ✅ ¡Listo! La aplicación estará en http://localhost:3000
```

**⚠️ IMPORTANTE para Windows:**
- **Siempre** usa Docker (evita problemas de instalación de PostgreSQL)
- **Si hay problemas de TTY**: usa comandos sin `-it`
- **Si algo falla**: `docker-compose down -v && docker-compose up -d --build`

## 📊 Scripts Disponibles

### 🐳 **Scripts Docker**
```bash
npm run docker:build    # Construir imagen Docker
npm run docker:up       # Levantar stack completo
npm run docker:down     # Detener stack
npm run docker:logs     # Ver logs en tiempo real
npm run docker:clean    # Limpiar todo (volúmenes incluidos)
```

### 💻 **Scripts de Desarrollo**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Poblar con datos de ejemplo
npm run db:studio    # Abrir Prisma Studio
npm run db:reset     # Reset completo + seed
```

## 🗄️ Estructura de la Base de Datos

### **Entidades Principales**

#### **Talento**
- Información personal y profesional
- Seniority (Junior, Semi-Senior, Senior, Lead, Architect)
- Estado (Activo/Inactivo)
- Relaciones con líder y mentor

#### **Referente Técnico**
- Líderes y mentores del equipo
- Especialidades técnicas
- Pueden liderar y/o mentorar múltiples talentos

#### **Interacción**
- Seguimiento de reuniones, mentorías, evaluaciones
- Estados: Iniciada, En Progreso, Finalizada, Cancelada
- Tipos: Reunión 1:1, Code Review, Mentoría, Evaluación, etc.

### **Datos de Ejemplo**
El seed crea automáticamente:
- **5 referentes técnicos** con especialidades realistas
- **20 talentos** organizados por equipos (Frontend, Backend, DevOps, Mobile, Full Stack)
- **Interacciones variadas** con detalles contextuales

## 🔌 APIs Disponibles

### **Talentos**
- `GET /api/talentos` - Listar con filtros, paginación y sorting
- `GET /api/talentos/[id]` - Obtener talento específico
- `POST /api/talentos` - Crear nuevo talento
- `PUT /api/talentos/[id]` - Actualizar talento
- `DELETE /api/talentos/[id]` - Eliminar talento

### **Referentes Técnicos**
- `GET /api/referentes-tecnicos` - Listar todos los referentes
- `POST /api/referentes-tecnicos` - Crear nuevo referente

### **Interacciones**
- `GET /api/interacciones` - Listar con filtros y paginación
- `POST /api/interacciones` - Crear nueva interacción
- `PUT /api/interacciones/[id]` - Actualizar estado

### **Sistema**
- `GET /api/health` - Estado de la API y conexión a base de datos

## 🎯 Funcionalidades del Frontend

### **Dashboard Principal**
- Estadísticas en tiempo real
- Contadores de talentos, referentes e interacciones
- Navegación rápida a todas las secciones

### **Gestión de Talentos**
- Lista con filtros por estado y seniority
- Búsqueda en tiempo real con debounce
- Paginación y sorting
- CRUD completo (Crear, Ver, Editar, Eliminar)

### **Referentes Técnicos**
- Lista de líderes y mentores
- Crear nuevos referentes
- Ver talentos asociados

### **Interacciones**
- Lista con filtros por tipo y estado
- Crear nuevas interacciones
- Actualizar estados en tiempo real
- Seguimiento completo del ciclo de vida

## 🐳 Docker

### **Servicios Incluidos**
- **PostgreSQL 15** - Base de datos principal
- **Next.js App** - Aplicación principal
- **Prisma Studio** - Gestor de base de datos (opcional)

### **Puertos**
- **3000** - Aplicación principal
- **5433** - PostgreSQL (mapeado desde 5432 interno)
- **5555** - Prisma Studio (opcional)

## 🔧 Configuración Avanzada

### **Variables de Entorno**
```bash
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/rocbird_takehome"

# Aplicación
NODE_ENV="development"
PORT="3000"
```

### **Personalización de Base de Datos**
```bash
# Cambiar puerto PostgreSQL
# En docker-compose.yml, línea 18: "5433:5432"

# Cambiar credenciales
# En docker-compose.yml, líneas 7-9
```

## 📝 Notas de Desarrollo

- **Rama principal:** `main`
- **Base de datos:** PostgreSQL con Prisma ORM
- **UI Components:** shadcn/ui con TailwindCSS
- **Validación:** Zod schemas en frontend y backend
- **Estado:** React hooks con fetch API nativo
- **Routing:** Next.js 15 App Router

## 🚀 Puntos a Mejorar

### **Funcionalidades Pendientes**
- [ ] **Unit Tests** - Implementar testing unitario con Jest/React Testing Library
- [ ] **E2E Tests** - Agregar tests end-to-end con Playwright o Cypress
- [ ] **Error Boundaries** - Implementar manejo de errores en React
- [ ] **Loading States** - Mejorar estados de carga y skeleton screens
- [ ] **Toast Notifications** - Sistema de notificaciones para feedback del usuario

### **Mejoras Técnicas**
- [ ] **Caching** - Implementar React Query o SWR para cache de datos
- [ ] **Optimización** - Lazy loading de componentes y code splitting
- [ ] **SEO** - Meta tags y optimización para motores de búsqueda
- [ ] **PWA** - Convertir en Progressive Web App
- [ ] **Internacionalización** - Soporte multi-idioma

### **DevOps y Deployment**
- [ ] **CI/CD** - Pipeline de GitHub Actions o GitLab CI
- [ ] **Testing Automatizado** - Tests automáticos en cada PR
- [ ] **Monitoreo** - Logs y métricas de performance
- [ ] **Backup** - Estrategia de backup de base de datos
- [ ] **Escalabilidad** - Preparar para múltiples instancias

## 🤝 Contribución

Este es un proyecto de take-home para Rocbird. Para contribuir:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Proyecto interno de Rocbird para evaluación de candidatos.

---

