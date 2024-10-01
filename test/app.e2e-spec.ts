import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { SalesChannel } from '@api/sales/sales.entity';

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

    describe('products-back', () => {
        const apiUrl = '/products-back';

        it('createFakeData (POST)', async () => {
            const req = await request(app.getHttpServer())
                .post(`${apiUrl}/createFakeData`)
                .expect(201);

            expect(req.body).toHaveProperty('total');
            expect(req.body.total).toBe(100);

            return req;
        });

        it('/products-back/findAll (POST)', async () => {
            const req = await request(app.getHttpServer())
                .post(`${apiUrl}/findAll`)
                .send({
                    itemsPerPage: 10,
                    page: 0,
                    search: 'test',
                    sortBy: ['name'],
                    sortDesc: [false],
                    totalProductCount: true,
                })
                .expect(200);

            expect(req.body).toHaveProperty('results');
            expect(req.body).toHaveProperty('total');

            expect(req.body.results).toHaveLength(10);
            expect(req.body.total).toBe(100);

            return req;
        });

        it('/products-back/productsWith30daysSales (POST)', async () => {
            const req = await request(app.getHttpServer())
                .post(`${apiUrl}/productsWith30daysSales`)
                .send({
                    page: 1,
                    itemsPerPage: 10,
                    search: '',
                    sortBy: ['EAN'],
                    sortDesc: [false],
                    totalProductCount: true,
                })
                .expect(200);

            expect(req.body).toHaveProperty('results');
            expect(req.body).toHaveProperty('total');

            expect(req.body.results[0]).toEqual(
                expect.objectContaining({
                    EAN: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    sales30: expect.any(Number),
                    units30: expect.any(Number),
                }),
            );

            expect(req.body.results).toHaveLength(10);
            expect(req.body.total).toBe(100);

            return req;
        });
    });

    describe('sales-back', () => {
        const apiUrl = '/sales-back';

        it('createFakeData (POST)', async () => {
            const req = await request(app.getHttpServer())
                .post(`${apiUrl}/createFakeData`)
                .expect(201);

            expect(req.body).toHaveProperty('total');
            expect(req.body.total).toBe(18000);
            return req;
        });

        it('create (POST)', async () => {
            const req = await request(app.getHttpServer())
                .post(`${apiUrl}/create`)
                .send({
                    date: '2024-09-05T19:45:00.000Z',
                    amount: 1500,
                    units: 5,
                    channel: 'FBA',
                    product: '66fab5b8ada9f861a64fe4c9',
                })
                .expect(201);

            expect(req.body).toHaveProperty('id');
            expect(req.body).toHaveProperty('createdAt');
            expect(req.body).toHaveProperty('updatedAt');
            return req;
        });

        it('findAll (POST)', async () => {
            const req = await request(app.getHttpServer())
                .post(`${apiUrl}/findAll`)
                .send({
                    itemsPerPage: 10,
                    page: 1,
                    sortBy: ['channel'],
                    sortDesc: [true],
                    search: '',
                    totalSalesCount: true,
                })
                .expect(200);

            expect(req.body).toHaveProperty('results');
            expect(req.body).toHaveProperty('total');
            expect(req.body.results).toHaveLength(10);
            return req;
        });

        describe('salesByChannel (POST)', () => {
            it('If the date range is longer than 3 months, it will return grouped by weeks.', async () => {
                const req = await request(app.getHttpServer())
                    .post(`${apiUrl}/salesByChannel`)
                    .send({
                        startDate: '2024-01-01',
                        endDate: '2024-08-02',
                        sortBy: ['channel'],
                        sortDesc: [true],
                    })
                    .expect(200);

                expect(req.body).toBeInstanceOf(Array);
                expect(req.body[0].groupedBy).toBe('week');
                expect(new Date(req.body[0].date)).toBeInstanceOf(Date);
                return req;
            });

            it('If the date range is no longer than 3 months, it will return grouped by days.', async () => {
                const req = await request(app.getHttpServer())
                    .post(`${apiUrl}/salesByChannel`)
                    .send({
                        startDate: '2024-07-01',
                        endDate: '2024-08-02',
                    })
                    .expect(200);

                expect(req.body).toBeInstanceOf(Array);
                expect(req.body[0].groupedBy).toBe('day');
                expect(new Date(req.body[0].date)).toBeInstanceOf(Date);
                return req;
            });
        });
    });
});
