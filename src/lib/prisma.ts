import { PrismaClient } from "../generated/prisma";

// ========================================
// CLIENTE DE PRISMA SINGLETON
// ========================================

declare global {
  // Prevenir múltiples instancias en desarrollo
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// ========================================
// UTILIDADES DE BASE DE DATOS
// ========================================

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log("✅ Conectado a la base de datos");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    console.log("✅ Desconectado de la base de datos");
  } catch (error) {
    console.error("❌ Error desconectando de la base de datos:", error);
  }
}

// ========================================
// VERIFICACIÓN DE SALUD DE LA BASE DE DATOS
// ========================================

export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: "unhealthy", 
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString() 
    };
  }
}
