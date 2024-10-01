import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesModule } from './sales/sales.module';
import { ProductsModule } from './products/products.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            connectionName: 'pt-epinium',
            useFactory: async () => {
                return {
                    uri: 'mongodb://127.0.0.1:27017/pt-epinium',
                    appname: 'PT-Epinium',
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                    connectTimeoutMS: 0,
                    socketTimeoutMS: 1000 * 60 * 5,
                    maxPoolSize: 100,
                    ignoreUndefined: true,
                };
            },
            inject: [ConfigService],
        }),
        ProductsModule,
        SalesModule,
    ],
    exports: [ProductsModule, SalesModule],
})
export class ApiModule {}
