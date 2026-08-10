import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService]  // AuthModule 임포트하기 위해서
})
export class MembersModule {}
