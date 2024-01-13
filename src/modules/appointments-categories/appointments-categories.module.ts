import { Module } from '@nestjs/common';
import { AppointmentsCategoriesService } from './appointments-categories.service';
import { AppointmentsCategoriesController } from './appointments-categories.controller';

@Module({
  controllers: [AppointmentsCategoriesController],
  providers: [AppointmentsCategoriesService],
})
export class AppointmentsCategoriesModule {}
