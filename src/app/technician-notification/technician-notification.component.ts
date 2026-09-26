import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MobileotpService } from "src/app/service/mobileotp/mobileotp.service";
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";

@Component({
  selector: 'app-technician-notification',
  templateUrl: './technician-notification.component.html',
  styleUrls: ['./technician-notification.component.css']
})
export class TechnicianNotificationComponent implements OnInit {

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
  techList: any;
  driverList: any;
  dynamicTableData!: any[];
  search: any;
  selectedAppType: any = 'tech-app';

  constructor(private otpService: MobileotpService,
    public dialog: MatDialog,) { }

  public displayedColumns: string[] = ['notifytitle', 'notifycontent', 'notifytype',  'fcmtoken', 'status', 'readreceipts',  'created_at',];

  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.gettingTechnicianNotification();
    this.gettingDriverNotification()
  }

  gettingTechnicianNotification() {
    this.loading = true;
    this.otpService.gettingTechnicianNotification().pipe()
      .subscribe((data: any) => {
        console.log("gettingTechnicianNotification ", data);
        this.List = data;
        this.techList = data;
        this.loadRecord();
      });
  }

  gettingDriverNotification() {
    this.loading = true;
    this.otpService.gettingDriverNotification().pipe()
      .subscribe((data: any) => {
        console.log("gettingDriverNotification ", data);
        this.driverList = data;
        // this.loadRecord();
      });
  }



  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => this.dataSource.sort = this.sort);
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch() {
    this.search = "";
    //localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  selectionFilterChange(event: any) {
    this.selectedAppType = event.value
    console.log('selection', this.selectedAppType);

    if (this.selectedAppType == "tech-app") {
      this.List = this.techList
    } else if (this.selectedAppType == "driver-app") {
      this.List = this.driverList
    }
    this.loadRecord()
  }
}
