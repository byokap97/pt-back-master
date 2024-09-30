import { Sale } from '@api/sales/sales.entity';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class FindAllSalesBackDto {
    page?: number;
    itemsPerPage?: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    search?: string;
    totalSalesCount?: boolean;
}

export class FindAllSalesDto {
    sales: SalesDto[];
    total?: number;
}

export class DeleteByIdDto {
    id: string;
}

export class CreatedFakeSalesDataDto {
    total: number;
}



export class CreateSalesBackDto {
    amount: Sale['amount'];
    units: Sale['units'];
    channel: Sale['channel'];
    date: Sale['date'];
    product: string;
}


export class UpdateSalesBackDto extends PartialType(CreateSalesBackDto) {}

export class SalesByChannelBackDto {
    startDate: Date;
    endDate: Date;
    sortDesc?: boolean[];
}

export class SalesByChannelDto {
    channel: string;
    date: Date;
    sales: number;
    units: number;
    groupedBy: 'day' | 'week';
}

export class SalesDto extends PartialType(OmitType(Sale, ['_id'])) {
    createdAt?: string;
    updatedAt?: string;
    id: string;
}
