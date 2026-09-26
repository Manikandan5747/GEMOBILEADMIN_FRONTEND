import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
import { MatDialog } from '@angular/material/dialog';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';
import { ExportToExcelService } from "../service/exportExcel/export-to-excel.service";
const moment = require('moment');

@Component({
  selector: 'app-crm-access-token',
  templateUrl: './crm-access-token.component.html',
  styleUrls: ['./crm-access-token.component.css']
})
export class CrmAccessTokenComponent implements OnInit {

  dataForExcel: any = [];
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  search: any;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List: any;


  constructor(private customerService: CustomerService, private exportToExcelService: ExportToExcelService,
    public dialog: MatDialog, private clipboard: Clipboard) { }

  public displayedColumns: string[] = ['app_id', 'crm_refreshtoken', 'crm_accesstoken', 'status', 'errorcode', 'created_at',];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.getAccessToken();
  }

  getAccessToken() {
    this.customerService.getAccessToken().pipe()
      .subscribe((data: any) => {
        console.log("getAccessToken", data);
        this.List = data;
        this.loadRecord();
      });
  }

  copyToClipboard(text: string | undefined) {
    if (text) {
      this.clipboard.copy(text);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Copied to clipboard", icon: 'success', });
      // alert('Copied to clipboard: ' + text);
    }
  }

  appType: any = {
    1: "WEB APP",
    2: "MOBILE APP",
    3: "AI USER"
  };

  loadRecord() {

    let dynamicTableData: any = [];
    this.List.forEach((element: any) => {
      let row: any = {
        app_id: this.appType[element.app_id] || "",
        crm_refreshtoken: element.crm_refreshtoken,
        crm_accesstoken: element.crm_accesstoken,
        status: element && element.status == 1 ? "Active" : "InActive",
        errorcode: element.errorcode,
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
      }
      dynamicTableData.push(row);
    })

    this.dataSource = new MatTableDataSource(dynamicTableData);
    setTimeout(() => this.dataSource.sort = this.sort)
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  exportExcel() {
    debugger;
    let displayedLabelColumns = ['APP NAME', 'CRM REFRESH TOKEN', 'CRM ACCESS TOKEN', 'STATUS', 'ERROR CODE', 'CREATED AT'];
    this.dataSource.filteredData.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })
    this.exportToExcelService.exportAsExcelFile(displayedLabelColumns, this.dataForExcel, "CRM Access Token Excel", '', "CRM Access Token Excel");
    this.dataForExcel = [];
  }

  clearSearch() {
    this.search = "";
    localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}



