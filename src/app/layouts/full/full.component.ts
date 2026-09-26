import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component,OnDestroy,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'src/app/service/cookie.service';
// import { MenuItems } from '../../shared/menu-items/menu-items';
/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  currentUser: any;


  constructor( private cookieService: CookieService,public toastr: ToastrService,
    changeDetectorRef: ChangeDetectorRef,private router: Router,
    media: MediaMatcher,
    // public menuItems: MenuItems
  ) {
    // console.log("qqq",JSON.parse(this.currentUser)[0].username)
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {}

  choosingLogo(){
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var userrole = this.currentUser ? JSON.parse(this.currentUser)[0]?.userrole : "";
   
    if(userrole == "ShowroomSupervisor"){
      this.router.navigate(["/car-details"]);
    }else{
      this.router.navigate(["/dashboard"]);
    }
   }

   clear() {
		this.toastr.clear();
	}
}
