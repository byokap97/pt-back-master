import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const options = new DocumentBuilder()
        .setTitle('PT Back')
        .setDescription('Backen PT-Epinium')
        .setVersion('1.0')
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.info('Nest Start at port 3000');
    console.info('Swagger Start at http://localhost:3000/api');
}
bootstrap();
