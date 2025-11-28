import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Heart, Users, Utensils, Calendar, Phone, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: kermesses, isLoading } = trpc.kermesses.getActive.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <span className="text-2xl font-bold text-slate-900">{APP_TITLE}</span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 no-underline">
                  Dashboard
                </Link>
                <Link href="/my-kermesses" className="text-slate-600 hover:text-slate-900 no-underline">
                  Mis Kermesses
                </Link>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile" className="no-underline">
                    {user?.name || "Perfil"}
                  </Link>
                </Button>
              </>
            ) : (
              <Button size="sm" asChild>
                <a href={getLoginUrl()}>Iniciar Sesión</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Kermesses Benéficas
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Descubre eventos solidarios donde la comida típica boliviana se vende para ayudar a quienes lo necesitan. 
              Cada compra es una contribución al bienestar de nuestras comunidades.
            </p>
            {!isAuthenticated && (
              <Button size="lg" asChild>
                <a href={getLoginUrl()}>Crear una Kermesse</a>
              </Button>
            )}
            {isAuthenticated && (
              <Button size="lg" asChild>
                <Link href="/create-kermesse" className="no-underline">
                  Crear una Kermesse
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Kermesses Activas</h2>
          <p className="text-slate-600 mb-8">
            {kermesses?.length === 0 
              ? "No hay kermesses activas en este momento." 
              : `Encontramos ${kermesses?.length} kermesses activas`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-slate-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : kermesses && kermesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kermesses.map((kermesse) => (
                <Link key={kermesse.id} href={`/kermesse/${kermesse.id}`} className="no-underline">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-slate-900">
                            {kermesse.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Para: <span className="font-semibold text-slate-700">{kermesse.beneficiaryName}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="whitespace-nowrap">
                          <Heart className="w-3 h-3 mr-1" />
                          Activa
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {kermesse.beneficiaryReason}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(new Date(kermesse.eventDate))}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{kermesse.contactPhone}</span>
                        </div>
                        {kermesse.contactEmail && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4" />
                            <span>{kermesse.contactEmail}</span>
                          </div>
                        )}
                      </div>

                      <Button variant="default" className="w-full">
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No hay kermesses activas en este momento.</p>
              {isAuthenticated && (
                <Button className="mt-4" asChild>
                  <Link href="/create-kermesse" className="no-underline">
                    Sé el primero en crear una
                  </Link>
                </Button>
              )}
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Cómo Funciona KSol
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle>Organiza</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Crea una kermesse benéfica para ayudar a alguien que lo necesita. Define los platos, 
                  ingredientes y colaboradores.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Utensils className="w-6 h-6 text-orange-500" />
                </div>
                <CardTitle>Vende</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Vende platos típicos de Bolivia. Los clientes compran directamente a través del contacto 
                  que proporcionas. Registra cada venta fácilmente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>Ayuda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Toda la ganancia va directamente a ayudar al beneficiario. Genera reportes transparentes 
                  de recaudación y entregas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2025 {APP_TITLE}. Plataforma solidaria para kermesses benéficas en Bolivia.
          </p>
        </div>
      </footer>
    </div>
  );
}
