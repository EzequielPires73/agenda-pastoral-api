import { Module } from '@nestjs/common';
import { AppointmentsCategoriesService } from './appointments-categories.service';
import { AppointmentsCategoriesController } from './appointments-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsCategory } from './entities/appointments-category.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AvailableTime } from '../available-times/entities/available-time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentsCategory, Appointment, AvailableTime])],
  controllers: [AppointmentsCategoriesController],
  providers: [AppointmentsCategoriesService],
  exports: [AppointmentsCategoriesService]
})
export class AppointmentsCategoriesModule {}
