import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { SalesBackService } from './sales-back.service';
import {
    CreateSalesBackDto,
    FindAllSalesBackDto,
    FindAllSalesByChannelBackDto,
    SalesByChannelDTO,
    UpdateSalesBackDto,
} from './dto/sales-back.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sales Back')
@Controller('sales-back')
export class SalesBackController {
    constructor(readonly salesBackService: SalesBackService) {}

    @Post('create')
    create(@Body() createSalesBackDto: CreateSalesBackDto) {
        return this.salesBackService.create(createSalesBackDto);
    }

    @Post('findAll')
    @ApiBody({
        type: FindAllSalesBackDto,
        examples: {
            example1: {
                value: {
                    page: 1,
                    itemsPerPage: 10,
                    sortBy: ['channel'],
                    sortDesc: [true],
                    search: 'test',
                    totalProductCount: true,
                },
            },
        },
    })
    findAll(@Body() findAllSalesBackDto: FindAllSalesBackDto) {
        if (
            typeof findAllSalesBackDto.page === undefined ||
            findAllSalesBackDto.page < 1
        )
            findAllSalesBackDto.page = 1;
        if (
            !findAllSalesBackDto.itemsPerPage ||
            findAllSalesBackDto.itemsPerPage < 1
        )
            findAllSalesBackDto.itemsPerPage = 10;
        return this.salesBackService.findAll(findAllSalesBackDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesBackService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSalesBackDto: UpdateSalesBackDto,
    ) {
        return this.salesBackService.update(id, updateSalesBackDto);
    }

    @Post('createFakeData')
    createFakeData() {
        return this.salesBackService.createFakeData();
    }

    @ApiResponse({
        status: 200,
        description: 'Get products with 30 days sales',
        type: SalesByChannelDTO,
        isArray: true,
    })
    @ApiBody({
        type: FindAllSalesByChannelBackDto,
        description: 'Find all sales by channel',
        examples: {
            example1: {
                value: {
                    startDate: '2024-08-01',
                    endDate: '2024-09-01',
                    sortDesc: [true],
                },
            },
        },
    })
    @Post('salesByChannel')
    @HttpCode(200)
    salesByChannel(@Body() findAllSalesByChannelBackDto: FindAllSalesByChannelBackDto) {
        return this.salesBackService.salesByChannel(findAllSalesByChannelBackDto);
    }
}
