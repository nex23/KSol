import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle, Clock, Truck } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export default function ManageDeliveries() {
  const [, params] = useRoute("/manage-deliveries/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const kerMesseId = parseInt(params?.id || "0");

  const { data: kermesse } = trpc.kermesses.getById.useQuery(
    { id: kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  const { data: deliveriesData, refetch } = trpc.deliveries.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 && !!user }
  );

  const updateStatusMutation = trpc.deliveries.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Estado de entrega actualizado");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar entrega");
    },
  });

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

  const handleStatusChange = async (deliveryId: number, newStatus: "pending" | "in_transit" | "delivered") => {
    await updateStatusMutation.mutateAsync({
      id: deliveryId,
      status: newStatus,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "in_transit":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "in_transit":
        return "En Tránsito";
      case "delivered":
        return "Entregado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <Link href={`/kermesse/${kerMesseId}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 no-underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestionar Entregas</h1>
        <p className="text-slate-600 mb-8">{kermesse.title}</p>

        {/* Deliveries List */}
        {deliveriesData && deliveriesData.length > 0 ? (
          <div className="space-y-4">
            {deliveriesData.map((delivery: any) => (
              <Card key={delivery.deliveries.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(delivery.deliveries.status)}
                          <h3 className="font-semibold text-slate-900">
                            Comprador: {delivery.sales.buyerName}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600">
                          Teléfono: {delivery.sales.buyerPhone || "No proporcionado"}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {getStatusLabel(delivery.deliveries.status)}
                      </Badge>
                    </div>

                    {/* Sale Details */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-semibold text-slate-900 mb-2">Detalles de Venta:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total:</span>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(delivery.sales.totalAmountInBs)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-slate-600">Fecha:</span>
                        <span className="text-sm text-slate-900">
                          {formatDateTime(new Date(delivery.sales.saleDate))}
                        </span>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant={delivery.deliveries.status === "pending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(delivery.deliveries.id, "pending")}
                        disabled={updateStatusMutation.isPending}
                      >
                        Pendiente
                      </Button>
                      <Button
                        variant={delivery.deliveries.status === "in_transit" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(delivery.deliveries.id, "in_transit")}
                        disabled={updateStatusMutation.isPending}
                      >
                        En Tránsito
                      </Button>
                      <Button
                        variant={delivery.deliveries.status === "delivered" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(delivery.deliveries.id, "delivered")}
                        disabled={updateStatusMutation.isPending}
                        className={delivery.deliveries.status === "delivered" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        Entregado
                      </Button>
                    </div>

                    {/* Notes */}
                    {delivery.deliveries.notes && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <strong>Notas:</strong> {delivery.deliveries.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No hay entregas registradas aún</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
