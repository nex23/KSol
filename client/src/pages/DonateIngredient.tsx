import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, Leaf } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function DonateIngredient() {
  const [, params] = useRoute("/donate-ingredient/:id");
  const [, setLocation] = useLocation();
  const ingredientId = parseInt(params?.id || "0");

  const { data: ingredient } = trpc.ingredients.getForKermesse.useQuery(
    { kerMesseId: 0 }, // We'll need to fetch the ingredient directly
    { enabled: false }
  );

  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    quantityDonated: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const donateMutation = trpc.ingredientDonations.create.useMutation({
    onSuccess: () => {
      toast.success("¡Gracias por tu donación!");
      setLocation("/");
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar la donación");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.donorName || !formData.quantityDonated) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    setIsSubmitting(true);
    try {
      await donateMutation.mutateAsync({
        ingredientId,
        donorName: formData.donorName,
        donorEmail: formData.donorEmail || undefined,
        donorPhone: formData.donorPhone || undefined,
        quantityDonated: parseInt(formData.quantityDonated),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-6 h-6 text-green-500" />
              <CardTitle>Donar Ingrediente</CardTitle>
            </div>
            <CardDescription>
              Tu donación ayudará a que la kermesse sea un éxito
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donor Name */}
              <div className="space-y-2">
                <Label htmlFor="donorName">Tu Nombre *</Label>
                <Input
                  id="donorName"
                  name="donorName"
                  placeholder="Tu nombre completo"
                  value={formData.donorName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Donor Email */}
              <div className="space-y-2">
                <Label htmlFor="donorEmail">Email</Label>
                <Input
                  id="donorEmail"
                  name="donorEmail"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.donorEmail}
                  onChange={handleChange}
                />
              </div>

              {/* Donor Phone */}
              <div className="space-y-2">
                <Label htmlFor="donorPhone">Teléfono</Label>
                <Input
                  id="donorPhone"
                  name="donorPhone"
                  type="tel"
                  placeholder="+591 7123456"
                  value={formData.donorPhone}
                  onChange={handleChange}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantityDonated">Cantidad a Donar *</Label>
                <Input
                  id="quantityDonated"
                  name="quantityDonated"
                  type="number"
                  placeholder="Ej: 2"
                  value={formData.quantityDonated}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || donateMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting || donateMutation.isPending ? "Procesando..." : "Confirmar Donación"}
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
