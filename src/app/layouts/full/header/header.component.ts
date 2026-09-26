import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'src/app/service/cookie.service';
import { Observable, Subscription, timer } from 'rxjs';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { NotificationPopupComponent } from 'src/app/internal-notification/notification-popup/notification-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import Swal from 'sweetalert2';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})

export class AppHeaderComponent {
  unreadMegCount:number=0;
  currentUser: any;
  username: any;
  everyFiftySeconds: Observable<number> = timer(0, 50000);
  private autoLogoutSubscription: Subscription = new Subscription;
  subscription: Subscription;
  userrole: any;
  constructor(private carDetailsService: CarDetailsService,private pushNotificationsService:PushNotificationsService,private notificationService: NotificationService,private router: Router, public dialog: MatDialog,
    private cookieService: CookieService, private customerService: CustomerService) {
      var user = this.cookieService.getCookie('login');
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      this.username = this.currentUser ? JSON.parse(this.currentUser)[0]?.username : "";
      this.userrole = this.currentUser ? JSON.parse(this.currentUser)[0]?.userrole : "";
      if(!user){
        var RoutingConstant = "login"
        this.router.navigate(["/"+RoutingConstant]);
      }


      this.subscription = this.pushNotificationsService.getMessage().subscribe((message:any) => {
        
        if(message.text == false){
          this.unreadMegCount += 1;
        }
        else {
          this.unreadMegCount -= 1;
          console.log("count", this.unreadMegCount);
        }
      });
  }

  ngOnInit(): void {
    var user = this.cookieService.getCookie('login');
    if(!user){
      this.router.navigate(['/login']); 
    }
    localStorage.removeItem('search');
    this.notificationService.getAllRecords(JSON.parse(this.currentUser)[0]).pipe().subscribe((response:any) => {
      console.log("getAllRecords", response);
     var temp =  response && response.filter((ele:any) => ele.isreaded == false);
      this.unreadMegCount = temp && temp.length;
    });

    // this.subscription = this.everyFiftySeconds.subscribe(() => {
    //   alert("Hi")
    // });

  }

notification(){
    const dialogRef1 = this.dialog.open(NotificationPopupComponent, {
      width: '400px',
      height: '255px',
      disableClose: false,
      data: {},
      panelClass: 'notification-popup'
    });
    const subscribeDialog = dialogRef1.componentInstance.onSubmitReason.subscribe((data:any) => {
      console.log('dialog data', data);
      if (data === true) {
        // this.unreadMegCount -= 1;
        // console.log("count", this.unreadMegCount)
      }
    });
    dialogRef1.afterClosed().subscribe((result: string) => {
      subscribeDialog.unsubscribe();
      if (result == 'Success') {

      }
    });
}


async logout(){
  
  localStorage.removeItem('search');
  sessionStorage.clear();
  var login_id = this.currentUser ? JSON.parse(this.currentUser)[0]?.login_id : "";
  this.customerService.offlineuser(login_id).pipe()
      .subscribe((data: any) => {
        var RoutingConstant = "login";
        localStorage.removeItem('search');
        this.cookieService.deleteCookie('login');
        this.cookieService.deleteCookie('geMobileAdminCurrentUser');
        this.router.navigate(["/"+RoutingConstant]);

      }); 
}

async SoldOut() {
  await this.customerService.getCarSoldOutDuration().pipe().subscribe((data: any) => {
    console.log("data", data);
    var date = data?.data?.date
    Swal.fire({
      title: 'Do you want to make Car InActive from Mobile App of last ' + date + ' days',
      // text: "You won't be able to revert this!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#f4d35f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result: any) => {
      if (result.isConfirmed) {

        this.carDetailsService.issolddate3days().pipe()
          .subscribe((data: any) => {
            var inActiveCount = data && data.data.length;
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: inActiveCount + " Cars - InActive", icon: 'success', });
          });

      }
    })
  })
}

}