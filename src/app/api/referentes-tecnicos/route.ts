import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { ReferenteTecnicoCreateSchema } from "../../../lib/validations";
import { 
  createSuccessResponse, 
  handleApiError,
  createMethodHandler
} from "../../../lib/api-utils";

// ========================================
// GET /api/referentes-tecnicos - LISTAR REFERENTES
// ========================================

async function GET(request: NextRequest) {
  const referentes = await prisma.referenteTecnico.findMany({
    include: {
      talentos_liderados: {
        select: {
          id: true,
          nombre_y_apellido: true,
          seniority: true,
          rol: true,
          estado: true,
        }
      },
      talentos_mentoreados: {
        select: {
          id: true,
          nombre_y_apellido: true,
          seniority: true,
          rol: true,
          estado: true,
        }
      },
      _count: {
        select: {
          talentos_liderados: true,
          talentos_mentoreados: true,
        }
      }
    },
    orderBy: { fecha_creacion: "desc" },
  });
  
  return createSuccessResponse(referentes);
}

// ========================================
// POST /api/referentes-tecnicos - CREAR REFERENTE
// ========================================

async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedData = ReferenteTecnicoCreateSchema.parse(body);
  
  const nuevoReferente = await prisma.referenteTecnico.create({
    data: validatedData,
    include: {
      _count: {
        select: {
          talentos_liderados: true,
          talentos_mentoreados: true,
        }
      }
    },
  });
  
  return createSuccessResponse(nuevoReferente, 201);
}

// ========================================
// EXPORTAR HANDLERS
// ========================================

const handler = createMethodHandler({
  GET,
  POST,
});

export { handler as GET, handler as POST };
