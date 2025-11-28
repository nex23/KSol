import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useRoute } from 'wouter';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

/**
 * Página de estadísticas de kermesse
 * Muestra gráficos y métricas en tiempo real
 */
export default function KermesseStatistics() {
  const [, params] = useRoute('/kermesse/:id/statistics');
  const kerMesseId = params?.id ? parseInt(params.id) : 0;

  // Obtener datos de la kermesse
  const { data: kermesse } = trpc.kermesses.getById.useQuery(
    { id: kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  // Obtener platos
  const { data: dishes = [] } = trpc.dishes.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  // Obtener ventas
  const { data: sales = [] } = trpc.sales.getForKermesse.useQuery(
    { kerMesseId },
    { enabled: kerMesseId > 0 }
  );

  // Obtener colaboradores
  const { data: collaborators = [] } =
    trpc.collaborators.getForKermesse.useQuery(
      { kerMesseId },
      { enabled: kerMesseId > 0 }
    );

  // Calcular estadísticas
  const statistics = useMemo(() => {
    const totalVentas = sales.length;
    const totalRecaudado = sales.reduce(
      (sum, sale) => sum + (sale.totalAmountInBs || 0),
      0
    );
    const ventasEntregadas = sales.filter(
      (s) => s.status === 'delivered'
    ).length;
    const platosVendidos = dishes.reduce(
      (sum, dish) => sum + (dish.quantitySold || 0),
      0
    );

    // Datos para gráfico de ventas por plato
    const ventasPorPlato = dishes.map((dish) => ({
      name: dish.name,
      vendidas: dish.quantitySold || 0,
      disponibles: dish.quantityAvailable,
    }));

    // Datos para gráfico de estado de ventas
    const estadoVentas = [
      {
        name: 'Entregadas',
        value: ventasEntregadas,
        color: '#10b981',
      },
      {
        name: 'Pendientes',
        value: sales.filter((s) => s.status === 'pending').length,
        color: '#f59e0b',
      },
      {
        name: 'Canceladas',
        value: sales.filter((s) => s.status === 'cancelled').length,
        color: '#ef4444',
      },
    ];

    // Datos para gráfico de progreso de meta
    const metaRecaudacion = 50000; // 500 bs en centavos
    const porcentajeAvance = Math.min(
      (totalRecaudado / metaRecaudacion) * 100,
      100
    );

    return {
      totalVentas,
      totalRecaudado,
      ventasEntregadas,
      platosVendidos,
      ventasPorPlato,
      estadoVentas,
      porcentajeAvance,
      metaRecaudacion,
    };
  }, [sales, dishes]);

  const formatCurrency = (centavos: number) => {
    return `${(centavos / 100).toFixed(2)} bs`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Estadísticas - {kermesse?.title}
          </h1>
          <p className="text-slate-600">
            Beneficiario: {kermesse?.beneficiaryName}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Ventas */}
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total de Ventas
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {statistics.totalVentas}
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          {/* Total Recaudado */}
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Recaudado
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {formatCurrency(statistics.totalRecaudado)}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </Card>

          {/* Entregas Completadas */}
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Entregas Completadas
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {statistics.ventasEntregadas}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-500 opacity-20" />
            </div>
          </Card>

          {/* Platos Vendidos */}
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Platos Vendidos
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {statistics.platosVendidos}
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ventas por Plato */}
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Ventas por Plato
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.ventasPorPlato}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendidas" fill="#3b82f6" name="Vendidas" />
                <Bar dataKey="disponibles" fill="#e5e7eb" name="Disponibles" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Estado de Ventas */}
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Estado de Ventas
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statistics.estadoVentas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statistics.estadoVentas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Meta de Recaudación */}
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Progreso hacia Meta de Recaudación
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                {formatCurrency(statistics.totalRecaudado)} de{' '}
                {formatCurrency(statistics.metaRecaudacion)}
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {statistics.porcentajeAvance.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${statistics.porcentajeAvance}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Colaboradores */}
        {collaborators.length > 0 && (
          <Card className="p-6 bg-white mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Colaboradores ({collaborators.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <p className="font-medium text-slate-900">
                    {collab.role === 'cook' && '👨‍🍳'}
                    {collab.role === 'seller' && '🛍️'}
                    {collab.role === 'distributor' && '🚚'} {collab.userId}
                  </p>
                  <p className="text-sm text-slate-600 capitalize">
                    {collab.role === 'cook' && 'Cocinero/a'}
                    {collab.role === 'seller' && 'Vendedor/a'}
                    {collab.role === 'distributor' && 'Repartidor/a'}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
