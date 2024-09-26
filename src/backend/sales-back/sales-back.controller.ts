import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SalesBackService } from './sales-back.service';
import {
    CreateSalesBackDto,
    FindAllSalesBackDto,
    UpdateSalesBackDto,
} from './dto/sales-back.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sales Back')
@Controller('sales-back')
export class SalesBackController {
    constructor(readonly salesBackService: SalesBackService) {}

    @Post('create')
    create(@Body() createSalesBackDto: CreateSalesBackDto) {
        // #TODO
    }

    @Post('findAll')
    findAll(@Body() findAllSalesBackDto: FindAllSalesBackDto) {
        // #TODO
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // #TODO
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProductsBackDto: UpdateSalesBackDto,
    ) {
        // #TODO
    }

    @Post('createFakeData')
    createFakeData() {
        // #TODO
    }

    @Post('salesByChannel')
    salesByChannel(@Body() findAllSalesBackDto: FindAllSalesBackDto) {
        // #TODO
    }
}
