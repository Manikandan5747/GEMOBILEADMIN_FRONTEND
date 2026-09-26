import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import { Workbook, Worksheet } from 'exceljs';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as logoFile from './export-excel-logo';
@Injectable({
    providedIn: 'root'
})
export class ExportToExcelService {

    constructor() { }

    public exportAsExcelFile(pdfTableHeader: any, json: any[], excelFileName: string, isHeader: string, excelHeader): void {
        if (isHeader === "noHeader") {
            // Existing code for exporting without header
        } else {
            let title = "GERMAN EXPERTS CAR MAINTENANCE  ";
            if (excelFileName === "SPECIAL_OFFER") {
                title = "GERMAN EXPERTS CAR MAINTENANCE \n ( SPECIAL OFFER UTILIZED REPORT )";
            }
            // Create a workbook with a worksheet
            let workbook = new Workbook();
            let worksheet: Worksheet;
            if (excelFileName === "SPECIAL_OFFER") {
                worksheet = workbook.addWorksheet('SPECIAL OFFER UTILIZED DATA');
            } else {
                worksheet = workbook.addWorksheet('Report Data');
            }

            // Add Title
            worksheet.mergeCells('B1', 'J4');
            let titleRow = worksheet.getCell('C1');
            titleRow.value = title;
            titleRow.font = {
                name: 'Calibri',
                size: 22,
                underline: 'none',
                bold: true,
                color: { argb: '000000' }
            }
            titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

            let subtitleRow = worksheet.getRow(5); // Assuming the subtitle will be in the fifth row
            worksheet.mergeCells('B5', 'J5'); // Merge cells for the subtitle
            subtitleRow.getCell('B').value = excelHeader; // Set the value in the first cell of the merged range
            subtitleRow.getCell('B').font = {
                name: 'Calibri',
                size: 16,
                underline: 'none',
                bold: true,
                color: { argb: '000000' }
            };
            subtitleRow.getCell('B').alignment = { vertical: 'top', horizontal: 'center' }; 

            // Add Date
            worksheet.mergeCells('K1:L4');
            let dateObj = new Date();
            let month = dateObj.getUTCMonth() + 1;
            let day = dateObj.getUTCDate();
            let year = dateObj.getUTCFullYear();
            let date = day + '-' + month + '-' + year;
            let dateCell = worksheet.getCell('K1');
            dateCell.value = date;
            dateCell.font = {
                name: 'Calibri',
                size: 12,
                bold: true
            }
            dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

            // Add Image
            let myLogoImage = workbook.addImage({
                base64: logoFile.logoBase64,
                extension: 'png',
            });
            worksheet.mergeCells('A1:A4');
            worksheet.addImage(myLogoImage, 'A1:A4');

            // Add Header Row
            let headerRow = worksheet.addRow(pdfTableHeader);
            headerRow.eachCell((cell, number) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '4167B8' },
                    bgColor: { argb: '' }
                }
                cell.font = {
                    bold: true,
                    color: { argb: 'FFFFFF' },
                    size: 12
                }
            })

            // Add Data Rows
            json.forEach((d: any) => {
                let row = worksheet.addRow(d);
            });

            worksheet.getColumn(3).width = 20;
            worksheet.addRow([]);

            // Generate & Save Excel File
            workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                FileSaver.saveAs(blob, title + '.xlsx');
            });
        }
    }

}
