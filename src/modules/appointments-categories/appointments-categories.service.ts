import { Injectable } from '@nestjs/common';
import { CreateAppointmentsCategoryDto } from './dto/create-appointments-category.dto';
import { UpdateAppointmentsCategoryDto } from './dto/update-appointments-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentsCategory } from './entities/appointments-category.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Appointment } from '../appointments/entities/appointment.entity';
import { AvailableTime } from '../available-times/entities/available-time.entity';

@Injectable()
export class AppointmentsCategoriesService {
  constructor(
    @InjectRepository(AppointmentsCategory) private repository: Repository<AppointmentsCategory>,
    @InjectRepository(Appointment) private repositoryAppointment: Repository<Appointment>,
    @InjectRepository(AvailableTime) private repositoryAvailableTime: Repository<AvailableTime>,
  ) { }

  async create(createAppointmentsCategoryDto: CreateAppointmentsCategoryDto) {
    try {
      const slug = slugify(createAppointmentsCategoryDto.name, { lower: true });
      const appointmentsCategory = this.repository.create({ ...createAppointmentsCategoryDto, slug });

      return {
        success: true,
        message: 'Categoria de Compromisso cadastrada com sucesso.',
        result: await this.repository.save(appointmentsCategory)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateAppointmentsCategoryDto: UpdateAppointmentsCategoryDto) {
    try {
      const category = await this.repository.findOne({ where: { id } });
      if (!category) throw new Error('Categoria não foi encontrada');

      await this.repository.update(id, updateAppointmentsCategoryDto);

      return {
        success: true,
        message: 'Categoria atualizada com sucesso.',
        result: await this.repository.findOne({ where: { id } })
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: number) {
    try {
      const category = await this.repository.findOne({ where: { id } });
      if (!category) throw new Error('Categoria não foi encontrada');

      await this.repository.delete(id);

      return {
        success: true,
        message: 'Categoria removida com sucesso.',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async availableTimes(id, date) {
    try {
      const category = await this.repository.findOne({ where: { id } });
      if (!category) throw new Error('Categoria não existe.');

      const appointments = await this.repositoryAppointment.find({ where: { date }, relations: ['category'] });

      const availableTimes = await this.repositoryAvailableTime.find({ where: { date }, order: {start: 'ASC'} });
      const results = availableTimes.map(timeSlot => this.generateTimeSlots(timeSlot.start, timeSlot.end, category.duration, appointments));

      const times = [];
      results.forEach(item => times.push(...item));

      return {
        success: true,
        results: times
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  generateTimeSlots(start, end, interval, existingAppointments) {
    const timeSlots = [];
    let currentTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    let endTimeWithDuration = new Date(`2000-01-01T${start}`);
    endTimeWithDuration.setMinutes(endTimeWithDuration.getMinutes() + interval);

    while (currentTime < endTime && endTimeWithDuration <= endTime) {
      const startFormatted = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endFormatted = endTimeWithDuration.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const isInConflict = existingAppointments.find(appointment =>
        (currentTime >= new Date(`2000-01-01T${appointment.start}`) &&
          currentTime < new Date(`2000-01-01T${appointment.end}`)) ||
        (currentTime < new Date(`2000-01-01T${appointment.end}`) &&
          endTimeWithDuration >= new Date(`2000-01-01T${appointment.end}`))
      );

      if (!isInConflict) {
        timeSlots.push({ start: startFormatted, end: endFormatted });
        currentTime.setMinutes(currentTime.getMinutes() + interval);
        endTimeWithDuration.setMinutes(endTimeWithDuration.getMinutes() + interval);
      } else {
        if (interval > isInConflict.category.duration) {
          currentTime.setMinutes(currentTime.getMinutes() + isInConflict.category.duration);
          endTimeWithDuration.setMinutes(endTimeWithDuration.getMinutes() + (interval - isInConflict.category.duration));
        } else {
          currentTime.setMinutes(currentTime.getMinutes() + interval);
          endTimeWithDuration.setMinutes(endTimeWithDuration.getMinutes() + interval);
        }
      }

    }

    return timeSlots;
  }
}
