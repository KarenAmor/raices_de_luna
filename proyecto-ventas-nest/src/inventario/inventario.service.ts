import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Ingrediente {
  nombre: string;
  costo_unitario: number; // Costo por unidad del ingrediente
  cantidad_comprada: number; // Cantidad comprada de este ingrediente
  costo_total_ingrediente?: number; // Costo total de este ingrediente (cantidad_comprada * costo_unitario)
}

export interface Lote {
  id_lote: number;
  fecha_creacion: string;
  ingredientes: Ingrediente[];
  costo_total_produccion: number;
  unidades_producidas: number;
  precio_unitario_venta: number;
  unidades_disponibles: number;
}

export interface InventarioData {
  lotes: Lote[];
}

export interface Venta {
  id: number;
  id_lote: number;
  vendedora_id: number;
  vendedora_nombre: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  tipo_pago: 'efectivo' | 'credito';
  fecha_venta: string;
  fecha_vencimiento?: string;
  pagado: boolean;
  precio_venta: number;
}

@Injectable()
export class InventarioService {
  private readonly inventarioPath = path.join(process.cwd(), 'src/data/inventario.json');
  private readonly ventasPath = path.join(process.cwd(), 'src/data/ventas.json');

  private leerInventario(): InventarioData {
    try {
      const data = fs.readFileSync(this.inventarioPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { lotes: [] };
    }
  }

  private escribirInventario(data: InventarioData): void {
    fs.writeFileSync(this.inventarioPath, JSON.stringify(data, null, 2));
  }

  private leerVentas(): Venta[] {
    try {
      const data = fs.readFileSync(this.ventasPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  obtenerLoteActual(): Lote | null {
    const inventario = this.leerInventario();
    if (inventario.lotes.length === 0) return null;
    
    // Retornar el último lote (el más reciente)
    return inventario.lotes[inventario.lotes.length - 1];
  }

  agregarNuevoLote(loteData: Omit<Lote, 'id_lote' | 'fecha_creacion' | 'unidades_disponibles' | 'ingredientes'> & { ingredientes: Array<{ nombre: string; costo_unitario: number; cantidad_comprada: number }> }): Lote {
    const inventario = this.leerInventario();
    
    // Calcular costo_total_ingrediente para cada ingrediente
    const ingredientesConCostoTotal = loteData.ingredientes.map(ing => ({
      ...ing,
      costo_total_ingrediente: ing.costo_unitario * ing.cantidad_comprada
    }));

    const nuevoLote: Lote = {
      ...loteData,
      ingredientes: ingredientesConCostoTotal,
      id_lote: inventario.lotes.length + 1,
      fecha_creacion: new Date().toISOString().split('T')[0],
      unidades_disponibles: loteData.unidades_producidas
    };

    inventario.lotes.push(nuevoLote);
    this.escribirInventario(inventario);
    
    return nuevoLote;
  }

  reducirInventario(idLote: number, cantidad: number = 1): boolean {
    const inventario = this.leerInventario();
    const lote = inventario.lotes.find(l => l.id_lote === idLote);
    
    if (!lote || lote.unidades_disponibles < cantidad) {
      return false;
    }

    lote.unidades_disponibles -= cantidad;
    this.escribirInventario(inventario);
    return true;
  }

  obtenerEstadisticas() {
    const inventario = this.leerInventario();
    const ventas = this.leerVentas();
    const loteActual = this.obtenerLoteActual();

    // Estadísticas de inventario
    const totalUnidadesDisponibles = inventario.lotes.reduce((sum, lote) => sum + lote.unidades_disponibles, 0);
    const totalUnidadesProducidas = inventario.lotes.reduce((sum, lote) => sum + lote.unidades_producidas, 0);
    const totalUnidadesVendidas = totalUnidadesProducidas - totalUnidadesDisponibles;

    // Estadísticas de ventas por vendedora
    const ventasPorVendedora = ventas.reduce((acc, venta) => {
      if (!acc[venta.vendedora_nombre]) {
        acc[venta.vendedora_nombre] = {
          cantidad: 0,
          total_efectivo: 0,
          total_credito: 0
        };
      }
      
      acc[venta.vendedora_nombre].cantidad += 1;
      
      if (venta.tipo_pago === 'efectivo') {
        acc[venta.vendedora_nombre].total_efectivo += venta.precio_venta;
      } else {
        acc[venta.vendedora_nombre].total_credito += venta.precio_venta;
      }
      
      return acc;
    }, {});

    // Estadísticas financieras
    const totalEfectivo = ventas
      .filter(v => v.tipo_pago === 'efectivo')
      .reduce((sum, v) => sum + v.precio_venta, 0);
    
    const totalPorCobrar = ventas
      .filter(v => v.tipo_pago === 'credito' && !v.pagado)
      .reduce((sum, v) => sum + v.precio_venta, 0);

    const totalVentas = ventas.reduce((sum, v) => sum + v.precio_venta, 0);

    return {
      lotes: inventario.lotes,
    total_lotes: inventario.lotes.length,
    unidades_disponibles: totalUnidadesDisponibles,
    unidades_producidas: totalUnidadesProducidas,
    unidades_vendidas: totalUnidadesVendidas,
      ventas: {
        total_ventas: ventas.length,
        ventas_por_vendedora: ventasPorVendedora
      },
      finanzas: {
        total_efectivo: totalEfectivo,
        total_por_cobrar: totalPorCobrar,
        total_ventas: totalVentas,
        ganancia_bruta: loteActual ? totalVentas - (loteActual.costo_total_produccion * (totalUnidadesVendidas / loteActual.unidades_producidas)) : 0
      }
    };
  }
}