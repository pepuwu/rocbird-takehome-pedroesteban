"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, UserPlus } from "lucide-react";

interface FormData {
  nombre_y_apellido: string;
  email: string;
  especialidad: string;
}

export default function NuevoReferentePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nombre_y_apellido: "",
    email: "",
    especialidad: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre_y_apellido.trim() || !formData.email.trim()) {
      setError("El nombre y email son obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/referentes-tecnicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el referente técnico");
      }

      router.push("/referentes");
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
        <div className="mb-8">
          <Link href="/referentes">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Referentes
            </Button>
          </Link>
          
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Nuevo Referente Técnico
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Agregar un nuevo líder o mentor al equipo
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Información del Referente</CardTitle>
              <CardDescription>
                Completa los datos del nuevo referente técnico que actuará como líder o mentor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre y Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="nombre_y_apellido">
                    Nombre y Apellido *
                  </Label>
                  <Input
                    id="nombre_y_apellido"
                    type="text"
                    placeholder="Ej: Ana García"
                    value={formData.nombre_y_apellido}
                    onChange={(e) => handleInputChange("nombre_y_apellido", e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ej: ana.garcia@rocbird.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                {/* Especialidad */}
                <div className="space-y-2">
                  <Label htmlFor="especialidad">
                    Especialidad
                  </Label>
                  <Input
                    id="especialidad"
                    type="text"
                    placeholder="Ej: Frontend Development, Backend Development, DevOps"
                    value={formData.especialidad}
                    onChange={(e) => handleInputChange("especialidad", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Campo opcional para identificar la especialidad técnica
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Crear Referente
                      </>
                    )}
                  </Button>
                  
                  <Link href="/referentes">
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
