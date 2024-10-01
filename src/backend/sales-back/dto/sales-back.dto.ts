import { Sale } from '@api/sales/sales.entity';
import { FindAllDto } from '@backend/utils/dto/utils.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class FindAllSalesBackDto {
    page?: number;
    itemsPerPage?: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    search?: string;
    totalSalesCount?: boolean;
}
export class SalesFindAllDto extends FindAllDto<SalesDto> {
    results: SalesDto[];
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
