import type { Response } from 'express';
import { ExcelService } from './excel.service';
export declare class ExcelController {
    private readonly excelService;
    constructor(excelService: ExcelService);
    exportExcel(res: Response): Promise<void>;
}
