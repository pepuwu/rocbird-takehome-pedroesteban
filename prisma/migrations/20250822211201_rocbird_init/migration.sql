-- CreateEnum
CREATE TYPE "public"."Seniority" AS ENUM ('JUNIOR', 'SEMI_SENIOR', 'SENIOR', 'LEAD', 'ARCHITECT');

-- CreateEnum
CREATE TYPE "public"."EstadoTalento" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "public"."TipoInteraccion" AS ENUM ('REUNION_1_1', 'CODE_REVIEW', 'MENTORIA', 'EVALUACION', 'FEEDBACK', 'CAPACITACION', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."EstadoInteraccion" AS ENUM ('INICIADA', 'EN_PROGRESO', 'FINALIZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "public"."talentos" (
    "id" TEXT NOT NULL,
    "nombre_y_apellido" TEXT NOT NULL,
    "seniority" "public"."Seniority" NOT NULL,
    "rol" TEXT NOT NULL,
    "estado" "public"."EstadoTalento" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "lider_id" TEXT,
    "mentor_id" TEXT,

    CONSTRAINT "talentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."referentes_tecnicos" (
    "id" TEXT NOT NULL,
    "nombre_y_apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "especialidad" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referentes_tecnicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."interacciones" (
    "id" TEXT NOT NULL,
    "tipo_de_interaccion" "public"."TipoInteraccion" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detalle" TEXT NOT NULL,
    "estado" "public"."EstadoInteraccion" NOT NULL DEFAULT 'INICIADA',
    "fecha_de_modificacion" TIMESTAMP(3) NOT NULL,
    "talento_id" TEXT NOT NULL,

    CONSTRAINT "interacciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referentes_tecnicos_email_key" ON "public"."referentes_tecnicos"("email");

-- AddForeignKey
ALTER TABLE "public"."talentos" ADD CONSTRAINT "talentos_lider_id_fkey" FOREIGN KEY ("lider_id") REFERENCES "public"."referentes_tecnicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."talentos" ADD CONSTRAINT "talentos_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "public"."referentes_tecnicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."interacciones" ADD CONSTRAINT "interacciones_talento_id_fkey" FOREIGN KEY ("talento_id") REFERENCES "public"."talentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
