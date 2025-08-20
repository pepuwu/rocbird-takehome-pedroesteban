import { z } from "zod";
import { Seniority, EstadoTalento, TipoInteraccion, EstadoInteraccion } from "../generated/prisma";

// ========================================
// UTILIDADES PARA FILTROS Y PAGINACIÓN
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
// SCHEMAS DE VALIDACIÓN PARA TALENTOS
// ========================================

export const TalentoCreateSchema = z.object({
  nombre_y_apellido: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  
  seniority: z.nativeEnum(Seniority, {
    errorMap: () => ({ message: "Seniority debe ser uno de: JUNIOR, SEMI_SENIOR, SENIOR, LEAD, ARCHITECT" })
  }),
  
  rol: z.string()
    .min(2, "El rol debe tener al menos 2 caracteres")
    .max(50, "El rol no puede exceder 50 caracteres"),
  
  estado: z.nativeEnum(EstadoTalento).default(EstadoTalento.ACTIVO),
  
  lider_id: z.string().cuid().optional(),
  mentor_id: z.string().cuid().optional(),
});

export const TalentoUpdateSchema = TalentoCreateSchema.partial();

export const TalentoQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).pipe(z.number().min(1).max(100)).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  sortBy: z.enum(["nombre_y_apellido", "seniority", "rol", "fecha_creacion"]).optional(),
  estado: z.nativeEnum(EstadoTalento).optional(),
  seniority: z.nativeEnum(Seniority).optional(),
  search: z.string().optional(),
});

// ========================================
// SCHEMAS PARA REFERENTES TÉCNICOS
// ========================================

export const ReferenteTecnicoCreateSchema = z.object({
  nombre_y_apellido: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  
  email: z.string()
    .email("Email inválido")
    .max(100, "El email no puede exceder 100 caracteres"),
  
  especialidad: z.string()
    .min(2, "La especialidad debe tener al menos 2 caracteres")
    .max(100, "La especialidad no puede exceder 100 caracteres")
    .optional(),
});

export const ReferenteTecnicoUpdateSchema = ReferenteTecnicoCreateSchema.partial();

// ========================================
// SCHEMAS PARA INTERACCIONES
// ========================================

export const InteraccionCreateSchema = z.object({
  talento_id: z.string().cuid("ID de talento inválido"),
  
  tipo_de_interaccion: z.nativeEnum(TipoInteraccion, {
    errorMap: () => ({ message: "Tipo de interacción debe ser uno de: REUNION_1_1, CODE_REVIEW, MENTORIA, EVALUACION, FEEDBACK, CAPACITACION, OTRO" })
  }),
  
  detalle: z.string()
    .min(5, "El detalle debe tener al menos 5 caracteres")
    .max(500, "El detalle no puede exceder 500 caracteres"),
  
  estado: z.nativeEnum(EstadoInteraccion).default(EstadoInteraccion.INICIADA),
  
  fecha: z.string().datetime().transform(val => new Date(val)).optional(),
});

export const InteraccionUpdateSchema = z.object({
  tipo_de_interaccion: z.nativeEnum(TipoInteraccion).optional(),
  detalle: z.string().min(5).max(500).optional(),
  estado: z.nativeEnum(EstadoInteraccion).optional(),
  fecha: z.string().datetime().transform(val => new Date(val)).optional(),
});

// ========================================
// TIPOS TYPESCRIPT DERIVADOS
// ========================================

export type TalentoCreateInput = z.infer<typeof TalentoCreateSchema>;
export type TalentoUpdateInput = z.infer<typeof TalentoUpdateSchema>;
export type TalentoQueryInput = z.infer<typeof TalentoQuerySchema>;

export type ReferenteTecnicoCreateInput = z.infer<typeof ReferenteTecnicoCreateSchema>;
export type ReferenteTecnicoUpdateInput = z.infer<typeof ReferenteTecnicoUpdateSchema>;

export type InteraccionCreateInput = z.infer<typeof InteraccionCreateSchema>;
export type InteraccionUpdateInput = z.infer<typeof InteraccionUpdateSchema>;

// ========================================
// SCHEMAS DE RESPUESTA API
// ========================================

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

export const PaginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
