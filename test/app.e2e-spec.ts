import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;
    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        const connection = app.get(getConnectionToken('pt-epinium'));
        await connection.close();
        await app.close();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });

    it('/products-back/findAll (POST)', async () => {
        const req = await request(app.getHttpServer())
            .post('/products-back/findAll')
            .send({
                itemsPerPage: 10,
                page: 0,
                search: 'test',
                sortBy: ['name'],
                sortDesc: [false],
                totalProductCount: true,
            })
            .expect(201);

        expect(req.body).toHaveProperty('products');
        expect(req.body).toHaveProperty('total');

        expect(req.body.products).toHaveLength(10);
        expect(req.body.total).toBe(100);

        return req;
    });

    it('/sales-back/salesByChannel (POST)', async () => {
        // #TODO
    });
});
