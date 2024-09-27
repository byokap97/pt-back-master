import { Schema } from 'mongoose';
import { SalesChannel, SalesDocument } from './sales.entity';

export const SalesSchema = new Schema<SalesDocument>(
    {
        amount: { type: Number, required: true },
        units: { type: Number, required: true },
        channel: {
            type: String,
            enum: Object.values(SalesChannel),
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        date: { type: Date, required: true },
    },
    {
        timestamps: true,
    },
);
