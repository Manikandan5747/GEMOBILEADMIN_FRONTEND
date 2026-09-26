import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
import { MatDialog } from '@angular/material/dialog';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { DataService } from "../service/encryption/data.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-driver-tracking',
  templateUrl: './driver-tracking.component.html',
  styleUrls: ['./driver-tracking.component.css']
})
export class DriverTrackingComponent implements OnInit {


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


  constructor(private customerService: CustomerService, public dialog: MatDialog,   ) { }

  public displayedColumns: string[] = ['driver_name','recovery_id',  'latitude', 'longitude', 'transaction_id',  'trip_status', 'fleet_id','timeslot_duration', 'status', 'created_at', ];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.getAllList();
  }



  async getAllList() {
   await this.customerService.getdriverapprecoverylocationupdatelist().pipe()
      .subscribe(async (data: any) => {
        console.log("getdriverapprecoverylocationupdatelist ", data);
        this.List = data?.data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);

    setTimeout(() => this.dataSource.sort = this.sort)
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch() {
    this.search = "";
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}


