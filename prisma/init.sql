-- Script de inicialización para Docker
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor PostgreSQL

-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE rocbird_takehome'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rocbird_takehome')\gexec

-- Conectar a la base de datos
\c rocbird_takehome;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Nota: Las tablas se crearán automáticamente con Prisma
-- Este script solo prepara el entorno
