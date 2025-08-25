"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Activity } from "lucide-react";

interface DashboardStats {
  totalTalentos: number;
  talentosActivos: number;
  talentosInactivos: number;
  totalReferentes: number;
  totalInteracciones: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTalentos: 0,
    talentosActivos: 0,
    talentosInactivos: 0,
    totalReferentes: 0,
    totalInteracciones: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Cargar estadísticas de talentos
        const talentosResponse = await fetch('/api/talentos?limit=1');
        const talentosData = await talentosResponse.json();
        
        // Cargar estadísticas de referentes
        const referentesResponse = await fetch('/api/referentes-tecnicos');
        const referentesData = await referentesResponse.json();
        
        // Cargar estadísticas de interacciones
        const interaccionesResponse = await fetch('/api/interacciones?limit=1');
        const interaccionesData = await interaccionesResponse.json();

        setStats({
          totalTalentos: talentosData.meta?.total || 0,
          talentosActivos: talentosData.data?.filter((t: any) => t.estado === 'ACTIVO').length || 0,
          talentosInactivos: talentosData.data?.filter((t: any) => t.estado === 'INACTIVO').length || 0,
          totalReferentes: referentesData.length || 0,
          totalInteracciones: interaccionesData.meta?.total || 0
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Sistema de Gestión de Talentos
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Herramienta interna para control de staffing y seguimiento de talentos en Rocbird
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Talentos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalTalentos}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.talentosActivos} activos, {stats.talentosInactivos} inactivos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referentes Técnicos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalReferentes}
              </div>
              <p className="text-xs text-muted-foreground">Líderes y mentores</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interacciones</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalInteracciones}
              </div>
              <p className="text-xs text-muted-foreground">Registros de seguimiento</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Talentos
              </CardTitle>
              <CardDescription>
                Administra el personal, roles y estados de los talentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Crea, edita y gestiona el personal de la empresa con información detallada sobre roles, seniority y estado.
              </p>
              <Link href="/talentos">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Talentos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Referentes Técnicos
              </CardTitle>
              <CardDescription>
                Gestiona líderes y mentores del equipo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Administra los referentes técnicos que actúan como líderes y mentores de los talentos.
              </p>
              <Link href="/referentes">
                <Button className="w-full">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Ver Referentes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Interacciones
              </CardTitle>
              <CardDescription>
                Seguimiento y registro de interacciones con talentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Registra y gestiona las interacciones, reuniones y seguimientos con los talentos del equipo.
              </p>
              <Link href="/interacciones">
                <Button className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Ver Interacciones
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm">
            Rocbird Takehome - Sistema de Gestión de Talentos
          </p>
          <p className="text-xs mt-2">
            Desarrollado con Next.js 15, TypeScript, Prisma y shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
}
