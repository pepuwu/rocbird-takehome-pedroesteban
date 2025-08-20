import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { InteraccionUpdateSchema } from "../../../../lib/validations";
import { 
  createSuccessResponse, 
  createErrorResponse,
  handleApiError,
  createMethodHandler
} from "../../../../lib/api-utils";

// ========================================
// GET /api/interacciones/[id] - OBTENER INTERACCIÓN POR ID
// ========================================

async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  const interaccion = await prisma.interaccion.findUnique({
    where: { id },
    include: {
      talento: {
        select: {
          id: true,
          nombre_y_apellido: true,
          seniority: true,
          rol: true,
          lider: {
            select: {
              id: true,
              nombre_y_apellido: true,
              email: true,
            }
          },
          mentor: {
            select: {
              id: true,
              nombre_y_apellido: true,
              email: true,
            }
          }
        }
      }
    },
  });
  
  if (!interaccion) {
    return createErrorResponse(
      "INTERACCION_NOT_FOUND",
      "Interacción no encontrada",
      404
    );
  }
  
  return createSuccessResponse(interaccion);
}

// ========================================
// PUT /api/interacciones/[id] - ACTUALIZAR INTERACCIÓN
// ========================================

async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const validatedData = InteraccionUpdateSchema.parse(body);
  
  // Verificar que la interacción existe
  const interaccionExistente = await prisma.interaccion.findUnique({
    where: { id }
  });
  
  if (!interaccionExistente) {
    return createErrorResponse(
      "INTERACCION_NOT_FOUND",
      "Interacción no encontrada",
      404
    );
  }
  
  const interaccionActualizada = await prisma.interaccion.update({
    where: { id },
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
  
  return createSuccessResponse(interaccionActualizada);
}

// ========================================
// DELETE /api/interacciones/[id] - ELIMINAR INTERACCIÓN
// ========================================

async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // Verificar que la interacción existe
  const interaccionExistente = await prisma.interaccion.findUnique({
    where: { id }
  });
  
  if (!interaccionExistente) {
    return createErrorResponse(
      "INTERACCION_NOT_FOUND",
      "Interacción no encontrada",
      404
    );
  }
  
  const interaccionEliminada = await prisma.interaccion.delete({
    where: { id },
  });
  
  return createSuccessResponse({
    message: "Interacción eliminada exitosamente",
    interaccion: interaccionEliminada,
  });
}

// ========================================
// EXPORTAR HANDLERS
// ========================================

const handler = createMethodHandler({
  GET,
  PUT,
  DELETE,
});

export { handler as GET, handler as PUT, handler as DELETE };
