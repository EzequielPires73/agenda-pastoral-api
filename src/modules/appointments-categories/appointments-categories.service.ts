import { Injectable } from '@nestjs/common';
import { CreateAppointmentsCategoryDto } from './dto/create-appointments-category.dto';
import { UpdateAppointmentsCategoryDto } from './dto/update-appointments-category.dto';

@Injectable()
export class AppointmentsCategoriesService {
  create(createAppointmentsCategoryDto: CreateAppointmentsCategoryDto) {
    return 'This action adds a new appointmentsCategory';
  }

  findAll() {
    return `This action returns all appointmentsCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointmentsCategory`;
  }

  update(id: number, updateAppointmentsCategoryDto: UpdateAppointmentsCategoryDto) {
    return `This action updates a #${id} appointmentsCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointmentsCategory`;
  }
}
