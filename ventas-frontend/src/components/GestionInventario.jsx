import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  ArrowLeft, 
  Package, 
  Plus, 
  Trash2,
  CheckCircle,
  Loader2,
  Calculator
} from 'lucide-react';

const GestionInventario = ({ onBack }) => {
  const [ingredientes, setIngredientes] = useState([
    { nombre: '', costo_unitario: '', cantidad_comprada: '' }
  ]);
  const [formData, setFormData] = useState({
    costo_total_produccion: '',
    unidades_producidas: '',
    precio_unitario_venta: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const agregarIngrediente = () => {
    setIngredientes([
      ...ingredientes,
      { nombre: '', costo_unitario: '', cantidad_comprada: '' }
    ]);
  };

  const eliminarIngrediente = (index) => {
    if (ingredientes.length > 1) {
      setIngredientes(ingredientes.filter((_, i) => i !== index));
    }
  };

  const handleIngredienteChange = (index, field, value) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index][field] = value;
    setIngredientes(nuevosIngredientes);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calcularCostoTotal = () => {
    return ingredientes.reduce((total, ing) => {
      const costo = parseFloat(ing.costo_unitario) || 0;
      const cantidad = parseFloat(ing.cantidad_comprada) || 0;
      return total + (costo * cantidad);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validaciones
    const ingredientesValidos = ingredientes.filter(ing => 
      ing.nombre.trim() && 
      ing.costo_unitario && 
      ing.cantidad_comprada
    );

    if (ingredientesValidos.length === 0) {
      setError('Debe agregar al menos un ingrediente válido');
      setLoading(false);
      return;
    }

    if (!formData.costo_total_produccion || !formData.unidades_producidas || !formData.precio_unitario_venta) {
      setError('Todos los campos del lote son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const loteData = {
        ingredientes: ingredientesValidos.map(ing => ({
          nombre: ing.nombre.trim(),
          costo_unitario: parseFloat(ing.costo_unitario),
          cantidad_comprada: parseFloat(ing.cantidad_comprada)
        })),
        costo_total_produccion: parseFloat(formData.costo_total_produccion),
        unidades_producidas: parseInt(formData.unidades_producidas),
        precio_unitario_venta: parseFloat(formData.precio_unitario_venta)
      };

      const response = await fetch('http://localhost:3000/inventario/lote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(loteData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Limpiar formulario
        setIngredientes([{ nombre: '', costo_unitario: '', cantidad_comprada: '' }]);
        setFormData({
          costo_total_produccion: '',
          unidades_producidas: '',
          precio_unitario_venta: ''
        });
        
        // Mostrar mensaje de éxito por 5 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.message || 'Error al crear el lote');
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const costoCalculado = calcularCostoTotal();

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
                Gestión de Inventario
              </h1>
              <p className="text-sm text-gray-600">
                Crear un nuevo lote de productos
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Nuevo lote creado exitosamente! El inventario se ha actualizado.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ingredientes del Lote
              </CardTitle>
              <CardDescription>
                Agrega todos los ingredientes utilizados en la producción
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredientes.map((ingrediente, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-2">
                    <Label htmlFor={`nombre-${index}`}>Nombre del Ingrediente</Label>
                    <Input
                      id={`nombre-${index}`}
                      placeholder="Ej: Tricofero de barry"
                      value={ingrediente.nombre}
                      onChange={(e) => handleIngredienteChange(index, 'nombre', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`costo-${index}`}>Costo Unitario (COP)</Label>
                    <Input
                      id={`costo-${index}`}
                      type="number"
                      placeholder="32000"
                      value={ingrediente.costo_unitario}
                      onChange={(e) => handleIngredienteChange(index, 'costo_unitario', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`cantidad-${index}`}>Cantidad</Label>
                      <Input
                        id={`cantidad-${index}`}
                        type="number"
                        placeholder="4"
                        value={ingrediente.cantidad_comprada}
                        onChange={(e) => handleIngredienteChange(index, 'cantidad_comprada', e.target.value)}
                      />
                    </div>
                    {ingredientes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="mt-6"
                        onClick={() => eliminarIngrediente(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {ingrediente.costo_unitario && ingrediente.cantidad_comprada && (
                    <div className="md:col-span-4 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Costo total de este ingrediente: </strong>
                      {formatCurrency(parseFloat(ingrediente.costo_unitario) * parseFloat(ingrediente.cantidad_comprada))}
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={agregarIngrediente}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ingrediente
              </Button>

              {costoCalculado > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-900 font-medium">
                    <Calculator className="h-4 w-4" />
                    Costo Total Calculado: {formatCurrency(costoCalculado)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Lote */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Lote</CardTitle>
              <CardDescription>
                Datos generales de producción y venta
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costo_total_produccion">Costo Total de Producción (COP)</Label>
                <Input
                  id="costo_total_produccion"
                  name="costo_total_produccion"
                  type="number"
                  placeholder="420000"
                  value={formData.costo_total_produccion}
                  onChange={handleFormChange}
                  required
                />
                {costoCalculado > 0 && (
                  <p className="text-xs text-gray-500">
                    Sugerido: {formatCurrency(costoCalculado)}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unidades_producidas">Unidades Producidas</Label>
                <Input
                  id="unidades_producidas"
                  name="unidades_producidas"
                  type="number"
                  placeholder="100"
                  value={formData.unidades_producidas}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precio_unitario_venta">Precio de Venta por Unidad (COP)</Label>
                <Input
                  id="precio_unitario_venta"
                  name="precio_unitario_venta"
                  type="number"
                  placeholder="20000"
                  value={formData.precio_unitario_venta}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumen del Lote */}
          {formData.costo_total_produccion && formData.unidades_producidas && formData.precio_unitario_venta && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Lote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Costo por Unidad</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(parseFloat(formData.costo_total_produccion) / parseInt(formData.unidades_producidas))}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ganancia por Unidad</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(parseFloat(formData.precio_unitario_venta) - (parseFloat(formData.costo_total_produccion) / parseInt(formData.unidades_producidas)))}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ingresos Totales</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(parseFloat(formData.precio_unitario_venta) * parseInt(formData.unidades_producidas))}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ganancia Total</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency((parseFloat(formData.precio_unitario_venta) * parseInt(formData.unidades_producidas)) - parseFloat(formData.costo_total_produccion))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando Lote...
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                Crear Nuevo Lote
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GestionInventario;

