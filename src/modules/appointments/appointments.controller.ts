import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ChangeAppointmentDto } from './dto/change-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Query() query: FindAppointmentsDto) {
    return this.appointmentsService.findAll(query);
  }
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  findAllMy(@Query() query: FindAppointmentsDto, @Req() {user}: {user: any}) {
    return this.appointmentsService.findAll({...query, memberId: user.id});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Post('change-status/:id')
  changeStatus(@Param('id') id: string, @Body() changeAppointmentDto: ChangeAppointmentDto) {
    return this.appointmentsService.changeStatus(+id, changeAppointmentDto.status);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
