import { PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class Product {
    EAN: string;
    name: string;
    description: string;
    price: number;
    stock: number;

    _id: Types.ObjectId | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface ProductDocument extends Product, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export class ProductDto extends PartialType(Product) {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}
