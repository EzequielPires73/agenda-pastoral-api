import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AvailableTimesService } from './available-times.service';
import { CreateAvailableTimeDto } from './dto/create-available-time.dto';
import { UpdateAvailableTimeDto } from './dto/update-available-time.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAvaibleTimesDto } from './dto/find-avaible-times.dto copy';

@ApiTags('Available Times')
@Controller('available-times')
export class AvailableTimesController {
  constructor(private readonly availableTimesService: AvailableTimesService) {}

  @Post()
  create(@Body() createAvailableTimeDto: CreateAvailableTimeDto) {
    return this.availableTimesService.create(createAvailableTimeDto);
  }

  @Get()
  findAll(@Query() query: FindAvaibleTimesDto) {
    return this.availableTimesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availableTimesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvailableTimeDto: UpdateAvailableTimeDto) {
    return this.availableTimesService.update(+id, updateAvailableTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availableTimesService.remove(+id);
  }
}
