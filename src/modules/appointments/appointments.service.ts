import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { AppointmentsCategoriesService } from '../appointments-categories/appointments-categories.service';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { isValidDateFormat } from 'src/helpers/date';
import { FirebaseService } from 'src/services/firebase.service';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private repository: Repository<Appointment>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private appointmentsCategoriesService: AppointmentsCategoriesService,
    private readonly firebaseService: FirebaseService
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const { categoryId, memberId, responsibleId, ...data } = createAppointmentDto;
      const date = new Date(`${data.date}T${data.start}`);

      const category = await this.appointmentsCategoriesService.findOne(categoryId);
      if (!category) throw new Error('Categoria não foi encontrada.');

      const member = await this.memberRepository.findOneBy({ id: memberId });
      if (!member) throw new Error('Membro não foi encontrado.');

      date.setMinutes(date.getMinutes() + category.duration);

      const appointment = this.repository.create({
        id: await this.generateId(),
        category: categoryId && { id: categoryId },
        member: memberId && { id: memberId },
        responsible: responsibleId && { id: responsibleId },
        end: date.toLocaleTimeString(),
        ...data
      });

      const result = await this.repository.save(appointment);

      if (result && member.notificationToken) {
        await this.firebaseService.sendMessaging({
          token: member.notificationToken,
          title: category.name,
          body: `Um compromisso foi marcado, confira as informações.`,
          route: '/notification'
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

  async findAll(queryDto: FindAppointmentsDto) {
    try {
      const { date, year, month, memberId, status } = queryDto;
      const statusArray = status ? status.split(',') : null;

      const query = this.repository.createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.member', 'member')
        .leftJoinAndSelect('appointment.category', 'category');

      /* query.addSelect(['member.id', 'member.name', 'member.email']); */

      { memberId ? query.andWhere('member.id = :memberId', { memberId }) : null }
      { status ? query.andWhere('appointment.status IN (:...status)', { status: statusArray }) : null }

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

  async changeStatus(id: number, status: AppointmentStatus) {
    try {
      const appointment = await this.repository.findOne({ where: { id }, relations: ['member', 'category'] });
      if (!appointment) throw new Error('Compromisso não foi encontrado.');
      const member = appointment.member;
      const category = appointment.category;

      if (!AppointmentStatus[status]) throw new Error('Status inválido');

      await this.repository.update(id, { status: status });

      switch (status) {
        case AppointmentStatus.confirmado:
          await this.firebaseService.sendMessaging({
            token: member.notificationToken,
            title: category.name,
            body: `O compromisso foi confirmado.`,
            route: '/notification'
          });
          break;
        case AppointmentStatus.declinado:
          await this.firebaseService.sendMessaging({
            token: member.notificationToken,
            title: category.name,
            body: `O compromisso foi declinado por motivos maiores.`,
            route: '/notification'
          });
          break;
        case AppointmentStatus.finalizado:
          await this.firebaseService.sendMessaging({
            token: member.notificationToken,
            title: category.name,
            body: `O compromisso foi finalizado.`,
            route: '/notification'
          });
          break;
      }

      return {
        success: true,
        result: await this.repository.findOneBy({ id })
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
      const appointment = await this.repository.findOne({where: {id}, relations: ['member', 'category']});
      if(!appointment) throw new Error('Compromisso não foi encontrado.');

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
}
