## Rocbird takehome Fullstack/Heavy backend dev

Este proyecto base es un starter kit para que puedas demostrar tus habilidades tecnicas en como fullstack con tecnologías modernas.  
Aquí tendrás que implementar y extender funcionalidades usando Next.js con TypeScript, Prisma y una UI base con shadcn y TailwindCSS.

El objetivo principal es evaluar la capacidad del postulante para diseñar APIs limpias, manejar base de datos con Prisma ORM, crear interfaces eficientes, escalables, fuertemente tipadas y correctamente estructuradas.

El tiempo para resolver este takehome sera de 5 dias desde el dia en el que se comparta el repo para ser clonado.

---

## Puntos a resolver

1. **CRUD completo de usuarios**  
   Implementar las operaciones Create, Read, Update y Delete para el modelo User usando Prisma y exponerlos a través de rutas API de Next.js (app router).  
   La UI deberá permitir listar, crear, editar y eliminar usuarios.

2. **Validación y manejo de errores**  
   Asegurar que la API y la UI manejan correctamente casos de error y validaciones básicas (ej: email único, campos requeridos).

3. **Consumo eficiente de la base de datos**  
   Usar Prisma con buenas prácticas para consultas y manejo de datos, optimizando cuando sea posible.

4. **Uso de componentes UI reutilizables**  
   Usar componentes de shadcn/ui para la interfaz, manteniendo un diseño limpio, atractivo y escalable.

5. **Configuración y documentación clara**  
   Asegurarse de que el proyecto pueda ser clonado, instalado y ejecutado fácilmente siguiendo el README

---

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