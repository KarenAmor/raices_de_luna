import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { VentasModule } from '../ventas/ventas.module';

@Module({
  imports: [NestScheduleModule.forRoot(), VentasModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}

