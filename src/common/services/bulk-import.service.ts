import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export interface BulkImportReport {
    total: number;
    success: number;
    errors: Array<{
        row: number;
        data: any;
        error: string;
    }>;
}

export abstract class BulkImportService<CreateDto extends object> {

    protected abstract getDtoClass(): new () => CreateDto;

    protected abstract createEntity(dto: CreateDto): Promise<any>;

    async createMany(file: Express.Multer.File) {
        const rows = this.extractRowsFromFile(file);
        const report = this.initializeReport(rows.length);

        for (const [index, row] of rows.entries()) {
            await this.processRow(row, index, report);
        }

        return this.buildResponse(report);
    }

    private extractRowsFromFile(file: Express.Multer.File): any[] {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];

        return XLSX.utils.sheet_to_json(sheet);
    }

    private initializeReport(total: number): BulkImportReport {
        return {
            total,
            success: 0,
            errors: [],
        };
    }

    private async processRow(row: any, index: number, report: BulkImportReport) {
        try {
            const dto = await this.buildValidDto(row);
            await this.createEntity(dto);
            report.success++;
        } catch (error) {
            this.appendError(report, index, row, error);
        }
    }

    private async buildValidDto(row: any): Promise<CreateDto> {
        const dto = plainToInstance(this.getDtoClass(), row);
        const validationErrors = await validate(dto);

        if (validationErrors.length > 0) {
            throw new Error(this.formatValidationErrors(validationErrors));
        }

        return dto;
    }

    private formatValidationErrors(errors: any[]): string {
        return errors
            .map(error =>
                Object.values(error.constraints || {}).join(', '),
            )
            .join('; ');
    }

    private appendError(report: BulkImportReport, index: number, row: any, error: any) {
        report.errors.push({
            row: index + 2,
            data: row,
            error: error?.message ?? 'Unknown error',
        });
    }

    private buildResponse(report: BulkImportReport) {
        return {
            message: 'Bulk import process completed',
            report,
        };
    }
}
