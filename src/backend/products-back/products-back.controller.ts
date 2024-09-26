import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ProductsBackService } from './products-back.service';
import {
    CreateProductsBackDto,
    FindAllProductsBackDto,
    ProductWithSales30DaysDTO,
    UpdateProductsBackDto,
} from './dto/products-back.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products Back')
@Controller('products-back')
export class ProductsBackController {
    constructor(private readonly productsBackService: ProductsBackService) {}

    @Post('create')
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
    createFakeData() {
        return this.productsBackService.createFakeData();
    }

    @ApiResponse({
        status: 200,
        description: 'Get products with 30 days sales',
        type: ProductWithSales30DaysDTO,
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
    productsWith30daysSales(
        @Body() findAllProductsBackDto: FindAllProductsBackDto,
    ) {
        return this.productsBackService.productsWith30daysSales(
            findAllProductsBackDto,
        );
    }
}
