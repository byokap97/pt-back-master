import { Module } from '@nestjs/common';
import { ProductsBackService } from './products-back.service';
import { ProductsBackController } from './products-back.controller';
import { ProductsModule } from '@api/products/products.module';

@Module({
    imports: [ProductsModule],
    controllers: [ProductsBackController],
    providers: [ProductsBackService],
})
export class ProductsBackModule {}
