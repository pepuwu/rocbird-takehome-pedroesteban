"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Activity, Save, Users, User } from "lucide-react";

// Interfaces
interface Talento {
  id: string;
  nombre_y_apellido: string;
  seniority: string;
  rol: string;
  estado: string;
}

interface ReferenteTecnico {
  id: string;
  nombre_y_apellido: string;
  email: string;
  especialidad: string;
}

interface FormData {
  talento_id: string;
  referente_tecnico_id: string;
  tipo_de_interaccion: string;
  detalle: string;
  fecha_interaccion: string;
  estado: string;
}

const TIPOS_INTERACCION = [
  { value: "REUNION_1_1", label: "Reunión 1:1" },
  { value: "CODE_REVIEW", label: "Code Review" },
  { value: "MENTORIA", label: "Mentoría" },
  { value: "EVALUACION", label: "Evaluación" },
  { value: "FEEDBACK", label: "Feedback" },
  { value: "CAPACITACION", label: "Capacitación" },
  { value: "OTRO", label: "Otro" }
];

const ESTADOS_INTERACCION = [
  { value: "INICIADA", label: "Iniciada" },
  { value: "EN_PROGRESO", label: "En Progreso" },
  { value: "FINALIZADA", label: "Finalizada" },
  { value: "CANCELADA", label: "Cancelada" }
];

export default function NuevaInteraccionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [talentos, setTalentos] = useState<Talento[]>([]);
  const [referentes, setReferentes] = useState<ReferenteTecnico[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    talento_id: "",
    referente_tecnico_id: "",
    tipo_de_interaccion: "",
    detalle: "",
    fecha_interaccion: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    estado: "INICIADA" // Estado por defecto
  });

  // Cargar talentos y referentes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Cargar talentos activos
        const talentosResponse = await fetch("/api/talentos?estado=ACTIVO");
        if (talentosResponse.ok) {
          const talentosData = await talentosResponse.json();
          // La API devuelve { data: [...], meta: {...} }
          console.log("Talentos cargados:", talentosData);
          setTalentos(talentosData.data || []);
        } else {
          console.error("Error cargando talentos:", talentosResponse.status);
        }

        // Cargar referentes técnicos
        const referentesResponse = await fetch("/api/referentes-tecnicos");
        if (referentesResponse.ok) {
          const referentesData = await referentesResponse.json();
          console.log("Referentes cargados:", referentesData);
          setReferentes(referentesData);
        } else {
          console.error("Error cargando referentes:", referentesResponse.status);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.talento_id || !formData.referente_tecnico_id || !formData.tipo_de_interaccion || !formData.detalle.trim()) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/interacciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          talento_id: formData.talento_id,
          referente_tecnico_id: formData.referente_tecnico_id,
          tipo_de_interaccion: formData.tipo_de_interaccion,
          detalle: formData.detalle.trim(),
          fecha_interaccion: new Date(formData.fecha_interaccion).toISOString(),
          estado: formData.estado
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la interacción");
      }

      // Redirigir a la lista de interacciones
      router.push("/interacciones");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al crear la interacción");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Cargando datos...</p>
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
        <div className="flex items-center gap-4 mb-8">
          <Link href="/interacciones">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="h-8 w-8" />
              Nueva Interacción
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Registra una nueva actividad entre talento y referente técnico
            </p>
          </div>
        </div>

        {/* Formulario */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Información de la Interacción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selección de Talento */}
              <div className="space-y-2">
                <Label htmlFor="talento">
                  Talento * 
                  {loadingData && <span className="text-sm text-slate-500 ml-2">(Cargando...)</span>}
                  {!loadingData && talentos.length > 0 && <span className="text-sm text-slate-500 ml-2">({talentos.length} disponibles)</span>}
                </Label>
                <Select 
                  value={formData.talento_id} 
                  onValueChange={(value) => handleInputChange("talento_id", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el talento" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(talentos) && talentos.length > 0 ? (
                      talentos.map((talento) => (
                        <SelectItem key={talento.id} value={talento.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{talento.nombre_y_apellido}</span>
                            <span className="text-sm text-slate-500">{talento.rol} - {talento.seniority}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-slate-500">
                        {loadingData ? "Cargando talentos..." : "No hay talentos activos disponibles"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Selección de Referente Técnico */}
              <div className="space-y-2">
                <Label htmlFor="referente">
                  Referente Técnico * 
                  {loadingData && <span className="text-sm text-slate-500 ml-2">(Cargando...)</span>}
                  {!loadingData && referentes.length > 0 && <span className="text-sm text-slate-500 ml-2">({referentes.length} disponibles)</span>}
                </Label>
                <Select 
                  value={formData.referente_tecnico_id} 
                  onValueChange={(value) => handleInputChange("referente_tecnico_id", value)}
                  disabled={loadingData}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el referente técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(referentes) && referentes.length > 0 ? (
                      referentes.map((referente) => (
                        <SelectItem key={referente.id} value={referente.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{referente.nombre_y_apellido}</span>
                            <span className="text-sm text-slate-500">{referente.especialidad}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-slate-500">
                        {loadingData ? "Cargando referentes..." : "No hay referentes técnicos disponibles"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Interacción */}
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Interacción *</Label>
                <Select 
                  value={formData.tipo_de_interaccion} 
                  onValueChange={(value) => handleInputChange("tipo_de_interaccion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de interacción" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_INTERACCION.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de la Interacción *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha_interaccion}
                  onChange={(e) => handleInputChange("fecha_interaccion", e.target.value)}
                  required
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(value) => handleInputChange("estado", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_INTERACCION.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Detalle */}
              <div className="space-y-2">
                <Label htmlFor="detalle">Detalle de la Interacción *</Label>
                <textarea
                  id="detalle"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe el objetivo, temas tratados, outcomes, próximos pasos..."
                  value={formData.detalle}
                  onChange={(e) => handleInputChange("detalle", e.target.value)}
                  required
                />
                <p className="text-sm text-slate-500">
                  Incluye objetivos, temas tratados, resultados y próximos pasos
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Link href="/interacciones">
                  <Button variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Interacción
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
