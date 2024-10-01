import { Test, TestingModule } from '@nestjs/testing';
import { SalesBackController } from './sales-back.controller';
import { SalesBackService } from './sales-back.service';

describe('SalesBackController', () => {
    let controller: SalesBackController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SalesBackController],
            providers: [
                {
                    provide: SalesBackService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<SalesBackController>(SalesBackController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
