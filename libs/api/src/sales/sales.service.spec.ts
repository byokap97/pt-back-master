import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SalesChannel, SalesDocument } from './sales.entity';
import { ProductDocument } from '@api/products/products.entity';

import {
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    CreateSalesBackDto,
    FindAllSalesBackDto,
    UpdateSalesBackDto,
    SalesByChannelBackDto,
} from '@backend/sales-back/dto/sales-back.dto';

describe('SalesService', () => {
    let service: SalesService;
    let mockSalesModel: Model<SalesDocument>;
    let mockProductsModel: Model<ProductDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SalesService,
                {
                    provide: getModelToken('sales', 'pt-epinium'),
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findOneAndDelete: jest.fn(),
                        aggregate: jest.fn(),
                        countDocuments: jest.fn(),
                        deleteMany: jest.fn(),
                        insertMany: jest.fn(),
                    },
                },
                {
                    provide: getModelToken('products', 'pt-epinium'),
                    useValue: {
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SalesService>(SalesService);
        mockSalesModel = module.get<Model<SalesDocument>>(
            getModelToken('sales', 'pt-epinium'),
        );
        mockProductsModel = module.get<Model<ProductDocument>>(
            getModelToken('products', 'pt-epinium'),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const id = new mongoose.Types.ObjectId().toString();
        it('should create a sale', async () => {
            const createSaleDto: CreateSalesBackDto = {
                product: id,
                units: 10,
                amount: 100,
                date: new Date(),
                channel: SalesChannel.FBA,
            };

            const mockCreatedSale: any = {
                ...createSaleDto,
                _id: new mongoose.Types.ObjectId(),
            };
            jest.spyOn(mockSalesModel, 'create').mockResolvedValue(
                mockCreatedSale,
            );

            const result = await service.create(createSaleDto);
            expect(result).toEqual(mockCreatedSale);
            expect(mockSalesModel.create).toHaveBeenCalledWith(createSaleDto);
        });

        it('should throw an error if create fails', async () => {
            const createSaleDto: CreateSalesBackDto = {
                product: id,
                units: 10,
                amount: 100,
                date: new Date(),
                channel: SalesChannel.FBA,
            };
            jest.spyOn(mockSalesModel, 'create').mockRejectedValue(
                new Error('Create error'),
            );

            await expect(service.create(createSaleDto)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('findAll', () => {
        it('should return sales with pagination', async () => {
            const findAllDto: FindAllSalesBackDto = {
                itemsPerPage: 10,
                page: 1,
                search: '',
                sortBy: [],
                sortDesc: [],
                totalSalesCount: true,
            };
            const mockSales = [{ amount: 100, units: 10, channel: 'FBA' }];
            jest.spyOn(mockSalesModel, 'aggregate').mockResolvedValue(
                mockSales,
            );
            jest.spyOn(mockSalesModel, 'countDocuments').mockResolvedValue(1);

            const result = await service.findAll(findAllDto);
            expect(result).toEqual({ results: mockSales, total: 1 });
            expect(mockSalesModel.aggregate).toHaveBeenCalledWith(
                expect.any(Array),
            );
            expect(mockSalesModel.countDocuments).toHaveBeenCalledWith({});
        });

        it('should throw an error if findAll fails', async () => {
            const findAllDto: FindAllSalesBackDto = {
                itemsPerPage: 10,
                page: 1,
                search: '',
                sortBy: [],
                sortDesc: [],
                totalSalesCount: true,
            };
            jest.spyOn(mockSalesModel, 'aggregate').mockRejectedValue(
                new Error('Find error'),
            );

            await expect(service.findAll(findAllDto)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('findById', () => {
        const saleId = new mongoose.Types.ObjectId().toString();

        it('should return a sale by id', async () => {
            const mockSale = {
                _id: saleId,
                amount: 100,
                units: 10,
                channel: 'FBA',
            };
            jest.spyOn(mockSalesModel, 'findById').mockResolvedValue(mockSale);

            const result = await service.findById(saleId);
            expect(result).toEqual(mockSale);
            expect(mockSalesModel.findById).toHaveBeenCalledWith(saleId);
        });

        it('should return a Bad Request exception when data id is wrong', async () => {
            await expect(service.findById('saleId')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw an error if findById fails', async () => {
            jest.spyOn(mockSalesModel, 'findById').mockRejectedValue(
                new Error('FindById error'),
            );

            await expect(service.findById(saleId)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('updateSale', () => {
        const saleId = new mongoose.Types.ObjectId().toString();

        const updateSalesBackDto: UpdateSalesBackDto = {
            units: 15,
            amount: 150,
        };
        it('should update a sale by id', async () => {
            const mockUpdatedSale = { _id: saleId, ...updateSalesBackDto };

            jest.spyOn(mockSalesModel, 'findByIdAndUpdate').mockResolvedValue(
                mockUpdatedSale,
            );

            const result = await service.updateSale(saleId, updateSalesBackDto);
            expect(result).toEqual(mockUpdatedSale);
            expect(mockSalesModel.findByIdAndUpdate).toHaveBeenCalledWith(
                saleId,
                { $set: updateSalesBackDto },
                { runValidators: true, new: true },
            );
        });

        it('should return a Bad Request exception when data id is wrong', async () => {
            await expect(
                service.updateSale('saleId', updateSalesBackDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw an error if updateSale fails', async () => {
            jest.spyOn(mockSalesModel, 'findByIdAndUpdate').mockRejectedValue(
                new Error('Update error'),
            );

            await expect(
                service.updateSale(saleId, updateSalesBackDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('deleteSale', () => {
        const saleId = new mongoose.Types.ObjectId().toString();

        it('should delete a sale by id', async () => {
            const mockDeletedSale = { _id: saleId };
            jest.spyOn(mockSalesModel, 'findOneAndDelete').mockResolvedValue(
                mockDeletedSale,
            );

            const result = await service.deleteSale(saleId);
            expect(result).toEqual({ message: 'Sale deleted' });
            expect(mockSalesModel.findOneAndDelete).toHaveBeenCalledWith({
                _id: saleId,
            });
        });

        it('should return a Bad Request exception when data id is wrong', async () => {
            await expect(service.deleteSale('saleId')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw an error if deleteSale fails', async () => {
            jest.spyOn(mockSalesModel, 'findOneAndDelete').mockRejectedValue(
                new Error('Delete error'),
            );

            await expect(service.deleteSale(saleId)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('createFakeData', () => {
        const productId = new mongoose.Types.ObjectId().toString();
        const mockProducts = [{ _id: productId }];

        it('should create fake data', async () => {
            jest.spyOn(mockProductsModel, 'find').mockResolvedValue(
                mockProducts,
            );
            jest.spyOn(mockSalesModel, 'insertMany').mockResolvedValue([
                { _id: new mongoose.Types.ObjectId().toString() } as any,
            ]);

            const result = await service.createFakeData();
            expect(result.total).toBe(1);
            expect(mockSalesModel.deleteMany).toHaveBeenCalled();
            expect(mockSalesModel.insertMany).toHaveBeenCalled();
        });

        it('should throw an error if createFakeData fails', async () => {
            jest.spyOn(mockProductsModel, 'find').mockResolvedValue(
                mockProducts,
            );
            jest.spyOn(mockSalesModel, 'insertMany').mockRejectedValue(
                new Error('Insert error'),
            );

            await expect(service.createFakeData()).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('salesByChannel', () => {
        it('should return sales grouped by channel and date', async () => {
            const mockSales = [
                {
                    sales: 4745,
                    units: 551,
                    groupedBy: 'day',
                    channel: 'FBM',
                    date: '2024-07-04',
                },
                {
                    sales: 4745,
                    units: 551,
                    groupedBy: 'day',
                    channel: 'FBA',
                    date: '2024-07-04',
                },
            ];
            const salesByChannelDto: SalesByChannelBackDto = {
                startDate: new Date('2024-07-03'),
                endDate: new Date('2024-07-04'),
                sortDesc: [true],
            };

            jest.spyOn(mockSalesModel, 'aggregate').mockResolvedValue(
                mockSales,
            );

            const result = await service.salesByChannel(salesByChannelDto);
            expect(result).toBe(mockSales);
            expect(mockSalesModel.aggregate).toHaveBeenCalledWith(
                expect.any(Array),
            );
        });

        it('should throw an error if salesByChannel fails', async () => {
            const salesByChannelDto: SalesByChannelBackDto = {
                startDate: new Date('2024-07-03'),
                endDate: new Date('2024-07-04'),
                sortDesc: [true],
            };

            jest.spyOn(mockSalesModel, 'aggregate').mockRejectedValue(
                new Error('Aggregate error'),
            );

            await expect(
                service.salesByChannel(salesByChannelDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });
});
