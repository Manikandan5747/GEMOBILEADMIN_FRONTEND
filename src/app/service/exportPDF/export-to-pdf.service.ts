import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
// import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PDF_EXTENSION = '.pdf';

@Injectable({
  providedIn: 'root'
})
export class ExportToPDFService {



  constructor() { }

  exportPdf(tableHeader: string[], tableBody: [], fileName: string, mapAttributes: Map<string, string>, heading: string, subHeading: string, userName: string) {

    let pipe = new DatePipe('en-IN');
    const now = Date.now();
    const myFormattedDate = pipe.transform(now, 'medium');
    var prepare: any = [];
    tableBody.forEach(e => {
      var tempObj: any = [];
      Object.entries(e).forEach(([key, value]) => tempObj.push(value));
      prepare.push(tempObj);
    });


    // Modify the prepare array to replace status values with "Active" or "Inactive"



    // console.log("prepare", prepare);
    const doc = new jsPDF('l', 'mm', [450, 315]);
    // const doc = new jsPDF('l', 'mm', [500, 400]);
    let x = 0;
    let y = 30;



    var totalPagesExp = "{total_pages_count_string}";

    let headX = 150;
    let headY = 20;
    let tableY = 40;

    autoTable(doc, {
      // html: tableContent,
      // console.log("test");
      headStyles: { fontSize: 10 },
      // headStyles: { fontSize: 10, fillColor: [63, 81, 181] },
      bodyStyles: { fontSize: 8 },
      theme: "striped", //striped grid
      head: [tableHeader],
      body: prepare,
      margin: { left: 10, top: y + 10 },  // First page table top margin
      styles: { overflow: "linebreak", },
      // columnStyles: { email: { columnWidth: "wrap" } },
      didDrawPage: function (data) {
        // Header
        data.settings.margin.top = tableY; // Identify second page table top margin
        doc.setFontSize(12);
        doc.setTextColor(40);
        //  doc.setFontStyle('bold');
        // if (base64Img) {
        //   doc.addImage(base64Img, 'JPEG', data.settings.margin.left, 15, 10, 10);
        // }
        doc.addImage("../../../assets/images/GE_logo.png", "JPG", data.settings.margin.left, 10, 20, 20);
        // doc.addImage("../../../assets/images/logo.png", "JPEG", data.settings.margin.left, 10, 20, 20);
        // doc.text("Report", data.settings.margin.left + 15, 20);
        doc.text("DATE PRINTED: " + myFormattedDate, 350, 20);
        doc.text("USER PRINTED: " + userName, 350, 28);


        if (heading) {
          doc.setFontSize(22).setFont("", 'bold');
          //  doc.setFontStyle('bold');
          doc.text(heading.toUpperCase(), headX, headY);
        }

        if (subHeading) {
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          const subHeadingWidth = doc.getStringUnitWidth(subHeading) * 20 / doc.internal.scaleFactor; // 20 is the font size
          const subHeadingX = (doc.internal.pageSize.width - subHeadingWidth) / 2;
          doc.text(subHeading.toUpperCase(), subHeadingX, headY + 10);
        }

        // Footer
        var str;
        for (let i = 1; i < doc.internal.pages.length; i++) {
          str = "Page " + i
        }

        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save(fileName + PDF_EXTENSION);
  }


}
