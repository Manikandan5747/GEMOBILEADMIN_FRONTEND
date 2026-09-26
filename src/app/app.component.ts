
import { Router } from '@angular/router';
import { OnInit, Component, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import Swal from 'sweetalert2';
import { CookieService } from './service/cookie.service';
import { CustomerService } from './service/customer/customer.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: any;
  login_id: any;

  //https://www.npmjs.com/package/bn-ng-idle

  constructor(private bnIdle: BnNgIdleService, public cookieService: CookieService, private router: Router,
    private customerService: CustomerService) {
      debugger
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      this.login_id = this.currentUser ? JSON.parse(this.currentUser)[0]?.login_id : "";
     
    // 600 is 10 min  change to 1800 for 30 min  // 900 15 mins
    this.bnIdle.startWatching(3600).subscribe(async (res: any) => {
      if (res) {
        var getPathWhilePageReoload = window.location.hash;
        if (getPathWhilePageReoload == '/login' || getPathWhilePageReoload == '#/login') {
        } else {
          Swal.fire({ toast: true, position: 'center', showConfirmButton: false, timer: 2000, title: "Your session has expire", icon: 'info', });
         await this.logout().then(()=>{
          localStorage.clear();
          sessionStorage.clear();
            var RoutingConstant = "login"
            this.cookieService.deleteCookie('login');
            this.cookieService.deleteCookie('geMobileAdminCurrentUser');
            this.router.navigate(["/" + RoutingConstant]);
          });
        }
      }
    })
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  async logout() {
    localStorage.removeItem('search');  
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.login_id = this.currentUser ? JSON.parse(this.currentUser)[0]?.login_id : "";
    await this.customerService.offlineuser(this.login_id).toPromise();
  }

  doBeforeUnload() {
    // Alert the user window is closing 
        return true;
    }

    async doUnload() {debugger
        // Clear session or do something
       await this.logout().then(()=>{
          localStorage.removeItem('search');
          sessionStorage.clear();
          var RoutingConstant = "login"
          this.cookieService.deleteCookie('login');
          this.cookieService.deleteCookie('geMobileAdminCurrentUser');
          this.router.navigate(["/" + RoutingConstant]);
        });
    }
}
