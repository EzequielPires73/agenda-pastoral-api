import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsCategoriesService } from '../appointments-categories/appointments-categories.service';
import { FindAppointmentsDto } from './dto/find-appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) private repository: Repository<Appointment>,
    private appointmentsCategoriesService: AppointmentsCategoriesService
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const { categoryId, memberId, responsibleId, ...data } = createAppointmentDto;
      const date = new Date(`${data.date}T${data.start}`);

      const category = await this.appointmentsCategoriesService.findOne(categoryId);
      if(!category) throw new Error('Categoria não foi encontrada.');

      date.setMinutes(date.getMinutes() + category.duration);

      const appointment = this.repository.create({
        id: await this.generateId(),
        category: categoryId && { id: categoryId },
        member: memberId && { id: memberId },
        responsible: responsibleId && { id: responsibleId },
        end: date.toLocaleTimeString(),
        ...data
      });

      return {
        success: true,
        message: 'Compromisso marcado com sucesso',
        result: await this.repository.save(appointment)
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
    
    const exists = await this.repository.findOneBy({id});
    if(exists) {
      return await this.generateId()
    } else {
      return id;
    }
  }

  async findAll(queryDto: FindAppointmentsDto) {
    try {
      const {date, year, month, memberId} = queryDto;

      const query = this.repository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.member', 'member')

      {memberId ? query.andWhere('member.id = :memberId', {memberId}) : null}
      {date ? query.andWhere('appointment.date = :date', {date}) : null}

      if(month && year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        query.andWhere('appointment.date >= :start', {start: start});
        query.andWhere('appointment.date <= :end', {end: end});
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

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
