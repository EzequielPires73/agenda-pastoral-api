import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsCategoriesModule } from '../appointments-categories/appointments-categories.module';
import { FirebaseService } from 'src/services/firebase.service';
import { User } from '../users/entities/user.entity';
import { Member } from '../members/entities/member.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Member]), AppointmentsCategoriesModule, NotificationsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
