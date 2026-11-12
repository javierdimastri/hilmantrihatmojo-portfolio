import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async generateExcelBuffer(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NestJS Excel API';
    workbook.created = new Date();
    workbook.modified = new Date();

    const sheet = workbook.addWorksheet('Annual_Data_Extraction_Report', {
      views: [{ state: 'frozen', ySplit: 3 }], // freeze Period row + header row
    });

    // ── Color palette (matching the screenshot) ──────────────────────────────
    const HEADER_BG   = 'FF1B4F72'; // dark teal / navy
    const HEADER_FG   = 'FFFFFFFF'; // white text
    const BORDER_COLOR = 'FFB0BEC5';
    const PERIOD_FG   = 'FF444444';

    // ── Column definitions ────────────────────────────────────────────────────
    // Each entry: { header (display text), key, width }
    const columns: { header: string; key: string; width: number }[] = [
      { header: 'Checklist ID',                        key: 'checklist_id',              width: 18 },
      { header: 'Customer Risk – Entity Type',         key: 'cr_entity_type',            width: 22 },
      { header: 'Customer Risk – PEP',                 key: 'cr_pep',                    width: 16 },
      { header: 'Customer Risk – Adverse News',        key: 'cr_adverse_news',           width: 22 },
      { header: 'Business Risk – Industry',            key: 'br_industry',               width: 28 },
      { header: 'Country Risk – Customer Country',     key: 'country_risk_customer',     width: 24 },
      { header: 'Country Risk – Location – BO Country',key: 'country_risk_location_bo',  width: 28 },
      { header: 'Country Risk – Nationality Country',  key: 'country_risk_nationality',  width: 24 },
      { header: 'Overall Risk Rating',                 key: 'overall_risk',              width: 18 },
      { header: 'Case Status',                         key: 'case_status',               width: 16 },
      { header: 'Assigned To',                         key: 'assigned_to',               width: 20 },
      { header: 'Created Date',                        key: 'created_date',              width: 16 },
    ];

    // Apply column widths
    sheet.columns = columns.map((c) => ({ key: c.key, width: c.width }));

    // ── Row 1: "Period: All records" label ───────────────────────────────────
    const periodRow = sheet.getRow(1);
    sheet.mergeCells(1, 1, 1, columns.length);
    const periodCell = sheet.getCell('A1');
    periodCell.value = 'Period: All records';
    periodCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: PERIOD_FG } };
    periodCell.alignment = { horizontal: 'left', vertical: 'middle' };
    periodCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
    periodRow.height = 20;

    // ── Row 2: empty spacer (matches screenshot gap) ─────────────────────────
    sheet.getRow(2).height = 4;

    // ── Row 3: Column headers ─────────────────────────────────────────────────
    const headerRow = sheet.getRow(3);
    headerRow.height = 48; // tall enough for 2-line wrap

    columns.forEach((col, colIndex) => {
      const cell = headerRow.getCell(colIndex + 1);
      cell.value = col.header;
      cell.font = {
        name: 'Arial',
        bold: true,
        size: 10,
        color: { argb: HEADER_FG },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: HEADER_BG },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = {
        top:    { style: 'thin', color: { argb: HEADER_BG } },
        left:   { style: 'thin', color: { argb: HEADER_BG } },
        bottom: { style: 'thin', color: { argb: HEADER_BG } },
        right:  { style: 'thin', color: { argb: HEADER_BG } },
      };
    });

    // ── Sample data matching the screenshot style ─────────────────────────────
    const records = [
      {
        checklist_id:             'CL-2026-HR0002',
        cr_entity_type:           '–',
        cr_pep:                   'Yes',
        cr_adverse_news:          'No',
        br_industry:              'Maritime Transport and Logistics',
        country_risk_customer:    'Canada',
        country_risk_location_bo: 'Canada',
        country_risk_nationality: 'Islamic Republic of Iran',
        overall_risk:             'High',
        case_status:              'In Review',
        assigned_to:              'John Doe',
        created_date:             new Date('2026-01-15'),
      },
      {
        checklist_id:             'CL-2026-HR0001',
        cr_entity_type:           '–',
        cr_pep:                   'No',
        cr_adverse_news:          'Yes',
        br_industry:              'Commodities and Agricultural Export',
        country_risk_customer:    'Australia',
        country_risk_location_bo: 'Belgium',
        country_risk_nationality: 'Russia',
        overall_risk:             'Medium',
        case_status:              'Pending',
        assigned_to:              'Jane Smith',
        created_date:             new Date('2026-01-10'),
      },
      {
        checklist_id:             'CL-2026-HR0003',
        cr_entity_type:           'Corporate',
        cr_pep:                   'No',
        cr_adverse_news:          'No',
        br_industry:              'Financial Services',
        country_risk_customer:    'United Kingdom',
        country_risk_location_bo: 'Luxembourg',
        country_risk_nationality: 'United Kingdom',
        overall_risk:             'Low',
        case_status:              'Approved',
        assigned_to:              'Alice Brown',
        created_date:             new Date('2026-02-03'),
      },
      {
        checklist_id:             'CL-2026-HR0004',
        cr_entity_type:           'Individual',
        cr_pep:                   'Yes',
        cr_adverse_news:          'Yes',
        br_industry:              'Real Estate',
        country_risk_customer:    'United Arab Emirates',
        country_risk_location_bo: 'Switzerland',
        country_risk_nationality: 'Pakistan',
        overall_risk:             'High',
        case_status:              'Escalated',
        assigned_to:              'Bob Wilson',
        created_date:             new Date('2026-02-14'),
      },
      {
        checklist_id:             'CL-2026-HR0005',
        cr_entity_type:           'Trust',
        cr_pep:                   'No',
        cr_adverse_news:          'No',
        br_industry:              'Mining and Natural Resources',
        country_risk_customer:    'South Africa',
        country_risk_location_bo: 'Netherlands',
        country_risk_nationality: 'South Africa',
        overall_risk:             'Medium',
        case_status:              'In Review',
        assigned_to:              'Carol Lee',
        created_date:             new Date('2026-03-01'),
      },
    ];

    // ── Render data rows (starting at row 4) ──────────────────────────────────
    records.forEach((record) => {
      const row = sheet.addRow({
        checklist_id:             record.checklist_id,
        cr_entity_type:           record.cr_entity_type,
        cr_pep:                   record.cr_pep,
        cr_adverse_news:          record.cr_adverse_news,
        br_industry:              record.br_industry,
        country_risk_customer:    record.country_risk_customer,
        country_risk_location_bo: record.country_risk_location_bo,
        country_risk_nationality: record.country_risk_nationality,
        overall_risk:             record.overall_risk,
        case_status:              record.case_status,
        assigned_to:              record.assigned_to,
        created_date:             record.created_date,
      });

      row.height = 36; // allow multi-line industry text to be visible

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: 'Arial', size: 10 };
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
        cell.border = {
          top:    { style: 'thin', color: { argb: BORDER_COLOR } },
          left:   { style: 'thin', color: { argb: BORDER_COLOR } },
          bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
          right:  { style: 'thin', color: { argb: BORDER_COLOR } },
        };

        // Colour-code Overall Risk
        if (colNumber === 9 /* overall_risk */) {
          const val = String(cell.value ?? '');
          if (val === 'High') {
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFCC0000' } };
          } else if (val === 'Medium') {
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFE65100' } };
          } else if (val === 'Low') {
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1A7F3C' } };
          }
        }

        // Format date column
        if (colNumber === 12 /* created_date */ && cell.value instanceof Date) {
          cell.numFmt = 'dd-mmm-yyyy';
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }

        // Center-align Yes/No/– columns
        if ([3, 4].includes(colNumber)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      });
    });

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}
