import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface SaleItem {
  dishId: number;
  dishName: string;
  quantity: number;
  pricePerUnitInBs: number;
}

export default function RegisterSale() {
  const [, params] = useRoute("/register-sale/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const kerMesseId = parseInt(params?.id || "0");

  const { data: kermesse } = trpc.kermesses.getById.useQuery(
    { id: kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: dishes } = trpc.dishes.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState("");

  const createSaleMutation = trpc.sales.create.useMutation({
    onSuccess: () => {
      toast.success("Venta registrada exitosamente");
      setLocation(`/kermesse/${kerMesseId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar venta");
    },
  });

  const handleAddItem = () => {
    if (!selectedDishId || !selectedQuantity) {
      toast.error("Por favor selecciona un plato y cantidad");
      return;
    }

    const dish = dishes?.find(d => d.id === selectedDishId);
    if (!dish) return;

    const quantity = parseInt(selectedQuantity);
    if (quantity > dish.quantityAvailable - dish.quantitySold) {
      toast.error("No hay suficiente cantidad disponible");
      return;
    }

    const existingItem = saleItems.find(item => item.dishId === selectedDishId);
    if (existingItem) {
      setSaleItems(saleItems.map(item =>
        item.dishId === selectedDishId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setSaleItems([
        ...saleItems,
        {
          dishId: selectedDishId,
          dishName: dish.name,
          quantity,
          pricePerUnitInBs: dish.priceInBs,
        },
      ]);
    }

    setSelectedDishId(null);
    setSelectedQuantity("");
  };

  const handleRemoveItem = (dishId: number) => {
    setSaleItems(saleItems.filter(item => item.dishId !== dishId));
  };

  const totalAmount = saleItems.reduce(
    (sum, item) => sum + (item.quantity * item.pricePerUnitInBs),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerName || saleItems.length === 0) {
      toast.error("Por favor completa el nombre del comprador y agrega al menos un plato");
      return;
    }

    await createSaleMutation.mutateAsync({
      kerMesseId,
      buyerName,
      buyerPhone: buyerPhone || undefined,
      items: saleItems.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        pricePerUnitInBs: item.pricePerUnitInBs,
      })),
    });
  };

  if (!kermesse) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">Kermesse no encontrada</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <Link href={`/kermesse/${kerMesseId}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Registrar Venta</h1>
        <p className="text-slate-600 mb-8">{kermesse.title}</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Buyer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Comprador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Nombre del Comprador *</Label>
                <Input
                  id="buyerName"
                  placeholder="Nombre completo"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Teléfono</Label>
                <Input
                  id="buyerPhone"
                  type="tel"
                  placeholder="+591 7123456"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Platos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dish">Plato</Label>
                  <select
                    id="dish"
                    value={selectedDishId || ""}
                    onChange={(e) => setSelectedDishId(parseInt(e.target.value) || null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Selecciona un plato</option>
                    {dishes?.map((dish) => {
                      const available = dish.quantityAvailable - dish.quantitySold;
                      return (
                        <option key={dish.id} value={dish.id} disabled={available <= 0}>
                          {dish.name} ({available} disponibles)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button type="button" onClick={handleAddItem} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sale Items */}
          {saleItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Platos en la Venta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {saleItems.map((item) => (
                  <div key={item.dishId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.dishName}</p>
                      <p className="text-sm text-slate-600">
                        {item.quantity} x {formatCurrency(item.pricePerUnitInBs)} = {formatCurrency(item.quantity * item.pricePerUnitInBs)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.dishId)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createSaleMutation.isPending || saleItems.length === 0}
              className="flex-1"
            >
              {createSaleMutation.isPending ? "Registrando..." : "Registrar Venta"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation(`/kermesse/${kerMesseId}`)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
