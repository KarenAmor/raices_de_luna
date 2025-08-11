import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react';

const GestionCreditos = ({ onBack }) => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const fetchVentas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ventas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Filtrar solo ventas a crédito
        const ventasCredito = data.data.filter(venta => venta.tipo_pago === 'credito');
        setVentas(ventasCredito);
      } else {
        setError('Error al cargar las ventas a crédito');
      }
    } catch (error) {
      setError('Error de conexión al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const marcarComoPagada = async (ventaId) => {
    setProcesando(ventaId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raices-de-luna.onrender.com/ventas/${ventaId}/pagar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Actualizar la venta en el estado local
        setVentas(ventas.map(venta => 
          venta.id === ventaId 
            ? { ...venta, pagado: true }
            : venta
        ));
      } else {
        setError('Error al marcar la venta como pagada');
      }
    } catch (error) {
      setError('Error de conexión al actualizar la venta');
    } finally {
      setProcesando(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isVencida = (fechaVencimiento) => {
    if (!fechaVencimiento) return false;
    return new Date(fechaVencimiento) < new Date();
  };

  const diasRestantes = (fechaVencimiento) => {
    if (!fechaVencimiento) return null;
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diferencia;
  };

  const ventasPendientes = ventas.filter(venta => !venta.pagado);
  const ventasPagadas = ventas.filter(venta => venta.pagado);
  const ventasVencidas = ventasPendientes.filter(venta => isVencida(venta.fecha_vencimiento));

  const totalPorCobrar = ventasPendientes.reduce((sum, venta) => sum + venta.precio_venta, 0);
  const totalVencido = ventasVencidas.reduce((sum, venta) => sum + venta.precio_venta, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ventas a crédito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Créditos
              </h1>
              <p className="text-sm text-gray-600">
                Administra las ventas a crédito y sus pagos
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total por Cobrar
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalPorCobrar)}
              </div>
              <p className="text-xs text-muted-foreground">
                {ventasPendientes.length} ventas pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas Vencidas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalVencido)}
              </div>
              <p className="text-xs text-muted-foreground">
                {ventasVencidas.length} ventas vencidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas Pagadas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {ventasPagadas.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Créditos completados
              </p>
            </CardContent>
          </Card>
        </div>

        {ventas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay ventas a crédito
              </h3>
              <p className="text-gray-600">
                Las ventas a crédito aparecerán aquí cuando se registren.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Ventas Pendientes */}
            {ventasPendientes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Ventas Pendientes de Pago ({ventasPendientes.length})
                  </CardTitle>
                  <CardDescription>
                    Ventas a crédito que aún no han sido pagadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ventasPendientes.map((venta) => {
                      const dias = diasRestantes(venta.fecha_vencimiento);
                      const vencida = isVencida(venta.fecha_vencimiento);
                      
                      return (
                        <div key={venta.id} className={`p-4 border rounded-lg ${vencida ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  Venta #{venta.id}
                                </Badge>
                                {vencida ? (
                                  <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Vencida
                                  </Badge>
                                ) : dias !== null && dias <= 3 ? (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {dias === 0 ? 'Vence hoy' : `${dias} días restantes`}
                                  </Badge>
                                ) : null}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Vendedora:</p>
                                  <p className="font-medium flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {venta.vendedora_nombre}
                                  </p>
                                </div>
                                
                                {venta.cliente_nombre && (
                                  <div>
                                    <p className="text-gray-600">Cliente:</p>
                                    <p className="font-medium">{venta.cliente_nombre}</p>
                                  </div>
                                )}
                                
                                {venta.cliente_telefono && (
                                  <div>
                                    <p className="text-gray-600">Teléfono:</p>
                                    <p className="font-medium flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {venta.cliente_telefono}
                                    </p>
                                  </div>
                                )}
                                
                                <div>
                                  <p className="text-gray-600">Fecha de Venta:</p>
                                  <p className="font-medium flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(venta.fecha_venta)}
                                  </p>
                                </div>
                                
                                {venta.fecha_vencimiento && (
                                  <div>
                                    <p className="text-gray-600">Fecha de Vencimiento:</p>
                                    <p className={`font-medium flex items-center gap-1 ${vencida ? 'text-red-600' : ''}`}>
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(venta.fecha_vencimiento)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right space-y-2">
                              <div className="text-2xl font-bold text-orange-600">
                                {formatCurrency(venta.precio_venta)}
                              </div>
                              <Button
                                onClick={() => marcarComoPagada(venta.id)}
                                disabled={procesando === venta.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {procesando === venta.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Marcar como Pagada
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ventas Pagadas */}
            {ventasPagadas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Ventas Pagadas ({ventasPagadas.length})
                  </CardTitle>
                  <CardDescription>
                    Historial de ventas a crédito que ya fueron pagadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ventasPagadas.map((venta) => (
                      <div key={venta.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                Venta #{venta.id}
                              </Badge>
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pagada
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Vendedora:</p>
                                <p className="font-medium">{venta.vendedora_nombre}</p>
                              </div>
                              
                              {venta.cliente_nombre && (
                                <div>
                                  <p className="text-gray-600">Cliente:</p>
                                  <p className="font-medium">{venta.cliente_nombre}</p>
                                </div>
                              )}
                              
                              <div>
                                <p className="text-gray-600">Fecha de Venta:</p>
                                <p className="font-medium">{formatDate(venta.fecha_venta)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(venta.precio_venta)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionCreditos;

