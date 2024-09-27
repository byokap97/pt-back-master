import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSchema } from './products/products.schema';
import { SalesSchema } from './sales/sales.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: 'sales', schema: SalesSchema },
                { name: 'products', schema: ProductsSchema },
            ],
            'pt-epinium',
        ),
    ],
    exports: [MongooseModule]
})
export class DataBaseModule {}
