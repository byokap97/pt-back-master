import { Module } from '@nestjs/common';
import { SalesBackController } from './sales-back.controller';
import { SalesBackService } from './sales-back.service';
import { SalesModule } from '@api/sales/sales.module';

@Module({
  imports: [SalesModule],
  controllers: [SalesBackController],
  providers: [SalesBackService]
})
export class SalesBackModule {}
