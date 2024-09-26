import { Test, TestingModule } from '@nestjs/testing';
import { ProductsBackService } from './products-back.service';

describe('ProductsBackService', () => {
  let service: ProductsBackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsBackService],
    }).compile();

    service = module.get<ProductsBackService>(ProductsBackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
