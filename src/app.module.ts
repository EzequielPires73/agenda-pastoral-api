import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { MembersModule } from './modules/members/members.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AppointmentsCategoriesModule } from './modules/appointments-categories/appointments-categories.module';
import { AvailableTimesModule } from './modules/available-times/available-times.module';
import { AuthModule } from './modules/auth/auth.module';
import * as admin from 'firebase-admin';
import { firebase_config } from './config/firebase';
import { FirebaseService } from './services/firebase.service';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
    MembersModule,
    AppointmentsModule,
    AppointmentsCategoriesModule,
    AvailableTimesModule,
    AuthModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
  exports: [FirebaseService]
})
export class AppModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: firebase_config.client_email,
        privateKey: firebase_config.private_key,
        projectId: firebase_config.project_id,
      }),
    })
  }
}
