export class PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        limit: number;
        offset: number;
    };
}
