import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get('report')
  report() {
    return this.membersService.generateMonthlyReportLast6Months();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('push-notification-token')
  pushNotificationToken(@Body() {token}: { token: string; }, @Req() {user}: {user: any}) {
    return this.membersService.pushNotificationToken(token, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
