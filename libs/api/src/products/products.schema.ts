import { Schema } from 'mongoose';
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

ProductsSchema.set('toObject', { virtuals: true, versionKey: false });
ProductsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
