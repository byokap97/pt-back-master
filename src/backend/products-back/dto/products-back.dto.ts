import { Product } from '@api/products/products.entity';
import { PartialType } from '@nestjs/swagger';

export class FindAllProductsBackDto {
    page?: number;
    itemsPerPage?: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    search?: string;
    totalProductCount?: boolean;
}

export class CreateProductsBackDto {
    EAN: Product['EAN'];
    name: Product['name'];
    description?: Product['description'];
    price: Product['price'];
    stock: Product['stock'];
}

export class UpdateProductsBackDto extends PartialType(CreateProductsBackDto) {}

export class ProductWithSales30DaysDTO {
    EAN: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sales30: number;
    units30: number;
}
