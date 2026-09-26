import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { first } from "rxjs/operators";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CookieService } from 'src/app/service/cookie.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { DateFormat, MatTableAttributes } from 'src/app/common/ui.constant';
import { PushNotificationsService } from 'src/app/service/push.notification.service';

@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.css']
})
export class AllNotificationComponent implements OnInit {
  isLoading: boolean = false;
  public displayedColumns: string[] = ['username', 'subject','messagebody','created_at','isreaded'];

  DATE_FORMAT = DateFormat.DATE_FORMAT;
  submitted!: boolean;
  unreadMeg: any;
  isShowErrors: boolean = false;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  // DATE_FORMAT = DateFormat.DATE_FORMAT;
  dataSource!: MatTableDataSource<any>;
  currentUser: any;

  constructor(private router: Router,public notificationService:NotificationService,
    private pushNotificationService:PushNotificationsService, private cookieService: CookieService, public dialog: MatDialog,) { 
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser'); }
    // this.route.queryParams.subscribe(params => {
    //   this.menuId = params['menuId'];
    //   console.log("menuId ", this.menuId);
    // });
  // };

  ngOnInit() {
    debugger;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    var obj =JSON.parse(this.currentUser);
    this.notificationService.getAllRecords(obj[0]).pipe().subscribe((response:any) => {
      console.log("getAllRecords", response);
      this.unreadMeg = response;
      this.dataSource = new MatTableDataSource(this.unreadMeg);
      setTimeout(() => {
      this.dataSource.sort = this.sort;
      })
    this.dataSource.paginator = this.paginator
    this.isLoading = false;
    })
  }

  markAsRead(notificationId:any) {debugger
    var obj =JSON.parse(this.currentUser);
    var tempObj = {
      userid:obj[0].login_id,
      notificationId:notificationId
    }
    this.notificationService.setReadRecord(tempObj).pipe(first()).subscribe((response) => {
      console.log(response);
      this.pushNotificationService.sendMessage(true);
      this.loadData();
      // this.onSubmitReason.emit(true);
    })
  }


  navigationToDashboard(){
  //   this.router.navigate(["/dashboard"]);
  }

  ViewNotificationPopup(rowData:any){
  //   debugger
  //   var isMsgRead = rowData.isReaded;
  //   if (!isMsgRead) {
  //     this.notificationService.sendMessage(true);
  //   }
  //   this.markAsRead(rowData.notificationId);
  //   const dialogRef = this.dialog.open(ViewNotificationComponent, {
  //     width: ViewNotificationComponentPopupAttribute.WIDTH,
  //     height: ViewNotificationComponentPopupAttribute.HEIGHT,
  //     disableClose: true,
  //     data: { notificationId: rowData.notificationId, isMsgRead:isMsgRead }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == 'Success') {
  //       this.loadData();  
  //     }

  //   });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  markAllAsRead() {
    var obj =JSON.parse(this.currentUser);
    var tempObj = {
      userid:obj[0].login_id
    }
    this.notificationService.markASReadAll(tempObj).pipe(first()).subscribe((response) => {
      console.log(response);
    window.location.reload()
      this.loadData();
      // this.onSubmitReason.emit(true);
    })
  }
  
}
