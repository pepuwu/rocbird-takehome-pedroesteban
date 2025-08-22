import { PrismaClient, Seniority, EstadoTalento, TipoInteraccion, EstadoInteraccion } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.interaccion.deleteMany();
  await prisma.talento.deleteMany();
  await prisma.referenteTecnico.deleteMany();

  // Crear referentes técnicos
  const referentes = await prisma.referenteTecnico.createMany({
    data: [
      {
        nombre_y_apellido: 'Ana García',
        email: 'ana.garcia@rocbird.com',
        especialidad: 'Frontend Development',
      },
      {
        nombre_y_apellido: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@rocbird.com',
        especialidad: 'Backend Development',
      },
      {
        nombre_y_apellido: 'María López',
        email: 'maria.lopez@rocbird.com',
        especialidad: 'DevOps & Infrastructure',
      },
      {
        nombre_y_apellido: 'Diego Fernández',
        email: 'diego.fernandez@rocbird.com',
        especialidad: 'Full Stack Development',
      }
    ]
  });

  // Obtener los referentes creados
  const referentesCreados = await prisma.referenteTecnico.findMany();
  const ana = referentesCreados.find(r => r.email === 'ana.garcia@rocbird.com')!;
  const carlos = referentesCreados.find(r => r.email === 'carlos.rodriguez@rocbird.com')!;
  const maria = referentesCreados.find(r => r.email === 'maria.lopez@rocbird.com')!;
  const diego = referentesCreados.find(r => r.email === 'diego.fernandez@rocbird.com')!;

  // Crear talentos
  const talentos = await prisma.talento.createMany({
    data: [
      // Frontend Team
      {
        nombre_y_apellido: 'Juan Pérez',
        seniority: Seniority.JUNIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: ana.id,
      },
      {
        nombre_y_apellido: 'Valentina Castro',
        seniority: Seniority.JUNIOR,
        rol: 'React Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: ana.id,
      },
      {
        nombre_y_apellido: 'Matías González',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: diego.id,
      },
      
      // Backend Team
      {
        nombre_y_apellido: 'Laura Martínez',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Backend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: diego.id,
      },
      {
        nombre_y_apellido: 'Santiago Rivera',
        seniority: Seniority.JUNIOR,
        rol: 'Node.js Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: carlos.id,
      },
      {
        nombre_y_apellido: 'Isabella Moreno',
        seniority: Seniority.SENIOR,
        rol: 'Backend Architect',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: diego.id,
      },
      
      // Full Stack Team
      {
        nombre_y_apellido: 'Roberto Silva',
        seniority: Seniority.SENIOR,
        rol: 'Full Stack Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: diego.id,
        mentor_id: carlos.id,
      },
      {
        nombre_y_apellido: 'Camila Vargas',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Full Stack Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: diego.id,
        mentor_id: diego.id,
      },
      
      // QA Team
      {
        nombre_y_apellido: 'Carmen Torres',
        seniority: Seniority.JUNIOR,
        rol: 'QA Tester',
        estado: EstadoTalento.ACTIVO,
        lider_id: maria.id,
        mentor_id: maria.id,
      },
      {
        nombre_y_apellido: 'Alejandro Ruiz',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'QA Automation Engineer',
        estado: EstadoTalento.ACTIVO,
        lider_id: maria.id,
        mentor_id: maria.id,
      },
      
      // DevOps Team
      {
        nombre_y_apellido: 'Sofía Herrera',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'DevOps Engineer',
        estado: EstadoTalento.ACTIVO, // Cambié a ACTIVO
        lider_id: maria.id,
        mentor_id: maria.id,
      },
      {
        nombre_y_apellido: 'Nicolás Mendoza',
        seniority: Seniority.SENIOR,
        rol: 'Cloud Engineer',
        estado: EstadoTalento.ACTIVO,
        lider_id: maria.id,
        mentor_id: diego.id,
      },
      
      // Leads y Seniors
      {
        nombre_y_apellido: 'Andrés Morales',
        seniority: Seniority.LEAD,
        rol: 'Tech Lead Frontend',
        estado: EstadoTalento.ACTIVO,
        lider_id: diego.id,
      },
      {
        nombre_y_apellido: 'Fernanda López',
        seniority: Seniority.LEAD,
        rol: 'Tech Lead Backend',
        estado: EstadoTalento.ACTIVO,
        lider_id: diego.id,
      },
      {
        nombre_y_apellido: 'Gabriel Jiménez',
        seniority: Seniority.ARCHITECT,
        rol: 'Software Architect',
        estado: EstadoTalento.ACTIVO,
        lider_id: diego.id,
      },
      
      // Algunos inactivos
      {
        nombre_y_apellido: 'Marina Vega',
        seniority: Seniority.JUNIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.INACTIVO,
        lider_id: ana.id,
        mentor_id: ana.id,
      },
      {
        nombre_y_apellido: 'Tomás Acosta',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Backend Developer',
        estado: EstadoTalento.INACTIVO,
        lider_id: carlos.id,
        mentor_id: carlos.id,
      },
      
      // Mobile Team
      {
        nombre_y_apellido: 'Lucía Fernández',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Mobile Developer (React Native)',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: diego.id,
      },
      {
        nombre_y_apellido: 'Diego Ramírez',
        seniority: Seniority.SENIOR,
        rol: 'iOS Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: diego.id,
      },
      
      // Data Team
      {
        nombre_y_apellido: 'Ana Carolina Ríos',
        seniority: Seniority.SENIOR,
        rol: 'Data Engineer',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: diego.id,
      }
    ]
  });

  // Obtener los talentos creados
  const talentosCreados = await prisma.talento.findMany();

  // Crear interacciones
  const interacciones = [];
  for (const talento of talentosCreados) {
    // 1-1 meetings
    interacciones.push({
      talento_id: talento.id,
      tipo_de_interaccion: TipoInteraccion.REUNION_1_1,
      detalle: 'Reunión semanal de seguimiento y alineación de objetivos',
      estado: EstadoInteraccion.FINALIZADA,
      fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // hace 1 semana
    });

    // Code reviews
    if (talento.seniority !== Seniority.LEAD) {
      interacciones.push({
        talento_id: talento.id,
        tipo_de_interaccion: TipoInteraccion.CODE_REVIEW,
        detalle: 'Revisión de código del feature de autenticación',
        estado: EstadoInteraccion.EN_PROGRESO,
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
      });
    }

    // Mentorías para juniors
    if (talento.seniority === Seniority.JUNIOR) {
      interacciones.push({
        talento_id: talento.id,
        tipo_de_interaccion: TipoInteraccion.MENTORIA,
        detalle: 'Sesión de mentoría sobre mejores prácticas de desarrollo',
        estado: EstadoInteraccion.INICIADA,
        fecha: new Date(), // hoy
      });
    }

    // Evaluaciones
    interacciones.push({
      talento_id: talento.id,
      tipo_de_interaccion: TipoInteraccion.EVALUACION,
      detalle: 'Evaluación de performance trimestral',
      estado: EstadoInteraccion.INICIADA,
      fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // en 3 días
    });
  }

  await prisma.interaccion.createMany({
    data: interacciones
  });

  // Mostrar estadísticas
  const totalReferentes = await prisma.referenteTecnico.count();
  const totalTalentos = await prisma.talento.count();
  const totalInteracciones = await prisma.interaccion.count();
  const talentosActivos = await prisma.talento.count({ 
    where: { estado: EstadoTalento.ACTIVO } 
  });

  console.log('✅ Seed completado exitosamente!');
  console.log(`📊 Datos creados:`);
  console.log(`   - ${totalReferentes} referentes técnicos`);
  console.log(`   - ${totalTalentos} talentos (${talentosActivos} activos)`);
  console.log(`   - ${totalInteracciones} interacciones`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
