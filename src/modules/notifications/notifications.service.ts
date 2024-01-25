import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/services/firebase.service';
import { FindNotificationsDto } from './dto/find-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private repository: Repository<Notification>,
    private readonly firebaseService: FirebaseService
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const { memberId, userId, appointmentId, token, ...data } = createNotificationDto;
    try {
      const notification = this.repository.create({
        ...data,
        member: memberId ? { id: memberId } : null,
        user: userId ? { id: userId } : null,
        appointment: appointmentId ? { id: appointmentId } : null,
      });

      return {
        success: true,
        result: await this.repository.save(notification)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.firebaseService.sendMessaging({
        token: token,
        ...data
      });
    }
  }

  async findAll(queryDto: FindNotificationsDto, user?: any) {
    try {
      const query = this.repository.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .leftJoinAndSelect('notification.member', 'member')
      .leftJoinAndSelect('notification.appointment', 'appointment')
      .leftJoinAndSelect('appointment.category', 'category')
      .leftJoinAndSelect('appointment.member', 'appointment.member')
      .limit(20)

      {queryDto.destination ? query.andWhere('notification.destination = :destination', {destination: queryDto.destination}) : null}
      {user?.id ? query.andWhere('user.id = :id or member.id = :id', {id: user.id}) : null}

      const [results, total] = await query.getManyAndCount();

      return {
        success: true,
        results,
        total
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
