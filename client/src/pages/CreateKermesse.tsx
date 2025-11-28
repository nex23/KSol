import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function CreateKermesse() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = trpc.kermesses.create.useMutation({
    onSuccess: (result) => {
      toast.success("Kermesse creada exitosamente");
      setLocation("/my-kermesses");
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear la kermesse");
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    beneficiaryName: "",
    beneficiaryReason: "",
    contactPhone: "",
    contactEmail: "",
    eventDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.beneficiaryName || !formData.beneficiaryReason || !formData.contactPhone || !formData.eventDate) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        beneficiaryName: formData.beneficiaryName,
        beneficiaryReason: formData.beneficiaryReason,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail || undefined,
        eventDate: new Date(formData.eventDate),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600 mb-4">Debes iniciar sesión para crear una kermesse</p>
              <Button asChild>
                <a href="/login">Iniciar Sesión</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Kermesse</CardTitle>
            <CardDescription>
              Organiza un evento solidario para ayudar a alguien que lo necesita
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Nombre de la Kermesse *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Kermesse para María"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe brevemente tu kermesse"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Beneficiary Info */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-semibold text-slate-900">Información del Beneficiario</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="beneficiaryName">Nombre del Beneficiario *</Label>
                  <Input
                    id="beneficiaryName"
                    name="beneficiaryName"
                    placeholder="Nombre de la persona que será ayudada"
                    value={formData.beneficiaryName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaryReason">Motivo de la Ayuda *</Label>
                  <Textarea
                    id="beneficiaryReason"
                    name="beneficiaryReason"
                    placeholder="Explica por qué se realiza esta kermesse (operación, medicamentos, etc.)"
                    value={formData.beneficiaryReason}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-semibold text-slate-900">Información de Contacto</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Teléfono de Contacto *</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    placeholder="+591 7123456"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="contacto@ejemplo.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <Label htmlFor="eventDate">Fecha del Evento *</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending}
                  className="flex-1"
                >
                  {isSubmitting || createMutation.isPending ? "Creando..." : "Crear Kermesse"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
