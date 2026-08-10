import { Module } from '@nestjs/common';
import { MealkitsService } from './mealkits.service';
import { MealkitsController } from './mealkits.controller';

@Module({
  controllers: [MealkitsController],
  providers: [MealkitsService],
  exports: [MealkitsService]
})
export class MealkitsModule {}
