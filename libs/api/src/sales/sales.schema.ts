import { Model, Schema, Types } from 'mongoose';
import { SalesChannel, SalesDocument } from './sales.entity';
import { Product } from '@api/products/products.entity';

export const SalesSchema = new Schema<SalesDocument>(
    {

        amount: { type: String, required: true },
        units: { type: Number, required: true },
        channel: { enum: SalesChannel, required: true },
        product: { type: Types.ObjectId, required: true, ref: 'Product' }
    },
    {
        timestamps: true,
    },
);
