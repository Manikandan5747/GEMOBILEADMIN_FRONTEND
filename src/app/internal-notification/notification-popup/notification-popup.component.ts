import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { DateFormat } from 'src/app/common/ui.constant';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { CookieService } from 'src/app/service/cookie.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
const moment = require('moment');

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css'],
})
export class NotificationPopupComponent implements OnInit {
  onSubmitReason = new EventEmitter();
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  // currentUserSubscription: Subscription;
  submitted!: boolean;
  currentUser: any;
  unreadMeg: any=[];
  

  constructor(private router: Router,private cookieService: CookieService,public dialog: MatDialog,private notificationService:NotificationService,
    public dialogRef: MatDialogRef<NotificationPopupComponent>,private pushNotificationService:PushNotificationsService,
    ) { this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

  ngOnInit() {
    this.dialogRef.updatePosition({ top: '62px', right: '100px' });
    this.loadData();
  }

  loadData() {
    this.notificationService.getAllRecords(JSON.parse(this.currentUser)[0]).pipe().subscribe((response:any) => {
      console.log("getAllRecords", response);
      var temp = response.filter((ele) => ele.isreaded === false).slice(0, 5);
      this.unreadMeg = temp;
      
    })
  }

   getTimeDifference = (createdDate) => {
    var updatedDat:any = new Date();
    var temp:any = new Date(createdDate);
    const timeDiff:any = new Date(updatedDat - temp);
  
    // Convert the time difference to minutes, rounded down
    const minsDiff = Math.floor(timeDiff / (1000 * 60));
  
    // Express the time difference in terms of "1 minute ago", "1 hour ago", "1 day ago", "1 week ago", or "1 month ago"
    if (minsDiff < 2) {
      return '1 minute ago';
    } else if (timeDiff < 1000 * 60 * 60 * 2) {
      return `${minsDiff} minutes ago`;
    } else if (timeDiff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(timeDiff / (1000 * 60 * 60))} hours ago`;
    } else if (timeDiff < 1000 * 60 * 60 * 24 * 7) {
      return `${Math.floor(timeDiff / (1000 * 60 * 60 * 24))} days ago`;
    } else if (timeDiff < 1000 * 60 * 60 * 24 * 30) {
      return `${Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7))} weeks ago`;
    } else {
      return `${Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30))} months ago`;
    }
};


public viewRecord(items: any) {
  var navigationExtras = { queryParams: { isEdit:"VIEW",[items.remark]:items.key }};
  // let route =items.keyaction+items.key;
  // console.log("route",route);
  
  this.router.navigate([items.keyaction],navigationExtras);
}

  markAsRead(notification:any) {
    var obj =JSON.parse(this.currentUser);
    var tempObj = {
      userid:obj[0].login_id,
      notificationId:notification.notificationId
    }
    this.notificationService.setReadRecord(tempObj).pipe().subscribe((response:any) => {
      console.log(response);
      this.loadData();
      this.pushNotificationService.sendMessage(true);
      this.ViewNotificationPopup(notification.notificationId);
      this.dialogRef.close()
    })
  }

  seeAllNotification() {
    this.router.navigate(["/internal-notification"]);
  }

  ViewNotificationPopup(notificationId:any){
  
    // const dialogRef = this.dialog.open(ViewNotificationComponent, {
    //   width: ViewNotificationComponentPopupAttribute.WIDTH,
    //   height: ViewNotificationComponentPopupAttribute.HEIGHT,
    //   disableClose: true,
    //   data: { notificationId: notificationId }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result == 'Success') {
     
    //   }
    // });
  }

}
