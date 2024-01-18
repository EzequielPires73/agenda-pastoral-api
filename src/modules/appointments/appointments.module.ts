import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsCategoriesModule } from '../appointments-categories/appointments-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), AppointmentsCategoriesModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
