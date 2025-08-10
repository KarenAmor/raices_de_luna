import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { InventarioService, Lote } from './inventario.service';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get('stats')
  obtenerEstadisticas() {
    try {
      const estadisticas = this.inventarioService.obtenerEstadisticas();
      return {
        success: true,
        data: estadisticas
      };
    } catch (error) {
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('lote-actual')
  obtenerLoteActual() {
    try {
      const lote = this.inventarioService.obtenerLoteActual();
      return {
        success: true,
        data: lote
      };
    } catch (error) {
      throw new HttpException('Error al obtener lote actual', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("lote")
  agregarNuevoLote(
    @Body() loteData: {
      ingredientes: Array<{ nombre: string; costo_unitario: number; cantidad_comprada: number }>;
      costo_total_produccion: number;
      unidades_producidas: number;
      precio_unitario_venta: number;
    },
  ) {
    try {
      if (
        !loteData.ingredientes ||
        !loteData.costo_total_produccion ||
        !loteData.unidades_producidas ||
        !loteData.precio_unitario_venta
      ) {
        throw new HttpException(
          "Todos los campos son requeridos",
          HttpStatus.BAD_REQUEST,
        );
      }

      const nuevoLote = this.inventarioService.agregarNuevoLote(loteData);

      return {
        success: true,
        message: "Nuevo lote agregado exitosamente",
        data: nuevoLote,
      };
    } catch (error) {
      throw new HttpException(
        "Error al agregar nuevo lote",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}