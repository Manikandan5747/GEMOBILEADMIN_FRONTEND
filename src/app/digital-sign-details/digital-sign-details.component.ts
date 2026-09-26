import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MobileotpService } from "src/app/service/mobileotp/mobileotp.service";
const moment = require('moment');
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { OnDestroy } from '@angular/core';
import { Observable, Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-digital-sign-details',
  templateUrl: './digital-sign-details.component.html',
  styleUrls: ['./digital-sign-details.component.css']
})
export class DigitalSignDetailsComponent implements OnInit {



  webArr = [];
 
  subscription!: Subscription;
  everyFiveSecond: Observable<number> = timer(2 * 60 * 1000);
  refershDurationEnabled: boolean = true;
  private ngUnsubscribe = new Subject();
  
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List: any;
  dynamicTableData!: any[];
  startTime: any;
  endTime: any;
  loadTime:any
  search:any;
  isDisabled = true; 
  constructor(public toastr: ToastrService, private otpService: MobileotpService, private cookieService: CookieService,
    public dialog: MatDialog,) { }

  public displayedColumns: string[] = [ 'customer_code','contract_number', 'contract_type_name','customer_signature_img','crm_module_ref_num','acceptance_of_tc','status', 'created_by', 'created_at','actions'];
  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    debugger
    this.toastr.clear();
    this.getList()
    this.everyTwoMins();
  }
 
  ngOnDestroy() {
    // Unsubscribe from the observable
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
    // Every 2 mins, this script will run
    everyTwoMins() {
      this.subscription = this.everyFiveSecond.pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(() => {
        this.getList();
      });
    }

  async getList() {
    this.loading = true;
   await this.otpService.listdigitalsignaturedetails().pipe()
      .subscribe((data: any) => {
        console.log("listdigitalsignaturedetails ", data);
        this.List = data;
        this.loadRecord();
      });
  }

  ViewPDF(ele:any){
    var pdf_url = ele.contract_with_pdf_url;
    window.open(pdf_url, '_blank');
    // this.otpService.ViewPDF(ele).pipe()
    // .subscribe((data: any) => {
    //   console.log("ViewPDF ", data);
   
    // });
  }

  loadRecord() {
    debugger
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => this.dataSource.sort = this.sort);
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  clearSearch(){
    this.search ="";
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  async GenerateSignedPDF(ele:any){
    Swal.fire({
      title: 'Generate PDF',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Generate'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // this.loading = true;
    await this.otpService.getAccessToken().pipe().subscribe(async (data: any) => {
      console.log('data getAccessToken 1:', data);
      var accessToken = data && data[0].crm_accesstoken;
      var postData = {
        TId: ele.crm_module_ref_num,
        accessToken: accessToken,
        customer_signature_img: ele.customer_signature_img,
        digital_signature_id: ele.digital_signature_id,
        tc_id: ele.contract_type_id
      }
      await this.otpService.GenerateSignedPDF(postData).pipe()
        .subscribe((data: any) => {
          console.log("GenerateSignedPDF ", data);
          this.loading = false;
         this.ngOnInit();
        });
    
    });
      }
    });
  }


  async GenerateSignedPDF2(ele:any){
    Swal.fire({
      title: 'Generate PDF',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Generate'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // this.loading = true;
    await this.otpService.getAccessToken().pipe().subscribe(async (data: any) => {
      console.log('data getAccessToken 1:', data);
      var accessToken = data && data[0].crm_accesstoken;
      var postData = {
        TId: ele.crm_module_ref_num,
        accessToken: accessToken,
        customer_signature_img: ele.customer_signature_img,
        digital_signature_id: ele.digital_signature_id,
        tc_id: ele.contract_type_id,
        contract_with_pdf_url:ele.pdfpath.split('/').pop().replace('.pdf', '')
      }
      await this.otpService.GenerateSignedPDF2(postData).pipe()
        .subscribe((data: any) => {
          console.log("GenerateSignedPDF ", data);
          this.loading = false;
         this.ngOnInit();
        });
    
    });
      }
    });
  }

   formatDateOnly(dateString) {
    const date = new Date(dateString);
    const currDay = String(date.getDate()).padStart(2, '0');
    const currMonth = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const currYear = date.getFullYear();
  
    return `${currDay}-${currMonth}-${currYear}`;
  }
  

  async  processRecordsInBatches(webArr, batchSize = 1) {
    for (let i = 0; i < webArr.length; i += batchSize) {
      const batch = webArr.slice(i, i + batchSize); // Take a slice of the array for the current batch
  
      const promises = batch.map((ele) => {
        const accessToken = "pWJV5qpmOL^q5wgc06W5jQ1Hcpc*^TLKLKgQiiFB8CJh33Y71LtAc4R4rfqAT*OZ!n.sVxPpo6BNfDfQ*1jOhN^Swd2cBOvw2cUvABwTYZPpX3BJ5TMh39AziPUOmiMAbirpx7YAREON^Vf8WEeZr68lbrZhIJLzl^sNCRFj1ft5n7zMe4phSVqDeJ0dNDObuWUFnGXxXffW9JN9is2^Ll*Kr7FoXGL7tjROS6g1rwlZFc=!n.4YqR4u*t6O*FbYy8HwYlL7BY74jiIpK4PHKRoJhh9QY=!n"; // Set access token if needed
        const postData = {
          TId: ele.crm_module_ref_num,
          accessToken: accessToken,
          customer_signature_img: ele.customer_signature_img,
          digital_signature_id: ele.digital_signature_id,
          tc_id: ele.contract_type_id,
          contract_with_pdf_url: ele.pdfpath.split('/').pop().replace('.pdf', ''),
          created_at:this.formatDateOnly(ele.created_at)
        };
  
        // Wrap API call in a promise to handle async/await properly
        return new Promise((resolve, reject) => {
          this.otpService.GenerateSignedPDF2(postData)
            .pipe()
            .subscribe(
              (response) => {
                console.log("GenerateSignedPDF Success:", response);
                resolve(response);
              },
              (error) => {
                console.error("GenerateSignedPDF Error:", error);
                reject(error);
              }
            );
        });
      });
  
      // Await all promises in the batch to complete before moving to the next batch
      try {
        const results = await Promise.all(promises);
        console.log("Batch processed:", results);
      } catch (error) {
        console.error("Error in batch:", error);
      }
    }
  }
  

  apicall(){
    this.processRecordsInBatches(this.webArr, 1); // Processes 5 requests at a time
  }
  


}
