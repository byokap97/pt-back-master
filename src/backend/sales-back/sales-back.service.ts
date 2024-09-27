import { SalesService } from '@api/sales/sales.service';
import { Injectable } from '@nestjs/common';
import { CreateSalesBackDto, FindAllSalesBackDto, FindAllSalesByChannelBackDto, UpdateSalesBackDto } from './dto/sales-back.dto';

@Injectable()
export class SalesBackService {

    constructor(readonly service: SalesService) {}

    create(createSalesBackDto: CreateSalesBackDto) {
        return this.service.createSale(createSalesBackDto);
    }

    async findAll(findAllSalesBackDto: FindAllSalesBackDto) {
        return this.service.findAll(findAllSalesBackDto);
    }

    findOne(id: string) {
        return this.service.findById(id);
    }

    update(id: string, updateSalesBackDto: UpdateSalesBackDto) {
        return this.service.updateSale(id, updateSalesBackDto);
    }

    remove(id: string) {
        return this.service.deleteSale(id);
    }

    createFakeData() {
        return this.service.createFakeData();
    }

    salesByChannel(findAllSalesByChannelBackDto: FindAllSalesByChannelBackDto) {
        return this.service.salesByChannel(findAllSalesByChannelBackDto);
    }
}
