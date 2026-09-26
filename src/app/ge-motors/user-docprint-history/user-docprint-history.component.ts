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
  selector: 'app-user-docprint-history',
  templateUrl: './user-docprint-history.component.html',
  styleUrls: ['./user-docprint-history.component.css']
})
export class UserDocprintHistoryComponent implements OnInit {

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

  public displayedColumns: string[] = ['documentname','refno','contracttype','createdbyname','count','createdat','modifiedat' ];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {  
   this.toastr.clear();
   this.gethistorydocprinted();
  }



  gethistorydocprinted(){
    this.customerService.gethistorydocprinted().pipe()
    .subscribe( (data:any) => {
        console.log("gethistorydocprinted ",data); 
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



