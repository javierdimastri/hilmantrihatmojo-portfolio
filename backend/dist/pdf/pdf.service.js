"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
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
let PdfService = class PdfService {
    async generatePdfBuffer() {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_table_1.default({
                margin: 20,
                size: 'A4',
                layout: 'landscape',
            });
            const buffers = [];
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
            const tableWidth = table.headers.reduce((sum, h) => sum + h.width, 0);
            doc.rect(20, 20, tableWidth, 95).fill(SMBC_GREEN);
            doc.fillColor('#FFFFFF');
            doc
                .font('Helvetica-Bold')
                .fontSize(16)
                .text('Next Review Date Report', 30, 30);
            doc
                .font('Helvetica')
                .fontSize(9)
                .text('Periodic review schedules — overdue tracking and status monitoring', 30, 50)
                .text('Generated: 22/07/2026', 30, 65)
                .text('Period: All records', 30, 78);
            doc.y = 115;
            doc.table(table, {
                prepareHeader: () => doc.font('Helvetica-Bold').fontSize(6).fillColor('#ffffff'),
                prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                    if (indexColumn === 0 &&
                        indexRow !== undefined &&
                        indexRow % 2 === 0 &&
                        rectRow) {
                        doc.addBackground(rectRow, '#E8F5E9', 1);
                    }
                    doc.font('Helvetica').fontSize(6).fillColor('#222222');
                    if (indexColumn === 8) {
                        const daysStr = row.days_to_overdue;
                        doc.font('Helvetica-Bold');
                        if (daysStr.startsWith('-')) {
                            doc.fillColor('#D32F2F');
                        }
                        else if (daysStr.startsWith('+')) {
                            doc.fillColor('#2E7D32');
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
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map