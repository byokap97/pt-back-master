import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ProductDocument } from './products.entity';
import {
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import {
    CreateProductsBackDto,
    FindAllProductsBackDto,
    UpdateProductsBackDto,
} from '@backend/products-back/dto/products-back.dto';

describe('ProductsService', () => {
    let service: ProductsService;
    let mockProductModel: Model<ProductDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getModelToken('products', 'pt-epinium'),
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        findOneAndDelete: jest.fn(),
                        find: jest.fn(),
                        aggregate: jest.fn(),
                        countDocuments: jest.fn(),
                        deleteMany: jest.fn(),
                        insertMany: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        mockProductModel = module.get<Model<ProductDocument>>(
            getModelToken('products', 'pt-epinium'),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /**
     * Test for createFakeData()
     */
    describe('createFakeData', () => {
        it('should create fake data', async () => {
            const mockProduct: CreateProductsBackDto = {
                EAN: '',
                name: '',
                description: '',
                price: 0,
                stock: 0,
            };
            jest.spyOn(mockProductModel, 'deleteMany').mockResolvedValue({
                deletedCount: 100,
            } as any);
            jest.spyOn(mockProductModel, 'insertMany').mockResolvedValue([
                mockProduct as any,
            ]);

            const result = await service.createFakeData();
            expect(result.total).toBe(1);
            expect(mockProductModel.deleteMany).toHaveBeenCalled();
            expect(mockProductModel.insertMany).toHaveBeenCalled();
        });

        it('should throw an error if createFakeData fails', async () => {
            jest.spyOn(mockProductModel, 'insertMany').mockRejectedValue(
                new Error('Insert error'),
            );

            await expect(service.createFakeData()).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    const mockId = new mongoose.Types.ObjectId().toString();

    describe('findAll', () => {
        it('should return products with pagination', async () => {
            const findAllDto: FindAllProductsBackDto = {
                itemsPerPage: 10,
                page: 1,
                search: '',
                sortBy: [],
                sortDesc: [],
                totalProductCount: true,
            };
            const mockProducts = [
                { name: 'Product 1', description: 'Description 1' },
            ];
            jest.spyOn(mockProductModel, 'find').mockResolvedValue(
                mockProducts,
            );
            jest.spyOn(mockProductModel, 'countDocuments').mockResolvedValue(1);

            const result = await service.findAll(findAllDto);
            expect(result).toEqual({ results: mockProducts, total: 1 });
            expect(mockProductModel.find).toHaveBeenCalledWith(
                expect.any(Object),
                null,
                expect.any(Object),
            );
            expect(mockProductModel.countDocuments).toHaveBeenCalledWith(
                expect.any(Object),
            );
        });

        it('should throw an error if findAll fails', async () => {
            const findAllDto: FindAllProductsBackDto = {
                itemsPerPage: 10,
                page: 1,
                search: '',
                sortBy: [],
                sortDesc: [],
                totalProductCount: true,
            };
            jest.spyOn(mockProductModel, 'find').mockRejectedValue(
                new Error('Find error'),
            );

            await expect(service.findAll(findAllDto)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('findProductById', () => {
        it('should return a product by id', async () => {
            const mockProduct = {
                _id: mockId,
                name: 'Product 1',
                description: 'Description 1',
            };
            jest.spyOn(mockProductModel, 'findById').mockResolvedValue(
                mockProduct,
            );

            const result = await service.findProductById(mockId);
            expect(result).toEqual(mockProduct);
            expect(mockProductModel.findById).toHaveBeenCalledWith(mockId);
        });

        it('should return a Bad Request exception when data id is wrong', async () => {
            await expect(service.findProductById('productId')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw an error if findProductById fails', async () => {
            jest.spyOn(mockProductModel, 'findById').mockRejectedValue(
                new InternalServerErrorException('FindById error'),
            );

            await expect(service.findProductById(mockId)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const createProductDto: CreateProductsBackDto = {
                EAN: '1234567890000',
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                stock: 50,
            };
            const mockCreatedProduct: any = {
                ...createProductDto,
                _id: mockId,
            };
            jest.spyOn(mockProductModel, 'create').mockResolvedValue(
                mockCreatedProduct,
            );

            const result = await service.createProduct(createProductDto);
            expect(result).toEqual(mockCreatedProduct);
            expect(mockProductModel.create).toHaveBeenCalledWith(
                createProductDto,
            );
        });

        it('should throw an error if createProduct fails', async () => {
            const createProductDto: CreateProductsBackDto = {
                EAN: '1234567890000',
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                stock: 50,
            };
            jest.spyOn(mockProductModel, 'create').mockRejectedValue(
                new Error('Create error'),
            );

            await expect(
                service.createProduct(createProductDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('updateProduct', () => {
        it('should update a product by id', async () => {
            const updateProductDto: UpdateProductsBackDto = {
                name: 'Updated Product',
            };
            const mockUpdatedProduct = {
                _id: mockId,
                ...updateProductDto,
            };

            jest.spyOn(mockProductModel, 'findByIdAndUpdate').mockResolvedValue(
                mockUpdatedProduct,
            );

            const result = await service.updateProduct(
                mockId,
                updateProductDto,
            );
            expect(result).toEqual(mockUpdatedProduct);
            expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
                mockId,
                { $set: updateProductDto },
                { runValidators: true, new: true },
            );
        });

        it('should return a Bad Request exception when data id is wrong', async () => {
            await expect(service.deleteProduct('productId')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw an error if updateProduct fails', async () => {
            const updateProductDto: UpdateProductsBackDto = {
                name: 'Updated Product',
            };
            jest.spyOn(mockProductModel, 'findByIdAndUpdate').mockRejectedValue(
                new Error('Update error'),
            );

            await expect(
                service.updateProduct(mockId, updateProductDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product by id', async () => {
            const mockDeletedProduct = { _id: mockId };
            jest.spyOn(mockProductModel, 'findOneAndDelete').mockResolvedValue(
                mockDeletedProduct,
            );

            const result = await service.deleteProduct(mockId);
            expect(result).toEqual({ message: 'Deleted Product' });
            expect(mockProductModel.findOneAndDelete).toHaveBeenCalledWith({
                _id: mockId,
            });
        });

        it('should return a Bad Request exception when data id is wrong', async () => {
            await expect(service.deleteProduct('productId')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw an error if deleteProduct fails', async () => {
            jest.spyOn(mockProductModel, 'findOneAndDelete').mockRejectedValue(
                new Error('Delete error'),
            );

            await expect(service.deleteProduct(mockId)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('productsWith30daysSales', () => {
        it('should return products with sales in the last 30 days', async () => {
            const mockProducts = [
                {
                    EAN: (12345678900001).toFixed(0),
                    name: `Test Product Name 1`,
                    description: 'Test Product Description',
                    price: Math.floor(Math.random() * 1000),
                    stock: Math.floor(Math.random() * 1000),
                },
                {
                    EAN: (12345678900002).toFixed(0),
                    name: `Test Product Name 2`,
                    description: 'Test Product Description',
                    price: Math.floor(Math.random() * 1000),
                    stock: Math.floor(Math.random() * 1000),
                },
            ];
            const findAllProductsBackDto: FindAllProductsBackDto = {
                page: 10,
                itemsPerPage: 10,
                sortBy: ['name'],
                sortDesc: [true],
                search: '',
                totalProductCount: true,
            };

            jest.spyOn(mockProductModel, 'aggregate').mockResolvedValue(
                mockProducts,
            );
            jest.spyOn(mockProductModel, 'countDocuments').mockResolvedValue(
                mockProducts.length,
            );

            const result = await service.productsWith30daysSales(
                findAllProductsBackDto,
            );

            expect(result.results).toBe(mockProducts);
            expect(result.total).toBe(mockProducts.length);

            expect(mockProductModel.aggregate).toHaveBeenCalledWith(
                expect.any(Array),
            );
            expect(mockProductModel.countDocuments).toHaveBeenCalledWith(
                expect.any(Object),
            );
        });

        it('should throw an error if productsWith30daysSales fails', async () => {
            const findAllDto: FindAllProductsBackDto = {
                itemsPerPage: 10,
                page: 1,
                search: '',
                sortBy: [],
                sortDesc: [],
                totalProductCount: true,
            };
            jest.spyOn(mockProductModel, 'aggregate').mockRejectedValue(
                new Error('Aggregate error'),
            );

            await expect(
                service.productsWith30daysSales(findAllDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });
});
