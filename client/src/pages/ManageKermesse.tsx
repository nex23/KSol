import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function ManageKermesse() {
  const [, params] = useRoute("/manage-kermesse/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const kerMesseId = parseInt(params?.id || "0");

  const { data: kermesse } = trpc.kermesses.getById.useQuery(
    { id: kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: dishes, refetch: refetchDishes } = trpc.dishes.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: ingredients, refetch: refetchIngredients } = trpc.ingredients.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const [showAddDish, setShowAddDish] = useState(false);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    category: "Oriente",
    priceInBs: "",
    quantityAvailable: "",
  });

  const [ingredientForm, setIngredientForm] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    quantityNeeded: "",
  });

  const createDishMutation = trpc.dishes.create.useMutation({
    onSuccess: () => {
      toast.success("Plato agregado exitosamente");
      setDishForm({ name: "", description: "", category: "Oriente", priceInBs: "", quantityAvailable: "" });
      setShowAddDish(false);
      refetchDishes();
    },
    onError: (error) => {
      toast.error(error.message || "Error al agregar plato");
    },
  });

  const createIngredientMutation = trpc.ingredients.create.useMutation({
    onSuccess: () => {
      toast.success("Ingrediente agregado exitosamente");
      setIngredientForm({ name: "", quantity: "", unit: "kg", quantityNeeded: "" });
      setShowAddIngredient(false);
      refetchIngredients();
    },
    onError: (error) => {
      toast.error(error.message || "Error al agregar ingrediente");
    },
  });

  const deleteDishMutation = trpc.dishes.delete.useMutation({
    onSuccess: () => {
      toast.success("Plato eliminado");
      refetchDishes();
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar plato");
    },
  });

  const deleteIngredientMutation = trpc.ingredients.delete.useMutation({
    onSuccess: () => {
      toast.success("Ingrediente eliminado");
      refetchIngredients();
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar ingrediente");
    },
  });

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name || !dishForm.priceInBs || !dishForm.quantityAvailable) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    await createDishMutation.mutateAsync({
      kerMesseId,
      name: dishForm.name,
      description: dishForm.description || undefined,
      category: dishForm.category,
      priceInBs: parseInt(dishForm.priceInBs) * 100, // Convert to cents
      quantityAvailable: parseInt(dishForm.quantityAvailable),
    });
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientForm.name || !ingredientForm.quantity || !ingredientForm.quantityNeeded) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    await createIngredientMutation.mutateAsync({
      kerMesseId,
      name: ingredientForm.name,
      quantity: ingredientForm.quantity,
      unit: ingredientForm.unit,
      quantityNeeded: parseInt(ingredientForm.quantityNeeded),
    });
  };

  if (!kermesse || kermesse.organizerId !== user?.id) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">No tienes permiso para acceder a esta página</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Gestionar: {kermesse.title}</h1>

        {/* Dishes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Platos</h2>
            <Button size="sm" onClick={() => setShowAddDish(!showAddDish)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Plato
            </Button>
          </div>

          {showAddDish && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <form onSubmit={handleAddDish} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Plato *</Label>
                      <Input
                        id="name"
                        placeholder="Ej: Salteña"
                        value={dishForm.name}
                        onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <select
                        id="category"
                        value={dishForm.category}
                        onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      >
                        <option value="Oriente">Oriente</option>
                        <option value="Occidente">Occidente</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe el plato"
                      value={dishForm.description}
                      onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceInBs">Precio (bs) *</Label>
                      <Input
                        id="priceInBs"
                        type="number"
                        placeholder="Ej: 15"
                        value={dishForm.priceInBs}
                        onChange={(e) => setDishForm({ ...dishForm, priceInBs: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantityAvailable">Cantidad *</Label>
                      <Input
                        id="quantityAvailable"
                        type="number"
                        placeholder="Ej: 50"
                        value={dishForm.quantityAvailable}
                        onChange={(e) => setDishForm({ ...dishForm, quantityAvailable: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createDishMutation.isPending}>
                      Agregar
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddDish(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {dishes && dishes.length > 0 ? (
            <div className="space-y-2">
              {dishes.map((dish) => (
                <Card key={dish.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{dish.name}</h3>
                        <p className="text-sm text-slate-600">
                          {formatCurrency(dish.priceInBs)} - {dish.quantityAvailable} disponibles
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDishMutation.mutate({ id: dish.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                No hay platos agregados
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ingredients Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Ingredientes</h2>
            <Button size="sm" onClick={() => setShowAddIngredient(!showAddIngredient)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Ingrediente
            </Button>
          </div>

          {showAddIngredient && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <form onSubmit={handleAddIngredient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingName">Nombre del Ingrediente *</Label>
                    <Input
                      id="ingName"
                      placeholder="Ej: Harina de trigo"
                      value={ingredientForm.name}
                      onChange={(e) => setIngredientForm({ ...ingredientForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Cantidad Necesaria *</Label>
                      <Input
                        id="quantity"
                        placeholder="Ej: 10"
                        value={ingredientForm.quantity}
                        onChange={(e) => setIngredientForm({ ...ingredientForm, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unidad</Label>
                      <select
                        id="unit"
                        value={ingredientForm.unit}
                        onChange={(e) => setIngredientForm({ ...ingredientForm, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      >
                        <option value="kg">kg</option>
                        <option value="litro">litro</option>
                        <option value="unidad">unidad</option>
                        <option value="docena">docena</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createIngredientMutation.isPending}>
                      Agregar
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddIngredient(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {ingredients && ingredients.length > 0 ? (
            <div className="space-y-2">
              {ingredients.map((ingredient) => (
                <Card key={ingredient.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{ingredient.name}</h3>
                        <p className="text-sm text-slate-600">
                          {ingredient.quantityNeeded} {ingredient.unit} - Donado: {ingredient.quantityDonated}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {ingredient.isDonated && (
                          <Badge className="bg-green-100 text-green-800">Completo</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteIngredientMutation.mutate({ id: ingredient.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                No hay ingredientes listados
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
