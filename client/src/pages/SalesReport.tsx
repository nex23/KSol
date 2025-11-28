import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export default function SalesReport() {
  const [, params] = useRoute("/sales-report/:id");
  const { user } = useAuth();
  const kerMesseId = parseInt(params?.id || "0");

  const { data: kermesse } = trpc.kermesses.getById.useQuery(
    { id: kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: sales } = trpc.sales.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 && !!user }
  );

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

  const totalRevenue = sales?.reduce((sum, sale) => sum + sale.totalAmountInBs, 0) || 0;
  const deliveredRevenue = sales?.filter(s => s.status === "delivered").reduce((sum, sale) => sum + sale.totalAmountInBs, 0) || 0;
  const pendingRevenue = sales?.filter(s => s.status === "pending").reduce((sum, sale) => sum + sale.totalAmountInBs, 0) || 0;

  // Group sales by seller
  const salesBySeller = sales?.reduce((acc: Record<number, any>, sale) => {
    if (!acc[sale.sellerId]) {
      acc[sale.sellerId] = {
        sellerId: sale.sellerId,
        totalAmount: 0,
        salesCount: 0,
        deliveredAmount: 0,
      };
    }
    acc[sale.sellerId].totalAmount += sale.totalAmountInBs;
    acc[sale.sellerId].salesCount += 1;
    if (sale.status === "delivered") {
      acc[sale.sellerId].deliveredAmount += sale.totalAmountInBs;
    }
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <Link href={`/kermesse/${kerMesseId}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reporte de Ventas</h1>
        <p className="text-slate-600 mb-8">{kermesse.title}</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 mb-1">Total Recaudado</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 mb-1">Entregado</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(deliveredRevenue)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600 mb-1">Pendiente</p>
              <p className="text-3xl font-bold text-yellow-600">{formatCurrency(pendingRevenue)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales by Seller */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ventas por Vendedor</h2>

          {Object.keys(salesBySeller).length > 0 ? (
            <div className="space-y-3">
              {Object.values(salesBySeller).map((seller: any) => (
                <Card key={seller.sellerId}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">Vendedor ID: {seller.sellerId}</p>
                        <p className="text-sm text-slate-600">
                          {seller.salesCount} venta{seller.salesCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatCurrency(seller.totalAmount)}</p>
                        <p className="text-sm text-green-600">
                          Entregado: {formatCurrency(seller.deliveredAmount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                No hay ventas registradas
              </CardContent>
            </Card>
          )}
        </div>

        {/* All Sales */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Todas las Ventas</h2>

          {sales && sales.length > 0 ? (
            <div className="space-y-3">
              {sales.map((sale) => (
                <Card key={sale.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{sale.buyerName}</h3>
                        <p className="text-sm text-slate-600">
                          {formatDateTime(new Date(sale.saleDate))}
                        </p>
                        {sale.buyerPhone && (
                          <p className="text-sm text-slate-600">{sale.buyerPhone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatCurrency(sale.totalAmountInBs)}</p>
                        <Badge
                          variant="outline"
                          className={
                            sale.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : sale.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {sale.status === "delivered"
                            ? "Entregado"
                            : sale.status === "pending"
                            ? "Pendiente"
                            : "Cancelado"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                No hay ventas registradas
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
