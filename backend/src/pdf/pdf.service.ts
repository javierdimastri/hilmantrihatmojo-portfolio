/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit-table';

const RECORDS = [
  {
    checklist_id: 'BES-2026-DUMMY',
    version: 'v1',
    customer_name: 'PT DUMMY DATA HIGH RISK',
    department: 'Corporate Banking',
    cif_no: '–',
    rm_ro_code: 'RM-0042',
    rm_ro_name: 'BUDI SANTOSO',
    next_review_date: '10-07-2026',
    days_to_overdue: '-13d',
    company_type: 'PERUSAHAAN ASING - FOREIGN COMPANY',
    status_new_checklist: '–',
    stage_new_checklist: '–',
    rework: 'Y',
    review_to: '–',
    risk_rating: 'High',
  },
  {
    checklist_id: 'CL-2026-HR0001',
    version: 'v0',
    customer_name: 'APEX TRADING GROUP PT',
    department: 'Corporate Trade Finance',
    cif_no: 'CIF2600001',
    rm_ro_code: '–',
    rm_ro_name: 'RM John Doe',
    next_review_date: '16-07-2027',
    days_to_overdue: '+364d',
    company_type: '–',
    status_new_checklist: '–',
    stage_new_checklist: '–',
    rework: 'N',
    review_to: '–',
    risk_rating: 'High',
  },
  {
    checklist_id: 'CL-2026-HR0002',
    version: 'v0',
    customer_name: 'GLOBAL SHIPPING SYSTEMS',
    department: 'Commercial Shipping',
    cif_no: 'CIF2600002',
    rm_ro_code: '–',
    rm_ro_name: 'RM Sarah Connor',
    next_review_date: '16-07-2027',
    days_to_overdue: '+364d',
    company_type: '–',
    status_new_checklist: '–',
    stage_new_checklist: '–',
    rework: 'N',
    review_to: '–',
    risk_rating: 'High',
  },
  {
    checklist_id: 'BES-2026-LOWRISK',
    version: 'v0',
    customer_name: 'PT MAJU BERSAMA SEJAHTERA',
    department: 'Corporate Banking',
    cif_no: 'CIF00000089',
    rm_ro_code: 'RM-2026-0088',
    rm_ro_name: 'Budi Santoso',
    next_review_date: '30-06-2029',
    days_to_overdue: '+1073d',
    company_type: 'PERUSAHAAN TERBATAS - LIMITED LIABILITY COMPANY',
    status_new_checklist: 'Pending',
    stage_new_checklist: 'KYCProgress',
    rework: 'N',
    review_to: 'CL-2026-4ZCDFW',
    risk_rating: 'Low',
  },
];

@Injectable()
export class PdfService {
  async generatePdfBuffer(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Landscape A4, adjust margins to fit everything
      const doc = new PDFDocument({
        margin: 20,
        size: 'A4',
        layout: 'landscape',
      });
      const buffers: Buffer[] = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const SMBC_GREEN = '#004B36';

      const table = {
        headers: [
          {
            label: 'Checklist ID',
            property: 'checklist_id',
            width: 65,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Ver.',
            property: 'version',
            width: 15,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Customer Name',
            property: 'customer_name',
            width: 90,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Department',
            property: 'department',
            width: 70,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'CIF No.',
            property: 'cif_no',
            width: 45,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'RM/RO Code',
            property: 'rm_ro_code',
            width: 45,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'RM/RO Name',
            property: 'rm_ro_name',
            width: 55,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Next Review Date',
            property: 'next_review_date',
            width: 55,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Days to Overdue',
            property: 'days_to_overdue',
            width: 55,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Company Type',
            property: 'company_type',
            width: 100,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Status of New Checklist',
            property: 'status_new_checklist',
            width: 45,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Stage of New Checklist',
            property: 'stage_new_checklist',
            width: 45,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Rework',
            property: 'rework',
            width: 25,
            align: 'center',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Review To',
            property: 'review_to',
            width: 55,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
          {
            label: 'Risk Rating',
            property: 'risk_rating',
            width: 35,
            align: 'left',
            headerColor: SMBC_GREEN,
            headerOpacity: 1,
          },
        ],
        datas: RECORDS.map((r) => ({ ...r })),
      };

      // Ensure the header box is exactly the width of the table
      const tableWidth = table.headers.reduce((sum, h) => sum + h.width, 0);

      // ── Header Box ────────────────────────────────────────────────────────
      // Draw a dark green box across the top (from y=20 to y=115) to seamlessly blend with table headers
      doc.rect(20, 20, tableWidth, 95).fill(SMBC_GREEN);

      doc.fillColor('#FFFFFF');
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Next Review Date Report', 30, 30);

      doc
        .font('Helvetica')
        .fontSize(9)
        .text(
          'Periodic review schedules — overdue tracking and status monitoring',
          30,
          50,
        )
        .text('Generated: 22/07/2026', 30, 65)
        .text('Period: All records', 30, 78);

      // Explicitly set Y coordinate so the table connects perfectly to the header box
      doc.y = 115;

      doc.table(table, {
        prepareHeader: () =>
          doc.font('Helvetica-Bold').fontSize(6).fillColor('#ffffff'),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          // 1) Draw the background rectangle using pdfkit-table's built-in addBackground which safely manages graphics state
          if (
            indexColumn === 0 &&
            indexRow !== undefined &&
            indexRow % 2 === 0 &&
            rectRow
          ) {
            doc.addBackground(rectRow, '#E8F5E9', 1); // strictly use addBackground to prevent layout shifting
          }

          // 2) Set font and fill color for the text
          doc.font('Helvetica').fontSize(6).fillColor('#222222');

          // 3) Handle specific coloring for days_to_overdue (index 8)
          if (indexColumn === 8) {
            const daysStr = (row as any).days_to_overdue as string;
            doc.font('Helvetica-Bold');
            if (daysStr.startsWith('-')) {
              doc.fillColor('#D32F2F'); // red
            } else if (daysStr.startsWith('+')) {
              doc.fillColor('#2E7D32'); // green
            }
          }
        },
        padding: 4,
        minRowHeight: 18,
        divider: {
          header: { disabled: true },
          horizontal: { disabled: true },
        },
      });

      doc.end();
    });
  }
}
