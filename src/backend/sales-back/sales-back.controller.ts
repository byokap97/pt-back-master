import {
    Body,
    Controller,
    Delete,
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
    UpdateSalesBackDto,
    SalesDto,
    FindAllSalesDto,
    DeleteByIdDto,
    SalesByChannelBackDto,
    SalesByChannelDto,
    CreatedFakeSalesDataDto,
} from './dto/sales-back.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sales Back')
@Controller('sales-back')
export class SalesBackController {
    constructor(readonly salesBackService: SalesBackService) {}

    @Post('create')
    @ApiBody({
        type: CreateSalesBackDto,
        examples: {
            example1: {
                value: {
                    date: '2024-09-05 19:45',
                    amount: '2',
                    units: '1500',
                    channel: 'FBA',
                    product: '66fab5b8ada9f861a64fe4c9',
                },
            },
        },
    })
    @ApiResponse({
        type: SalesDto,
        description: 'Product created',
        status: 201,
    })
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
    @ApiResponse({
        type: FindAllSalesDto,
        description: 'Get all Sales from db',
        status: 200,
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
    @ApiResponse({
        status: 200,
        type: SalesDto,
    })
    findOne(@Param('id') id: string) {
        return this.salesBackService.findOne(id);
    }

    @Patch(':id')
    @ApiBody({
        type: UpdateSalesBackDto,
        examples: {
            example1: {
                value: {
                    amount: 50,
                    units: 7,
                    channel: 'FBA',
                    product: '66fab5b8ada9f861a64fe4c9',
                    date: '2024-09-01T14:31:08.495Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        type: SalesDto,
    })
    update(
        @Param('id') id: string,
        @Body() updateSalesBackDto: UpdateSalesBackDto,
    ) {
        return this.salesBackService.update(id, updateSalesBackDto);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Deleted',
        type: DeleteByIdDto,
    })
    @ApiBody({
        type: SalesDto,
        examples: {
            example1: {
                value: {
                    id: '66fab62ce54e7a26355169f3',
                    amount: 50,
                    units: 7,
                    channel: 'FBA',
                    product: '66fab5b8ada9f861a64fe4c9',
                    date: '2024-09-01T14:31:08.495Z',
                    createdAt: '2024-09-30T14:31:08.796Z',
                    updatedAt: '2024-09-30T14:31:08.796Z',
                },
            },
        },
    })
    deleteById(@Param('id') id: string) {
        return this.salesBackService.remove(id);
    }

    @Post('createFakeData')
    @ApiResponse({
        status: 201,
        description: 'Db seeded',
        type: CreatedFakeSalesDataDto,
        isArray: true,
    })
    createFakeData() {
        return this.salesBackService.createFakeData();
    }

    @Post('salesByChannel')
    @ApiBody({
        type: SalesByChannelDto,
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
    @ApiResponse({
        status: 200,
        description: 'Get products with 30 days sales',
        type: SalesByChannelBackDto,
        isArray: true,
    })
    salesByChannel(
        @Body() findAllSalesByChannelBackDto: SalesByChannelBackDto,
    ) {
        return this.salesBackService.salesByChannel(
            findAllSalesByChannelBackDto,
        );
    }
}
