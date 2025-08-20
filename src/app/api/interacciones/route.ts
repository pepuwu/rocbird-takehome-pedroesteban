import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { InteraccionCreateSchema } from "../../../lib/validations";
import { 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError,
  createMethodHandler,
  extractQueryParams
} from "../../../lib/api-utils";

// ========================================
// GET /api/interacciones - LISTAR INTERACCIONES
// ========================================

async function GET(request: NextRequest) {
  const queryParams = extractQueryParams(request);
  const talento_id = queryParams.talento_id;
  
  const where = talento_id ? { talento_id } : {};
  
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
  });
  
  return createSuccessResponse(interacciones);
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
