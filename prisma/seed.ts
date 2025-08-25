import { PrismaClient, Seniority, EstadoTalento, TipoInteraccion, EstadoInteraccion } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.interaccion.deleteMany();
  await prisma.talento.deleteMany();
  await prisma.referenteTecnico.deleteMany();

  // Crear referentes técnicos con datos realistas
  const referentes = await prisma.referenteTecnico.createMany({
    data: [
      {
        nombre_y_apellido: 'María González',
        email: 'maria.gonzalez@rocbird.com',
        especialidad: 'Frontend Development & UI/UX',
      },
      {
        nombre_y_apellido: 'Carlos Mendoza',
        email: 'carlos.mendoza@rocbird.com',
        especialidad: 'Backend Development & Architecture',
      },
      {
        nombre_y_apellido: 'Ana Rodríguez',
        email: 'ana.rodriguez@rocbird.com',
        especialidad: 'DevOps & Cloud Infrastructure',
      },
      {
        nombre_y_apellido: 'Luis Fernández',
        email: 'luis.fernandez@rocbird.com',
        especialidad: 'Full Stack Development & Team Leadership',
      },
      {
        nombre_y_apellido: 'Sofia Martínez',
        email: 'sofia.martinez@rocbird.com',
        especialidad: 'Mobile Development & Cross-platform',
      }
    ]
  });

  // Obtener los referentes creados
  const referentesCreados = await prisma.referenteTecnico.findMany();
  const maria = referentesCreados.find(r => r.email === 'maria.gonzalez@rocbird.com')!;
  const carlos = referentesCreados.find(r => r.email === 'carlos.mendoza@rocbird.com')!;
  const ana = referentesCreados.find(r => r.email === 'ana.rodriguez@rocbird.com')!;
  const luis = referentesCreados.find(r => r.email === 'luis.fernandez@rocbird.com')!;
  const sofia = referentesCreados.find(r => r.email === 'sofia.martinez@rocbird.com')!;

  // Crear talentos con datos realistas organizados por equipos
  const talentos = await prisma.talento.createMany({
    data: [
      // Equipo Frontend
      {
        nombre_y_apellido: 'Diego Silva',
        seniority: Seniority.JUNIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: maria.id,
        mentor_id: maria.id,
      },
      {
        nombre_y_apellido: 'Valentina Herrera',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: maria.id,
        mentor_id: maria.id,
      },
      {
        nombre_y_apellido: 'Roberto Jiménez',
        seniority: Seniority.SENIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: maria.id,
        mentor_id: luis.id,
      },

      // Equipo Backend
      {
        nombre_y_apellido: 'Camila Torres',
        seniority: Seniority.JUNIOR,
        rol: 'Backend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: carlos.id,
      },
      {
        nombre_y_apellido: 'Andrés Morales',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Backend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: carlos.id,
      },
      {
        nombre_y_apellido: 'Natalia Castro',
        seniority: Seniority.SENIOR,
        rol: 'Backend Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: carlos.id,
        mentor_id: luis.id,
      },
      {
        nombre_y_apellido: 'Miguel Rojas',
        seniority: Seniority.LEAD,
        rol: 'Backend Team Lead',
        estado: EstadoTalento.ACTIVO,
        lider_id: luis.id,
        mentor_id: luis.id,
      },

      // Equipo DevOps
      {
        nombre_y_apellido: 'Gabriela Paredes',
        seniority: Seniority.JUNIOR,
        rol: 'DevOps Engineer',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: ana.id,
      },
      {
        nombre_y_apellido: 'Felipe Vega',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'DevOps Engineer',
        estado: EstadoTalento.ACTIVO,
        lider_id: ana.id,
        mentor_id: ana.id,
      },

      // Equipo Mobile
      {
        nombre_y_apellido: 'Isabella Contreras',
        seniority: Seniority.JUNIOR,
        rol: 'Mobile Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: sofia.id,
        mentor_id: sofia.id,
      },
      {
        nombre_y_apellido: 'Sebastián Fuentes',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Mobile Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: sofia.id,
        mentor_id: sofia.id,
      },

      // Equipo Full Stack
      {
        nombre_y_apellido: 'Daniela Ruiz',
        seniority: Seniority.SENIOR,
        rol: 'Full Stack Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: luis.id,
        mentor_id: luis.id,
      },
      {
        nombre_y_apellido: 'Matías Espinoza',
        seniority: Seniority.SEMI_SENIOR,
        rol: 'Full Stack Developer',
        estado: EstadoTalento.ACTIVO,
        lider_id: luis.id,
        mentor_id: luis.id,
      },

      // Talento inactivo (ejemplo)
      {
        nombre_y_apellido: 'Alejandro Soto',
        seniority: Seniority.JUNIOR,
        rol: 'Frontend Developer',
        estado: EstadoTalento.INACTIVO,
        lider_id: maria.id,
        mentor_id: null,
      }
    ]
  });

  // Obtener los talentos creados para crear interacciones
  const talentosCreados = await prisma.talento.findMany({
    where: { estado: EstadoTalento.ACTIVO }
  });

  // Crear interacciones realistas
  const interaccionesData = [];
  
  for (const talento of talentosCreados) {
    // Crear 2-4 interacciones por talento
    const numInteracciones = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numInteracciones; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30)); // Últimos 30 días
      
      const tipos = Object.values(TipoInteraccion);
      const estados = Object.values(EstadoInteraccion);
      
      interaccionesData.push({
        tipo_de_interaccion: tipos[Math.floor(Math.random() * tipos.length)],
        fecha: fecha,
        detalle: generarDetalleInteraccion(talento.rol, tipos[Math.floor(Math.random() * tipos.length)]),
        estado: estados[Math.floor(Math.random() * estados.length)],
        talento_id: talento.id,
      });
    }
  }

  await prisma.interaccion.createMany({
    data: interaccionesData
  });

  console.log('✅ Seed completado exitosamente');
  console.log(`📊 ${referentesCreados.length} referentes técnicos creados`);
  console.log(`👥 ${talentosCreados.length} talentos creados`);
  console.log(`📝 ${interaccionesData.length} interacciones creadas`);
}

function generarDetalleInteraccion(rol: string, tipo: string): string {
  const detalles = {
    REUNION_1_1: [
      `Reunión semanal de seguimiento del ${rol.toLowerCase()}. Revisión de objetivos y planificación de la próxima semana.`,
      `Sesión de feedback y desarrollo profesional para el rol de ${rol.toLowerCase()}.`,
      `Reunión de alineación de expectativas y revisión de KPIs del ${rol.toLowerCase()}.`
    ],
    CODE_REVIEW: [
      `Revisión de código del proyecto actual. Feedback sobre buenas prácticas y optimizaciones para ${rol.toLowerCase()}.`,
      `Code review de la implementación de nuevas funcionalidades. Sugerencias de mejora y refactoring.`,
      `Revisión de pull request con enfoque en calidad de código y estándares del equipo.`
    ],
    MENTORIA: [
      `Sesión de mentoría técnica sobre mejores prácticas en ${rol.toLowerCase()}. Compartir experiencias y casos de uso.`,
      `Mentoría sobre arquitectura de software y patrones de diseño aplicados al rol de ${rol.toLowerCase()}.`,
      `Sesión de desarrollo de habilidades técnicas específicas del ${rol.toLowerCase()}.`
    ],
    EVALUACION: [
      `Evaluación de desempeño del ${rol.toLowerCase()}. Revisión de objetivos cumplidos y áreas de mejora.`,
      `Evaluación técnica del ${rol.toLowerCase()}. Análisis de competencias y plan de desarrollo.`,
      `Evaluación de proyecto entregado por el ${rol.toLowerCase()}. Feedback constructivo y reconocimiento.`
    ],
    FEEDBACK: [
      `Sesión de feedback sobre el trabajo reciente del ${rol.toLowerCase()}. Reconocimiento de logros y sugerencias.`,
      `Feedback sobre la colaboración en equipo y comunicación del ${rol.toLowerCase()}.`,
      `Feedback sobre la calidad del trabajo entregado por el ${rol.toLowerCase()}.`
    ],
    CAPACITACION: [
      `Capacitación sobre nuevas tecnologías y herramientas para ${rol.toLowerCase()}.`,
      `Workshop de mejores prácticas y metodologías ágiles para el equipo.`,
      `Capacitación sobre seguridad y testing en el contexto de ${rol.toLowerCase()}.`
    ],
    OTRO: [
      `Sesión de brainstorming para mejorar procesos del equipo de ${rol.toLowerCase()}.`,
      `Reunión de coordinación interdepartamental con el equipo de ${rol.toLowerCase()}.`,
      `Sesión de resolución de problemas técnicos del proyecto actual.`
    ]
  };

  const detallesDisponibles = detalles[tipo as keyof typeof detalles] || detalles.OTRO;
  return detallesDisponibles[Math.floor(Math.random() * detallesDisponibles.length)];
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
