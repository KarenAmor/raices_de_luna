import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InventarioModule } from './inventario/inventario.module';
import { VentasModule } from './ventas/ventas.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [AuthModule, InventarioModule, VentasModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
