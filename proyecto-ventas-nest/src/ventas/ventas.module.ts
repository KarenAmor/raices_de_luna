import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { InventarioModule } from '../inventario/inventario.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [InventarioModule, AuthModule],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService]
})
export class VentasModule {}

