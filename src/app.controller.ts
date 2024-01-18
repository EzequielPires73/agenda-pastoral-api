import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './services/firebase.service';

@Controller()
export class AppController {
  constructor(
    private readonly firebaseService: FirebaseService
  ) { }

  @Get()
  getHello() {
    return new Date(2024, 1, 0);
  }

  @Post('send-notification')
  sendNotification(@Body() body: { token: string, title: string, body: string, route?: string }) {
    return this.firebaseService.sendMessaging(body);
  }
}
