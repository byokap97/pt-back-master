import { Module } from '@nestjs/common';
import { SalesBackController } from './sales-back.controller';
import { SalesBackService } from './sales-back.service';

@Module({
  controllers: [SalesBackController],
  providers: [SalesBackService]
})
export class SalesBackModule {}
