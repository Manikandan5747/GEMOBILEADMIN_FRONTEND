import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { CustomerService } from '../service/customer/customer.service';
import { CookieService } from '../service/cookie.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ErrorlogService } from '../errorlog.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  hide = true;
  loginForm!: FormGroup;
  submitted = false;
  returnUrl!: string;
  error = '';
  loading = false;
  currentUser: any;
  ipAddress: any;
  platform: string = "";

  constructor(public toastr: ToastrService, private http: HttpClient, private formBuilder: FormBuilder, private cookieService: CookieService,
    private route: ActivatedRoute, private router: Router,
    private customerService: CustomerService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.getIPAddress();
    this.toastr.clear();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: "MobileAdmin"
    });

    

    var OSName = "";
    if (navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.userAgent.indexOf("Mac") != -1) OSName = "Macintosh";
    if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
    if (navigator.userAgent.indexOf("Android") != -1) OSName = "Android";
    if (navigator.userAgent.indexOf("like Mac") != -1) OSName = "iOS";
    this.platform = OSName;

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
  
  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  detectBrowserVersion() {
    var userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }



  // detectBrowserName() { 
  //    const agent = window.navigator.userAgent.toLowerCase()
  //    switch (true) {
  //      case agent.indexOf('edge') > -1:
  //        return 'edge';
  //      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
  //        return 'opera';
  //      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
  //        return 'chrome';
  //      case agent.indexOf('trident') > -1:
  //        return 'ie';
  //      case agent.indexOf('firefox') > -1:
  //        return 'firefox';
  //      case agent.indexOf('safari') > -1:
  //        return 'safari';
  //      default:
  //        return 'other';
  //    }
  //  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
    document.body.classList.add('authentication-bg-pattern');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  // this.browserName = this.detectBrowserName();
  /**
   * On submit form
   */
  onSubmit() {
    debugger
    this.submitted = true;
    // console.log("this.loginForm",this.detectBrowserName())
    // console.log("this.loginForm",this.detectBrowserVersion())
    // stop here if form is invalid


    if (this.loginForm.value.username == '') {
      this.errorlogService.logManualValidationError(`login component|onSubmit()|Please Enter Username`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Please Enter Username", icon: 'error', });
      return
    }


    if (this.loginForm.value.password == '') {
      this.errorlogService.logManualValidationError(`login component|onSubmit()|Please Enter Password`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Please Enter Password", icon: 'error', });
      return
    }

    this.loading = true;
    var enteredData = this.loginForm.value;
    enteredData.ipAddress = this.ipAddress;
    enteredData.browserused = this.detectBrowserVersion();
    enteredData.platform = this.platform;
    this.customerService.login(enteredData)
      .pipe()
      .subscribe(
        data => {
          console.log("data2 ", data);
        
          if (data.length == 0) {
            this.errorlogService.logManualValidationError(`login component|onSubmit() 2|Invalid login Credentials`);
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Invalid login Credentials", icon: 'error', });
          }else if (data.message) {
            Swal.fire(data.message)
          } else {
            this.cookieService.setCookie('login', "true", 1);

            this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
            var dashboardurl = this.currentUser ? JSON.parse(this.currentUser)[0]?.dashboardurl : "";
             if (dashboardurl) {
              this.router.navigate([dashboardurl]).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate([this.returnUrl]).then(() => {
                window.location.reload();
              });
            }
            

          }
        },
        error => {
          this.errorlogService.logManualValidationError(`login component|onSubmit() 3|Invalid Credentials`);
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Invalid Credentials", icon: 'error', });
          this.loading = false;
        });
  }
}
