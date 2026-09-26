import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DownloadPdfService {

  constructor() { }

  
  
    // https://stackoverflow.com/questions/54629163/angular-7-convert-html-to-pdf
    public convertHTMLtoPDF(pdfContent:any, fileName:any) {

      return new Promise((resolve, reject) => {

      const doc = new jsPDF();
   
      // const specialElementHandlers = {
      //    '#editor': function (element, renderer) {
      //     return true;
      //     }
      // };
   
      // const pdfContent = this.pdfContent.nativeElement;
   
      console.log("pdfContent ", pdfContent);
      // doc.fromHTML(content.innerHTML, 15, 15, {
      //    width: 190,
      //   'elementHandlers': specialElementHandlers
      // });
  
      // Use html2canvas to apply CSS settings
    //   html2canvas(pdfContent).then(function (canvas)
    //   {
    //     var img = canvas.toDataURL("image/png");
    //     var doc = new jsPDF();
    //     doc.addImage(img, 'JPEG', 20, 20);
    //     doc.save('demo.pdf');
    // });
  
    html2canvas(pdfContent).then((canvas) => {
  
      // https://github.com/MrRio/jsPDF/issues/476
      var imgData = canvas.toDataURL('image/jpeg');
  
      var doc : any;
  
      if(canvas.width > canvas.height){
        doc = new jsPDF('l', 'mm', [canvas.width, canvas.height]);
        }
        else{
        doc = new jsPDF('p', 'mm', [canvas.height, canvas.width]);
        }
  
        doc.addImage(imgData, 'JPEG', 20, 20, canvas.width, canvas.height);
        doc.setFontSize(10);
  
      // var img = canvas.toDataURL("image/PNG");
      // // var doc = new jsPDF('l', 'mm', 'a4', 1);
      // console.log("image ",img);
      // var doc = new jsPDF();
      // // Add image Canvas to PDF
      // const bufferX = 5;
      // const bufferY = 5;
      // const imgProps = (<any>doc).getImageProperties(img);
      // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      // // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
  
      // doc.addImage(img, 'JPEG', 20, 20);
  //     var imgData = canvas.toDataURL('image/png');
  //     console.log("canvas ", canvas);
  // var imgWidth = 210; 
  // var pageHeight = 295;  
  // // var imgHeight = canvas.height * imgWidth / canvas.width;
  // var imgHeight = pageHeight;
  // var heightLeft = canvas.height;
  // var doc = new jsPDF('p', 'mm');
  // var position = 10; // give some top padding to first page
  
  // // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  // doc.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
  // heightLeft -= pageHeight;
  
  // while (heightLeft >= 0) {
  //   // position += heightLeft - imgHeight; // top padding for other pages
  //   position += heightLeft - imgHeight;
  //   doc.addPage();
  //   // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //   doc.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
  //   heightLeft -= pageHeight;
  // }
  // doc.save( 'file.pdf');
      return doc;
    }).then((doc) => {
      let pdfFile = doc.output('blob');
      debugger;
      console.log("pdf file : ",pdfFile);
      doc.save(fileName);  
      // doc.save(testName+"_"+formatDate(new Date(), 'dd-MMM-yyyy', 'en')+'.pdf');  
      resolve(pdfFile);
    }).catch(err => {
      reject(err);
    });
  
      // doc.fromHTML(pdfContent, 15, 15,{
      //               width: 190,
      //               'elementHandlers': specialElementHandlers
      //             }, function(){
      //             doc.save('demo.pdf');
      //           });
  
  
                // var pdf = new jsPDF('l', 'pt', 'letter');
                // pdf.addHTML(pdfContent, 15, 15, {},
                //   function () {
                //     var iframe = document.createElement('iframe');
                //     iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
                //     content.appendChild(iframe);
                //     iframe.src = pdf.output('datauristring');
                // });          
   
      // doc.save('demo.pdf');
    })
   }

  //  https://stackoverflow.com/questions/54959522/angular-7-download-incoming-file-from-server
   public downloadFileFromData(fileName: string, contentType: string, fileData: any, dataType: string){
    //  console.log("fileData : ",fileData);
    let blobData : any;
    if(dataType && dataType == 'Buffer'){
      // Buffer type file
      blobData = new Uint8Array(fileData);
    }else{
      // Base64 file
      blobData = this.base64ToByteArray(fileData);
    }
    //  https://www.pdftron.com/documentation/web/guides/basics/open/arraybuffer/
    // Convert Array buffer to Blob
    const a = document.createElement('a');
    const file = new Blob([blobData], { type: contentType});
    console.log("file : ", file);
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
   }

   //https://stackoverflow.com/questions/48378592/download-image-as-file-in-typescript
   public base64ToByteArray(base64Data:any){
    let byteCharacters = atob(base64Data);

    let byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    let byteArray = new Uint8Array(byteNumbers);
    return byteArray;
   }

}
