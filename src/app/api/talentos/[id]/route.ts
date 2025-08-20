import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { TalentoUpdateSchema } from "../../../../lib/validations";
import { 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError,
  createMethodHandler
} from "../../../../lib/api-utils";

// ========================================
// GET /api/talentos/[id] - OBTENER TALENTO POR ID
// ========================================

async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const talento = await prisma.talento.findUnique({
    where: { id },
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
          detalle: true,
          estado: true,
          fecha: true,
          fecha_de_modificacion: true,
        },
        orderBy: { fecha: "desc" },
      },
      _count: {
        select: {
          interacciones: true,
        }
      }
    },
  });
  
  if (!talento) {
    return createErrorResponse(
      "TALENTO_NOT_FOUND",
      "Talento no encontrado",
      404
    );
  }
  
  return createSuccessResponse(talento);
}

// ========================================
// PUT /api/talentos/[id] - ACTUALIZAR TALENTO
// ========================================

async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const validatedData = TalentoUpdateSchema.parse(body);
  
  // Verificar que el talento existe
  const talentoExistente = await prisma.talento.findUnique({
    where: { id }
  });
  
  if (!talentoExistente) {
    return createErrorResponse(
      "TALENTO_NOT_FOUND",
      "Talento no encontrado",
      404
    );
  }
  
  // Verificar que el líder y mentor existen (si se proporcionan)
  if (validatedData.lider_id) {
    const liderExists = await prisma.referenteTecnico.findUnique({
      where: { id: validatedData.lider_id }
    });
    if (!liderExists) {
      return createErrorResponse(
        "LIDER_NOT_FOUND",
        "El líder especificado no existe",
        400
      );
    }
  }
  
  if (validatedData.mentor_id) {
    const mentorExists = await prisma.referenteTecnico.findUnique({
      where: { id: validatedData.mentor_id }
    });
    if (!mentorExists) {
      return createErrorResponse(
        "MENTOR_NOT_FOUND",
        "El mentor especificado no existe",
        400
      );
    }
  }
  
  const talentoActualizado = await prisma.talento.update({
    where: { id },
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
      interacciones: {
        select: {
          id: true,
          tipo_de_interaccion: true,
          estado: true,
          fecha: true,
        },
        orderBy: { fecha: "desc" },
        take: 5,
      },
    },
  });
  
  return createSuccessResponse(talentoActualizado);
}

// ========================================
// DELETE /api/talentos/[id] - ELIMINAR TALENTO
// ========================================

async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // Verificar que el talento existe
  const talentoExistente = await prisma.talento.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          interacciones: true,
        }
      }
    }
  });
  
  if (!talentoExistente) {
    return createErrorResponse(
      "TALENTO_NOT_FOUND",
      "Talento no encontrado",
      404
    );
  }
  
  // Usar transacción para eliminar en cascada
  // (Las interacciones se eliminan automáticamente por el onDelete: Cascade en el schema)
  const talentoEliminado = await prisma.talento.delete({
    where: { id },
    include: {
      lider: {
        select: {
          id: true,
          nombre_y_apellido: true,
        }
      },
      mentor: {
        select: {
          id: true,
          nombre_y_apellido: true,
        }
      },
    },
  });
  
  return createSuccessResponse({
    message: "Talento eliminado exitosamente",
    talento: talentoEliminado,
    interacciones_eliminadas: talentoExistente._count.interacciones,
  });
}

// ========================================
// EXPORTAR HANDLERS CON MANEJO DE MÉTODOS
// ========================================

const handler = createMethodHandler({
  GET,
  PUT,
  DELETE,
});

export { handler as GET, handler as PUT, handler as DELETE };
