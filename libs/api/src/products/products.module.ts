import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSchema } from './products.schema';
import { DataBaseModule } from '@api/database.module';

@Module({
    imports: [DataBaseModule],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
