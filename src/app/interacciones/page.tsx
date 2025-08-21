"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Activity, Calendar, User } from "lucide-react";

interface Interaccion {
  id: string;
  tipo_de_interaccion: string;
  fecha: string;
  detalle: string;
  estado: string;
  fecha_de_modificacion: string;
  talento: {
    id: string;
    nombre_y_apellido: string;
    seniority: string;
    rol: string;
  };
}

const TIPO_INTERACCION_LABELS = {
  REUNION_1_1: "Reunión 1:1",
  CODE_REVIEW: "Code Review",
  MENTORIA: "Mentoría",
  EVALUACION: "Evaluación",
  FEEDBACK: "Feedback",
  CAPACITACION: "Capacitación",
  OTRO: "Otro"
};

const ESTADO_INTERACCION_COLORS = {
  INICIADA: "bg-blue-100 text-blue-800",
  EN_PROGRESO: "bg-yellow-100 text-yellow-800",
  FINALIZADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800"
};

const SENIORITY_COLORS = {
  JUNIOR: "bg-green-100 text-green-800",
  SEMI_SENIOR: "bg-blue-100 text-blue-800",
  SENIOR: "bg-purple-100 text-purple-800",
  LEAD: "bg-orange-100 text-orange-800",
  ARCHITECT: "bg-red-100 text-red-800"
};

export default function InteraccionesPage() {
  const [interacciones, setInteracciones] = useState<Interaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all");

  // Función para cargar interacciones
  const loadInteracciones = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/interacciones");
      
      if (!response.ok) {
        throw new Error("Error al cargar las interacciones");
      }

      const data = await response.json();
      setInteracciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInteracciones();
  }, []);

  // Función para actualizar estado de interacción
  const handleEstadoChange = async (id: string, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/interacciones/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la interacción");
      }

      // Recargar la lista
      loadInteracciones();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar");
    }
  };

  // Filtrar interacciones
  const interaccionesFiltradas = interacciones.filter((interaccion) => {
    const estadoMatch = estadoFilter === "all" || interaccion.estado === estadoFilter;
    const tipoMatch = tipoFilter === "all" || interaccion.tipo_de_interaccion === tipoFilter;
    return estadoMatch && tipoMatch;
  });

  // Estadísticas
  const estadisticas = {
    total: interacciones.length,
    iniciadas: interacciones.filter(i => i.estado === "INICIADA").length,
    enProgreso: interacciones.filter(i => i.estado === "EN_PROGRESO").length,
    finalizadas: interacciones.filter(i => i.estado === "FINALIZADA").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Cargando interacciones...</p>
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
            <Button onClick={loadInteracciones} className="mt-4">
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="h-8 w-8" />
              Interacciones
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {interaccionesFiltradas.length} de {interacciones.length} interacciones
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Iniciadas</CardTitle>
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{estadisticas.iniciadas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{estadisticas.enProgreso}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estadisticas.finalizadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="INICIADA">Iniciada</SelectItem>
                  <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
                  <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Interacción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {Object.entries(TIPO_INTERACCION_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setEstadoFilter("all");
                  setTipoFilter("all");
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Interacciones */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Talento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interaccionesFiltradas.map((interaccion) => (
                  <TableRow key={interaccion.id}>
                    <TableCell>
                      <div>
                        <Link 
                          href={`/talentos/${interaccion.talento.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {interaccion.talento.nombre_y_apellido}
                        </Link>
                        <div className="text-sm text-slate-500">
                          {interaccion.talento.rol}
                        </div>
                        <Badge className={`text-xs ${SENIORITY_COLORS[interaccion.talento.seniority as keyof typeof SENIORITY_COLORS]}`}>
                          {interaccion.talento.seniority}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {TIPO_INTERACCION_LABELS[interaccion.tipo_de_interaccion as keyof typeof TIPO_INTERACCION_LABELS] || interaccion.tipo_de_interaccion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date(interaccion.fecha).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={interaccion.estado}
                        onValueChange={(value) => handleEstadoChange(interaccion.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue>
                            <Badge className={ESTADO_INTERACCION_COLORS[interaccion.estado as keyof typeof ESTADO_INTERACCION_COLORS]}>
                              {interaccion.estado.replace("_", " ")}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INICIADA">Iniciada</SelectItem>
                          <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
                          <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                          <SelectItem value="CANCELADA">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate" title={interaccion.detalle}>
                        {interaccion.detalle}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Link href={`/talentos/${interaccion.talento.id}`}>
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {interaccionesFiltradas.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No hay interacciones
              </h3>
              <p className="text-slate-500">
                No se encontraron interacciones con los filtros seleccionados.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
