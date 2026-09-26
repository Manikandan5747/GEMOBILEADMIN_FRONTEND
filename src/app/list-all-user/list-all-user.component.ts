import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
const moment = require('moment');
import {MatDialog} from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { CreateLoginComponent } from "./create-login/create-login.component";
import {ToastrService} from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "../common/ui.constant";
import { HttpClient } from "@angular/common/http";
import { ModuleIdList } from "../common/enum";
import { OnDestroy } from '@angular/core';
import { Observable, Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-list-all-user',
  templateUrl: './list-all-user.component.html',
  styleUrls: ['./list-all-user.component.css']
})
export class ListAllUserComponent implements OnInit {

  subscription!: Subscription;
  everyFiveSecond: Observable<number> = timer(2 * 60 * 1000);
  private ngUnsubscribe = new Subject();


  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List:any;
  dynamicTableData!: any[];
  ipAddress: any;

  userPrivilegeObj :any;
  constructor(private http:HttpClient,private clipboard: Clipboard,public toastr: ToastrService,private customerService:CustomerService,private cookieService: CookieService,
    public dialog: MatDialog,)
   {
   this.userPrivilegeObj = {};
   var tempPrivilege = this.customerService.getCurrentUserPrivilegeArr();
   this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.Users)
   console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }

  public displayedColumns: string[] = ['actions','username','userpassword','emailid','isforcefulllogin','rolename','loginlink','status','useronline_status','created_by', 'created_at','modified_by','modified_at','dashboardurl', ];
  // public displayedLabelColumns: string[] = ['username','customer mobile number','Mobile password','customer code','customer status','status','created By', 'created Date', 'updated By', 'updated Date','Action'];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {  
   this.toastr.clear();
   this.getAllCustomer();
   this.everyTwoMins();
  }

  ngOnDestroy() {
    // Unsubscribe from the observable
    // alert("2 mins close")
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Every 2 mins, this script will run
  everyTwoMins() {
    this.subscription = this.everyFiveSecond.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.getAllCustomer();
    });
  }


  getAllCustomer(){
    // alert("2 mins")
    this.customerService.getList().pipe()
    .subscribe( (data:any) => {
        console.log("getList ",data); 
        this.List = data;
        this.loadRecord();
      },error => {
        this.error = error;
      });
  }


  loadRecord() {
    debugger
    this.dynamicTableData = [];
    this.List.forEach((element:any) => {
      if(element.status){
        let row: any = {
          dashboardurl:element.dashboardurl,
          showroomdetid:element.showroomdetid,
          rolename: element.rolename,
          emailid: element.emailid,
          isforcefulllogin: element.isforcefulllogin,
          role: element.role,
          role_id:element.role_id,
          loginlink:element.loginlink,
          username:element.username,
          userpassword:element.userpassword,
          userrole:element.userrole,
          login_id:element.login_id,
          status: element&& element.status == 1 ? "Active":"InActive",
          created_by:  element && element.createdbyname ?element.createdbyname :"" ,
          useronline_status:element.useronline_status,
          created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
          modified_by:  element && element.updatedbyname ?element.updatedbyname :"" ,
          modified_at:  element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        }
        this.dynamicTableData.push(row);
      }
     
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    this.dataSource.paginator = this.paginator;
    setTimeout(() => this.dataSource.sort = this.sort )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  copyLink(ele: string) {
    this.clipboard.copy(ele);
    this.success("Link Copied to Clipboard");
    // this.snackBar.open('Email copied to clipboard', 'Dismiss', {
    //   duration: 2000
    // });
  }

  public addRecord() {
    const dialogRef = this.dialog.open(CreateLoginComponent, {
      width: '450px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllCustomer();
      }
    });
  }



  public editRecord(item:any) {
    const dialogRef = this.dialog.open(CreateLoginComponent, {
      width: '450px',
      height: 'fit-content',
      disableClose: true,
      data:{
        dashboardurl:item.dashboardurl,
        username:item.username,
        userpassword:item.userpassword,
        userrole:item.userrole,
        login_id:item.login_id,
        status:item.status,
        emailid: item.emailid,
        isforcefulllogin: item.isforcefulllogin,
        role_id: item.role_id,
        role: item.role,
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllCustomer();
      }
    });
  }


  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
   // this.alertService.success('Saved successfully');
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  //  this.alertService.success(error);
  }

  makeOffline(ele:any){debugger
    this.customerService.makeOfflineUser(ele.login_id).pipe()
    .subscribe( (data:any) => {
       this.ngOnInit();
      });
  }

  updateforcefullstatus(ele:any,key:any){debugger
    var obj = {
      login_id:ele.login_id,
      isforcefulllogin:key
    }
    this.customerService.update_forcefulllogin_status(obj).pipe()
    .subscribe( (data:any) => {
       this.ngOnInit();
      });
  }


  
  


}


