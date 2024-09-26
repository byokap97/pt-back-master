import { Test, TestingModule } from '@nestjs/testing';
import { ProductsBackController } from './products-back.controller';
import { ProductsBackService } from './products-back.service';

describe('ProductsBackController', () => {
    let controller: ProductsBackController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsBackController],
            providers: [ProductsBackService],
        }).compile();

        controller = module.get<ProductsBackController>(ProductsBackController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
