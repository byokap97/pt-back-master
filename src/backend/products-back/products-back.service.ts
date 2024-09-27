import { Injectable } from '@nestjs/common';
import { ProductsService } from '@api/products/products.service';
import {
    CreateProductsBackDto,
    FindAllProductsBackDto,
    UpdateProductsBackDto,
} from './dto/products-back.dto';

@Injectable()
export class ProductsBackService {
    constructor(readonly productsService: ProductsService) { }

    create(createProductsBackDto: CreateProductsBackDto) {
        return this.productsService.createProduct(createProductsBackDto);
    }

    async findAll(findAllProductsBackDto: FindAllProductsBackDto) {
        return this.productsService.findAll(findAllProductsBackDto);
    }

    findOne(id: string) {
        return this.productsService.findProductById(id);
    }

    update(id: string, updateProductsBackDto: UpdateProductsBackDto) {
        return this.productsService.updateProduct(id, updateProductsBackDto);
    }

    remove(id: string) {
        return this.productsService.deleteProduct(id);
    }

    productsWith30daysSales(findAllProductsBackDto: FindAllProductsBackDto) {
        return this.productsService.productsWith30daysSales(
            findAllProductsBackDto,
        );
    }

    createFakeData() {
        return this.productsService.createFakeData();
    }
}
