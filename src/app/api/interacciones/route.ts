import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { InteraccionCreateSchema } from "../../../lib/validations";
import { 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError,
  createMethodHandler,
  extractQueryParams,
  createPaginatedResponse,
  calculatePagination
} from "../../../lib/api-utils";

// ========================================
// GET /api/interacciones - LISTAR INTERACCIONES
// ========================================

async function GET(request: NextRequest) {
  const queryParams = extractQueryParams(request);
  const talento_id = queryParams.talento_id;
  const page = parseInt(queryParams.page || "1");
  const limit = parseInt(queryParams.limit || "10");
  
  const where = talento_id ? { talento_id } : {};
  
  // Obtener total de registros
  const total = await prisma.interaccion.count({ where });
  
  // Calcular paginación
  const skip = (page - 1) * limit;
  
  const interacciones = await prisma.interaccion.findMany({
    where,
    include: {
      talento: {
        select: {
          id: true,
          nombre_y_apellido: true,
          seniority: true,
          rol: true,
        }
      }
    },
    orderBy: { fecha: "desc" },
    skip,
    take: limit,
  });
  
  const meta = calculatePagination(page, limit, total);
  
  return createPaginatedResponse(interacciones, meta);
}

// ========================================
// POST /api/interacciones - CREAR INTERACCIÓN
// ========================================

async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedData = InteraccionCreateSchema.parse(body);
  
  // Verificar que el talento existe
  const talentoExists = await prisma.talento.findUnique({
    where: { id: validatedData.talento_id }
  });
  
  if (!talentoExists) {
    return createErrorResponse(
      "TALENTO_NOT_FOUND",
      "El talento especificado no existe",
      400
    );
  }
  
  const nuevaInteraccion = await prisma.interaccion.create({
    data: validatedData,
    include: {
      talento: {
        select: {
          id: true,
          nombre_y_apellido: true,
          seniority: true,
          rol: true,
        }
      }
    },
  });
  
  return createSuccessResponse(nuevaInteraccion, 201);
}

// ========================================
// EXPORTAR HANDLERS
// ========================================

const handler = createMethodHandler({
  GET,
  POST,
});

export { handler as GET, handler as POST };
