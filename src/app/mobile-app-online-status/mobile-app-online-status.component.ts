import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { AccountService } from "../ge-motors/account/account.service";
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-mobile-app-online-status',
  templateUrl: './mobile-app-online-status.component.html',
  styleUrls: ['./mobile-app-online-status.component.css']
})

export class MobileAppOnlineStatusComponent implements OnInit {

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
  userPrivilegeObj: any;
  currentuser: any;
  totalItemCount: any;
  createdat: any;
  app_type_id:any

  constructor(private router: Router, private clipboard: Clipboard,public dialog: MatDialog, public accountService: AccountService) {
  }

  public displayedColumns: string[] = ['user_id','app_user_name', 'app_version', 'app_type_id', 'app_device_id',  'crm_accesstoken', 'status','createdby', 'created_at','modified_at'];

  dataSource!: MatTableDataSource<any>;

  async ngOnInit() {
    this.getUserOnlineStatus();
  }


  getUserOnlineStatus() {
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    this.accountService.getUserOnlineStatus(obj).pipe()
      .subscribe((data: any) => {
        console.log("getAccount", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }

    this.accountService.getUserOnlineStatus(obj).pipe()
      .subscribe((data: any) => {
        console.log("getUserOnlineStatus", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }



  onPageChange(event) {debugger
    console.log('Pagination event:', event);
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize,
      "createdat": this.createdat ? this.addOneDay(this.createdat):null,
      "app_type_id":this.app_type_id ? this.app_type_id :null
    }
    this.accountService.getUserOnlineStatus(obj).pipe()
      .subscribe((data: any) => {
        console.log("getUserOnlineStatus", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }


  selectionFilterChange(event: any) {
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "createdat": this.addOneDay(this.createdat),
       "app_type_id":this.app_type_id ? this.app_type_id :null
    }
    this.accountService.getUserOnlineStatus(obj).pipe()
      .subscribe((data: any) => {
        console.log("getUserOnlineStatus", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loading = false;
        this.loadRecord();
      });
  }

  clearSearch() {
    this.search = "";
    this.app_type_id = null;
    this.createdat = null
    this.ngOnInit();
  }

  // addOneDay(date) {
  //   const newDate = new Date(date);
  //   newDate.setDate(newDate.getDate() + 1);
  //   return newDate;
  // }


  addOneDay(date) {
  if(!date){
    return null;
  }
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 0);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


   copyLink(ele: string) {
    this.clipboard.copy(ele);
    this.success("Link Copied to Clipboard");
  }

   private success(message:any) {
      Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    }


}



