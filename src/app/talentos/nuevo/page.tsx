"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User } from "lucide-react";

interface ReferenteTecnico {
  id: string;
  nombre_y_apellido: string;
  email: string;
  especialidad: string;
}

interface FormData {
  nombre_y_apellido: string;
  seniority: string;
  rol: string;
  estado: string;
  lider_id: string;
  mentor_id: string;
}

const SENIORITY_OPTIONS = [
  { value: "JUNIOR", label: "Junior" },
  { value: "SEMI_SENIOR", label: "Semi Senior" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "ARCHITECT", label: "Architect" },
];

const ESTADO_OPTIONS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
];

export default function NuevoTalentoPage() {
  const router = useRouter();
  const [referentes, setReferentes] = useState<ReferenteTecnico[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre_y_apellido: "",
    seniority: "",
    rol: "",
    estado: "ACTIVO",
    lider_id: "",
    mentor_id: "",
  });

  // Cargar referentes técnicos
  useEffect(() => {
    const loadReferentes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/referentes-tecnicos");
        
        if (!response.ok) {
          throw new Error("Error al cargar referentes técnicos");
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre_y_apellido.trim()) {
      setError("El nombre y apellido es requerido");
      return;
    }
    
    if (!formData.seniority) {
      setError("El seniority es requerido");
      return;
    }
    
    if (!formData.rol.trim()) {
      setError("El rol es requerido");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Preparar datos para enviar
      const submitData = {
        nombre_y_apellido: formData.nombre_y_apellido.trim(),
        seniority: formData.seniority,
        rol: formData.rol.trim(),
        estado: formData.estado,
        ...(formData.lider_id && formData.lider_id !== "none" && { lider_id: formData.lider_id }),
        ...(formData.mentor_id && formData.mentor_id !== "none" && { mentor_id: formData.mentor_id }),
      };

      const response = await fetch("/api/talentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el talento");
      }

      // Redirigir a la lista de talentos
      router.push("/talentos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/talentos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Talentos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="h-8 w-8" />
              Nuevo Talento
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Crear un nuevo talento en el sistema
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Información del Talento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Nombre y Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="nombre_y_apellido">Nombre y Apellido *</Label>
                  <Input
                    id="nombre_y_apellido"
                    type="text"
                    value={formData.nombre_y_apellido}
                    onChange={(e) => handleInputChange("nombre_y_apellido", e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                {/* Rol */}
                <div className="space-y-2">
                  <Label htmlFor="rol">Rol *</Label>
                  <Input
                    id="rol"
                    type="text"
                    value={formData.rol}
                    onChange={(e) => handleInputChange("rol", e.target.value)}
                    placeholder="Ej: Frontend Developer"
                    required
                  />
                </div>

                {/* Seniority y Estado en la misma fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seniority">Seniority *</Label>
                    <Select 
                      value={formData.seniority} 
                      onValueChange={(value) => handleInputChange("seniority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona seniority" />
                      </SelectTrigger>
                      <SelectContent>
                        {SENIORITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select 
                      value={formData.estado} 
                      onValueChange={(value) => handleInputChange("estado", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADO_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Líder y Mentor */}
                {loading ? (
                  <div className="text-center py-4">
                    <p className="text-slate-600">Cargando referentes técnicos...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lider_id">Líder (Opcional)</Label>
                      <Select 
                        value={formData.lider_id} 
                        onValueChange={(value) => handleInputChange("lider_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona líder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin líder asignado</SelectItem>
                          {referentes.map((referente) => (
                            <SelectItem key={referente.id} value={referente.id}>
                              {referente.nombre_y_apellido} - {referente.especialidad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mentor_id">Mentor (Opcional)</Label>
                      <Select 
                        value={formData.mentor_id} 
                        onValueChange={(value) => handleInputChange("mentor_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona mentor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin mentor asignado</SelectItem>
                          {referentes.map((referente) => (
                            <SelectItem key={referente.id} value={referente.id}>
                              {referente.nombre_y_apellido} - {referente.especialidad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Crear Talento
                      </>
                    )}
                  </Button>
                  
                  <Link href="/talentos">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
