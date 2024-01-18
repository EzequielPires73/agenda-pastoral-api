import { Module } from '@nestjs/common';
import { AvailableTimesService } from './available-times.service';
import { AvailableTimesController } from './available-times.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailableTime } from './entities/available-time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvailableTime])],
  controllers: [AvailableTimesController],
  providers: [AvailableTimesService],
})
export class AvailableTimesModule {}
