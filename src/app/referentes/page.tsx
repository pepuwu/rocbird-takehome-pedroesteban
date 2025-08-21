"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserCheck, Users, Mail } from "lucide-react";

interface ReferenteTecnico {
  id: string;
  nombre_y_apellido: string;
  email: string;
  especialidad: string;
  fecha_creacion: string;
  talentos_liderados: Array<{
    id: string;
    nombre_y_apellido: string;
    seniority: string;
    rol: string;
    estado: string;
  }>;
  talentos_mentoreados: Array<{
    id: string;
    nombre_y_apellido: string;
    seniority: string;
    rol: string;
    estado: string;
  }>;
  _count: {
    talentos_liderados: number;
    talentos_mentoreados: number;
  };
}

export default function ReferentesPage() {
  const [referentes, setReferentes] = useState<ReferenteTecnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReferentes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/referentes-tecnicos");
        
        if (!response.ok) {
          throw new Error("Error al cargar los referentes técnicos");
        }

        const data = await response.json();
        setReferentes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadReferentes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Cargando referentes técnicos...</p>
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
            <Button onClick={() => window.location.reload()} className="mt-4">
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
                <UserCheck className="h-8 w-8" />
                Referentes Técnicos
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {referentes.length} referentes técnicos registrados
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referentes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referentes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Talentos Liderados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referentes.reduce((sum, ref) => sum + ref._count.talentos_liderados, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Talentos Mentoreados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referentes.reduce((sum, ref) => sum + ref._count.talentos_mentoreados, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Referentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {referentes.map((referente) => (
            <Card key={referente.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      {referente.nombre_y_apellido}
                    </CardTitle>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <Mail className="h-4 w-4" />
                      {referente.email}
                    </p>
                    {referente.especialidad && (
                      <p className="text-sm text-slate-500 mt-1">
                        {referente.especialidad}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Estadísticas */}
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {referente._count.talentos_liderados}
                      </div>
                      <div className="text-xs text-slate-500">Liderados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {referente._count.talentos_mentoreados}
                      </div>
                      <div className="text-xs text-slate-500">Mentoreados</div>
                    </div>
                  </div>

                  {/* Talentos Liderados */}
                  {referente.talentos_liderados.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Talentos Liderados:</h4>
                      <div className="flex flex-wrap gap-1">
                        {referente.talentos_liderados.map((talento) => (
                          <Link key={talento.id} href={`/talentos/${talento.id}`}>
                            <Badge variant="outline" className="text-xs hover:bg-blue-50 cursor-pointer">
                              {talento.nombre_y_apellido}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Talentos Mentoreados */}
                  {referente.talentos_mentoreados.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Talentos Mentoreados:</h4>
                      <div className="flex flex-wrap gap-1">
                        {referente.talentos_mentoreados.map((talento) => (
                          <Link key={talento.id} href={`/talentos/${talento.id}`}>
                            <Badge variant="outline" className="text-xs hover:bg-green-50 cursor-pointer">
                              {talento.nombre_y_apellido}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-400 border-t pt-2">
                    Registrado el {new Date(referente.fecha_creacion).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {referentes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No hay referentes técnicos
              </h3>
              <p className="text-slate-500">
                Aún no se han registrado referentes técnicos en el sistema.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
