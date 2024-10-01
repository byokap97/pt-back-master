import { SalesService } from '@api/sales/sales.service';
import { Injectable } from '@nestjs/common';
import {
    CreateSalesBackDto,
    FindAllSalesBackDto,
    SalesByChannelBackDto,
    SalesDto,
    SalesFindAllDto,
    UpdateSalesBackDto,
} from './dto/sales-back.dto';
import {
    DeleteByIdDto,
    FindAllDto,
    TotalCollectionAffectedDto,
} from '../utils/dto/utils.dto';

@Injectable()
export class SalesBackService {
    constructor(readonly service: SalesService) {}

    create(createSalesBackDto: CreateSalesBackDto): Promise<SalesDto> {
        return this.service.create(createSalesBackDto);
    }

    async findAll(
        findAllSalesBackDto: FindAllSalesBackDto,
    ): Promise<SalesFindAllDto> {
        return this.service.findAll(findAllSalesBackDto);
    }

    findOne(id: string): Promise<SalesDto> {
        return this.service.findById(id);
    }

    update(
        id: string,
        updateSalesBackDto: UpdateSalesBackDto,
    ): Promise<SalesDto> {
        return this.service.updateSale(id, updateSalesBackDto);
    }

    remove(id: string): Promise<DeleteByIdDto> {
        return this.service.deleteSale(id);
    }

    createFakeData(): Promise<TotalCollectionAffectedDto> {
        return this.service.createFakeData();
    }

    salesByChannel(salesByChannelBackDto: SalesByChannelBackDto) {
        return this.service.salesByChannel(salesByChannelBackDto);
    }
}
