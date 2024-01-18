import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppointmentsCategoriesService } from './appointments-categories.service';
import { CreateAppointmentsCategoryDto } from './dto/create-appointments-category.dto';
import { UpdateAppointmentsCategoryDto } from './dto/update-appointments-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindTimesDto } from './dto/find-times.dto';

@ApiTags('Appointments Categories')
@Controller('appointments-categories')
export class AppointmentsCategoriesController {
  constructor(private readonly appointmentsCategoriesService: AppointmentsCategoriesService) {}

  @Post()
  create(@Body() createAppointmentsCategoryDto: CreateAppointmentsCategoryDto) {
    return this.appointmentsCategoriesService.create(createAppointmentsCategoryDto);
  }

  @Get()
  findAll() {
    return this.appointmentsCategoriesService.findAll();
  }
  
  @Get('avaible-times/:id')
  availableTimes(@Param('id') id: string, @Query() query: FindTimesDto) {
    return this.appointmentsCategoriesService.availableTimes(id, query.date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentsCategoryDto: UpdateAppointmentsCategoryDto) {
    return this.appointmentsCategoriesService.update(+id, updateAppointmentsCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsCategoriesService.remove(+id);
  }
}
