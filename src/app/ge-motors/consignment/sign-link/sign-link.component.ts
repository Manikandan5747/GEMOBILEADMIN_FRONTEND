import { Component, OnInit, Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { ConsignmentService } from '../../consignment/consignment.service';
const CryptoJS = require('crypto-js');


@Component({
  selector: 'app-sign-link',
  templateUrl: './sign-link.component.html',
  styleUrls: ['./sign-link.component.css']
})
export class SignLinkComponent implements OnInit {

  isShowErrors: boolean = false;
  buyerSignLink: string = '';
  sellerSignLink: string = '';
  buyerSignPath: boolean = false;  // Assume buyer signed
  sellerSignPath: boolean = false; // Assume seller not signed
  consignmentrefno: any;
  seller_email: any;
  buyer_email: any;
  seller_accountname: any;
  buyer_accountname: any;
  status: any;

  constructor(public dialogRef: MatDialogRef<SignLinkComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public consignmentService: ConsignmentService,) { }

  ngOnInit() {debugger
    this.consignmentrefno = this.data.consignmentrefno;

    this.status = this.data.status;
    this.buyerSignPath = this.data.buyer_sign_path ? true : false;
    this.sellerSignPath = this.data.seller_sign_path ? true : false;

    this.buyer_email = this.data?.buyer_email;
    this.seller_email = this.data?.seller_email;

    this.seller_accountname = this.data?.seller_accountname;
    this.buyer_accountname = this.data?.accountname;
  }

  copyToClipboard(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Copied to clipboard", icon: 'success', });
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  copyLink(type: string) {
    let url = "";
    if (type == "Buyer Link") {
      // url = `https://geapps.germanexperts.ae/AgreementSignlink/#/buyer-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid +  `&MqFWwTcUGx9EQ=54` + ``
    } else {
      url = `https://geapps.germanexperts.ae/AgreementSignlink/#/seller-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid + `&MqFWwTcUGx9EQ=56` + ``
    }
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: type + " Copied to clipboard", icon: 'success', });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  }


  // //local
  // copyLink(type: string) {
  //   let url = "";
  //   if (type == "Buyer Link") {
  //     // url = `http://localhost:50000/#/buyer-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid +  `&MqFWwTcUGx9EQ=54` + ``
  //   } else {
  //     url = `http://localhost:50000/#/seller-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid + `&MqFWwTcUGx9EQ=56` + ``
  //   }
  //   if (url) {
  //     navigator.clipboard.writeText(url).then(() => {
  //       Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: type + " Copied to clipboard", icon: 'success', });
  //     }).catch(err => {
  //       console.error('Failed to copy: ', err);
  //     });
  //   }
  // }


  encryptString(plainText: string | number): string {
    if (plainText === null || plainText === undefined) {
      console.error('Invalid input: Null or undefined cannot be encrypted');
      return '';
    }

    const textToEncrypt = plainText.toString();  // Convert number to string
    const encryptionKey = 'a4db08b7-5729-4ba9-8c08-f2df493465a1';
    try {
      const encryptedData = CryptoJS.AES.encrypt(textToEncrypt, encryptionKey).toString();
      return encryptedData;
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }


  sendmail(email: string, name: string, type: string) {
    let url = "";
    if (type == "Buyer Link") {
      // url = `https://geapps.germanexperts.ae/AgreementSignlink/#/buyer-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid +  `&MqFWwTcUGx9EQ=54` + ``
    } else {
      url = `https://geapps.germanexperts.ae/AgreementSignlink/#/seller-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid + `&MqFWwTcUGx9EQ=56` + ``
    }
    // if (type == "Buyer Link") {
    //   // url = `http://localhost:50000/#/buyer-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid +  `&MqFWwTcUGx9EQ=54` + ``
    // } else {
    //   url = `http://localhost:50000/#/seller-signature-link?oJhKHCPV=CAFxnqwg&IVzQu=` + this.data?.consignmentid + `&MqFWwTcUGx9EQ=56` + ``
    // }

    var obj = {
      subject: "Action Required: Please Sign the Consignment Agreement - " + this.consignmentrefno,
      content: `
      Dear ` + name + `,<br/><br/>
      The Consignment agreement is ready for your review. Please click the link below to open the document and provide your signature:
      <br/><br/>
      <a href="` + url + `" target="_blank" class="btn btn-sm">Click Here to Sign</a>
      <br/><br/>
      If you have any questions, please feel free to contact us.
      <br/><br/>
      Best regards,<br/>
      GE Motors
      `,
      //  tomail: "durga.s@germanexperts.ae"
      tomail: email
    };

    this.consignmentService.sendMailtoUser(obj).subscribe(
      async (response: any) => {
        console.log("response", response);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'success', });
      });
  }

}

