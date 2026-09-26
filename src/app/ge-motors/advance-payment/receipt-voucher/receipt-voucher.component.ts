import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { AdvanceService } from '../advance.service';
import { DateFormat } from 'src/app/common/ui.constant';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';

@Component({
  selector: 'app-receipt-voucher',
  templateUrl: './receipt-voucher.component.html',
  styleUrls: ['./receipt-voucher.component.css']
})
export class ReceiptVoucherComponent implements OnInit,OnDestroy {
  advanceid: any;
  advanceList: any;
  carprice:any;
  newbalance!: number;
  DATE_FORMAT = DateFormat.DATE_ONLYFORMAT;
  hidefooter:boolean = false
  currentuser: any;
  storage_data_id: any;
  amountdue:any;
  constructor(private router: Router,private route: ActivatedRoute, public customerService:CustomerService,private dataService: DataService,
    public advanceService:AdvanceService) { 

      this.storage_data_id = this.dataService.getData('pdf_storage_data_id');
      if(this.storage_data_id){
        this.getRecord(this.storage_data_id);
      }


  }


  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.advanceid = response?.data['advanceid'];
      this.carprice = response?.data['carprice'];

      this.getadvancedetails();
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }


  async ngOnInit(): Promise<void> {
    this.currentuser = await this.customerService.getCurrentUser();
   
   
  }

  goback() {
    history.back();
  }

  // getadvancedetails() {
  //   this.advanceService.getAdvanceById(this.advanceid).pipe()
  //     .subscribe((data: any) => {
  //       console.log("getadvancedetails ", data);
  //       this.advanceList = data;
  //       let carprice = Number(this.carprice);
  //       let advanceamount = Number(this.advanceList.advanceamount);
  //       this.newbalance = carprice - advanceamount;
  //       // this.generatePDF();
  //     });
  // }

    getadvancedetails() {
    this.advanceService.getAdvanceById(this.advanceid).subscribe({
      next: (data: any) => {
        this.advanceList = data;
        this.carprice = this.advanceList['carprice'];
        const carprice = Number(this.carprice || 0);
        const previousadvanceamount =
          Number(this.advanceList?.previousadvanceamount || 0);

        const totaladvanceamount =
          Number(this.advanceList?.totaladvanceamount || 0);

        // Amount Due BEFORE current payment
        this.amountdue = carprice - previousadvanceamount;

        // Balance AFTER current payment
        this.newbalance = carprice - totaladvanceamount;
      },
      error: (err) => {
        console.error("Error getting advance details:", err);
      }
    });
  }

  async generatePDF() {

    let userid = this.currentuser && this.currentuser[0].login_id;
    let obj = {
      "contracttype": "ADVANCE PAYMENT",
      "userid": userid,
      "entityid":this.advanceid
    }
     await this.customerService.createHistoryDocPrinted(obj).toPromise();
    this.hidefooter = true;
    const element = document.getElementById('contentToConvert');
    let options = {
      filename: this.advanceList?.advancerefno +".pdf",
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      html2canvas: { scale: 5, useCORS: true }
    };

    html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
      // window.open(pdf.output('bloburl'), '_blank');
      // history.back();
    }).save()

    setTimeout(() => {
      this.hidefooter = false
    }, 100);
  }

  ngOnDestroy() {
    this.dataService.clearData('pdf_storage_data_id');
  }
}
