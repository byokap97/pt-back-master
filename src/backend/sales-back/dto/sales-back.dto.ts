import { Sale } from '@api/sales/sales.entity';
import { PartialType } from '@nestjs/swagger';

export class FindAllSalesBackDto {
    page?: number;
    itemsPerPage?: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    search?: string;
    totalSalesCount?: boolean;
}

export class FindAllSalesByChannelBackDto {
    startDate: Date;
    endDate: Date;
    sortDesc?: boolean[];
}

export class CreateSalesBackDto {
    amount: Sale['amount'];
    units: Sale['units'];
    channel: Sale['channel'];
    product: Sale['product'];
}

export class UpdateSalesBackDto extends PartialType(CreateSalesBackDto) {}

export class SalesByChannelDTO {
    channel: string;
    date: Date;
    sales: number;
    units: number;
    groupedBy: 'day' | 'week';
}
