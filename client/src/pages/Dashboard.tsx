import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { Heart, Plus, Utensils, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: myKermesses, isLoading } = trpc.kermesses.getMine.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: mySales } = trpc.sales.getMySales.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: myDeliveries } = trpc.deliveries.getMyDeliveries.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600 mb-4">Debes iniciar sesión para acceder al dashboard</p>
              <Button asChild>
                <a href="/login">Iniciar Sesión</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalSalesAmount = mySales?.reduce((sum, sale) => sum + sale.totalAmountInBs, 0) || 0;
  const deliveredCount = myDeliveries?.filter(d => d.status === "delivered").length || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-4">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">
              Bienvenido, {user?.name || "Usuario"}
            </h1>
            <p className="text-slate-600 mt-1">Gestiona tus kermesses y ventas desde aquí</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/create-kermesse" className="no-underline">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Kermesse
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Mis Kermesses</p>
                  <p className="text-3xl font-bold text-slate-900">{myKermesses?.length || 0}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Mis Ventas</p>
                  <p className="text-3xl font-bold text-slate-900">{mySales?.length || 0}</p>
                </div>
                <Utensils className="w-8 h-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Entregas</p>
                  <p className="text-3xl font-bold text-slate-900">{deliveredCount}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Vendido</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSalesAmount)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Kermesses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Mis Kermesses</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : myKermesses && myKermesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myKermesses.map((kermesse) => (
                <Card key={kermesse.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{kermesse.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Para: {kermesse.beneficiaryName}
                        </CardDescription>
                      </div>
                      <Badge>{kermesse.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {kermesse.beneficiaryReason}
                    </p>
                    <p className="text-sm text-slate-600">
                      📅 {formatDate(new Date(kermesse.eventDate))}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/kermesse/${kermesse.id}`} className="no-underline">
                          Ver
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/edit-kermesse/${kermesse.id}`} className="no-underline">
                          Editar
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/manage-kermesse/${kermesse.id}`} className="no-underline">
                          Gestionar
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No has creado ninguna kermesse aún</p>
                <Button asChild>
                  <Link href="/create-kermesse" className="no-underline">
                    Crear tu primera Kermesse
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* My Sales */}
        {mySales && mySales.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Mis Ventas Recientes</h2>
            <div className="space-y-2">
              {mySales.slice(0, 5).map((sale) => (
                <Card key={sale.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{sale.buyerName}</p>
                        <p className="text-sm text-slate-600">
                          {formatDate(new Date(sale.saleDate))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatCurrency(sale.totalAmountInBs)}</p>
                        <Badge variant="outline">{sale.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
