import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, SortOrder, Types } from 'mongoose';
import { ProductDocument } from './products.entity';
import {
    CreateProductsBackDto,
    FindAllProductsBackDto,
    UpdateProductsBackDto,
} from 'src/backend/products-back/dto/products-back.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('products', 'pt-epinium')
        readonly model: Model<ProductDocument>,
    ) { }

    /**
     * Create fake data
     *
     * Function to delete all products and create 100 new products
     */
    async createFakeData() {
        await this.model.deleteMany({});
        const createPromises: Promise<any>[] = [];
        for (let i = 0; i < 100; i++) {
            createPromises.push(
                this.model.create({
                    EAN: (1234567890000 + i).toFixed(0),
                    name: `Test Product Name ${i}`,
                    description: 'Test Product Description',
                    price: Math.floor(Math.random() * 1000),
                    stock: Math.floor(Math.random() * 1000),
                }),
            );
        }
        await Promise.all(createPromises);
    }

    async findAll({
        itemsPerPage,
        page,
        search,
        sortBy,
        sortDesc,
        totalProductCount,
    }: FindAllProductsBackDto) {
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

        if (page < 1) page = 1;
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
            products: await products,
            total: await total,
        };
    }

    async findProductById(id: string) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        return this.model.findById(id);
    }

    async createProduct(product: CreateProductsBackDto) {
        return this.model.create(product);
    }

    async updateProduct(id: string, product: UpdateProductsBackDto) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        const updatedProduct = await this.model.findByIdAndUpdate(
            id,
            { $set: product },
            { runValidators: true }
        );

        if (!updatedProduct) {
            throw new Error('Product not updated');
        }

        return updatedProduct;
    }

    async deleteProduct(id: string) {
        if (!id) throw new Error('Id is required');
        if (!Types.ObjectId.isValid(id)) throw new Error('Id is not valid');

        const deletedProduct = await this.model.findOneAndDelete({ _id: id })

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
        // #TODO

        const match: FilterQuery<ProductDocument> = {};

        const pipeline: PipelineStage[] = [{ $match: match }];

        const products = this.model.aggregate(pipeline);
        const total = totalProductCount
            ? this.model.countDocuments(match)
            : undefined;

        return {
            products: await products,
            total: await total,
        };
    }
}
