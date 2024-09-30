import { SalesService } from '@api/sales/sales.service';
import { Injectable } from '@nestjs/common';
import {
    CreateSalesBackDto,
    DeleteByIdDto,
    FindAllSalesBackDto,
    SalesByChannelBackDto,
    FindAllSalesDto,
    SalesDto,
    UpdateSalesBackDto,
    CreatedFakeSalesDataDto,
} from './dto/sales-back.dto';

@Injectable()
export class SalesBackService {
    constructor(readonly service: SalesService) {}

    create(createSalesBackDto: CreateSalesBackDto): Promise<SalesDto> {
        return this.service.create(createSalesBackDto);
    }

    async findAll(
        findAllSalesBackDto: FindAllSalesBackDto,
    ): Promise<FindAllSalesDto> {
        return this.service.findAll(findAllSalesBackDto);
    }

    findOne(id: string): Promise<SalesDto> {
        return this.service.findById(id);
    }

    update(id: string, updateSalesBackDto: UpdateSalesBackDto): Promise<SalesDto> {
        return this.service.updateSale(id, updateSalesBackDto);
    }

    remove(id: string): Promise<DeleteByIdDto> {
        return this.service.deleteSale(id);
    }

    createFakeData(): Promise<CreatedFakeSalesDataDto> {
        return this.service.createFakeData();
    }

    salesByChannel(salesByChannelBackDto: SalesByChannelBackDto) {
        return this.service.salesByChannel(salesByChannelBackDto);
    }
}
