import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { FindAllProductsBackDto } from 'src/backend/products-back/dto/products-back.dto';
import { getModelToken } from '@nestjs/mongoose';
import { ProductDocument } from './products.entity';
import { Model } from 'mongoose';
describe('ProductsService', () => {
    let service: ProductsService;
    let module: TestingModule;
    let mockProductModel: Model<ProductDocument>;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [],
            providers: [
                {
                    provide: getModelToken('products', 'pt-epinium'),
                    useValue: {
                        aggregate: jest.fn(),
                        countDocuments: jest.fn(),
                    },
                },
                ProductsService,
            ],
        }).compile();

        mockProductModel = module.get<Model<ProductDocument>>(
            getModelToken('products', 'pt-epinium'),
        );
        service = module.get<ProductsService>(ProductsService);
    });

    afterEach(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('productsWith30daysSales', async () => {
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
});
