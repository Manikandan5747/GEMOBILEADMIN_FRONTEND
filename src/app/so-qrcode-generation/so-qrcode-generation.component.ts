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
  selector: 'app-so-qrcode-generation',
  templateUrl: './so-qrcode-generation.component.html',
  styleUrls: ['./so-qrcode-generation.component.css']
})
export class SoQrcodeGenerationComponent implements OnInit {
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

  constructor(public toastr: ToastrService, private otpService: MobileotpService, private cookieService: CookieService,
    public dialog: MatDialog,) { }

  public displayedColumns: string[] = ['qr_codeid', 'specialofferid', 'unique_code','fcm_token', 'qr_date','status', 'created_by', 'created_at',];
  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.toastr.clear();
    this.getAllMobileOTP();
  }

  getAllMobileOTP() {
    this.loading = true;
    this.otpService.getQRCodeList().pipe()
      .subscribe((data: any) => {
        console.log("getQRCodeList ", data);
        this.List = data;
        this.loadRecord();
      });
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
}
