"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Users, Calendar, Activity } from "lucide-react";

interface Talento {
  id: string;
  nombre_y_apellido: string;
  seniority: "JUNIOR" | "SEMI_SENIOR" | "SENIOR" | "LEAD" | "ARCHITECT";
  rol: string;
  estado: "ACTIVO" | "INACTIVO";
  fecha_creacion: string;
  fecha_actualizacion: string;
  lider?: {
    id: string;
    nombre_y_apellido: string;
    email: string;
    especialidad: string;
  } | null;
  mentor?: {
    id: string;
    nombre_y_apellido: string;
    email: string;
    especialidad: string;
  } | null;
  interacciones: Array<{
    id: string;
    tipo_de_interaccion: string;
    detalle: string;
    estado: string;
    fecha: string;
    fecha_de_modificacion: string;
  }>;
  _count: {
    interacciones: number;
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

export default function TalentoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [talento, setTalento] = useState<Talento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTalento = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/talentos/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Talento no encontrado");
          }
          throw new Error("Error al cargar el talento");
        }

        const data = await response.json();
        setTalento(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTalento();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Cargando talento...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !talento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <div className="space-x-4">
              <Link href="/talentos">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Talentos
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
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
            <Link href="/talentos">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="h-8 w-8" />
                {talento.nombre_y_apellido}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {talento.rol} • {SENIORITY_LABELS[talento.seniority]}
              </p>
            </div>
          </div>
          
          <Link href={`/talentos/${id}/editar`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos Básicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Nombre</label>
                    <p className="text-lg font-semibold">{talento.nombre_y_apellido}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Rol</label>
                    <p className="text-lg">{talento.rol}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Seniority</label>
                    <div className="mt-1">
                      <Badge className={SENIORITY_COLORS[talento.seniority]}>
                        {SENIORITY_LABELS[talento.seniority]}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Estado</label>
                    <div className="mt-1">
                      <Badge variant={talento.estado === "ACTIVO" ? "default" : "secondary"}>
                        {talento.estado}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interacciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Interacciones ({talento._count.interacciones})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {talento.interacciones.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Detalle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {talento.interacciones.map((interaccion) => (
                        <TableRow key={interaccion.id}>
                          <TableCell>
                            <Badge variant="outline">
                              {TIPO_INTERACCION_LABELS[interaccion.tipo_de_interaccion as keyof typeof TIPO_INTERACCION_LABELS] || interaccion.tipo_de_interaccion}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(interaccion.fecha).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={ESTADO_INTERACCION_COLORS[interaccion.estado as keyof typeof ESTADO_INTERACCION_COLORS]}>
                              {interaccion.estado.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {interaccion.detalle}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-slate-500 text-center py-8">
                    No hay interacciones registradas
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Referentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Líder</label>
                  {talento.lider ? (
                    <div className="mt-1">
                      <p className="font-semibold">{talento.lider.nombre_y_apellido}</p>
                      <p className="text-sm text-slate-500">{talento.lider.especialidad}</p>
                      <p className="text-sm text-slate-400">{talento.lider.email}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500 mt-1">Sin líder asignado</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Mentor</label>
                  {talento.mentor ? (
                    <div className="mt-1">
                      <p className="font-semibold">{talento.mentor.nombre_y_apellido}</p>
                      <p className="text-sm text-slate-500">{talento.mentor.especialidad}</p>
                      <p className="text-sm text-slate-400">{talento.mentor.email}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500 mt-1">Sin mentor asignado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fechas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Fecha de creación</label>
                  <p className="mt-1">{new Date(talento.fecha_creacion).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Última actualización</label>
                  <p className="mt-1">{new Date(talento.fecha_actualizacion).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
