import { Injectable } from '@nestjs/common';
import { SalesChannel, SalesDocument } from './sales.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, SortOrder, Types } from 'mongoose';
import {
    CreateSalesBackDto,
    FindAllSalesBackDto,
    FindAllSalesByChannelBackDto,
    SalesByChannelDTO,
    UpdateSalesBackDto,
} from 'src/backend/sales-back/dto/sales-back.dto';
import { ProductDocument } from '@api/products/products.entity';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel('sales', 'pt-epinium')
        readonly model: Model<SalesDocument>,
        @InjectModel('products', 'pt-epinium')
        readonly productsModel: Model<ProductDocument>,
    ) {}

    async createSale(sale: CreateSalesBackDto) {
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
            query.$or = [{ channel: { $regex: search, $options: 'i' } }];
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

    async updateSale(id: string, updateSalesBackDto: UpdateSalesBackDto) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        const updateSale = await this.model.findByIdAndUpdate(
            id,
            { $set: updateSalesBackDto },
            { runValidators: true },
        );

        if (!updateSale) {
            throw new Error('Sale not updated');
        }

        return updateSale;
    }

    async deleteSale(id: string) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        const deletedSale = await this.model.findOneAndDelete({ _id: id });

        if (!deletedSale) {
            throw new Error('Sale not deleted');
        }

        return deletedSale;
    }

    async createFakeData() {
        await this.model.deleteMany({});
        const createPromises: Promise<any>[] = [];

        const products = await this.productsModel.find({});

        const today = new Date();

        for (let d = 0; d < 90; ++d) {
            products.forEach((product) => {
                const model = {
                    units: Math.floor(Math.random() * (10 - 1 + 1) + 1),
                    product: product['_id'],
                    amount: Math.floor(Math.random() * (100 - 1 + 1) + 1),
                    date: new Date(today).setDate(today.getDay() - d),
                    channel: SalesChannel.FBA,
                };
                createPromises.push(
                    this.model.create(model),
                    this.model.create({ ...model, channel: SalesChannel.FBM }),
                );
            });
        }

        await Promise.all(createPromises);
    }

    async salesByChannel({
        startDate,
        endDate,
        sortDesc,
    }: FindAllSalesByChannelBackDto) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const monthsDiff =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        const groupBy =
            monthsDiff > 3
                ? {
                      _id: {
                          date: {
                              $week: '$date',
                          },
                          channel: '$channel',
                          saleDate: '$date',
                      },
                  }
                : {
                      _id: {
                          date: {
                              $dateToString: {
                                  format: '%Y-%m-%d',
                                  date: '$date',
                              },
                          },
                          channel: '$channel',
                          saleDate: '$date',
                      },
                  };

        //To collect all data of the las day
        const endDateMidnight = new Date(new Date(end).setHours(24, 0, 0, 0));
        const match = {
            date: {
                $gte: new Date(start),
                $lt: endDateMidnight,
            },
        };
        const pipeline: PipelineStage[] = [
            {
                $match: match,
            },
            {
                $group: {
                    ...groupBy,
                    sales: { $sum: { $toDouble: '$amount' } },
                    units: { $sum: '$units' },
                },
            },
            {
                $sort: {
                    '_id.date': sortDesc ? -1 : 1,
                    '_id.channel': sortDesc ? -1 : 1,
                },
            },
            {
                $addFields: {
                    groupedBy: monthsDiff > 3 ? 'week' : 'day',
                },
            },
            {
                $project: {
                    _id: 0,
                    channel: '$_id.channel',
                    date: '$_id.saleDate',
                    sales: 1,
                    units: 1,
                    groupedBy: 1,
                },
            },
        ];
        const sales = await this.model.aggregate(pipeline);

        if (!sales) {
            throw new Error('Sales not found');
        }

        return {
            results: sales,
        };
    }
}
