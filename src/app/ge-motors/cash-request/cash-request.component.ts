import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import Swal from 'sweetalert2';
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { CashRequestService } from "./cash-request.service";
import { DataService } from "src/app/service/encryption/data.service";


@Component({
  selector: 'app-cash-request',
  templateUrl: './cash-request.component.html',
  styleUrls: ['./cash-request.component.css']
})
export class CashRequestComponent implements OnInit {

 
  formData = new FormData();
  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List:any=[];
  dynamicTableData!: any[];
  currentUser: any;
  userPrivilegeObj: any;
 
  constructor(public toastr: ToastrService,private customerService:CustomerService,  private dataService: DataService,private router: Router,private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog,public cashRequestService:CashRequestService) {
      this.getCurrentUserPrivilege(); }

  public displayedColumns: string[] = ['actions','cashrequesrefno','cashrequesttype','modeofpayment','requestdate','amount','purchasedoc','paymentstatus', 'createdby', 'createdat', 'modifiedby', 'modifiedat', ];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.getCashReq();
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.CashRequest)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCashReq() {
    this.loading = true;
    this.cashRequestService.getCashRequest().pipe()
      .subscribe((data: any) => {
        console.log("CashRequest", data);
        this.List = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }
  
  // public addRecord() {
  //   var navigationExtras = { queryParams: { isEdit:"ADD" }};
  //   this.router.navigate(['cash-request/create-cash-req'],navigationExtras);
  // }

  public addRecord(){
    let obj = {
      key: "app_cashrequest",
      value: { isEdit:"ADD" }
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('cash_storage_data_id', response.storage_data_id);
        this.router.navigate(['cash-request/create-cash-req']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public editRecord(items: any){
    let obj = {
      key: "app_cashrequest",
      value:  { isEdit:"EDIT",cashrequestid:items.cashrequestid }
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('cash_storage_data_id', response.storage_data_id);
        this.router.navigate(['cash-request/create-cash-req']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public viewRecord(items: any){
    let obj = {
      key: "app_cashrequest",
      value:  { isEdit:"VIEW",cashrequestid:items.cashrequestid }
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('cash_storage_data_id', response.storage_data_id);
        this.router.navigate(['cash-request/create-cash-req']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  clearSearch(){
    this.search ="";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   deleteRecord(element: any) {
      Swal.fire({
        title: 'Are You Sure You Want to Delete This Cash Request?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
           await this.cashRequestService.deleteCashRequestrecords(element).pipe()
            .subscribe((data: any) => {
              this.getCashReq();
            })
        }
      })
    }
  
}


