import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  /**
   * GET /excel/export
   *
   * Streams an Excel (.xlsx) file as a download.
   * The file is generated on-the-fly using ExcelJS with a sample employee
   * dataset — no temporary files are written to disk.
   */
  @Get('export')
  async exportExcel(@Res() res: Response): Promise<void> {
    const buffer = await this.excelService.generateExcelBuffer();

    const filename = `employees_${Date.now()}.xlsx`;

    res.set({
      // Standard MIME type for modern Office Open XML workbooks
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Forces the browser/client to download instead of render
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
      // Prevent caching so every request generates a fresh file
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });

    res.end(buffer);
  }
}
