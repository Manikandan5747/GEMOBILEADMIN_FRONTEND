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
import { SalesOrderService } from "src/app/ge-motors/sales-order/sales-order.service";
import { KeyManageService } from "../key-manage.service";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-key-management',
  templateUrl: './key-management.component.html',
  styleUrls: ['./key-management.component.css']
})
export class KeyManagementComponent implements OnInit {

  JOBREQNO: any;
  CUSTCODE: any;
  CUSTNAME: any;
  INVOICEAMOUNT: any;
  CATEGORYNAME: any;
  GIFTSTATUS: any;

  userPrivilegeObj: any;
  currentUser: any;
  formData = new FormData();
  loading: boolean = false;
  search: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List: any = [];
  dynamicTableData!: any[];
  quoteid: any;
  opportunityid: any;
  currentuser: any;
  totalItemCount: any;
  searchSubject: Subject<any> = new Subject<any>();
  created_at: any;
  gift_draw_time: any;
  received_date: any;
  crm_name: any;
  mobilenumber: any;
  category_type: any;

  constructor(public toastr: ToastrService, private router: Router, private keyManageService: KeyManageService,
    private route: ActivatedRoute, private customerService: CustomerService, private cookieService: CookieService, public dialog: MatDialog,) {
    this.getCurrentUserPrivilege();
    this.route.queryParams.subscribe(params => {
      this.quoteid = params['quoteid'];
      this.opportunityid = params['opportunityid'];
    });
  }

  public displayedColumns: string[] = [
    'generated_key','crm_name', 'cust_code', 'customername','mobilenumber', 'invoice_amount', 'category_name','category_type', 'job_req_no',
    'campaign_id', 'gift_status','gift_name','gift_image','spinning_wheel_image', 'validity', 'gift_validity', 'gift_draw_time',
    'prize_received', 'received_date','transfered_name', 'transfered_phone_number', 'transfered_plate_number', 'createdbyname', 'created_at',
  ];

   


  dataSource!: MatTableDataSource<any>;

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.LuckykeyManagement)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  async ngOnInit() {
    this.currentuser = await this.customerService.getCurrentUser();
    this.getDeatils();
    this.searchSubject.pipe(
      debounceTime(500)  // Delay the API call for 500ms after the user stops typing
    ).subscribe((event) => {
      this.selectionFilterChange(event);
    });
  }

  getDeatils() {

    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }

    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }
    this.keyManageService.getkeyManagewithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getDeatils", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.loading = false;
  }


  viewRecord(items: any) {
    var navigationExtras = { queryParams: { isEdit: "VIEW", salesorderid: items.salesorderid } };
    this.router.navigate(['create-salesorder'], navigationExtras);
  }







  onPageChange(event) {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize
    }
    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }



    this.keyManageService.getkeyManagewithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getopportunitywithpagination", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }

  applyFilter(event: Event) {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }
    this.keyManageService.getkeyManagewithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }

  onFilterChange(event: any) {
    this.searchSubject.next(event);
  }

  onDateFilterChange(event: any, field: string): void {
    const selectedDate = new Date(event.value);
    const value = event?.value;
    // Handle empty or invalid value
    if (!value) {
      // Set the field to null or handle as needed
      this[field] = null;
      console.log('No date selected, field cleared');
      this.searchSubject.next(event);

      return;
    }

    // Set the time to midnight
    selectedDate.setHours(0, 0, 0, 0);

    // Adjust for timezone offset by converting to UTC and back
    const localOffset = selectedDate.getTimezoneOffset();
    const utcDate = new Date(selectedDate.getTime() - localOffset * 60000);

    // Use a switch or condition to handle multiple date fields
    switch (field) {
      case 'created_at':
        this.created_at = utcDate;
        break;
      case 'gift_draw_time':
        this.gift_draw_time = utcDate;
        break;
      case 'received_date':
        this.received_date = utcDate;
        break;
      default:
        break;
    }
    this.searchSubject.next(event);
  }


  sortData(event: any) {
    console.log("event", event);

    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "job_req_no": this.JOBREQNO,
      "cust_code": this.CUSTCODE,
      'customername': this.CUSTNAME,
      "category_name": this.CATEGORYNAME,
      "invoice_amount": this.INVOICEAMOUNT,
      "gift_status": this.GIFTSTATUS,
      "created_at": this.created_at,
      "gift_draw_time": this.gift_draw_time,
      "received_date": this.received_date,
      "crm_name": this.crm_name,
      "mobilenumber": this.mobilenumber,
      "category_type":this.category_type,
      "sort": true,
      "sortevent": event
    }

    this.keyManageService.getkeyManagewithpagination(obj).pipe()
    .subscribe((data: any) => {
      this.List = data.data;
      this.totalItemCount = data.total_count;
      this.loading = false;
      this.loadRecord();
    });
  }



  selectionFilterChange(event: any) {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "job_req_no": this.JOBREQNO,
      "cust_code": this.CUSTCODE,
      'customername': this.CUSTNAME,
      "category_name": this.CATEGORYNAME,
      "invoice_amount": this.INVOICEAMOUNT,
      "gift_status": this.GIFTSTATUS,
      "created_at": this.created_at,
      "gift_draw_time": this.gift_draw_time,
      "received_date": this.received_date,
      "crm_name": this.crm_name,
      "mobilenumber": this.mobilenumber,
      "category_type":this.category_type,
    }
    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }


    this.keyManageService.getkeyManagewithpagination(obj).pipe()
      .subscribe((data: any) => {
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loading = false;
        this.loadRecord();
      });
  }

  addOneDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  clearSearch() {
    this.search = "";
    this.JOBREQNO = "";
    this.CUSTCODE = "";
    this.INVOICEAMOUNT = "";
    this.CATEGORYNAME = "";
    this.CUSTNAME = "";
    this.GIFTSTATUS = "";
    this.created_at = "";
    this.gift_draw_time = "";
    this.received_date = "";
    this.crm_name = "";
    this.mobilenumber = "";
    this.category_type = "";
    this.ngOnInit();
  }



  isBeforeExpiryDate(expiryDate: string): boolean {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    return currentDate <= expiry;
  }



}