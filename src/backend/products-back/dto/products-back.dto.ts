import { Product } from '@api/products/products.entity';
import { FindAllDto } from '@backend/utils/dto/utils.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class FindAllProductsBackDto {
    page?: number;
    itemsPerPage?: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    search?: string;
    totalProductCount?: boolean;
}

export class FindAllProductsDto extends FindAllDto<ProductDto> {
    results: ProductDto[];
}

export class CreateProductsBackDto {
    EAN: Product['EAN'];
    name: Product['name'];
    description?: Product['description'];
    price: Product['price'];
    stock: Product['stock'];
}

export class UpdateProductsBackDto extends PartialType(CreateProductsBackDto) {}

export class FindProductWith30DaysSalesDto extends FindAllDto<ProductWithSales30DaysDto> {
    results: ProductWithSales30DaysDto[];
}

export class ProductWithSales30DaysDto {
    EAN: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sales30: number;
    units30: number;
}

export class ProductDto extends PartialType(OmitType(Product, ['_id'])) {
    createdAt?: string;
    updatedAt?: string;
    id: string;
}
export class CreatedFakeProductsDataDto {
    total: number;
}
