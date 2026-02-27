// xlsx se utiliza para leer y transformar archivos Excel (.xlsx) desde un buffer en memoria
import * as XLSX from 'xlsx';

// class-transformer convierte objetos planos en instancias reales de clases (DTO)
import { plainToInstance } from 'class-transformer';

// class-validator ejecuta las reglas de validación definidas en el DTO mediante decoradores
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

// Servicio base para importación masiva usando patrón Template Method
export abstract class BulkImportService<CreateDto extends object> {

    // Cada módulo define el DTO al que se mapearán las filas del Excel
    protected abstract getDtoClass(): new () => CreateDto;

    // Cada módulo implementa la lógica específica de persistencia
    protected abstract createEntity(dto: CreateDto): Promise<any>;

    async createMany(file: Express.Multer.File) {
        // Extrae las filas del Excel cargado en memoria
        const rows = this.extractRowsFromFile(file);

        // Inicializa la estructura de reporte
        const report = this.initializeReport(rows.length);

        // Procesa cada fila individualmente para aislar errores
        for (const [index, row] of rows.entries()) {
            await this.processRow(row, index, report);
        }

        return this.buildResponse(report);
    }

    private extractRowsFromFile(file: Express.Multer.File): any[] {
        // Lee el archivo Excel desde el buffer usando xlsx
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });

        // Obtiene el nombre de la primera hoja del archivo
        const firstSheetName = workbook.SheetNames[0];

        // Accede a la hoja seleccionada
        const sheet = workbook.Sheets[firstSheetName];

        // Convierte la hoja en un arreglo de objetos JSON (una fila por objeto)
        return XLSX.utils.sheet_to_json(sheet);
    }

    private initializeReport(total: number): BulkImportReport {
        // Crea el objeto base que acumula resultados del proceso
        return {
            total,
            success: 0,
            errors: [],
        };
    }

    private async processRow(row: any, index: number, report: BulkImportReport) {
        try {
            // Construye y valida el DTO antes de persistir
            const dto = await this.buildValidDto(row);

            // Ejecuta la lógica específica de creación definida por el módulo
            await this.createEntity(dto);

            report.success++;
        } catch (error) {
            // Registra el error sin detener el procesamiento completo
            this.appendError(report, index, row, error);
        }
    }

    private async buildValidDto(row: any): Promise<CreateDto> {
        // Transforma el objeto plano del Excel en una instancia tipada del DTO
        const dto = plainToInstance(this.getDtoClass(), row);

        // Ejecuta las validaciones declaradas con decoradores en el DTO
        const validationErrors = await validate(dto);

        // Si existen errores de validación, se formatean y se lanza excepción
        if (validationErrors.length > 0) {
            throw new Error(this.formatValidationErrors(validationErrors));
        }

        return dto;
    }

    private formatValidationErrors(errors: any[]): string {
        // Extrae y concatena los mensajes de error definidos en las constraints
        return errors
            .map(error =>
                Object.values(error.constraints || {}).join(', '),
            )
            .join('; ');
    }

    private appendError(report: BulkImportReport, index: number, row: any, error: any) {
        // Se suma 2 porque Excel inicia en fila 1 y la fila 1 suele ser encabezado
        report.errors.push({
            row: index + 2,
            data: row,
            error: error?.message ?? 'Unknown error',
        });
    }

    private buildResponse(report: BulkImportReport) {
        // Respuesta final estandarizada del proceso de importación
        return {
            message: 'Bulk import process completed',
            report,
        };
    }
}