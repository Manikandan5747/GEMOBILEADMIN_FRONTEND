import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { SpecialOfferService } from "../service/special-offer/special-offer.service";
import { ExportToPDFService } from "../service/exportPDF/export-to-pdf.service";
import { ExportToExcelService } from "../service/exportExcel/export-to-excel.service";
const moment = require('moment');

@Component({
  selector: 'app-special-offer-history',
  templateUrl: './special-offer-history.component.html',
  styleUrls: ['./special-offer-history.component.css']
})
export class SpecialOfferHistoryComponent implements OnInit {

  loading: boolean = false;
  testAttributesMap = new Map();

  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  List: any;
  dataForExcel: any = [];
  dynamicTableData!: any[];

  constructor(public toastr: ToastrService, private exportToPDFService: ExportToPDFService,
    private exportToExcelService: ExportToExcelService, private specialOfferService: SpecialOfferService, private cookieService: CookieService,
    public dialog: MatDialog,) { }

  public displayedColumns: string[] = ['specialoffer_title', 'showroomname', 'customername', 'unique_code', 'status', 'created_at',];
  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAllList();
  }

  getAllList() {
    this.loading = true;
    this.specialOfferService.getSpecialofferHistory().pipe()
      .subscribe((data: any) => {
        console.log("getAllList ", data);
        // this.List = data.filter((ele:any) => ele.showroomdetid != null);
        this.List = data;
        this.loadRecord();
        this.loading = false;
      });
  }


  loadRecord() {
    this.dynamicTableData = [];
    this.List.forEach((element: any) => {
      let row: any = {
        "specialoffer_title": element.specialoffer_title,
        "showroomname": element.showroomname,
        "customername": element.customername,
        "unique_code": element.unique_code ? element.unique_code.split('_')[0] : "",
        "status": element && element.status == 1 ? "Active" : "InActive",
        "created_at": element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.sort = this.sort)
    }, 100);
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  exportExcel() {
    debugger
    this.dataSource.filteredData.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    var header = ['SPECIAL OFFER', 'EXTERNAL COMPANY', 'CUSTOMER NAME', 'CUSTOMER CODE', 'STATUS', 'UTILIZED AT',];
    this.exportToExcelService.exportAsExcelFile(header, this.dataForExcel, "SPECIAL_OFFER", '',"Report Excel");
    this.dataForExcel = [];
  }
  exportPdf() {
    debugger
    let tableBody: any = this.dataSource.filteredData;
    var header = ['SPECIAL OFFER', 'EXTERNAL COMPANY', 'CUSTOMER NAME', 'CUSTOMER CODE', 'STATUS', 'UTILIZED AT',];
    this.exportToPDFService.exportPdf(header, tableBody, "Report PDF", this.testAttributesMap, "GERMAN EXPERTS CAR MAINTENANCE", "SPECIAL OFFER UTILIZED REPORT", "ADMINISTRATOR");
  }

}
