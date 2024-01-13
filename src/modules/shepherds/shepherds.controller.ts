import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShepherdsService } from './shepherds.service';
import { CreateShepherdDto } from './dto/create-shepherd.dto';
import { UpdateShepherdDto } from './dto/update-shepherd.dto';

@Controller('shepherds')
export class ShepherdsController {
  constructor(private readonly shepherdsService: ShepherdsService) {}

  @Post()
  create(@Body() createShepherdDto: CreateShepherdDto) {
    return this.shepherdsService.create(createShepherdDto);
  }

  @Get()
  findAll() {
    return this.shepherdsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shepherdsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShepherdDto: UpdateShepherdDto) {
    return this.shepherdsService.update(+id, updateShepherdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shepherdsService.remove(+id);
  }
}
