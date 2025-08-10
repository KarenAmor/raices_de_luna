import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VentasService } from '../ventas/ventas.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly ventasService: VentasService) {}

  // Ejecutar todos los días a las 9:00 AM
  @Cron('0 0 9 * * *')
  async verificarVentasVencidas() {
    this.logger.log('Verificando ventas vencidas...');
    
    try {
      const ventasVencidas = this.ventasService.obtenerVentasVencidas();
      
      if (ventasVencidas.length === 0) {
        this.logger.log('No hay ventas vencidas para hoy');
        return;
      }

      this.logger.log(`Se encontraron ${ventasVencidas.length} ventas vencidas`);
      
      // Mostrar recordatorios en la consola
      ventasVencidas.forEach(venta => {
        const mensaje = venta.cliente_nombre 
          ? `RECORDATORIO DE COBRO: La venta al cliente '${venta.cliente_nombre}' (Cel: ${venta.cliente_telefono}) ha vencido. Monto: $${venta.precio_venta.toLocaleString()}`
          : `RECORDATORIO DE COBRO: Venta sin datos de cliente ha vencido. Monto: $${venta.precio_venta.toLocaleString()}. Vendedora: ${venta.vendedora_nombre}`;
        
        this.logger.warn(mensaje);
      });

      // Aquí puedes agregar lógica adicional para enviar notificaciones
      // Por ejemplo: enviar emails, WhatsApp, etc.
      
    } catch (error) {
      this.logger.error('Error al verificar ventas vencidas:', error);
    }
  }

  // Método manual para probar los recordatorios
  async verificarVentasVencidasManual() {
    this.logger.log('Verificación manual de ventas vencidas iniciada...');
    await this.verificarVentasVencidas();
  }
}

