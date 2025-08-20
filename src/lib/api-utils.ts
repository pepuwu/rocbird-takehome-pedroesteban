import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma";
import { ApiError, PaginationMeta } from "./validations";

// ========================================
// UTILIDADES PARA RESPUESTAS DE API
// ========================================

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(
  error: string,
  message: string,
  status: number = 400,
  details?: any
): NextResponse {
  const errorResponse: ApiError = {
    error,
    message,
    ...(details && { details }),
  };
  
  return NextResponse.json(errorResponse, { status });
}

export function createPaginatedResponse<T>(
  data: T[],
  meta: PaginationMeta,
  status: number = 200
) {
  return NextResponse.json({
    data,
    meta,
  }, { status });
}

// ========================================
// MANEJO DE ERRORES
// ========================================

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Error de validación de Zod
  if (error instanceof ZodError) {
    return createErrorResponse(
      "VALIDATION_ERROR",
      "Datos de entrada inválidos",
      400,
      error.errors
    );
  }

  // Errores de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return createErrorResponse(
          "UNIQUE_CONSTRAINT_ERROR",
          "Ya existe un registro con estos datos únicos",
          409,
          { field: error.meta?.target }
        );
      
      case "P2025":
        return createErrorResponse(
          "RECORD_NOT_FOUND",
          "El registro solicitado no fue encontrado",
          404
        );
      
      case "P2003":
        return createErrorResponse(
          "FOREIGN_KEY_CONSTRAINT_ERROR",
          "Referencia inválida a otro registro",
          400,
          { field: error.meta?.field_name }
        );
      
      default:
        return createErrorResponse(
          "DATABASE_ERROR",
          "Error en la base de datos",
          500,
          { code: error.code }
        );
    }
  }

  // Error general de Prisma
  if (error instanceof Prisma.PrismaClientValidationError) {
    return createErrorResponse(
      "DATABASE_VALIDATION_ERROR",
      "Error de validación en la base de datos",
      400
    );
  }

  // Error genérico
  if (error instanceof Error) {
    return createErrorResponse(
      "INTERNAL_ERROR",
      error.message || "Error interno del servidor",
      500
    );
  }

  // Error desconocido
  return createErrorResponse(
    "UNKNOWN_ERROR",
    "Ha ocurrido un error inesperado",
    500
  );
}

// ========================================
// UTILIDADES PARA QUERY PARAMS
// ========================================

export function extractQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

export function calculatePagination(
  page: number = 1,
  limit: number = 10,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// ========================================
// UTILIDADES PARA FILTROS DE BÚSQUEDA
// ========================================

export function buildSearchFilter(search: string) {
  if (!search) return {};
  
  return {
    OR: [
      { nombre_y_apellido: { contains: search, mode: "insensitive" as const } },
      { rol: { contains: search, mode: "insensitive" as const } },
    ],
  };
}

export function buildSortOrder(sortBy: string = "fecha_creacion", sort: string = "desc") {
  return {
    [sortBy]: sort,
  };
}

// ========================================
// MIDDLEWARE PARA VALIDACIÓN DE MÉTODOS HTTP
// ========================================

export function createMethodHandler(handlers: Record<string, Function>) {
  return async (request: NextRequest, context: any) => {
    const method = request.method;
    const handler = handlers[method];
    
    if (!handler) {
      return createErrorResponse(
        "METHOD_NOT_ALLOWED",
        `Método ${method} no permitido`,
        405
      );
    }
    
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// ========================================
// UTILIDADES PARA HEADERS DE CORS
// ========================================

export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  return response;
}
