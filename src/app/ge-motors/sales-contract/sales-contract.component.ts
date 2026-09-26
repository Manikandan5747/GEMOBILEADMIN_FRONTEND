import { Component, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { CommonConstants } from 'src/app/common/common.constant';
import { DateFormat } from 'src/app/common/ui.constant';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';
import Swal from 'sweetalert2';
import { SalesOrderService } from '../sales-order/sales-order.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-sales-contract',
  templateUrl: './sales-contract.component.html',
  styleUrls: ['./sales-contract.component.css']
})
export class SalesContractComponent implements OnInit, OnDestroy {

  salescontractData: any = [];
  salesorderid: any;
  CommonConstants: any = CommonConstants.WEBAPI_URL;
  date: any = new Date();
  DATE_FORMAT = DateFormat.DATE_ONLYFORMAT;
  currentuser: any;
  storage_data_id: any;
  contractId: any;
  settings: any;
  showroomSign: any;
  loading: boolean = false;
  is_pdfgenerating: boolean = true;
  constructor(private router: Router, private dataService: DataService, private route: ActivatedRoute, private customerService: CustomerService, private salesOrderService: SalesOrderService, private errorlogService: ErrorlogService) {


    // Get the ID from the route parameter
    this.contractId = this.route.snapshot.paramMap.get('id');
    if (this.contractId) {
      this.salesorderid = this.contractId
      this.gerInfo();
      console.log('Contract ID:', this.contractId);
    } else {
      this.storage_data_id = this.dataService.getData('pdf_storage_data_id');
      if (this.storage_data_id) {
        this.getRecord(this.storage_data_id);
      }
    }




  }


  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        console.log("Retrieved data:", response);
        this.salesorderid = response?.data['salesorderid'];
        this.gerInfo();
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }


  async gerInfo() {
    this.loading = true;
    this.currentuser = await this.customerService.getCurrentUser();
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('apiKey', 'a4db08b7-5729-4ba9-8c08-f2df493465a1');
    try {
      fetch(`./assets/data.json`, {
        method: 'GET',
        headers: header
      })
      fetch(this.CommonConstants + `/api/ge_motors/listAllSalesContractDetails/` + this.salesorderid, {
        method: 'GET',
        headers: header
      })
        .then(res => res.json())
        .then(data => {
          console.log("data,", data);
          this.salescontractData = data;
          //  let carownertypeid  = this.salescontractData.salesorder_details && this.salescontractData.salesorder_details[0] && this.salescontractData.salesorder_details[0].carownertypeid;
          let sellerInfo = this.salescontractData?.seller_accountname;
          //  let carshowroom_id  = this.salescontractData.salesorder_details && this.salescontractData.salesorder_details[0] && this.salescontractData.salesorder_details[0].carshowroom_id;
          //  this.salescontractData?.carshowroom_id;


          // if(!this.salescontractData.buyer_sign_path_base64){
          //   Swal.fire({
          //     title: "Buyer Sign Unavailable",
          //     icon: 'error',
          //     showCancelButton: false,
          //     showConfirmButton: true,
          //     confirmButtonColor: '#f89923',
          //     cancelButtonColor: '#b1b1b1',
          //     confirmButtonText: 'Ok'
          //   });
          //  }


          if (!sellerInfo) {

            this.errorlogService.logManualValidationError(`sales-contract component|gerInfo()|Seller Details For The Showroom Car Are Currently Unavailable`);
            Swal.fire({
              title: "Seller Details For The Showroom Car Are Currently Unavailable.",
              // text: 'Thank you for signing our contract',
              icon: 'error',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#f89923',
              cancelButtonColor: '#b1b1b1',
              confirmButtonText: 'Ok'
            });

            // history.back()

            // this.editRecord(carshowroom_id);
            // Swal.fire({
            //    toast: true,
            //    position: 'center',
            //    showConfirmButton: false,
            //    timer: 5000,
            //    title: "Check Your Account details Seller details are missing.",
            //    icon: 'info'
            //  });
          }
          // this.generatePDF()
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }


  async ngOnInit(): Promise<void> {
    if (!this.contractId) {
      this.isCurrentUserAdministrator();
    }
  }

  // async generatePDF() {

  //   let userid = this.currentuser && this.currentuser[0].login_id;
  //   let obj = {
  //     "contracttype": "SALES CONTRACT",
  //     "userid": userid,
  //     "entityid":this.salesorderid
  //   }
  //    await this.customerService.createHistoryDocPrinted(obj).toPromise();

  //   const element = document.getElementById('contentToConvert');
  //   let options = {
  //     filename: this.salescontractData && this.salescontractData?.salesorderrefno +"_SALES_CONTRACT.pdf",
  //     // filename: `SALES_CONTRACT.pdf`,
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  //     html2canvas: { scale: 5, useCORS: true }
  //   };


  //   html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
  //     // window.open(pdf.output('bloburl'), '_blank');
  //     // history.back();
  //     // this.router.navigate(['sales-order']);
  //   }).save()

  // }


  async generatePDF() {
    this.loading = true;
    this.is_pdfgenerating = false;
    let userid = this.currentuser && this.currentuser[0].login_id;
    let obj = {
      "contracttype": "SALES CONTRACT",
      "userid": userid,
      "entityid": this.salesorderid
    }
    await this.customerService.createHistoryDocPrinted(obj).toPromise();

    const element = document.getElementById('contentToConvert');
    if (!element) {
      console.error('Element not found: #contentToConvert');
      return;
    }

    const options = {
      filename: this.salescontractData && this.salescontractData?.salesorderrefno + "_SALES_CONTRACT.pdf",
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
          pdf.save(this.salescontractData && this.salescontractData?.salesorderrefno + "_SALES_CONTRACT.pdf");
          this.loading = false;
          this.is_pdfgenerating = true;
        });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }



  goback() {
    history.back();
  }

  ngOnDestroy() {
    this.dataService.clearData('pdf_storage_data_id');
  }

  public editRecord(carshowroom_id: any) {
    let obj = {
      key: "app_cardetails",
      value: { carshowroom_id: carshowroom_id, }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(["car-details/add-edit-car"]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  async isCurrentUserAdministrator() {
    this.currentuser = await this.customerService.getCurrentUser();
    this.settings = this.salesOrderService.findSettingsappsetcategory('GENERAL').toPromise();
    try {
      const settings = await this.settings;
      let isSettingUser = settings.find((setting: any) =>
        setting.appsetparameter == 'SHOWROOM_SIGNATURE' && setting.appsetparametervalue == "ABUDHABI"
      );
      this.showroomSign = isSettingUser.imagePathBase64 ? isSettingUser.imagePathBase64 : '';
      console.log("isSettingUser", isSettingUser);

    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }

}
