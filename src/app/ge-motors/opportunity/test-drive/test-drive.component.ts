import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { OpportunityService } from '../opportunity.service';
import { DateFormat } from 'src/app/common/ui.constant';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';

@Component({
  selector: 'app-test-drive',
  templateUrl: './test-drive.component.html',
  styleUrls: ['./test-drive.component.css']
})
export class TestDriveComponent implements OnInit,OnDestroy {
  opportunityid: any;
  date: any;
  time: any;
  index: any;
  list: any;
  headerlist: any;
  DATE_FORMAT = DateFormat.DATE_ONLYFORMAT;
  currentDate: any = new Date();
  customer: any;
  carshowroom_id: any;
  hidefooter:boolean = false;
  currentuser: any;
  testdrive_id: any;
  storage_data_id: any;
  parent_storage_data_id: any;
  constructor(private router: Router,public customerService:CustomerService, private route: ActivatedRoute,private dataService: DataService, public opportunityService: OpportunityService) {

    this.storage_data_id = this.dataService.getData('pdf_storage_data_id');
    if(this.storage_data_id){
      this.getRecord(this.storage_data_id);
    }

    // this.route.queryParams.subscribe(params => {
    //   this.opportunityid = params['opportunityid'];
    //   this.date = params['date'];
    //   this.time = params['time'];
    //   this.index = params['index'];
    //   this.customer = params['customer'];
    //   this.carshowroom_id = params['carshowroom_id'];
    //   this.testdrive_id = params['testdrive_id'];
    // })
  }

  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.opportunityid = response?.data?.opportunityid;
        this.date = new Date(response?.data['date']);
        this.date.setDate(this.date.getDate() + 0);
        this.time = response?.data['time'];
        this.index = response?.data['index'];
        this.customer = response?.data['customer'];
        this.carshowroom_id = response?.data['carshowroom_id'];
        this.testdrive_id = response?.data['testdrive_id'];

       this.parent_storage_data_id = response?.data['storage_data_id']; 
        this.testDrive();
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  async testDrive() {
    debugger
    await this.opportunityService.getByIdOpportunity(this.opportunityid).pipe()
      .subscribe(async (data: any) => {
        this.headerlist = data && data[0];
        console.log("this.list", data[0].opportunity_details);
        this.list = data[0] && data[0].opportunity_details.find((ele: any) => ele.carshowroom_id == this.carshowroom_id)
        console.log("this.list", this.list);
        // this.generatePDF()
      });
  }

  async ngOnInit(): Promise<void> {
    this.currentuser = await this.customerService.getCurrentUser();
  }

  async generatePDF() {
     let userid = this.currentuser && this.currentuser[0].login_id;
    let obj = {
      "contracttype": "TEST DRIVE",
      "userid": userid,
      "entityid":this.testdrive_id
    }
     await this.customerService.createHistoryDocPrinted(obj).toPromise();
    this.hidefooter = true;
    const element = document.getElementById('contentToConvert');
    let options = {
      filename: this.list?.chasisno+"_TEST_DRIVE.pdf",
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      html2canvas: { scale: 5, useCORS: true }
    };

    html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
      // window.open(pdf.output('bloburl'), '_blank');
    }).save();

    setTimeout(() => {
      this.hidefooter = false
    }, 100);
  }

  goback() {
    history.back();
  }

  
   formatTime(value: string | Date): string {
    let date: Date;

    if (typeof value === 'string') {
        // If value is a string in HH:MM:SS format
        const [hours, minutes, seconds] = value.split(':').map(Number);

        // Create a Date object with a specific date but the provided time
        date = new Date(1970, 0, 1, hours, minutes, seconds);
    } else {
        // If value is already a Date object
        date = value;
    }

    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero if necessary

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

ngOnDestroy() {

  
  this.dataService.setData('storage_data_id', this.parent_storage_data_id);
  this.dataService.clearData('pdf_storage_data_id');
}



}
