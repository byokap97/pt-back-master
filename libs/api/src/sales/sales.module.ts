import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesSchema } from './sales.schema';
import { DataBaseModule } from '@api/database.module';

@Module({
    imports: [DataBaseModule],
    providers: [SalesService],
    exports: [SalesService],
})
export class SalesModule {}
