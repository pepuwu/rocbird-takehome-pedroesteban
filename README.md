# Rocbird takehome Fullstack/Heavy backend dev

Este proyecto base es un starter kit enfocadao a una herramienta interna para control de staffing de talentos para que puedas demostrar tus habilidades técnicas como fullstack orientado fuertemente a backend con tecnologías modernas.  
Aquí tendrás que implementar y extender funcionalidades usando **Next.js v15**, **TypeScript**, **Prisma ORM** y una UI base con **shadcn** y **TailwindCSS**.

El objetivo principal es evaluar la capacidad del postulante para:  
- Diseñar **APIs limpias** y seguras.  
- Manejar base de datos con Prisma ORM aplicando buenas prácticas.  
- Crear interfaces eficientes, escalables, fuertemente tipadas y correctamente estructuradas.  

El tiempo para resolver este takehome será de **7 días** desde el día en el que se comparta el repo para ser clonado.

---

## Puntos a resolver

1. **CRUD completo de talentos**  
   - Implementar las operaciones Create, Read, Update y Delete para el modelo `Talento` usando Prisma y exponerlos a través de rutas API de Next.js (App Router).  
   - La UI deberá permitir listar, crear, editar y eliminar talentos.  
   - Usar rutas dinámicas (`app/talentos/[id]`) y soportar query params para filtrado y paginación (`/talentos?page=2&sort=asc`).

2. **Validación y manejo de errores**  
   - Validar tanto en backend como en frontend asegurando tipado estricto entre ambos.  
   - Validar campos requeridos, formatos y devolver códigos HTTP correctos.  
   - Mostrar mensajes claros y amigables para el usuario en la UI (toast, alert).

3. **Consumo eficiente de la base de datos**  
   - Usar `select` / `include` para traer solo datos necesarios.  
   - Evitar N+1 queries con relaciones bien definidas.  
   - Manejar transacciones con `prisma.$transaction` para operaciones múltiples.

4. **Uso de componentes UI reutilizables**  
   - Usar componentes de `shadcn/ui` para formularios, tablas, modales y toasts.  
   - Seguir un patrón consistente de estilos y estructura.  
   - Construir componentes genéricos reutilizables que puedan adaptarse a distintos casos.

5. **Configuración y documentación clara**  
   - Proyecto listo para clonar y correr con instrucciones claras.  
   - Scripts útiles (`db:push`, `db:seed`, `lint`, `format`).  
   - `.env.example` documentado.

6. **Modelado y seed de base de datos**  
   - Levantar una base de datos **PostgreSQL local**.  
   - Conectarla al backend mediante Prisma.  
   - Crear un **seed inicial** que incluya las siguientes tablas y relaciones:
     - **talento**: Representa a una persona parte del staff.(nombre_y_apellido, seniority, rol, estado ("activo" o "inactivo"), )
     - **referente_tecnico**: Puede actuar como **líder** y/o **mentor** de uno o varios talentos.  
       - Un talento puede tener **líder** y/o **mentor** (pueden ser la misma persona o distintas).  
       - Un referente técnico puede tener múltiples talentos a cargo (determinar correctamente relaciones uno a muchos, muchos a muchos, etc).  
     - **interaccion**: Registro de interacciones de un talento, generar los tipos correctos para cada columna del schema (tipo_de_interaccion, fecha, detalle, estado, fecha_de_modificacion) y vincularlas correctamente al talento.  
       - Un talento puede tener múltiples interacciones.
       - El estado de la intearccion puede actualizarse desde el front ("Iniciada", "En Progreso", "Finalizada")
       - Documentar el esquema y sus relaciones en el README o en `prisma/schema.prisma`.  

---

## Puntos extra (opcionales):

- Utilizar Docker.  
- Testing unitario de funcionalidades críticas.  

---

## 🚀 Instalación y Setup

### 🐳 **Opción 1: Docker (Recomendado)**
```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd rocbird-takehome
git checkout develop

# Levantar todo el stack con Docker
docker-compose up -d

# La aplicación estará disponible en http://localhost:3000
# Prisma Studio en http://localhost:5555
```

### 💻 **Opción 2: Instalación Local**
#### 1. Clonar e instalar dependencias
```bash
git clone <tu-repo-url>
cd rocbird-takehome
git checkout develop
npm install
```

### 2. Configurar PostgreSQL
```bash
# macOS con Homebrew
brew install postgresql@15
brew services start postgresql@15
createdb rocbird_takehome

# O con Docker
docker run --name postgres-rocbird \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=rocbird_takehome \
  -p 5432:5432 -d postgres:15
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```bash
# Para usuario local sin contraseña
DATABASE_URL="postgresql://tu_usuario@localhost:5432/rocbird_takehome"

# Para Docker
DATABASE_URL="postgresql://postgres:password@localhost:5432/rocbird_takehome"
```

### 4. Configurar base de datos
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. Ejecutar el proyecto
```bash
npm run dev
```

Abre [http://localhost:3000] en tu navegador para ver el resultado.

## 📊 Scripts Útiles

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
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Poblar con datos de ejemplo  
npm run db:studio    # Abrir Prisma Studio
npm run db:reset     # Reset completo + seed
```

## 🗄️ Documentación del Schema

### Entidades y Relaciones

#### **Talento**
```prisma
model Talento {
  id                String   @id @default(cuid())
  nombre_y_apellido String
  seniority         Seniority // JUNIOR, SEMI_SENIOR, SENIOR, LEAD, ARCHITECT
  rol               String
  estado            EstadoTalento @default(ACTIVO) // ACTIVO, INACTIVO
  fecha_creacion    DateTime @default(now())
  fecha_actualizacion DateTime @updatedAt
  
  // Relaciones opcionales
  lider_id          String?
  mentor_id         String?
  lider             ReferenteTecnico? @relation("LiderTalento")
  mentor            ReferenteTecnico? @relation("MentorTalento")
  interacciones     Interaccion[]
}
```

#### **ReferenteTecnico**
```prisma
model ReferenteTecnico {
  id                String   @id @default(cuid())
  nombre_y_apellido String
  email             String   @unique
  especialidad      String?
  fecha_creacion    DateTime @default(now())
  fecha_actualizacion DateTime @updatedAt
  
  // Relaciones - Un referente puede liderar/mentorar múltiples talentos
  talentos_liderados    Talento[] @relation("LiderTalento")
  talentos_mentoreados  Talento[] @relation("MentorTalento")
}
```

#### **Interaccion**
```prisma
model Interaccion {
  id                    String   @id @default(cuid())
  tipo_de_interaccion   TipoInteraccion // REUNION_1_1, CODE_REVIEW, MENTORIA, etc.
  fecha                 DateTime @default(now())
  detalle               String
  estado                EstadoInteraccion @default(INICIADA) // INICIADA, EN_PROGRESO, FINALIZADA
  fecha_de_modificacion DateTime @updatedAt
  
  // Relación - Una interacción pertenece a un talento
  talento_id            String
  talento               Talento @relation(fields: [talento_id], references: [id], onDelete: Cascade)
}
```

### Datos de Ejemplo
El seed crea:
- **4 referentes técnicos** (Ana García, Carlos Rodríguez, María López, Diego Fernández)
- **6 talentos** con diferentes roles y seniorities
- **19 interacciones** de diferentes tipos

## 🎯 APIs Implementadas

### Talentos
- `GET /api/talentos` - Listar con filtros y paginación
- `GET /api/talentos/[id]` - Obtener por ID
- `POST /api/talentos` - Crear nuevo
- `PUT /api/talentos/[id]` - Actualizar
- `DELETE /api/talentos/[id]` - Eliminar

### Referentes Técnicos
- `GET /api/referentes-tecnicos` - Listar todos
- `POST /api/referentes-tecnicos` - Crear nuevo

### Interacciones
- `GET /api/interacciones` - Listar todas (filtro por talento_id)
- `POST /api/interacciones` - Crear nueva
- `PUT /api/interacciones/[id]` - Actualizar estado

### Sistema
- `GET /api/health` - Estado de la API y DB