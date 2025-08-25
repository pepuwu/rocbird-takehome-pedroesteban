import { NextRequest } from "next/server";
import { checkDatabaseHealth } from "../../../lib/prisma";
import { createSuccessResponse, createMethodHandler } from "../../../lib/api-utils";

// ========================================
// GET /api/health - VERIFICAR ESTADO DE LA API
// ========================================

async function GET(request: NextRequest) {
  const dbHealth = await checkDatabaseHealth();
  
  const healthStatus = {
    api: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
    database: dbHealth,
    environment: {
      node_env: process.env.NODE_ENV,
      runtime: "Node.js",
    }
  };
  
  const statusCode = dbHealth.status === "healthy" ? 200 : 503;
  
  return createSuccessResponse(healthStatus, statusCode);
}

// ========================================
// EXPORTAR HANDLER
// ========================================

export { GET };
