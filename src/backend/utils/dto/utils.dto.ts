export class DeleteByIdDto {
    message: string;
}

export class TotalCollectionAffectedDto {
    total: number;
}

export class FindAllDto<T> {
    results: T[];
    total?: number;

    constructor(results: T[], total?: number) {
        this.results = results;
        this.total = total;
    }
}

export class ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
}
