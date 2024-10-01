import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { SalesChannel, SalesDocument } from './sales.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { ProductDocument } from '@api/products/products.entity';
import { idValidator } from '@api/utils/validators';
import {
    CreateSalesBackDto,
    FindAllSalesBackDto,
    SalesFindAllDto,
    SalesDto,
    UpdateSalesBackDto,
    SalesByChannelBackDto,
    SalesByChannelDto,
} from '@backend/sales-back/dto/sales-back.dto';
import {
    DeleteByIdDto,
    TotalCollectionAffectedDto,
} from '@backend/utils/dto/utils.dto';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel('sales', 'pt-epinium')
        readonly model: Model<SalesDocument>,
        @InjectModel('products', 'pt-epinium')
        readonly productsModel: Model<ProductDocument>,
    ) {}

    async create(sale: CreateSalesBackDto): Promise<any> {
        idValidator(sale.product);
        try {
            return await this.model.create(sale);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findAll({
        itemsPerPage,
        page,
        search,
        sortBy,
        sortDesc,
        totalSalesCount,
    }: FindAllSalesBackDto): Promise<SalesFindAllDto> {
        const query: FilterQuery<SalesDocument> = {};

        if (search) {
            query.$or = [{ channel: { $regex: search, $options: 'i' } }];
        }

        const sort: { [k: string]: 1 | -1 } = {};

        if (sortBy?.length && sortDesc?.length) {
            sortBy.forEach((v, i) => {
                sort[v] = sortDesc[i] ? -1 : 1;
            });
        }

        if (!page || page < 1) page = 1;
        if (itemsPerPage < 1) itemsPerPage = 10;

        const pipeline: PipelineStage[] = [
            { $match: query },
            { $skip: +itemsPerPage * (+page - 1) },
            { $limit: +itemsPerPage },
            {
                $project: {
                    amount: 1,
                    units: 1,
                    channel: 1,
                    product: 1,
                    date: 1,
                    _id: 0,
                    id: '$_id',
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ];
        if (Object.keys(sort).length) {
            pipeline.push({
                $sort: sort,
            });
        }
        let totalSales;
        try {
            if (totalSalesCount) {
                totalSales = await this.model.countDocuments(query);
            }
            const result = await this.model.aggregate(pipeline);

            return {
                results: result || [],
                total: totalSalesCount ? totalSales : undefined,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failure to search');
        }
    }

    async findById(id: string): Promise<SalesDto> {
        idValidator(id);
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw new InternalServerErrorException('Failure to search');
        }
    }

    async updateSale(
        id: string,
        updateSalesBackDto: UpdateSalesBackDto,
    ): Promise<any> {
        idValidator(id);
        try {
            const updateSale = await this.model.findByIdAndUpdate(
                id,
                { $set: updateSalesBackDto },
                { runValidators: true, new: true },
            );

            if (!updateSale) {
                throw new BadRequestException('Sale not updated');
            }

            return updateSale;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async deleteSale(id: string): Promise<DeleteByIdDto> {
        idValidator(id);

        try {
            const deletedSale = await this.model.findOneAndDelete({ _id: id });

            if (!deletedSale) {
                throw new NotFoundException('Sale not deleted');
            }

            return { message: 'Sale deleted' };
        } catch (error) {
            throw new InternalServerErrorException('Failure deleting object');
        }
    }

    async createFakeData(): Promise<TotalCollectionAffectedDto> {
        await this.model.deleteMany({});
        const createModels: CreateSalesBackDto[] = [];

        const products = await this.productsModel.find({});

        const today = new Date();

        for (let d = 0; d < 90; ++d) {
            products.forEach((product) => {
                const date = new Date(
                    new Date(today).setDate(today.getDate() - d),
                );
                const model: CreateSalesBackDto = {
                    units: Math.floor(Math.random() * (10 - 1 + 1) + 1),
                    product: product['_id'].toString(),
                    amount: Math.floor(Math.random() * (100 - 1 + 1) + 1),
                    date: date,
                    channel: SalesChannel.FBA,
                };
                createModels.push(model, {
                    ...model,
                    channel: SalesChannel.FBM,
                });
            });
        }

        try {
            const insert = await this.model.insertMany(createModels);
            return {
                total: insert.length,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failure to seed sales');
        }
    }

    async salesByChannel({
        startDate,
        endDate,
        sortDesc,
    }: SalesByChannelBackDto): Promise<SalesByChannelDto[]> {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException(`Is a valid date`);
        }
        const monthsDiff =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

        const groupBy =
            monthsDiff > 3
                ? {
                      _id: {
                          year: { $year: '$date' },
                          week: { $week: '$date' },
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

        const endDateMidnight = new Date(
            new Date(end).setHours(23, 59, 59, 999),
        );
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
                    sales: { $sum: '$amount' },
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
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$_id.saleDate',
                        },
                    },
                    sales: 1,
                    units: 1,
                    groupedBy: 1,
                },
            },
        ];
        try {
            const sales = await this.model.aggregate(pipeline);

            if (!sales) {
                throw new NotFoundException('Sales not found');
            }

            return sales as SalesByChannelDto[];
        } catch (error) {
            throw new InternalServerErrorException('Failure to find sales');
        }
    }
}
