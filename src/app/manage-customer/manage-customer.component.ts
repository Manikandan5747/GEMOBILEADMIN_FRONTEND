import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddCustomerComponent } from "./add-customer/add-customer.component";
import { EditCustomerComponent } from "./edit-customer/edit-customer.component";
import { CustomerService } from "src/app/service/customer/customer.service";
const moment = require('moment');
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "../common/ui.constant";
import { ModuleIdList } from "src/app/common/enum";
import { OnDestroy } from '@angular/core';
import { Observable, Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DesTextAreaComponent } from "./des-text-area/des-text-area.component";
import { ErrorlogService } from "../errorlog.service";


@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.css']
})
export class ManageCustomerComponent implements OnInit {
  subscription!: Subscription;
  everyFiveSecond: Observable<number> = timer(2 * 60 * 1000);
  private ngUnsubscribe = new Subject();

  loading: boolean = false;
  customer_status: any;
  block_status: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  personList: any;
  dynamicTableData!: any[];
  user: any;
  code: any;
  homePageRedirection: string = "";
  userrole: any;
  displayedColumns: string[] = [];
  displayedLabelColumns: string[] = [];
  startTime: any;
  endTime: any;
  userPrivilegeObj: any;
  customertypes: any;
  homeRedirectioncusttype: any;
  totalItemCount: any;
  search: any;
  constructor(public toastr: ToastrService, private customerService: CustomerService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog, private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege();
    this.customer_status = "";
    this.block_status = "";
    this.route.queryParams.subscribe(params => {
      this.homePageRedirection = params['homePageRedirection'];
      this.homeRedirectioncusttype = params['customertypes'];

    });
  }


  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
    var currentUser = JSON.parse(this.cookieService.getCookie('geMobileAdminCurrentUser') || '{}');
    // console.log("currentUser",currentUser[0].userrole);
    this.userrole = currentUser && currentUser[0].userrole ? currentUser[0].userrole : "";

    if (this.userrole == "AuditUser") {
      this.displayedColumns = ['username', 'customertypes', 'customername', 'mobilenumber', 'emailid', 'password', 'customercode', 'customerstatus', 'nationalityname', 'created_at', 'created_by', 'modified_at', 'modified_by', 'block_status', 'status', 'fcmtoken'];
      this.displayedLabelColumns = ['customer name', 'customer mobile number', 'email', 'Mobile password', 'customer code', 'customer status', 'nationality', 'created Date', 'created By', 'updated Date', 'updated By', 'status', 'fcmtoken'];
    } else {
      this.displayedColumns = ['actions', 'username', 'customertypes', 'customername', 'mobilenumber', 'emailid', 'password', 'customercode', 'customerstatus', 'nationalityname', 'created_at', 'created_by', 'modified_at', 'modified_by', 'block_status', 'status', 'fcmtoken',];
      this.displayedLabelColumns = ['Action', 'customer name', 'customer mobile number', 'email', 'Mobile password', 'customer code', 'customer status', 'nationality', 'created Date', 'created By', 'updated Date', 'updated By', 'status', 'fcmtoken',];
    }

    this.getAllCustomer();
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
      this.block_status = "";
      this.customertypes = '';
      this.customer_status = ''
      this.getAllCustomer();
    });
  }

  getAllCustomer() {
    debugger
    this.loading = true;

    // homePageRedirection=Registration&customertypes=INDIVIDUAL

    var obj: any = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE,
    }

    if (this.homeRedirectioncusttype === 'INDIVIDUAL' || this.homeRedirectioncusttype === 'CORPORATE') {
      obj.customertypes = this.homeRedirectioncusttype;

      if (this.homePageRedirection !== 'Registration') {
        obj.customerstatus = this.homePageRedirection;
      }
    }
    this.loadNotifications(obj);
  }

  onSort(event: any) {
    this.loading = true;
    var obj: any = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE,
      "sortBy": event.active,
      "sortOrder": event.direction
    }
    if (this.homeRedirectioncusttype === 'INDIVIDUAL' || this.homeRedirectioncusttype === 'CORPORATE') {
      obj.customertypes = this.homeRedirectioncusttype;

      if (this.homePageRedirection !== 'Registration') {
        obj.customerstatus = this.homePageRedirection;
      }
    }
    this.loadNotifications(obj);
  }

  onPageChange(event: any) {
    this.loading = true;
    var obj: any = {
      "search": this.search,
      "page": event.pageIndex + 1,
      "limit": event.pageSize ? event.pageSize : this.PAGE_SIZE
    }
    if (this.homeRedirectioncusttype === 'INDIVIDUAL' || this.homeRedirectioncusttype === 'CORPORATE') {
      obj.customertypes = this.homeRedirectioncusttype;

      if (this.homePageRedirection !== 'Registration') {
        obj.customerstatus = this.homePageRedirection;
      }
    }
    this.loadNotifications(obj);
  }

  applyFilter(event: Event) {
    this.loading = true;
    var obj: any = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE
    }
    if (this.homeRedirectioncusttype === 'INDIVIDUAL' || this.homeRedirectioncusttype === 'CORPORATE') {
      obj.customertypes = this.homeRedirectioncusttype;

      if (this.homePageRedirection !== 'Registration') {
        obj.customerstatus = this.homePageRedirection;
      }
    }
    this.loadNotifications(obj);
  }

  loadNotifications(obj: any) {
    this.customerService.getCustomerWithPagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getCustomerWithPagination", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.personList = data.data;
        this.totalItemCount = data.total;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dynamicTableData = this.personList && this.personList
      .map((element: any) => ({
        platform: element.platform,
        emailid: element.emailid || "-",
        reg_id: element.reg_id,
        fcmtoken: element.fcmtoken,
        username: element.username || "-",
        userpassword: element.password || "-",
        customertypes: element.customertypes || "-",
        customername: element.customername || "-",
        mobilenumber: element.mobilenumber || "-",
        password: element.mobilepassword || "-",
        customerstatus: element.customerstatus,
        customercode: element.customercode,
        block_status: element.block_status === 1 ? "Blocked" : "Open",
        status: element.status === 1 ? "Active" : "Inactive",
        created_by: element.createdbyname || "",
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        modified_by: element.updatedbyname || "",
        modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        //  customer_refno: element.customer_refno || "",
        nationalityname: element.nationalityname || "-",
        dobmonth: element.dobmonth || "-",
        dobday: element.dobday || "-",
      }));

    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    this.loading = false;
  }


  clearFilter() {
    this.dataSource.filter = '';
  }
  // applyFilter(event: Event) {
  //   this.block_status = "";
  //   this.customertypes = '';
  //   this.customer_status = ''
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  customerStatus(event: any) {
    this.block_status = "";
    this.customertypes = ''
    if (event.value == "None") {
      this.homePageRedirection = "Registration"
      this.ngOnInit();
    } else {
      var obj: any = {
        "search": this.search,
        "page": 1,
        "limit": this.PAGE_SIZE,
        "customerstatus": event.value
      }

      if (this.homeRedirectioncusttype === 'INDIVIDUAL' || this.homeRedirectioncusttype === 'CORPORATE') {
        obj.customertypes = this.homeRedirectioncusttype;

        if (this.homePageRedirection !== 'Registration') {
          obj.customerstatus = this.homePageRedirection;
        }
      }
      this.loadNotifications(obj);
      // const filterValue = event.value;
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  }


  blockStatus(event: any) {
    debugger
    this.customertypes = '';
    this.customer_status = "";
    if (event.value == "None") {
      this.homePageRedirection = "Registration"
      this.ngOnInit();
    } else {
      var obj: any = {
        "search": this.search,
        "page": 1,
        "limit": this.PAGE_SIZE,
        "block_status": event.value
      }

      if (this.homeRedirectioncusttype === 'INDIVIDUAL' || this.homeRedirectioncusttype === 'CORPORATE') {
        obj.customertypes = this.homeRedirectioncusttype;

        if (this.homePageRedirection !== 'Registration') {
          obj.customerstatus = this.homePageRedirection;
        }
      }
      this.loadNotifications(obj);
    }
  }

  type(event: any) {
    this.block_status = ''

    if (event.value == "None") {
      this.homePageRedirection = "Registration"
      this.ngOnInit();
    } else {
      var obj:any = {
        "search": this.search,
        "page": 1,
        "limit": this.PAGE_SIZE,
        "customertypes": event.value
      }
       if (this.homeRedirectioncusttype === 'INDIVIDUAL' || this.homeRedirectioncusttype === 'CORPORATE') {
      obj.customertypes = this.homeRedirectioncusttype;

      if (this.homePageRedirection !== 'Registration') {
        obj.customerstatus = this.homePageRedirection;
      }
    }
      this.loadNotifications(obj);
    }

  }


  public addRecord() {
    debugger
    const dialogRef = this.dialog.open(AddCustomerComponent, {
      width: '750px',
      height: 'fit-content',
      disableClose: true,
      data: {
        code: this.code,
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllCustomer();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditCustomerComponent, {
      width: '750px',
      height: 'fit-content',
      disableClose: true,
      data: {
        reg_id: items.reg_id,
        customername: items.customername,
        mobilenumber: items.mobilenumber,
        password: items.password,
        customerstatus: items.customerstatus,
        customercode: items.customercode,
        status: items.status,
        created_at: items.created_at,
        created_by: items.created_by,
        modified_at: items.modified_at,
        modified_by: items.modified_by,
        fcmtoken: items.fcmtoken,
        emailid: items.emailid == '-' ? '' : items.emailid,
        platform: items.platform,

        username: items.username == '-' ? '' : items.username,
        userpassword: items.userpassword == '-' ? '' : items.userpassword,
        customertypes: items.customertypes,

        nationalityname: items.nationalityname || "-",
        dobmonth: items.dobmonth || "-",
        dobday: items.dobday || "-",
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllCustomer();
      }
    });
  }



  // inActiveRecord(changeEvent:any,items:any){debugger;
  //   console.log("event",changeEvent);
  //   console.log("items",items)
  //   // return
  //   Swal.fire({
  //     title: 'Do you want to In-Active the Record?',
  //     // text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.customerService.inActiveCustomer(items.reg_id,"").pipe()
  //   .subscribe( (data:any) => {
  //       // console.log("registration ",data); 
  //       this.success(data.message);
  //       this.getAllCustomer();
  //     },error => {
  //       this.error = error;
  //       this.handleError(error);
  //     });
  //     }else{
  //       changeEvent.source.checked = true;
  //     }
  //   });
  // }



  inActiveRecord(items: any) {
    Swal.fire({
      title: 'Do you want to delete ' + items.customername + '`s Record?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.inActiveCustomer(items.reg_id, '').pipe()
          .subscribe((data: any) => {
            // console.log("registration ",data); 
            this.success(data.message);
            this.getAllCustomer();
          }, error => {
            this.error = error;
            this.errorlogService.logManualValidationError(`manage-customer inActiveRecord error:${error}`);
            this.handleError(error);
          });
      }
    });
  }


  blockRecord(items: any) {
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Block it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.blockRecord(items.reg_id, "").pipe()
          .subscribe((data: any) => {
            // console.log("registration ",data); 
            this.success(data.message);
            this.getAllCustomer();
          }, error => {
            this.error = error;
            this.errorlogService.logManualValidationError(`manage-customer blockRecord error:${error}`);
            this.handleError(error);
          });
      }
    })

  }


  unBlockRecord(items: any) {

    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Un Block it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.unBlockRecord(items.reg_id, "").pipe()
          .subscribe((data: any) => {
            // console.log("registration ",data); 
            this.success(data.message);
            this.getAllCustomer();
          }, error => {
            this.error = error;
            this.errorlogService.logManualValidationError(`manage-customer unBlockRecord error:${error}`);
            this.handleError(error);
          });
      }
    })


  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    // this.alertService.success('Saved successfully');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    //  this.alertService.success(error);
  }
  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Registration)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }


  openDescriptionDialog(obj: any): void {
    debugger
    const dialogRef = this.dialog.open(DesTextAreaComponent, {
      width: '800px',
      data: { description: obj.customercode, customertypes: obj.customertypes, mobilenumber: obj.mobilenumber, title: "Customer Code" }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (!result) {
        this.errorlogService.logManualValidationError(`manage-customer component|openDescriptionDialog()|Customer code cannot be empty`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Customer code cannot be empty", icon: 'error', });
      }

      var obj1 = {
        reg_id: obj.reg_id,
        customercode: result.trim()
      }
      
      this.customerService.updatecustcode(obj1).pipe()
        .subscribe((data: any) => {
          if (data.status) {
            this.success(data.message);
            this.ngOnInit();
          } else {
            this.handleError(data.message);
          }

        })

    });
  }

  copyToClipboard(url: string) {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Copied to clipboard", icon: 'success', });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  }

}


