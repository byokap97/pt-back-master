import { Test, TestingModule } from '@nestjs/testing';
import { SalesBackService } from './sales-back.service';

describe('SalesBackService', () => {
    let service: SalesBackService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: SalesBackService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<SalesBackService>(SalesBackService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
