import { PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';

export enum SalesChannel {
    FBA = 'FBA',
    FBM = 'FBM',
}

export class Sale {
    amount: number;
    units: number;
    channel: SalesChannel;
    product: Types.ObjectId;
    date: Date;
    _id: Types.ObjectId | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface SalesDocument extends Sale, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

