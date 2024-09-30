import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, SortOrder, Types } from 'mongoose';
import { Product, ProductDocument } from './products.entity';
import {
    CreatedFakeProductsDataDto,
    CreateProductsBackDto,
    FindAllProductsBackDto,
    FindAllProductsDto,
    ProductDto,
    ProductWithSales30DaysDto,
    UpdateProductsBackDto,
} from 'src/backend/products-back/dto/products-back.dto';
import { idValidator } from '@api/utils/validators';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('products', 'pt-epinium')
        readonly model: Model<ProductDocument>,
    ) {}

    /**
     * Create fake data
     *
     * Function to delete all products and create 100 new products
     */
    async createFakeData(): Promise<CreatedFakeProductsDataDto> {
        await this.model.deleteMany({});
        const createModels: CreateProductsBackDto[] = [];
        for (let i = 0; i < 100; i++) {
            const model: CreateProductsBackDto = {
                EAN: (1234567890000 + i).toFixed(0),
                name: `Test Product Name ${i}`,
                description: 'Test Product Description',
                price: Math.floor(Math.random() * 1000),
                stock: Math.floor(Math.random() * 1000),
            };
            createModels.push(model);
        }
        try {
            const insert = await this.model.insertMany(createModels);
            return {
                total: insert.length,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failure to seed Products');
        }
    }

    async findAll({
        itemsPerPage,
        page,
        search,
        sortBy,
        sortDesc,
        totalProductCount,
    }: FindAllProductsBackDto): Promise<FindAllProductsDto> {
        const query: FilterQuery<ProductDocument> = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const sort: { [k: string]: SortOrder } = {};

        if (sortBy?.length && sortDesc?.length) {
            sortBy.forEach((v, i) => {
                sort[v] = sortDesc[i] ? -1 : 1;
            });
        }

        if (!page || page < 1) page = 1;
        if (itemsPerPage < 1) itemsPerPage = 10;

        const products = this.model.find(query, null, {
            sort,
            skip: +itemsPerPage * (+page - 1),
            limit: +itemsPerPage,
        });

        const total = totalProductCount
            ? this.model.countDocuments(query)
            : undefined;

        return {
            results: (await products) as any,
            total: await total,
        };
    }

    async findProductById(id: string) {
        idValidator(id);

        return this.model.findById(id);
    }

    async createProduct(product: CreateProductsBackDto): Promise<any> {
        try {
            return this.model.create(product);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateProduct(id: string, product: UpdateProductsBackDto) {
        idValidator(id);

        const updatedProduct = await this.model.findByIdAndUpdate(
            id,
            { $set: product },
            { runValidators: true },
        );

        if (!updatedProduct) {
            throw new Error('Product not updated');
        }

        return updatedProduct;
    }

    async deleteProduct(id: string) {
        idValidator(id);

        const deletedProduct = await this.model.findOneAndDelete({ _id: id });

        if (!deletedProduct) {
            throw new Error('Product not deleted');
        }

        return deletedProduct;
    }

    async productsWith30daysSales({
        itemsPerPage,
        page,
        search,
        sortBy,
        sortDesc,
        totalProductCount,
    }: FindAllProductsBackDto) {
        const match: FilterQuery<ProductDocument> = {};
        if (search) {
            match.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const sort: Record<string, 1 | -1> = {};

        if (sortBy?.length && sortDesc?.length) {
            sortBy.forEach((v, i) => {
                sort[v] = sortDesc[i] ? -1 : 1;
            });
        }
        if (itemsPerPage < 1) itemsPerPage = 10;

        const pipeline: PipelineStage[] = [
            { $match: match },
            { $sort: sort },
            { $skip: +itemsPerPage * (+page - 1) },
            { $limit: +itemsPerPage },
            {
                $lookup: {
                    from: 'sales',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'sales',
                },
            },
            {
                $addFields: {
                    sales: {
                        $filter: {
                            input: '$sales',
                            as: 'sale',
                            cond: {
                                $gte: [
                                    '$$sale.date',
                                    new Date(
                                        new Date().setDate(
                                            new Date().getDate() - 30,
                                        ),
                                    ),
                                ],
                            },
                        },
                    },
                    sales30: {
                        $size: '$sales',
                    },
                    units30: { $sum: '$sales.units' },
                },
            },
            {
                $project: {
                    EAN: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    stock: 1,
                    sales30: 1,
                    units30: 1,
                },
            },
        ];

        const products = await this.model.aggregate(pipeline);
        const total = totalProductCount ? products.length : undefined;

        return {
            results: products as ProductWithSales30DaysDto[],
            total: await total,
        };
    }
}
