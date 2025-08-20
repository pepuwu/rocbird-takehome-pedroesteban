"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, ArrowLeft, Users, Eye, Edit, Trash2 } from "lucide-react";

// Tipos basados en nuestras APIs
interface Talento {
  id: string;
  nombre_y_apellido: string;
  seniority: "JUNIOR" | "SEMI_SENIOR" | "SENIOR" | "LEAD" | "ARCHITECT";
  rol: string;
  estado: "ACTIVO" | "INACTIVO";
  fecha_creacion: string;
  lider?: {
    id: string;
    nombre_y_apellido: string;
    email: string;
  } | null;
  mentor?: {
    id: string;
    nombre_y_apellido: string;
    email: string;
  } | null;
  _count: {
    interacciones: number;
  };
}

interface ApiResponse {
  data: Talento[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const SENIORITY_LABELS = {
  JUNIOR: "Junior",
  SEMI_SENIOR: "Semi Senior",
  SENIOR: "Senior",
  LEAD: "Lead",
  ARCHITECT: "Architect"
};

const SENIORITY_COLORS = {
  JUNIOR: "bg-green-100 text-green-800",
  SEMI_SENIOR: "bg-blue-100 text-blue-800",
  SENIOR: "bg-purple-100 text-purple-800",
  LEAD: "bg-orange-100 text-orange-800",
  ARCHITECT: "bg-red-100 text-red-800"
};

export default function TalentosPage() {
  const [talentos, setTalentos] = useState<Talento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<ApiResponse["meta"] | null>(null);

  // Función para cargar talentos
  const loadTalentos = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(estadoFilter !== "all" && { estado: estadoFilter }),
        ...(seniorityFilter !== "all" && { seniority: seniorityFilter }),
      });

      const response = await fetch(`/api/talentos?${params}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar los talentos");
      }

      const data: ApiResponse = await response.json();
      setTalentos(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Cargar talentos al montar el componente o cambiar filtros
  useEffect(() => {
    loadTalentos();
  }, [currentPage, searchTerm, estadoFilter, seniorityFilter]);

  // Función para eliminar talento
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este talento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/talentos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el talento");
      }

      // Recargar la lista
      loadTalentos();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Cargando talentos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            <Button onClick={loadTalentos} className="mt-4">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="h-8 w-8" />
                Gestión de Talentos
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {meta && `${meta.total} talentos encontrados`}
              </p>
            </div>
          </div>
          
          <Link href="/talentos/nuevo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Talento
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nombre o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVO">Activo</SelectItem>
                  <SelectItem value="INACTIVO">Inactivo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seniority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="JUNIOR">Junior</SelectItem>
                  <SelectItem value="SEMI_SENIOR">Semi Senior</SelectItem>
                  <SelectItem value="SENIOR">Senior</SelectItem>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="ARCHITECT">Architect</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setEstadoFilter("all");
                  setSeniorityFilter("all");
                  setCurrentPage(1);
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Talentos */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Seniority</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Interacciones</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talentos.map((talento) => (
                  <TableRow key={talento.id}>
                    <TableCell className="font-medium">
                      {talento.nombre_y_apellido}
                    </TableCell>
                    <TableCell>{talento.rol}</TableCell>
                    <TableCell>
                      <Badge className={SENIORITY_COLORS[talento.seniority]}>
                        {SENIORITY_LABELS[talento.seniority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={talento.estado === "ACTIVO" ? "default" : "secondary"}>
                        {talento.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {talento.lider?.nombre_y_apellido || "Sin asignar"}
                    </TableCell>
                    <TableCell>
                      {talento.mentor?.nombre_y_apellido || "Sin asignar"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {talento._count.interacciones}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/talentos/${talento.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/talentos/${talento.id}/editar`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(talento.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Paginación */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Página {meta.page} de {meta.totalPages} - {meta.total} talentos total
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!meta.hasPrev}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={!meta.hasNext}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
