import { Model, Schema } from 'mongoose';
import { ProductDocument } from './products.entity';

export const ProductsSchema = new Schema<ProductDocument>(
    {
        EAN: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, index: true },
        description: String,
        price: { type: Number, required: true, index: true },
        stock: { type: Number, required: true, index: true },
    },
    {
        timestamps: true,
    },
);
