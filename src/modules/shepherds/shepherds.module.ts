import { Module } from '@nestjs/common';
import { ShepherdsService } from './shepherds.service';
import { ShepherdsController } from './shepherds.controller';

@Module({
  controllers: [ShepherdsController],
  providers: [ShepherdsService],
})
export class ShepherdsModule {}
