import { Component, OnInit,ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { CommonConstants } from 'src/app/common/common.constant';
import { DateFormat } from 'src/app/common/ui.constant';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { SalesOrderService } from '../../sales-order/sales-order.service';

@Component({
  selector: 'app-consignment-pdf',
  templateUrl: './consignment-pdf.component.html',
  styleUrls: ['./consignment-pdf.component.css']
})
export class ConsignmentPdfComponent implements OnInit,OnDestroy {
  consignmentid:any;
  consignmentData:any=[];
  CommonConstants:any = CommonConstants.WEBAPI_URL;
  DATE_FORMAT = DateFormat.DATE_ONLYFORMAT;
  currentuser: any;
  storage_data_id: any;

  contractId: any;
  settings: any;
  loading:boolean=false;
  showroomSign: any;
  is_pdfgenerating:boolean=true;

  constructor(private salesOrderService: SalesOrderService,private customerService: CustomerService,private route: ActivatedRoute,private dataService: DataService, private el: ElementRef) { 


      // Get the ID from the route parameter
      this.contractId = this.route.snapshot.paramMap.get('id');
      if(this.contractId){
        this.consignmentid = this.contractId
        this.gerInfo();
        console.log('Contract ID:', this.contractId);
      }else{
        this.storage_data_id = this.dataService.getData('pdf_storage_data_id');
        if(this.storage_data_id){
          this.getRecord(this.storage_data_id);
        }
      }  
  }


  public getRecord(storage_data_id: any) {  this.loading = true;
    this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        console.log("Retrieved data:", response);
        this.consignmentid = response?.data['consignmentid'];
         this.gerInfo();
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });  this.loading = false;
  }

  async gerInfo(){  this.loading = true;
    this.currentuser = await this.customerService.getCurrentUser();
    const header = new Headers();
   
    header.append('Content-Type', 'application/json');
    header.append('apiKey', 'a4db08b7-5729-4ba9-8c08-f2df493465a1');
    try {
        fetch(this.CommonConstants+`/api/ge_motors/consignment/`+this.consignmentid, {
          method: 'GET',
          headers: header
        })
        .then(res => res.json())
        .then(data => {
          console.log("consignmentData",data);
          this.consignmentData = data;

          // this.generatePDF()
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }  this.loading = false;
  }

  goback() {
    history.back();
  }

  async ngOnInit(): Promise<void> {
    if(!this.contractId){
      this.isCurrentUserAdministrator();
    }
   
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

  //   let userid = this.currentuser && this.currentuser[0].login_id;
  //   let obj = {
  //     "contracttype": "CONSIGNMENT",
  //     "userid": userid,
  //     "entityid":this.consignmentid
  //   }
  //    await this.customerService.createHistoryDocPrinted(obj).toPromise();
     
  //   const element = document.getElementById('contentToConvert');
  //   let options = {
  //     filename: this.consignmentData.consignmentrefno+`.pdf`,
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  //     html2canvas: { scale: 5, useCORS: true }
  //   };


  //   html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
  //     // window.open(pdf.output('bloburl'), '_blank');
  //     // this.rt.navigateByUrl('');
  //     // history.back();
  //     // this.router.navigate(['car-details/consignment']);
  //   }).save()

  // }


  async generatePDF() {
    this.loading = true;
    this.is_pdfgenerating =false
   let userid = this.currentuser && this.currentuser[0].login_id;
    let obj = {
      "contracttype": "CONSIGNMENT",
      "userid": userid,
      "entityid":this.consignmentid
    }
     await this.customerService.createHistoryDocPrinted(obj).toPromise();


    const element = document.getElementById('contentToConvert');
    if (!element) {
      console.error('Element not found: #contentToConvert');
      return;
    }

    const options = {
      filename: this.consignmentData.consignmentrefno+`.pdf`,
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
          pdf.save(this.consignmentData.consignmentrefno+`.pdf`);
          this.loading = false;
          this.is_pdfgenerating = true;
        });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }


  ngOnDestroy() {
    this.dataService.clearData('pdf_storage_data_id');
  }

}
