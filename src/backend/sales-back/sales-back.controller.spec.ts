import { Test, TestingModule } from '@nestjs/testing';
import { SalesBackController } from './sales-back.controller';

describe('SalesBackController', () => {
  let controller: SalesBackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesBackController],
    }).compile();

    controller = module.get<SalesBackController>(SalesBackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
