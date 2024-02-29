import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { AppointmentsCategoriesService } from '../appointments-categories/appointments-categories.service';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { isValidDateFormat } from 'src/helpers/date';
import { Member } from '../members/entities/member.entity';
import { TypeUserEnum, User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { DestinationNotification } from '../notifications/entities/notification.entity';
import { ChangeAppointmentDto } from './dto/change-appointment.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private repository: Repository<Appointment>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private appointmentsCategoriesService: AppointmentsCategoriesService,
    private readonly notificationService: NotificationsService,
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {

      const { categoryId, memberId, responsibleId, ...data } = createAppointmentDto;
      const date = new Date(`${data.date}T${data.start}`);
      const dateStartFull = new Date(`${data.date}T${data.start}`);

      const category = await this.appointmentsCategoriesService.findOne(categoryId);
      if (!category) throw new Error('Categoria não foi encontrada.');

      const responsible = responsibleId ? await this.userRepository.findOne({ where: { id: responsibleId } }) : await this.userRepository.findOne({ where: { type: TypeUserEnum.SUPER_ADMIN } });
      if (!responsible) throw new Error('Responsável não foi encontrado.');

      const member = memberId ? await this.memberRepository.findOne({ where: { id: memberId } }) : null;
      if (!member) throw new Error('Membro não foi encontrado.');

      date.setMinutes(date.getMinutes() + category.duration);

      const appointment = this.repository.create({
        id: await this.generateId(),
        category: categoryId && { id: categoryId },
        member: member,
        responsible: responsible,
        end: date.toLocaleTimeString(),
        dateStartFull,
        ...data
      });

      const result = await this.repository.save(appointment);

      if (result && responsible.notificationToken) {
        await this.notificationService.create({
          token: responsible.notificationToken,
          title: result.category.name,
          body: `Um compromisso foi marcado, confira as informações.`,
          route: '/notification',
          userId: responsible.id,
          memberId: member.id,
          destination: DestinationNotification.USER,
          appointmentId: result.id,
        });
      }

      return {
        success: true,
        message: 'Compromisso marcado com sucesso',
        result,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async generateId() {
    const id = Math.floor(100000 + Math.random() * 900000);

    const exists = await this.repository.findOneBy({ id });
    if (exists) {
      return await this.generateId()
    } else {
      return id;
    }
  }

  async findAll(queryDto: FindAppointmentsDto, user?: any) {
    try {
      const { date, year, month, memberId, status } = queryDto;
      const statusArray = status ? status.split(',') : null;

      const query = this.repository.createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.member', 'member')
        .leftJoinAndSelect('appointment.responsible', 'responsible')
        .leftJoinAndSelect('appointment.category', 'category')
        .orderBy('appointment.status', 'ASC');

      if (user && user.type != 'super_admin' && user.type != 'shepherd_president' && user.type != 'member') {
        query.andWhere('responsible.id = :responsibleId', { responsibleId: user.id })
      }

      { memberId ? query.andWhere('member.id = :memberId', { memberId }) : null }
      { status && status != "null" ? query.andWhere('appointment.status IN (:...status)', { status: statusArray }) : null }

      if (date) {
        if (!isValidDateFormat(date?.toString())) throw new Error('Formato da data deve ser yyyy-MM-dd');
        query.andWhere('appointment.date = :date', { date })
      }

      if (month && year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        query.andWhere('appointment.date >= :start', { start: start });
        query.andWhere('appointment.date <= :end', { end: end });
      }

      const [results, total] = await query.getManyAndCount();

      return {
        success: true,
        results,
        total
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async changeStatus(id: number, { status, responsibleId }: ChangeAppointmentDto) {
    try {
      const appointment = await this.repository.findOne({ where: { id }, relations: ['member', 'category', 'responsible'] });
      if (!appointment) throw new Error('Compromisso não foi encontrado.');
      const member = appointment.member;
      const category = appointment.category;

      if (!AppointmentStatus[status]) throw new Error('Status inválido');

      await this.repository.update(id, { status: status, responsible: responsibleId ? { id: responsibleId } : appointment.responsible });

      switch (status) {
        case AppointmentStatus.confirmado:
          await this.notificationService.create({
            token: member.notificationToken,
            title: category.name,
            body: `O compromisso foi confirmado.`,
            route: '/notification',
            memberId: member.id,
            destination: DestinationNotification.MEMBER,
            appointmentId: id,
          });
          break;
        case AppointmentStatus.declinado:
          await this.notificationService.create({
            token: member.notificationToken,
            title: category.name,
            body: `O compromisso foi declinado por motivos maiores.`,
            route: '/notification',
            memberId: member.id,
            destination: DestinationNotification.MEMBER,
            appointmentId: id,
          });
          break;
        case AppointmentStatus.finalizado:
          await this.notificationService.create({
            token: member.notificationToken,
            title: category.name,
            body: `O compromisso foi finalizado.`,
            route: '/notification',
            memberId: member.id,
            destination: DestinationNotification.MEMBER,
            appointmentId: id,
          });
          break;
      }

      return {
        success: true,
        result: await this.repository.findOne({ where: { id }, relations: ['member', 'category'] })
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: number) {
    try {
      const appointment = await this.repository.findOne({ where: { id }, relations: ['member', 'category', 'responsible'] });
      if (!appointment) throw new Error('Compromisso não foi encontrado.');

      return {
        success: true,
        result: appointment
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    try {
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() - 5);
      
      const expiredAppointments = await this.repository
      .createQueryBuilder('appointment')
      .where('appointment.dateStartFull < :currentDate', { currentDate })
      .andWhere('appointment.status IN (:...status)', { status: ['pendente', 'confirmado'] })
      .getMany();

      for (let i = 0; i < expiredAppointments.length; i++) {
        await this.changeStatus(expiredAppointments[i].id, { status: AppointmentStatus.finalizado });
      }

      return null;
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCronLembrete() {
    try {
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() - 3);
      const futureDate = new Date(currentDate.getTime() + 20 * 60000);
      
      const expiredAppointments = await this.repository
      .createQueryBuilder('appointment')
      .where('appointment.dateStartFull BETWEEN :currentDate AND :futureDate', { currentDate, futureDate })
      .andWhere('appointment.status IN (:...status)', { status: ['confirmado'] })
      .getMany();

      for (let i = 0; i < expiredAppointments.length; i++) {
        await this.notificationService.create({
          token: expiredAppointments[i].member.notificationToken,
          title: expiredAppointments[i].category.name,
          body: `Você tem um compromisso confirmado para hoje às ${expiredAppointments[i].start}, veja mais informações.`,
          route: '/notification',
          memberId: expiredAppointments[i].member.id,
          destination: DestinationNotification.MEMBER,
          appointmentId: expiredAppointments[i].id,
        });
      }

      return null;
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCronNotification() {
    try {
      const currentDate = new Date();
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0);
      const endOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      );

      const expiredAppointments = await this.repository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.member', 'member')
        .leftJoinAndSelect('appointment.responsible', 'responsible')
        .leftJoinAndSelect('appointment.category', 'category')
        .where('appointment.date BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
        .andWhere('appointment.status IN (:...status)', { status: ['confirmado'] })
        .getMany();

      for (let i = 0; i < expiredAppointments.length; i++) {
        await this.notificationService.create({
          token: expiredAppointments[i].member.notificationToken,
          title: expiredAppointments[i].category.name,
          body: `Você tem um compromisso confirmado para hoje, veja mais informações.`,
          route: '/notification',
          memberId: expiredAppointments[i].member.id,
          destination: DestinationNotification.MEMBER,
          appointmentId: expiredAppointments[i].id,
        });
      }

      return null;
    } catch (error) {
      console.log(error);
    }
  }

  async generateMonthlyReportLast6Months() {
    try {
      const currentDate = new Date();
      const sixMonthsAgoDate = new Date();
      sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);
      const monthlyCounts = [];

      for (let i = 0; i <= 6; i++) {
        const startDate = new Date(sixMonthsAgoDate.getFullYear(), sixMonthsAgoDate.getMonth(), 1);
        const endDate = new Date(sixMonthsAgoDate.getFullYear(), sixMonthsAgoDate.getMonth() + 1, 0);

        const count = await this.repository.count({
          where: {
            created_at: Between(startDate, endDate),
          },
        });

        monthlyCounts.push({
          name: startDate.toLocaleString('default', { month: 'long' }),
          count: count,
        });

        sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() + 1);
      }

      return {
        success: true,
        results: monthlyCounts,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async generateReportByStatus() {
    try {
      const report = await this.repository
        .createQueryBuilder('appointment')
        .select(['appointment.status as name', 'COUNT(*) as count'])
        .groupBy('appointment.status')
        .getRawMany();

        return {
          success: true,
          results: report.map(i => {
            return {
              name: i.name,
              count: +i.count,
            }
          }),
        }
    } catch(error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async generateReportByCategory() {
    try {
      const report = await this.repository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.category', 'category')
        .select(['category.name as name', 'COUNT(*) as count'])
        .groupBy('category.name')
        .getRawMany();

        return {
          success: true,
          results: report.map(i => {
            return {
              name: i.name,
              count: +i.count,
            }
          }),
        }
    } catch(error) {
      console.log(error.name);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
