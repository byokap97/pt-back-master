import { SalesService } from '@api/sales/sales.service';
import { Injectable } from '@nestjs/common';
import { CreateSalesBackDto, FindAllSalesBackDto, UpdateSalesBackDto } from './dto/sales-back.dto';
import { UpdateProductsBackDto, FindAllProductsBackDto } from '../products-back/dto/products-back.dto';

@Injectable()
export class SalesBackService {
    // #TODO

    constructor(readonly service: SalesService) {}

    create(dto: CreateSalesBackDto) {
        return this.service.create(dto);
    }

    async findAll(dto: FindAllSalesBackDto) {
        return this.service.findAll(dto);
    }

    findOne(id: string) {
        return this.service.findById(id);
    }

    update(id: string, dto: UpdateSalesBackDto) {
        return this.service.update(id, dto);
    }

    remove(id: string) {
        return this.service.delete(id);
    }

}
