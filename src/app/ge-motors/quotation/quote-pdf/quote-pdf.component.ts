import { Component, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { CommonConstants } from 'src/app/common/common.constant';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';


@Component({
  selector: 'app-quote-pdf',
  templateUrl: './quote-pdf.component.html',
  styleUrls: ['./quote-pdf.component.css']
})

export class QuotePdfComponent implements OnInit,OnDestroy {
  quotationData: any; // Define quotationData property
  cars: any
  CommonConstants: any = CommonConstants.WEBAPI_URL;
  carTableHtml: any = ''
  lastIndex: any = 0
  otherPageHtml: any = ''
  otherCarTableHtml: any = ''
  tableFooterHtml: any = ''

  pageNum: any = 1
  quoteid: any;
  hideheader: boolean = true;
  currentuser: any;
  storage_data_id: any;

  constructor(private router: Router, private renderer: Renderer2,private customerService: CustomerService,private dataService: DataService, private route: ActivatedRoute, private el: ElementRef) {
    // this.route.queryParams.subscribe(params => {
    //   this.quoteid = params['quoteid'];
    // })

    this.storage_data_id = this.dataService.getData('storage_data_id');
    if(this.storage_data_id){
      this.getRecord(this.storage_data_id);
    }
    
  }

  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        console.log("Retrieved data:", response);
        this.quoteid = response?.data['quoteid'];

        this.currentuser = await this.customerService.getCurrentUser();
        const header = new Headers();
    
        header.append('Content-Type', 'application/json');
        header.append('apiKey', 'a4db08b7-5729-4ba9-8c08-f2df493465a1');
        try {
          fetch(this.CommonConstants + `/api/ge_motors/listAllQuotationDetails/` + this.quoteid, {
            method: 'GET',
            headers: header
          })
            .then(res => res.json())
            .then(data => {
              console.log("data[0]", data[0]);
              this.quotationData = data[0]
    
              this.cars = data[0] && data[0].quotation_details ? data[0].quotation_details : [];
    
    
              console.log('cars', this.cars);
    
              this.populateTableAlt()
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.log(error);
        }
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  async ngOnInit(): Promise<void> {

  
  }

  populateTableAlt() {

    this.otherCarTableHtml = ''

    const carTableOut = this.el.nativeElement.querySelector('.pdf-car-table-out')

    for (let i = this.lastIndex; i < this.cars.length; i++) {

      this.otherCarTableHtml += `
      <tr>
          <td><p class="pdf-page-break">${i + 1}</p></td>
          <td>
              <p class="pdf-page-break">${this.cars[i].brandname}-${this.cars[i].modelname}</p>
              <img class="pdf-page-break" crossorigin="*" src='${this.cars[i].carimgs ? this.cars[i].carimgs[0] : './assets/car.png'}' alt="">
          </td>
          <td class="pdf-description">
            <p><span class="pdf-t-ita">Chassis no</span>: ${this.cars[i].chasisno == null ? "-" : this.cars[i].chasisno}</p>
            <p><span class="pdf-t-ita">Color</span>: ${this.cars[i].carcolor == null ? "-" : this.cars[i].carcolor}</p>
            <p><span class="pdf-t-ita">Mileage</span>: ${this.cars[i].mileage == null ? "-" : this.cars[i].mileage}</p>
            <p><span class="pdf-t-ita">Year</span>: ${this.cars[i].modelyear == null ? "-" : this.cars[i].modelyear}</p>
          </td>
          <td><p class="pdf-page-break">1</p></td>
          <td><p class="pdf-page-break">${this.cars[i].salesprice}</p></td>
         
          <td><p class="pdf-page-break">${this.cars[i].amount}</p></td>
      </tr>  
      `

      this.renderer.setProperty(carTableOut, 'innerHTML', this.otherCarTableHtml)

    }

    // <td><p class="pdf-page-break">${this.cars[i].taxamount}</p></td>
    // <td><p class="pdf-page-break">${this.cars[i].discount == null ? "-":this.cars[i].discount}</p></td>

    // <td class="pdf-description">${this.extractSentences(this.cars[i].description)}</td>

    // setTimeout(()=>{                       
    //   this.generatePDF();
    // }, 1000);


  }


  async generatePDF() {

    let userid = this.currentuser && this.currentuser[0].login_id;
    let obj = {
      "contracttype": "QUOTATION",
      "userid": userid,
      "entityid": this.quoteid
    }
    await this.customerService.createHistoryDocPrinted(obj).toPromise();

    this.hideheader = false;
    const element = document.getElementById('contentToConvert');
    const carTableOut = this.el.nativeElement.querySelector('.pdf-car-table-out')

    let options = {
      filename: this.quotationData?.quoterefno + ".pdf",
      margin: [0.7, 0, 1.4, 0],
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      html2canvas: { scale: 5, useCORS: true }
    };

    html2pdf().from(element).set(options).toPdf().get('pdf').then(function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const imageWidth = pageWidth - 0.65;

        pdf.addImage('../../../../assets/assets/footerTemplate.png', 'JPEG', 0.3, 10.5, imageWidth, 0); // x y w h

        if (i == 1) {
          pdf.setPage(i)
          pdf.addImage('../../../../assets/assets/GeMotorsblack.png', 'JPEG', 0.3, 0.3, 1.5, 0); // x y w h
          pdf.setFontSize(18);
          pdf.setFont(undefined, 'bold');
          pdf.text(`Quotation`, 3.5, 0.5); //y x
        }

        if (i > 1) {
          pdf.setPage(i)
          pdf.addImage('../../../../assets/assets/tableTitle_1.png', 'JPEG', 0.3, 0.1, imageWidth, 0); // x y w h
        }

        pdf.setFontSize(12)
        // pdf.setFont(undefined,'bold');
        pdf.setTextColor(48, 48, 48);
        pdf.text(`${i}`, 7.53, 11.37);
      }

      if (carTableOut.offsetHeight <= 690) {
        console.log(carTableOut.offsetHeight);
        pdf.deletePage(2)
      }

      
      // window.open(pdf.output('bloburl'), '_blank');
      // this.router.navigate(['quotation'])
    }).save()
   
    // html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
    //   window.open(pdf.output('bloburl'), '_blank');
    //   // this.rt.navigateByUrl('');
    // })

    setTimeout(() => {
      this.hideheader = true;
    }, 100);



  }

  extractSentences(stringData) {
    // Split the JSON data into lines
    const lines = stringData && stringData.split('\n');

    // Initialize an empty string to store the extracted sentences
    let result = '';

    // Iterate over each line
    lines && lines.forEach(line => {
      // Remove leading and trailing whitespaces
      line = line.trim();

      // Check if the line is not empty
      if (line !== '') {
        // Extract the sentence before \n and add it to the result string
        const sentence = line.split('\\n')[0];
        result += `<p class="pdf-page-break" style="margin: 0;" >${sentence}</p>`;
      }
    });

    // Return the extracted sentences string
    return result;
  }

  goback() {
    history.back();
  }

  ngOnDestroy() {
    this.dataService.clearData('storage_data_id');
  }

}

