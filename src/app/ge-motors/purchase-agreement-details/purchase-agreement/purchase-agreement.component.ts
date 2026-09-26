import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { CommonConstants } from 'src/app/common/common.constant';
import { DateFormat } from 'src/app/common/ui.constant';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { SalesOrderService } from '../../sales-order/sales-order.service';
import Swal from 'sweetalert2'
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-purchase-agreement',
  templateUrl: './purchase-agreement.component.html',
  styleUrls: ['./purchase-agreement.component.css']
})
export class PurchaseAgreementComponent implements OnInit, OnDestroy {
  url: any = CommonConstants.WEBAPI_URL + "/";
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  showCarData: any;
  carshowroom_id: any;
  CommonConstants: any = CommonConstants.WEBAPI_URL;
  purchaseagreementrefno: any;
  currentuser: any;
  storage_data_id: any;
  parent_storage_data_id: any;
  settings: any;
  showroomSign: any;
  loading:boolean=false;
  constructor(private dataService: DataService, public customerService: CustomerService, private renderer: Renderer2, private route: ActivatedRoute, private el: ElementRef, public salesOrderService: SalesOrderService,private errorlogService: ErrorlogService) {


    this.storage_data_id = this.dataService.getData('pdf_storage_data_id');
    if (this.storage_data_id) {
      this.getRecord(this.storage_data_id);
    }

  }

  public getRecord(storage_data_id: any) {
    this.loading = true;
    this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        console.log("Retrieved data:", response);
        this.carshowroom_id = response?.data['carshowroom_id'];
        this.purchaseagreementrefno = response?.data['purchaseagreementrefno'];
        this.parent_storage_data_id = response?.data['parent_storage_data_id'];


        this.currentuser = await this.customerService.getCurrentUser();
        const header = new Headers();

        header.append('Content-Type', 'application/json');
        header.append('apiKey', 'a4db08b7-5729-4ba9-8c08-f2df493465a1');
        try {
          fetch(this.CommonConstants + `/api/purchaseDetailsShowrroomcarById/` + this.carshowroom_id, {
            method: 'GET',
            headers: header
          })
            .then(res => res.json())
            .then(data => {
              console.log("purchaseDetailsShowrroomcarById", data);
              this.showCarData = data;



              if(!this.showCarData.buyer_accountname){
                this.errorlogService.logManualValidationError(`purchase-agreement component|getRecord()|Seller Details Unavailable.`);
                Swal.fire({
                  title: "Seller Details Unavailable",
                  icon: 'error',
                  showCancelButton: false,
                  showConfirmButton: true,
                  confirmButtonColor: '#f89923',
                  cancelButtonColor: '#b1b1b1',
                  confirmButtonText: 'Ok'
                });
               }

              this.loading = false;
              // this.generatePDF()
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
    this.isCurrentUserAdministrator();
  }


  async isCurrentUserAdministrator() {
    this.currentuser = await this.customerService.getCurrentUser();
    this.settings = this.salesOrderService.findSettingsappsetcategory('GENERAL').toPromise();
    try {
      const settings = await this.settings;
      let isSettingUser = settings.find((setting: any) =>
        setting.appsetparameter == 'SHOWROOM_SIGNATURE' && setting.appsetparametervalue == "ABUDHABI"
      );
      this.showroomSign = isSettingUser.imagePathBase64 ? isSettingUser.imagePathBase64:'';
      console.log("isSettingUser", isSettingUser);

    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }

  // async generatePDF() {

  // let userid = this.currentuser && this.currentuser[0].login_id;
  // let obj = {
  //   "contracttype": "PURCHASE DETAILS",
  //   "userid": userid,
  //   "entityid": this.carshowroom_id
  // }
  // await this.customerService.createHistoryDocPrinted(obj).toPromise();

  //   const element = document.getElementById('contentToConvert');
  //   let options = {
  //     filename: this.purchaseagreementrefno+`_PURCHASE_AGREEMENT.pdf`,
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  //     html2canvas: { scale: 5, useCORS: true }
  //   };

  //   const images = element.querySelectorAll('img');
  //   const loadImages = Array.from(images).map((img: HTMLImageElement) => {
  //     return new Promise((resolve) => {
  //       if (img.complete) {
  //         resolve(true);
  //       } else {
  //         img.onload = () => resolve(true);
  //         img.onerror = () => resolve(false);
  //       }
  //     });
  //   });

  //   Promise.all(loadImages).then(() => {
  //     html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
  //       pdf.save();
  //     });
  //   });

  //   // html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
  //   //   // window.open(pdf.output('bloburl'), '_blank');
  //   //   // history.back();
  //   // }).save()

  // }


  async generatePDF() {
    this.loading = true;
    let userid = this.currentuser && this.currentuser[0].login_id;
    let obj = {
      "contracttype": "PURCHASE DETAILS",
      "userid": userid,
      "entityid": this.carshowroom_id
    }
    await this.customerService.createHistoryDocPrinted(obj).toPromise();


    const element = document.getElementById('contentToConvert');
    if (!element) {
      console.error('Element not found: #contentToConvert');
      return;
    }

    const options = {
      filename: this.purchaseagreementrefno + `_PURCHASE_AGREEMENT.pdf`,
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      html2canvas: {
        scale: 5,
        useCORS: true,
        allowTaint: true, // Allow cross-origin images
        logging: true, // Debug logs in the console
      },
    };

    // Preload all images
    const images = element.querySelectorAll('img');
    const loadImages = Array.from(images).map((img: HTMLImageElement) => {
      return new Promise<void>((resolve, reject) => {
        img.crossOrigin = 'anonymous'; // Ensure cross-origin loading
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => {
            console.error('Image failed to load:', img.src);
            reject(new Error(`Failed to load image: ${img.src}`));
          };
        }
      });
    });

    try {
      await Promise.all(loadImages); // Ensure all images are loaded

      html2pdf()
        .from(element)
        .set({
          ...options,
          onclone: (doc) => {
            // Ensure images are cloned correctly
            const clonedImages = doc.querySelectorAll('img');
            clonedImages.forEach((img) => {
              img.setAttribute('crossorigin', 'anonymous');
            });
          },
        })
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          pdf.save(this.purchaseagreementrefno + `_PURCHASE_AGREEMENT.pdf`);
          this.loading = false;
        });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }


  goback() {
    this.dataService.setData('storage_data_id', this.parent_storage_data_id);
    this.dataService.clearData('pdf_storage_data_id');
    history.back();
  }

  ngOnDestroy() {debugger

    this.dataService.setData('storage_data_id', this.parent_storage_data_id);
    this.dataService.clearData('pdf_storage_data_id');
  }

}
