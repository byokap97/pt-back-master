import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsBackModule } from './backend/products-back/products-back.module';
import { ApiModule } from '@api/api.module';
import { ConfigModule } from '@nestjs/config';
import { SalesBackModule } from './backend/sales-back/sales-back.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ProductsBackModule,
        ApiModule,
        SalesBackModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
