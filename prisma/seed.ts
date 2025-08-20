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
      {
        nombre_y_apellido: 'Juan Pérez',
        seniority: Seniority.JUNIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: ana.id,
      },
      {
        nombre_y_apellido: 'Laura Martínez',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Backend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: diego.id,
      },
      {
        nombre_y_apellido: 'Roberto Silva',
        seniority: Seniority.SENIOR,
        rol: 'Full Stack Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: diego.id,
        mentor_id: carlos.id,
      },
      {
        nombre_y_apellido: 'Carmen Torres',
        seniority: Seniority.JUNIOR,
        rol: 'QA Tester',
        estado: EstadoTalento.ACTIVO,
        lider_id: maria.id,
        mentor_id: maria.id,
      },
      {
        nombre_y_apellido: 'Andrés Morales',
        seniority: Seniority.LEAD,
        rol: 'Tech Lead',
        estado: EstadoTalento.ACTIVO,
        lider_id: diego.id,
      },
      {
        nombre_y_apellido: 'Sofía Herrera',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'DevOps Engineer',
        estado: EstadoTalento.INACTIVO,
        lider_id: maria.id,
        mentor_id: maria.id,
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
