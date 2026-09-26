import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
const moment = require('moment');
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2';
import { AddNotificationComponent } from "./add-notification/add-notification.component";
import { NotificationService } from "../service/notification/notification.service";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "../common/ui.constant";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { ErrorlogService } from "../errorlog.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  userPrivilegeObj: any;
  search: any;
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  notificationList: any;
  dynamicTableData!: any[];

  public displayedColumns: string[] = ['actions', 'notificationtitle', 'notificationcontent', 'notifytype', 'messagestatus', 'fcmtoken', 'readreceipts',  'created_at',];
  totalItemCount: any = 0;
  constructor(public toastr: ToastrService, private customerService: CustomerService, private notificationService: NotificationService, private cookieService: CookieService, public dialog: MatDialog, private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege()
  }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {
    this.toastr.clear();
    this.getAllNotification();

  }


  getAllNotification() {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE
    }
    this.loadNotifications(obj);
  }

  onPageChange(event) {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize ? event.pageSize : this.PAGE_SIZE
    }
    this.loadNotifications(obj);
  }


  applyFilter(event: Event) {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    this.loadNotifications(obj);
  }

  loadNotifications(obj: any) {
    this.notificationService.getNotificationWithPagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.notificationList = data.data;
        this.totalItemCount = data.total;
        this.loadRecord();
      });
  }

  onSort(event: any) {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "sortBy": event.active,
      "sortOrder": event.direction
    }
    this.loadNotifications(obj);
  }

  loadRecord() {
    this.dataSource = new MatTableDataSource(this.notificationList);
    this.loading = false;
  }



  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Notification)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddNotificationComponent, {
      width: '450px',
      height: 'fit-content',
      disableClose: true,

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // if (result == 'Success') {
      this.ngOnInit();
      // }
    });
  }

  deleteRecord(items: any) {
    debugger;
    this.notificationService.deleteRecord(items.campaign_id, "").pipe()
      .subscribe((data: any) => {
        // console.log("deleteRecord ",data); 
        this.success(data.message);
        this.getAllNotification();
      }, error => {
        this.error = error;
        this.errorlogService.logManualValidationError(`notification component error:${error}`);
        this.handleError(error);
      });
  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }



}


