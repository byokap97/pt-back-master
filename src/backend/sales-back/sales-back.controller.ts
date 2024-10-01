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
    SalesByChannelBackDto,
    SalesByChannelDto,
    SalesFindAllDto,
} from './dto/sales-back.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    DeleteByIdDto,
    ErrorResponseDto,
    TotalCollectionAffectedDto,
} from '../utils/dto/utils.dto';

@ApiTags('Sales Back')
@Controller('sales-back')
export class SalesBackController {
    constructor(readonly salesBackService: SalesBackService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new Sale' })
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
        description: 'Sale created',
        status: 201,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    create(@Body() createSalesBackDto: CreateSalesBackDto) {
        return this.salesBackService.create(createSalesBackDto);
    }

    @Post('findAll')
    @HttpCode(200)
    @ApiOperation({ summary: 'Find All Sales ordered' })
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
        type: SalesFindAllDto,
        description: 'Get all Sales from db',
        status: 200,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    findAll(
        @Body() findAllSalesBackDto: FindAllSalesBackDto,
    ): Promise<SalesFindAllDto> {
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
    @ApiOperation({ summary: 'Find a sale by id' })
    @ApiResponse({
        status: 200,
        type: SalesDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    findOne(@Param('id') id: string) {
        return this.salesBackService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a sale by id' })
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
        description: 'Sale Updated',
        type: SalesDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    update(
        @Param('id') id: string,
        @Body() updateSalesBackDto: UpdateSalesBackDto,
    ) {
        return this.salesBackService.update(id, updateSalesBackDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a sale by id' })
    @ApiResponse({
        status: 204,
        description: 'Deleted',
        type: DeleteByIdDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Sale not found',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    remove(@Param('id') id: string) {
        return this.salesBackService.remove(id);
    }

    @Post('createFakeData')
    @ApiOperation({ summary: 'Create a fake data inside db to run tests' })
    @ApiResponse({
        status: 201,
        description: 'Db seeded',
        type: TotalCollectionAffectedDto,
        isArray: true,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    createFakeData() {
        return this.salesBackService.createFakeData();
    }

    @Post('salesByChannel')
    @HttpCode(200)
    @ApiOperation({ summary: 'Find all sales by channel in a period of time' })
    @ApiBody({
        type: SalesByChannelBackDto,
        description: 'Send the period and the sort option',
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
        description: 'Sales by channel',
        type: SalesByChannelDto,
        isArray: true,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Sales not found',
        type: ErrorResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    salesByChannel(
        @Body() findAllSalesByChannelBackDto: SalesByChannelBackDto,
    ) {
        return this.salesBackService.salesByChannel(
            findAllSalesByChannelBackDto,
        );
    }
}
