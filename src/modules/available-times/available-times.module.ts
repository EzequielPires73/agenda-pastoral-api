import { Module } from '@nestjs/common';
import { AvailableTimesService } from './available-times.service';
import { AvailableTimesController } from './available-times.controller';

@Module({
  controllers: [AvailableTimesController],
  providers: [AvailableTimesService],
})
export class AvailableTimesModule {}
