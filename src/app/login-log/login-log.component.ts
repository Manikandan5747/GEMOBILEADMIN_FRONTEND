import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
const moment = require('moment');
import {MatDialog} from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import { HttpClient } from "@angular/common/http";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.css']
})
export class LoginLogComponent implements OnInit {

  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  search:any;
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List:any;


  constructor(public toastr: ToastrService,private customerService:CustomerService,public dialog: MatDialog,)
   { }

  public displayedColumns: string[] = ['browserused','logintime','logouttime','machinename','platform','status','username', 'created_at', ];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {  
   this.toastr.clear();
   this.getAllLoginLog();
  }

  // browserused: "Chrome 103"
  // created_at: "2022-08-27T08:40:02.925Z"
  // created_by: 1
  // loginlog_id: 24
  // logintime: "2022-08-27T08:40:02.925Z"
  // logouttime: null
  // machinename: "2.50.123.22"
  // modified_at: null
  // modified_by: null
  // platform: "Macintosh"
  // status: 1
  // user_id: 23
  // visitedpage

  getAllLoginLog(){
    this.customerService.getLogInLogList().pipe()
    .subscribe( (data:any) => {
        console.log("getLogInLogList ",data); 
        this.List = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    
    setTimeout(() => this.dataSource.sort = this.sort )
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(){
    this.search ="";
  //  localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


