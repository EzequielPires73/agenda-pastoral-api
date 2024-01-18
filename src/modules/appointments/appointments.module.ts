import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsCategoriesModule } from '../appointments-categories/appointments-categories.module';
import { FirebaseService } from 'src/services/firebase.service';
import { User } from '../users/entities/user.entity';
import { Member } from '../members/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Member]), AppointmentsCategoriesModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, FirebaseService],
})
export class AppointmentsModule {}
