import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { ProductsBackService } from './products-back.service';
import {
    CreatedFakeProductsDataDto,
    CreateProductsBackDto,
    FindAllProductsBackDto,
    FindAllProductsDto,
    ProductDto,
    ProductWithSales30DaysDto,
    UpdateProductsBackDto,
} from './dto/products-back.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteByIdDto, ErrorResponseDto } from '../utils/dto/utils.dto';

@ApiTags('Products Back')
@Controller('products-back')
export class ProductsBackController {
    constructor(private readonly productsBackService: ProductsBackService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new Product' })
    @ApiBody({
        type: CreateProductsBackDto,
        examples: {
            example1: {
                value: {
                    EAN: '1234567890001',
                    name: 'Test Product Name 1',
                    description: 'Test Product Description',
                    price: 169,
                    stock: 796,
                },
            },
        },
    })
    @ApiResponse({
        type: ProductDto,
        description: 'Product created',
        status: 201,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    create(@Body() createProductsBackDto: CreateProductsBackDto) {
        return this.productsBackService.create(createProductsBackDto);
    }

    @Post('findAll')
    @ApiOperation({ summary: 'Find All Products ordered' })
    @HttpCode(200)
    @ApiBody({
        type: FindAllProductsBackDto,
        examples: {
            example1: {
                value: {
                    page: 1,
                    itemsPerPage: 10,
                    sortBy: ['name'],
                    sortDesc: [true],
                    search: 'test',
                    totalProductCount: true,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Get all Products from db',
        type: FindAllProductsDto,
        isArray: false,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    findAll(@Body() findAllProductsBackDto: FindAllProductsBackDto) {
        if (
            typeof findAllProductsBackDto.page === undefined ||
            findAllProductsBackDto.page < 1
        )
            findAllProductsBackDto.page = 1;
        if (
            !findAllProductsBackDto.itemsPerPage ||
            findAllProductsBackDto.itemsPerPage < 1
        )
            findAllProductsBackDto.itemsPerPage = 10;
        return this.productsBackService.findAll(findAllProductsBackDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a product by id' })
    @ApiResponse({
        status: 200,
        type: ProductDto,
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
        return this.productsBackService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product by id' })
    @ApiBody({
        type: UpdateProductsBackDto,
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
        description: 'Product Updated',
        type: ProductDto,
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
        @Body() updateProductsBackDto: UpdateProductsBackDto,
    ) {
        return this.productsBackService.update(id, updateProductsBackDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Product by id' })
    @ApiResponse({
        status: 204,
        description: 'Deleted',
        type: DeleteByIdDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
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
        return this.productsBackService.remove(id);
    }

    @Post('createFakeData')
    @ApiOperation({ summary: 'Create a fake data inside db to run tests' })
    @ApiResponse({
        status: 201,
        description: 'Db seeded',
        type: CreatedFakeProductsDataDto,
        isArray: true,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    createFakeData() {
        return this.productsBackService.createFakeData();
    }

    @Post('productsWith30daysSales')
    @HttpCode(200)
    @ApiBody({
        type: FindAllProductsBackDto,
        description: 'Find all products with 30 days sales',
        examples: {
            example1: {
                value: {
                    page: 1,
                    itemsPerPage: 10,
                    sortBy: ['name'],
                    sortDesc: [true],
                    search: 'test',
                    totalProductCount: true,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Get products with 30 days sales',
        type: ProductWithSales30DaysDto,
        isArray: true,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        type: ErrorResponseDto,
    })
    productsWith30daysSales(
        @Body() findAllProductsBackDto: FindAllProductsBackDto,
    ) {
        return this.productsBackService.productsWith30daysSales(
            findAllProductsBackDto,
        );
    }
}
