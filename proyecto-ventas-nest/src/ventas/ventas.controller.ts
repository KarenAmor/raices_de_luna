import { Controller, Post, Get, Put, Body, Headers, HttpException, HttpStatus, Param } from '@nestjs/common';
import { VentasService } from './ventas.service';
import type { RegistrarVentaDto } from './ventas.service';
import { AuthService } from '../auth/auth.service';

@Controller('ventas')
export class VentasController {
  constructor(
    private readonly ventasService: VentasService,
    private readonly authService: AuthService
  ) {}

  private verificarAutenticacion(authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new HttpException('Token de autorización requerido', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.substring(7); // Remover "Bearer "
    const usuario = this.authService.verificarToken(token);
    
    if (!usuario) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }

    return usuario;
  }

  @Post()
  registrarVenta(
    @Body() ventaData: RegistrarVentaDto,
    @Headers('authorization') authorization: string
  ) {
    const usuario = this.verificarAutenticacion(authorization);

    if (!ventaData.tipo_pago || !['efectivo', 'credito'].includes(ventaData.tipo_pago)) {
      throw new HttpException('Tipo de pago inválido', HttpStatus.BAD_REQUEST);
    }

    if (ventaData.tipo_pago === 'credito' && ventaData.dias_credito && ![8, 15].includes(ventaData.dias_credito)) {
      throw new HttpException('Los días de crédito deben ser 8 o 15', HttpStatus.BAD_REQUEST);
    }

    const venta = this.ventasService.registrarVenta(ventaData, {
      id: usuario.id,
      nombre: usuario.nombre
    });

    if (!venta) {
      throw new HttpException('No hay inventario disponible', HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      message: 'Venta registrada exitosamente',
      data: venta
    };
  }

  @Get()
  obtenerVentas(@Headers('authorization') authorization: string) {
    this.verificarAutenticacion(authorization);
    
    const ventas = this.ventasService.obtenerVentas();
    return {
      success: true,
      data: ventas
    };
  }

  @Get('vencidas')
  obtenerVentasVencidas(@Headers('authorization') authorization: string) {
    this.verificarAutenticacion(authorization);
    
    const ventasVencidas = this.ventasService.obtenerVentasVencidas();
    return {
      success: true,
      data: ventasVencidas
    };
  }

  @Put(':id/pagar')
  marcarComoPagada(
    @Param('id') id: string,
    @Headers('authorization') authorization: string
  ) {
    this.verificarAutenticacion(authorization);
    
    const ventaId = parseInt(id);
    if (isNaN(ventaId)) {
      throw new HttpException('ID de venta inválido', HttpStatus.BAD_REQUEST);
    }

    const resultado = this.ventasService.marcarComoPagada(ventaId);
    
    if (!resultado) {
      throw new HttpException('Venta no encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      message: 'Venta marcada como pagada'
    };
  }
}

