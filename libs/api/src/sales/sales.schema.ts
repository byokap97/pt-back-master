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

SalesSchema.set('toObject', { virtuals: true, versionKey: false });
SalesSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
