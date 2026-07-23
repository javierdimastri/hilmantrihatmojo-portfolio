import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  /**
   * GET /pdf/export
   *
   * Streams a PDF file as a download.
   * The document is generated on-the-fly using pdfmake with the same
   * risk-checklist dataset as the Excel export — no temp files written.
   */
  @Get('export')
  async exportPdf(@Res() res: Response): Promise<void> {
    const buffer = await this.pdfService.generatePdfBuffer();
    const filename = `data_extraction_report_${Date.now()}.pdf`;

    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length':      buffer.length,
      'Cache-Control':       'no-cache, no-store, must-revalidate',
      Pragma:                'no-cache',
      Expires:               '0',
    });

    res.end(buffer);
  }
}
