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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products Back')
@Controller('products-back')
export class ProductsBackController {
    constructor(private readonly productsBackService: ProductsBackService) {}

    @Post('create')
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
    create(@Body() createProductsBackDto: CreateProductsBackDto) {
        return this.productsBackService.create(createProductsBackDto);
    }

    @Post('findAll')
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
    findOne(@Param('id') id: string) {
        return this.productsBackService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProductsBackDto: UpdateProductsBackDto,
    ) {
        return this.productsBackService.update(id, updateProductsBackDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsBackService.remove(id);
    }

    @Post('createFakeData')
    @ApiResponse({
        status: 201,
        description: 'Db seeded',
        type: CreatedFakeProductsDataDto,
        isArray: true,
    })
    createFakeData() {
        return this.productsBackService.createFakeData();
    }

    @ApiResponse({
        status: 200,
        description: 'Get products with 30 days sales',
        type: ProductWithSales30DaysDto,
        isArray: true,
    })
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
    @Post('productsWith30daysSales')
    @HttpCode(200)
    productsWith30daysSales(
        @Body() findAllProductsBackDto: FindAllProductsBackDto,
    ) {
        return this.productsBackService.productsWith30daysSales(
            findAllProductsBackDto,
        );
    }
}
