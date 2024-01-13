import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentsCategoryDto } from './create-appointments-category.dto';

export class UpdateAppointmentsCategoryDto extends PartialType(CreateAppointmentsCategoryDto) {}
