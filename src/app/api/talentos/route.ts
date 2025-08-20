import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { 
  TalentoCreateSchema, 
  TalentoQuerySchema,
  buildSearchFilter,
  buildSortOrder,
  calculatePagination
} from "../../../lib/validations";
import { 
  createSuccessResponse, 
  createPaginatedResponse,
  handleApiError,
  extractQueryParams,
  createMethodHandler
} from "../../../lib/api-utils";

// ========================================
// GET /api/talentos - LISTAR TALENTOS
// ========================================

async function GET(request: NextRequest) {
  const queryParams = extractQueryParams(request);
  const validatedQuery = TalentoQuerySchema.parse(queryParams);
  
  const {
    page = 1,
    limit = 10,
    sort = "desc",
    sortBy = "fecha_creacion",
    estado,
    seniority,
    search
  } = validatedQuery;
  
  const skip = (page - 1) * limit;
  
  // Construir filtros
  const where = {
    ...(estado && { estado }),
    ...(seniority && { seniority }),
    ...buildSearchFilter(search || ""),
  };
  
  // Obtener total de registros
  const total = await prisma.talento.count({ where });
  
  // Obtener talentos con paginación
  const talentos = await prisma.talento.findMany({
    where,
    skip,
    take: limit,
    orderBy: buildSortOrder(sortBy, sort),
    include: {
      lider: {
        select: {
          id: true,
          nombre_y_apellido: true,
          email: true,
          especialidad: true,
        }
      },
      mentor: {
        select: {
          id: true,
          nombre_y_apellido: true,
          email: true,
          especialidad: true,
        }
      },
      interacciones: {
        select: {
          id: true,
          tipo_de_interaccion: true,
          estado: true,
          fecha: true,
        },
        orderBy: { fecha: "desc" },
        take: 5, // Solo las 5 más recientes
      },
      _count: {
        select: {
          interacciones: true,
        }
      }
    },
  });
  
  const meta = calculatePagination(page, limit, total);
  
  return createPaginatedResponse(talentos, meta);
}

// ========================================
// POST /api/talentos - CREAR TALENTO
// ========================================

async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedData = TalentoCreateSchema.parse(body);
  
  // Verificar que el líder y mentor existen (si se proporcionan)
  if (validatedData.lider_id) {
    const liderExists = await prisma.referenteTecnico.findUnique({
      where: { id: validatedData.lider_id }
    });
    if (!liderExists) {
      throw new Error("El líder especificado no existe");
    }
  }
  
  if (validatedData.mentor_id) {
    const mentorExists = await prisma.referenteTecnico.findUnique({
      where: { id: validatedData.mentor_id }
    });
    if (!mentorExists) {
      throw new Error("El mentor especificado no existe");
    }
  }
  
  const nuevoTalento = await prisma.talento.create({
    data: validatedData,
    include: {
      lider: {
        select: {
          id: true,
          nombre_y_apellido: true,
          email: true,
          especialidad: true,
        }
      },
      mentor: {
        select: {
          id: true,
          nombre_y_apellido: true,
          email: true,
          especialidad: true,
        }
      },
    },
  });
  
  return createSuccessResponse(nuevoTalento, 201);
}

// ========================================
// EXPORTAR HANDLER CON MANEJO DE MÉTODOS
// ========================================

const handler = createMethodHandler({
  GET,
  POST,
});

export { handler as GET, handler as POST };
