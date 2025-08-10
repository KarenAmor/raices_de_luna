import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { 
  ArrowLeft, 
  ShoppingCart, 
  User, 
  Phone, 
  CreditCard, 
  DollarSign,
  CheckCircle,
  Loader2
} from 'lucide-react';

const RegistrarVenta = ({ onBack }) => {
  const [formData, setFormData] = useState({
    tipo_pago: 'efectivo',
    cliente_nombre: '',
    cliente_telefono: '',
    dias_credito: 8,
    sin_datos: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTipoPagoChange = (value) => {
    setFormData({
      ...formData,
      tipo_pago: value
    });
  };

  const handleDiasCreditoChange = (value) => {
    setFormData({
      ...formData,
      dias_credito: parseInt(value)
    });
  };

  const handleSinDatosChange = (checked) => {
    setFormData({
      ...formData,
      sin_datos: checked,
      cliente_nombre: checked ? '' : formData.cliente_nombre,
      cliente_telefono: checked ? '' : formData.cliente_telefono
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      // Preparar datos para enviar
      const ventaData = {
        tipo_pago: formData.tipo_pago
      };

      // Solo incluir datos del cliente si no está marcado "sin datos"
      if (!formData.sin_datos) {
        if (formData.cliente_nombre.trim()) {
          ventaData.cliente_nombre = formData.cliente_nombre.trim();
        }
        if (formData.cliente_telefono.trim()) {
          ventaData.cliente_telefono = formData.cliente_telefono.trim();
        }
      }

      // Solo incluir días de crédito si es venta a crédito
      if (formData.tipo_pago === 'credito') {
        ventaData.dias_credito = formData.dias_credito;
      }

      const response = await fetch('https://raices-de-luna.onrender.com/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ventaData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          tipo_pago: 'efectivo',
          cliente_nombre: '',
          cliente_telefono: '',
          dias_credito: 8,
          sin_datos: false
        });
        
        // Mostrar mensaje de éxito por 3 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(data.message || 'Error al registrar la venta');
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

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
                Registrar Nueva Venta
              </h1>
              <p className="text-sm text-gray-600">
                Registra una nueva venta de producto para el cabello
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Venta registrada exitosamente! El inventario se ha actualizado.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Información de la Venta
            </CardTitle>
            <CardDescription>
              Completa los datos de la venta. Los datos del cliente son opcionales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de Pago */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tipo de Pago</Label>
                <RadioGroup 
                  value={formData.tipo_pago} 
                  onValueChange={handleTipoPagoChange}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="efectivo" id="efectivo" />
                    <Label htmlFor="efectivo" className="flex items-center gap-2 cursor-pointer">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Efectivo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credito" id="credito" />
                    <Label htmlFor="credito" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4 text-orange-600" />
                      Crédito
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Días de Crédito (solo si es crédito) */}
              {formData.tipo_pago === 'credito' && (
                <div className="space-y-2">
                  <Label htmlFor="dias_credito">Días para Pagar</Label>
                  <Select 
                    value={formData.dias_credito.toString()} 
                    onValueChange={handleDiasCreditoChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona los días" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 días</SelectItem>
                      <SelectItem value="15">15 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Checkbox para venta sin datos */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sin_datos"
                  checked={formData.sin_datos}
                  onCheckedChange={handleSinDatosChange}
                />
                <Label htmlFor="sin_datos" className="text-sm">
                  El cliente no quiere proporcionar sus datos
                </Label>
              </div>

              {/* Datos del Cliente (solo si no está marcado sin datos) */}
              {!formData.sin_datos && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Datos del Cliente (Opcional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente_nombre">Nombre del Cliente</Label>
                      <Input
                        id="cliente_nombre"
                        name="cliente_nombre"
                        type="text"
                        placeholder="Nombre completo"
                        value={formData.cliente_nombre}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cliente_telefono">Teléfono del Cliente</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="cliente_telefono"
                          name="cliente_telefono"
                          type="tel"
                          placeholder="3012345678"
                          value={formData.cliente_telefono}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen de la Venta */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Resumen de la Venta</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Producto:</span>
                    <span className="font-medium">Producto para el Cabello</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span className="font-medium">1 unidad</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio:</span>
                    <span className="font-medium">$20,000 COP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipo de Pago:</span>
                    <span className="font-medium capitalize">
                      {formData.tipo_pago}
                      {formData.tipo_pago === 'credito' && ` (${formData.dias_credito} días)`}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando Venta...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Registrar Venta
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrarVenta;

