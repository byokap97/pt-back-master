import { Injectable } from '@nestjs/common';
import { ProductsService } from '@api/products/products.service';
import {
    CreatedFakeProductsDataDto,
    CreateProductsBackDto,
    FindAllProductsBackDto,
    FindAllProductsDto,
    FindProductWith30DaysSalesDto,
    ProductDto,
    ProductWithSales30DaysDto,
    UpdateProductsBackDto,
} from './dto/products-back.dto';
import { DeleteByIdDto, FindAllDto } from '../utils/dto/utils.dto';

@Injectable()
export class ProductsBackService {
    constructor(readonly productsService: ProductsService) {}

    create(createProductsBackDto: CreateProductsBackDto): Promise<ProductDto> {
        return this.productsService.createProduct(createProductsBackDto);
    }

    async findAll(
        findAllProductsBackDto: FindAllProductsBackDto,
    ): Promise<FindAllProductsDto> {
        return this.productsService.findAll(findAllProductsBackDto);
    }

    findOne(id: string): Promise<ProductDto> {
        return this.productsService.findProductById(id);
    }

    update(
        id: string,
        updateProductsBackDto: UpdateProductsBackDto,
    ): Promise<ProductDto> {
        return this.productsService.updateProduct(id, updateProductsBackDto);
    }

    remove(id: string): Promise<DeleteByIdDto> {
        return this.productsService.deleteProduct(id);
    }

    productsWith30daysSales(
        findAllProductsBackDto: FindAllProductsBackDto,
    ): Promise<FindProductWith30DaysSalesDto> {
        return this.productsService.productsWith30daysSales(
            findAllProductsBackDto,
        );
    }

    createFakeData(): Promise<CreatedFakeProductsDataDto> {
        return this.productsService.createFakeData();
    }
}
