import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
const moment = require('moment');
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "../common/ui.constant";
import { HttpClient } from "@angular/common/http";
import { ModuleIdList } from "../common/enum";
import { PushNotificationsService } from "../service/push.notification.service";
import { PortalUsersStatusService } from "../service/portalusers-status/portal-users-status.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-portal-user',
  templateUrl: './portal-user.component.html',
  styleUrls: ['./portal-user.component.css']
})
export class PortalUserComponent implements OnInit {

  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  loading: boolean = false;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List: any;
  dynamicTableData!: any[];
  ipAddress: any;

  userPrivilegeObj: any;
  portalUsersStatusList: any;
  currentUser: any;
  homePageRedirection: any;
  constructor(private route: ActivatedRoute, private portalUsersStatusService: PortalUsersStatusService, private pushNotificationService: PushNotificationsService, private http: HttpClient, public toastr: ToastrService, private customerService: CustomerService, private cookieService: CookieService,
    public dialog: MatDialog,) {
    this.userPrivilegeObj = {};
    var tempPrivilege = this.customerService.getCurrentUserPrivilegeArr();
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Users)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

    this.route.queryParams.subscribe(params => {
      this.homePageRedirection = params['homePageRedirection'];
    });

  }

  public displayedColumns: string[] = ['actions','username', 'userpassword', 'emailid', 'portalstatus', 'rolename', 'showroomname', 'status', 'created_by', 'created_at', 'modified_by', 'modified_at', ];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
    this.getAllCustomer();
    //  this.getShowroomContactList();
  }
  getPortalUsersStatus() {
    this.portalUsersStatusService.getPortalUsersStatus().pipe()
      .subscribe((data: any) => {
        console.log("getPortalUsersStatus", data);
        this.portalUsersStatusList = data;
      });
  }


  
  getAllCustomer() { 
    this.loading = true;
    this.customerService.getList().pipe()
      .subscribe((data: any) => {
        console.log("getList ", data);
        this.List = data;

        if (this.homePageRedirection == 'Active') {
          this.List = this.List.filter((ele: any) => ele.portalstatus == 'APPROVE' && ele.status==1);
        } else if (this.homePageRedirection == 'Pending') {
          this.List = this.List.filter((ele: any) => ele.portalstatus == "REQUEST" && ele.status==1);
        } else if (this.homePageRedirection == 'Cancel') {
          this.List = this.List.filter((ele: any) => ele.portalstatus == "CANCEL"&& ele.status==0);
        }
        this.loading = false;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  loadRecord() {
    
    this.dynamicTableData = [];

    this.List.forEach((element: any) => {
      if (element.showroomdetid) {
        let row: any = {
          showroomdcon_id: element.showroomdcon_id,
          showroomname: element.showroomname,
          rolename: element.rolename,
          portalstatus: element.portalstatus,
          emailid: element.emailid,
          isforcefulllogin: element.isforcefulllogin,
          role: element.role,
          role_id: element.role_id,
          username: element.username,
          userpassword: element.userpassword,
          userrole: element.userrole,
          login_id: element.login_id,
          status: element && element.status == 1 ? "Active" : "InActive",
          created_by: element && element.createdbyname ? element.createdbyname : "",
          useronline_status: element.useronline_status,
          created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
          modified_by: element && element.updatedbyname ? element.updatedbyname : "",
          modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        }
        this.dynamicTableData.push(row);
      }
    })


    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    this.dataSource.paginator = this.paginator;
    setTimeout(() => this.dataSource.sort = this.sort)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}


  cancelRecord(ele: any) {
    
    this.loading = true;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    var currentUserid = obj[0]?.login_id;
    Swal.fire({
      title: 'Do you want to Cancel?',
      text: ele.username,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonAriaLabel: 'Close',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:
        '<p style="margin: 0px">Close</p>',
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.makeCancelUser(ele.login_id, ele.showroomdcon_id, currentUserid, ele.showroomname).pipe()
          .subscribe((data: any) => {
            // this.notify('Canceled',ele.showroomname);
            this.loading = false;
            this.getAllCustomer();
          });
      }
    })


  }

  ngAfterViewInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

  inviteRecord(ele: any) {
    
    this.loading = true;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    var currentUserid = obj[0]?.login_id;

    Swal.fire({
      title: 'Do you want to invite?',
      text: ele.username,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, invite accepted!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.makeActiveUser(ele.login_id, currentUserid, ele.showroomname).pipe()
          .subscribe((data: any) => {
            this.loading = false;
            this.notify('APPROVED', ele.showroomname);
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title:"Portal User Approved Successfully", icon: 'success' });
            this.getAllCustomer();
          });
      }
    })


  }


  notify(text: any, showroomname: any) {
    let data: Array<any> = [];
    data.push({
      'title': "Added New Portal User",
      'alertContent': "New Portal User " + text + " from " + showroomname + "",
    });
    this.pushNotificationService.generateNotification(data);
  }


}


