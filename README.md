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

1. **CRUD completo de usuarios**  
   - Implementar las operaciones Create, Read, Update y Delete para el modelo `Talento` usando Prisma y exponerlos a través de rutas API de Next.js (App Router).  
   - La UI deberá permitir listar, crear, editar y eliminar usuarios.  
   - Usar rutas dinámicas (`app/talentos/[id]`) y soportar query params para filtrado y paginación (`/talentos?page=2&sort=asc`).

2. **Validación y manejo de errores**  
   - Validar en backend con **Zod** o similar, asegurando tipado estricto entre backend y frontend.  
   - Validar unicidad de email, campos requeridos, formatos y devolver códigos HTTP correctos.  
   - Mostrar mensajes claros y amigables en UI (toast, alert).

3. **Consumo eficiente de la base de datos**  
   - Usar `select` / `include` para traer solo datos necesarios.  
   - Implementar paginación con `skip` / `take`.  
   - Evitar N+1 queries con relaciones bien definidas.  
   - Manejar transacciones con `prisma.$transaction` para operaciones múltiples.

4. **Uso de componentes UI reutilizables**  
   - Usar componentes de `shadcn/ui` para formularios, tablas, modales y toasts.  
   - Seguir un patrón consistente de estilos y estructura.  
   - Componer componentes genéricos que puedan adaptarse a distintos casos.

5. **Configuración y documentación clara**  
   - Proyecto listo para clonar y correr con instrucciones claras.  
   - Scripts útiles (`db:push`, `db:seed`, `lint`, `format`).  
   - `.env.example` documentado.

6. **Modelado y seed de base de datos para herramienta de gestión de talentos**  
   - Levantar una base de datos **PostgreSQL local** (recomendado: Docker + Postgres).  
   - Conectarla al backend mediante Prisma.  
   - Crear un **seed inicial** que incluya las siguientes tablas y relaciones:
     - **talento**: Representa a una persona candidata o parte del staff.  
     - **referente_tecnico**: Puede actuar como **líder** y/o **mentor** de uno o varios talentos.  
       - Un talento puede tener **líder** y/o **mentor** (pueden ser la misma persona o distintas).  
       - Un referente técnico puede tener múltiples talentos a cargo.  
     - **interaccion**: Registro de interacciones de un talento (entrevistas, reuniones, feedback).  
       - Un talento puede tener múltiples interacciones.
   - Documentar el esquema y sus relaciones en el README o en `prisma/schema.prisma`.  

---

## Puntos extra (opcionales):

- Utilizar Docker.  
- Testing unitario de funcionalidades críticas.  

---

## Instalar los paquetes necesarios

```bash
npm install
# or
pnpm install
# or
yarn install


## Instalar los paquetes necesarios: 

```bash
npm install
# or
pnpm install
# or
yarn install
```

## Ejecutar entorno

Ejecutar el server dev:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abre [http://localhost:3000] en tu navegador para ver el resultado.