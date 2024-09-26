import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
    let service: ProductsService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [],
            providers: [ProductsService],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    });

    afterEach(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('productsWith30daysSales', async () => {
        // #TODO
    });
});
