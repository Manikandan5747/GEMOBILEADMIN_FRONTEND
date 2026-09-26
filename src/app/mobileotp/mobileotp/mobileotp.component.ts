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

@Component({
  selector: 'app-mobileotp',
  templateUrl: './mobileotp.component.html',
  styleUrls: ['./mobileotp.component.css']
})
export class MobileotpComponent implements OnInit {
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
  loadTime: any
  search: any;
  totalItemCount: any;

  constructor(public toastr: ToastrService, private otpService: MobileotpService,
    public dialog: MatDialog,) { }

  public displayedColumns: string[] = ['onetimepassword', 'passwordstatus', 'mobileno', 'status', 'created_by', 'created_at',];
  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.toastr.clear();
    this.getAllMobileOTP();
  }

  getAllMobileOTP() {
    this.loading = true;
     var obj = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE
    }
     this.loadNotifications(obj);
  }

  onPageChange(event) {debugger
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": event.pageIndex + 1,
      "limit": event.pageSize ? event.pageSize : this.PAGE_SIZE
    }
    this.loadNotifications(obj);
  }


  applyFilter(event: Event) {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE
    }
    this.loadNotifications(obj);
  }

  onSort(event: any) {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE,
      "sortBy": event.active,
      "sortOrder": event.direction
    }
    this.loadNotifications(obj);
  }

  loadNotifications(obj: any) {
    this.otpService.getMobileotpWithPagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total;
        this.loadRecord();
      });
  }



  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.loading = false;
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    // this.alertService.success('Saved successfully');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    //  this.alertService.success(error);
  }

  clearSearch() {
    this.search = "";
     var obj = {
      "search": this.search,
      "page": 1,
      "limit": this.PAGE_SIZE
    }
     this.loadNotifications(obj);
  }
}
