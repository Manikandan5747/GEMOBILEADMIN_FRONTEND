import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ModuleIdList } from "src/app/common/enum";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from "src/app/service/event/event.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-event-qr-code',
  templateUrl: './manage-event-qr-code.component.html',
  styleUrls: ['./manage-event-qr-code.component.css']
})
export class ManageEventQrCodeComponent implements OnInit {

  @ViewChild('test1', { static: false }) content!: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  search: any = '';
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;

  error = '';
  List: any[] = [];
  dataSource!: MatTableDataSource<any>;
  userPrivilegeObj: any;
  currentUser: any;

  constructor(
    public toastr: ToastrService,
    private EventService: EventService,
     private cookieService: CookieService,
    public dialog: MatDialog
  ) {
    this.getCurrentUserPrivilege();
  }

  displayedColumns: string[] = [
    'qr_code_id',
    'event_planner_id',
    'unique_code',
    'fcm_token',
    'qr_expiry_date',
    'status',
    'created_by',
    'created_date'
 
  ];

  ngOnInit() {
    console.log("ManageEventCustomerComponent initialized");
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.getActiveQRCodeList();
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    const tempPrivilege = await this.EventService.getCurrentUserPrivilegeArr();
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.EventQrcode);
    console.log("User privilege:", this.userPrivilegeObj);
  }

  getActiveQRCodeList() {
    this.EventService.getEventQRCode().subscribe({
      next: (data: any) => {
        this.List = data;
        this.loadRecord();
      },
      error: (err) => {
        this.toastr.error("Failed to load customer events");
        console.error("getEventCustomers error:", err);
      }
    });
  }

  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch() {
    this.search = '';
    this.dataSource.filter = '';
  }


}
