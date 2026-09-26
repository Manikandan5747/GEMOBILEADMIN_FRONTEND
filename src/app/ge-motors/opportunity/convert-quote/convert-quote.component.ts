import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'src/app/service/cookie.service';
import Swal from 'sweetalert2';
import { QuotationService } from '../../quotation/quotation.service';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-convert-quote',
  templateUrl: './convert-quote.component.html',
  styleUrls: ['./convert-quote.component.css']
})
export class ConvertQuoteComponent implements OnInit {
  currentUser: any;
  formData = new FormData();
  accountname: any;
  firstname: any;
  opportunityname: any;
  stageList: any = [];
  quotename: any;
  opportunity_details: any = [];
  constructor(public quotationService: QuotationService, public dialogRef: MatDialogRef<ConvertQuoteComponent>, public opportunityService: OpportunityService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService,) {
  }

  async ngOnInit() {
    debugger
    this.accountname = this.data.accountname;
    this.firstname = this.data.contactfirstname;
    this.opportunityname = this.data.opportunityname;
    this.quotename = "QUOTE "+ this.data.opportunityname;;
    this.opportunity_details = this.data.opportunity_details;
    // opportunity_details && opportunity_details.forEach((element: any) => {
    //   const salesPrice = element.salesprice;
    //   const taxRate = 5; // 5% tax rate
    //   // Calculate tax amount
    //   const taxAmount = salesPrice * (taxRate / 100);
    //   // Update element properties
    //   element.discount = 0;
    //   element.taxamount = taxAmount;
    //   element.tax = taxRate;
    //   element.taxcode = 1;
    //   element.amount = taxAmount + salesPrice;
    // });

    let subtotal = 0;
    let totalTaxAmount = 0;
    if (this.opportunity_details.length > 0) {
      this.opportunity_details.forEach((element: any) => {
        const salesPrice = element.salesprice;
        const taxRate = 5; // 5% tax rate

        // Calculate tax amount
        const taxAmount = salesPrice * (taxRate / 100);

        // Update element properties
        element.discount = 0;
        element.taxamount = taxAmount;
        element.tax = taxRate;
        element.taxcode = 1;
        element.amount = taxAmount + salesPrice;

        // Accumulate subtotal and total tax amount
        subtotal += salesPrice;
        totalTaxAmount += taxAmount;
      });
    }


    // Calculate grand total
    const discount = 0;
    const grandTotal = subtotal + totalTaxAmount;

    // Output
    console.log("Subtotal:", subtotal);
    console.log("Tax:", totalTaxAmount);
    console.log("Discount:", discount);
    console.log("Grand Total:", grandTotal);
    this.data.subtotal = subtotal;
    this.data.tax = totalTaxAmount;
    this.data.discount = discount;
    this.data.grandtotal = grandTotal;
    

  }


  async submit() {
    let findnextRefno = await this.opportunityService.getfindnextRefno('QUOTATION').toPromise();
    console.log("quoterefno", findnextRefno.quoterefno);
    this.formData = new FormData();
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.data.userid = obj[0]?.login_id;
    this.data.quotename = this.quotename;
    this.data.expirydate = this.data.expectedclosedate;
    this.data.exchangerate =1;
    this.data.quoterefno = findnextRefno.quoterefno;
    for (let ele in this.data) {
      this.formData.append(ele, this.data[ele]);
    }

    this.opportunity_details && this.opportunity_details.forEach((item: any) => {
      item.productname = item.carshowroom_id;
      this.formData.append(`productDetails[]`, JSON.stringify(item));
    });

    this.quotationService.createquotation(this.formData).subscribe(
      async (response: any) => {
        console.log("response", response);
        if (response.success) {
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'success', });
          this.dialogRef.close('Success');
        } else {
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'info', });
        }

      });
  }






}
