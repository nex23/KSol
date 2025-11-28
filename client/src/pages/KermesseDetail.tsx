import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Heart, Phone, Mail, Calendar, Users, Utensils, Leaf, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function KermesseDetail() {
  const [, params] = useRoute("/kermesse/:id");
  const { user } = useAuth();
  const kerMesseId = parseInt(params?.id || "0");

  const { data: kermesse, isLoading: kerMesseLoading } = trpc.kermesses.getById.useQuery(
    { id: kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: dishes } = trpc.dishes.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: ingredients } = trpc.ingredients.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: collaborators } = trpc.collaborators.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const isOrganizer = user && kermesse && user.id === kermesse.organizerId;

  if (kerMesseLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="h-96 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!kermesse) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
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

  const totalDishesAvailable = dishes?.reduce((sum, d) => sum + d.quantityAvailable, 0) || 0;
  const totalIngredients = ingredients?.length || 0;
  const ingredientsDonated = ingredients?.filter(i => i.isDonated).length || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        {/* Main Card */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <Badge>{kermesse.status}</Badge>
                </div>
                <CardTitle className="text-3xl text-slate-900">{kermesse.title}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Para ayudar a: <span className="font-semibold text-slate-700">{kermesse.beneficiaryName}</span>
                </CardDescription>
              </div>
              {isOrganizer && (
                <Button asChild>
                  <Link href={`/edit-kermesse/${kermesse.id}`} className="no-underline">
                    Editar
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Motivo de la Kermesse</h3>
              <p className="text-slate-600">{kermesse.beneficiaryReason}</p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Teléfono</p>
                  <p className="font-semibold text-slate-900">{kermesse.contactPhone}</p>
                </div>
              </div>
              {kermesse.contactEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-semibold text-slate-900">{kermesse.contactEmail}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Fecha del Evento</p>
                  <p className="font-semibold text-slate-900">{formatDate(new Date(kermesse.eventDate))}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{totalDishesAvailable}</p>
                <p className="text-sm text-slate-600">Platos Disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{collaborators?.length || 0}</p>
                <p className="text-sm text-slate-600">Colaboradores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{ingredientsDonated}/{totalIngredients}</p>
                <p className="text-sm text-slate-600">Ingredientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dishes Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-900">Platos Disponibles</h2>
          </div>

          {dishes && dishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishes.map((dish) => (
                <Card key={dish.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                        <Badge variant="outline" className="mt-2">{dish.category}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(dish.priceInBs)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dish.description && (
                      <p className="text-sm text-slate-600">{dish.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-slate-600">Disponibles:</span>
                      <span className="font-semibold text-slate-900">
                        {dish.quantityAvailable - dish.quantitySold} / {dish.quantityAvailable}
                      </span>
                    </div>
                    {isOrganizer && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/edit-dish/${dish.id}`} className="no-underline">
                          Editar
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No hay platos disponibles aún</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ingredients Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold text-slate-900">Ingredientes Necesarios</h2>
          </div>

          {ingredients && ingredients.length > 0 ? (
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <Card key={ingredient.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{ingredient.name}</h3>
                        <p className="text-sm text-slate-600">
                          Necesario: {ingredient.quantityNeeded} {ingredient.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Donado</p>
                          <p className="font-semibold text-slate-900">
                            {ingredient.quantityDonated} {ingredient.unit}
                          </p>
                        </div>
                        {ingredient.isDonated ? (
                          <Badge className="bg-green-100 text-green-800">Completo</Badge>
                        ) : (
                          <Badge variant="outline">Falta</Badge>
                        )}
                      </div>
                    </div>
                    {!ingredient.isDonated && (
                      <Button size="sm" className="w-full mt-4" asChild>
                        <Link href={`/donate-ingredient/${ingredient.id}`} className="no-underline">
                          Donar
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Leaf className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No hay ingredientes listados</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons for Organizer */}
        {isOrganizer && (
          <div className="mb-8 flex gap-2 flex-wrap">
            <Button asChild>
              <Link href={`/register-sale/${kermesse.id}`} className="no-underline">
                Registrar Venta
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/manage-deliveries/${kermesse.id}`} className="no-underline">
                Gestionar Entregas
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/sales-report/${kermesse.id}`} className="no-underline">
                Ver Reportes
              </Link>
            </Button>
          </div>
        )}

        {/* Collaborators Section */}
        {isOrganizer && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h2 className="text-2xl font-bold text-slate-900">Colaboradores</h2>
              </div>
              <Button size="sm" asChild>
                <Link href={`/add-collaborator/${kermesse.id}`} className="no-underline">
                  Agregar
                </Link>
              </Button>
            </div>

            {collaborators && collaborators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collaborators.map((collab) => (
                  <Card key={collab.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">Usuario ID: {collab.userId}</p>
                          <Badge variant="outline" className="mt-2">
                            {collab.role === "cook" ? "Cocinero" : collab.role === "seller" ? "Vendedor" : "Repartidor"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No hay colaboradores aún</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
