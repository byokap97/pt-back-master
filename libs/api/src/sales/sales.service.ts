import { Injectable } from '@nestjs/common';
import { SalesDocument } from './sales.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { CreateSalesBackDto, FindAllSalesBackDto, UpdateSalesBackDto } from 'src/backend/sales-back/dto/sales-back.dto';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel('sales', 'pt-epinium')
        readonly model: Model<SalesDocument>,
    ) { }


    async create(sale: CreateSalesBackDto) {
        return this.model.create(sale);
    }

    async findAll({
        itemsPerPage,
        page,
        search,
        sortBy,
        sortDesc,
        totalSalesCount,
    }: FindAllSalesBackDto) {
        const query: FilterQuery<SalesDocument> = {};

        if (search) {
            query.$or = [
                { channel: { $regex: search, $options: 'i' } },
                { product: { $regex: search, $options: 'i' } },
            ];
        }

        const sort: { [k: string]: SortOrder } = {};

        if (sortBy?.length && sortDesc?.length) {
            sortBy.forEach((v, i) => {
                sort[v] = sortDesc[i] ? -1 : 1;
            });
        }

        if (page < 1) page = 1;
        if (itemsPerPage < 1) itemsPerPage = 10;

        const sales = this.model.find(query, null, {
            sort,
            skip: +itemsPerPage * (+page - 1),
            limit: +itemsPerPage,
        });

        const total = totalSalesCount
            ? this.model.countDocuments(query)
            : undefined;

        return {
            sales: await sales,
            total: await total,
        };
    }

    async findById(id: string) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        return this.model.findById(id);
    }

    async update(id: string, sale: UpdateSalesBackDto) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        const updateSale = await this.model.findByIdAndUpdate(
            id,
            { $set: sale },
            { runValidators: true }
        );

        if (!updateSale) {
            throw new Error('Sale not updated');
        }

        return updateSale;
    }

    async delete(id: string) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        const deletedSale = await this.model.findOneAndDelete({ _id: id })

        if (!deletedSale) {
            throw new Error('Sale not deleted');
        }

        return deletedSale;
    }
}
