import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InventarioService, Venta } from '../inventario/inventario.service';

export interface RegistrarVentaDto {
  tipo_pago: 'efectivo' | 'credito';
  cliente_nombre?: string;
  cliente_telefono?: string;
  dias_credito?: number; // 8 o 15 días para crédito
}

@Injectable()
export class VentasService {
  private readonly ventasPath = path.join(process.cwd(), 'src/data/ventas.json');

  constructor(private readonly inventarioService: InventarioService) {}

  private leerVentas(): Venta[] {
    try {
      const data = fs.readFileSync(this.ventasPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private escribirVentas(ventas: Venta[]): void {
    fs.writeFileSync(this.ventasPath, JSON.stringify(ventas, null, 2));
  }

  private calcularFechaVencimiento(diasCredito: number): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasCredito);
    return fecha.toISOString().split('T')[0];
  }

  registrarVenta(ventaData: RegistrarVentaDto, vendedora: { id: number; nombre: string }): Venta | null {
    // Obtener lote actual
    const loteActual = this.inventarioService.obtenerLoteActual();
    if (!loteActual || loteActual.unidades_disponibles <= 0) {
      return null; // No hay inventario disponible
    }

    // Reducir inventario
    const inventarioReducido = this.inventarioService.reducirInventario(loteActual.id_lote, 1);
    if (!inventarioReducido) {
      return null; // No se pudo reducir el inventario
    }

    // Crear nueva venta
    const ventas = this.leerVentas();
    const nuevaVenta: Venta = {
      id: ventas.length + 1,
      id_lote: loteActual.id_lote,
      vendedora_id: vendedora.id,
      vendedora_nombre: vendedora.nombre,
      cliente_nombre: ventaData.cliente_nombre,
      cliente_telefono: ventaData.cliente_telefono,
      tipo_pago: ventaData.tipo_pago,
      fecha_venta: new Date().toISOString().split('T')[0],
      pagado: ventaData.tipo_pago === 'efectivo', // Si es efectivo, ya está pagado
      precio_venta: loteActual.precio_unitario_venta
    };

    // Si es a crédito, calcular fecha de vencimiento
    if (ventaData.tipo_pago === 'credito') {
      const diasCredito = ventaData.dias_credito || 8; // Por defecto 8 días
      nuevaVenta.fecha_vencimiento = this.calcularFechaVencimiento(diasCredito);
    }

    // Guardar venta
    ventas.push(nuevaVenta);
    this.escribirVentas(ventas);

    return nuevaVenta;
  }

  obtenerVentas(): Venta[] {
    return this.leerVentas();
  }

  obtenerVentasVencidas(): Venta[] {
    const ventas = this.leerVentas();
    const hoy = new Date().toISOString().split('T')[0];
    
    return ventas.filter(venta => 
      venta.tipo_pago === 'credito' && 
      !venta.pagado && 
      venta.fecha_vencimiento && 
      venta.fecha_vencimiento <= hoy
    );
  }

  marcarComoPagada(ventaId: number): boolean {
    const ventas = this.leerVentas();
    const venta = ventas.find(v => v.id === ventaId);
    
    if (!venta) return false;
    
    venta.pagado = true;
    this.escribirVentas(ventas);
    return true;
  }
}
