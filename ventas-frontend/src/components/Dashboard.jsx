import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Package, 
  DollarSign, 
  CreditCard, 
  Users, 
  ShoppingCart, 
  LogOut,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const Dashboard = ({ usuario, onLogout, onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://raices-de-luna.onrender.com/inventario/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Error al cargar las estadísticas');
      }
    } catch (error) {
      setError('Error de conexión al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Ventas
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenida, {usuario.nombre}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={() => onNavigate('ventas')}
            className="h-16 text-lg bg-green-600 hover:bg-green-700"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Registrar Venta
          </Button>
          <Button 
            onClick={() => onNavigate('inventario')}
            variant="outline"
            className="h-16 text-lg"
          >
            <Package className="mr-2 h-5 w-5" />
            Gestionar Inventario
          </Button>
          <Button 
            onClick={() => onNavigate('creditos')}
            variant="outline"
            className="h-16 text-lg"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Gestionar Créditos
          </Button>
        </div>

        {stats && (
          <>
            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Productos Disponibles
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.inventario.unidades_disponibles}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    de {stats.inventario.unidades_producidas} producidas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total en Efectivo
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.finanzas.total_efectivo)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dinero disponible
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Por Cobrar
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(stats.finanzas.total_por_cobrar)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ventas a crédito
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ganancia Bruta
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.finanzas.ganancia_bruta)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ganancia estimada
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ventas por Vendedora */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Ventas por Vendedora
                  </CardTitle>
                  <CardDescription>
                    Resumen de ventas individuales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.ventas.ventas_por_vendedora).map(([nombre, datos]) => (
                      <div key={nombre} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{nombre}</p>
                          <p className="text-sm text-gray-600">
                            {datos.cantidad} productos vendidos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {formatCurrency(datos.total_efectivo)}
                          </p>
                          {datos.total_credito > 0 && (
                            <p className="text-sm text-orange-600">
                              {formatCurrency(datos.total_credito)} a crédito
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Información del Lote Actual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Lote Actual
                  </CardTitle>
                  <CardDescription>
                    Información del inventario actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.inventario.lote_actual && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID del Lote:</span>
                        <Badge variant="outline">
                          #{stats.inventario.lote_actual.id_lote}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fecha de Creación:</span>
                        <span className="text-sm font-medium">
                          {stats.inventario.lote_actual.fecha_creacion}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Costo de Producción:</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(stats.inventario.lote_actual.costo_total_produccion)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Precio por Unidad:</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(stats.inventario.lote_actual.precio_unitario_venta)}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Progreso de Ventas:</span>
                          <span className="text-sm font-medium">
                            {stats.inventario.unidades_vendidas} / {stats.inventario.unidades_producidas}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(stats.inventario.unidades_vendidas / stats.inventario.unidades_producidas) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

