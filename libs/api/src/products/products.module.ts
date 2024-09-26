import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSchema } from './products.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: 'products', schema: ProductsSchema }],
            'pt-epinium',
        ),
    ],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
