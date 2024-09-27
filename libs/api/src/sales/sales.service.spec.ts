import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getModelToken } from '@nestjs/mongoose';
import {
    FindAllSalesBackDto,
    FindAllSalesByChannelBackDto,
} from 'src/backend/sales-back/dto/sales-back.dto';
import { SalesDocument } from './sales.entity';
import { Model } from 'mongoose';

describe('SalesService', () => {
    let service: SalesService;
    let mockSaleDocument: Model<SalesDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('products', 'pt-epinium'),
                    useValue: {
                        aggregate: jest.fn(),
                        countDocuments: jest.fn(),
                    },
                },
                {
                    provide: getModelToken('sales', 'pt-epinium'),
                    useValue: {
                        aggregate: jest.fn(),
                    },
                },
                SalesService,
            ],
        }).compile();

        mockSaleDocument = module.get<Model<SalesDocument>>(
            getModelToken('sales', 'pt-epinium'),
        );
        service = module.get<SalesService>(SalesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('salesByChannel', async () => {
        const mockSales = [
            {
                sales: 4745,
                units: 551,
                groupedBy: 'day',
                channel: 'FBM',
                date: '2024-07-04T12:47:48.036Z',
            },
            {
                sales: 4745,
                units: 551,
                groupedBy: 'day',
                channel: 'FBA',
                date: '2024-07-04T12:47:48.036Z',
            },
            {
                sales: 5351,
                units: 579,
                groupedBy: 'day',
                channel: 'FBM',
                date: '2024-07-03T12:47:48.036Z',
            },
            {
                sales: 5351,
                units: 579,
                groupedBy: 'day',
                channel: 'FBA',
                date: '2024-07-03T12:47:48.036Z',
            },
        ];
        const findAllSalesByChannelBackDto: FindAllSalesByChannelBackDto = {
            startDate: new Date('2024-07-03'),
            endDate: new Date('2024-07-04'),
            sortDesc: [true],
        };

        jest.spyOn(mockSaleDocument, 'aggregate').mockResolvedValue(mockSales);

        const result = await service.salesByChannel(
            findAllSalesByChannelBackDto,
        );

        expect(result.results).toBe(mockSales);

        expect(mockSaleDocument.aggregate).toHaveBeenCalledWith(
            expect.any(Array),
        );
    });
});
