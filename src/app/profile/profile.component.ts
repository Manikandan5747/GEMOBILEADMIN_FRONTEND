import { Component, OnInit } from '@angular/core';
import { CookieService } from 'src/app/service/cookie.service';
import Swal from 'sweetalert2';
import { CustomerService } from '../service/customer/customer.service';
import { ErrorlogService } from '../errorlog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProfile!: any;
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  newPassword: string = '';
  tempPassword: string = '';
  login_id: any
  email_id:any
  user_name:any

  currentUser: any;

  constructor(private cookieService: CookieService, private customerService: CustomerService, private errorlogService: ErrorlogService, private router: Router) { }

  ngOnInit(): void {
    let currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    let userProfile = currentUser ? JSON.parse(currentUser) : "";
    this.userProfile = userProfile[0];
    this.login_id = userProfile[0].login_id;
    this.email_id = userProfile[0].emailid;
    this.user_name = userProfile[0].username;
    console.log("userProfile", this.userProfile);

  }

  goback() {
    history.back();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  resetPassword() {
    if (!this.newPassword || this.newPassword.trim().length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Please enter a new password'
      });
      return;
    }

    Swal.fire({
      title: 'Confirm Reset',
      text: `Reset password for ${this.userProfile?.username}? You will be logged out and will have to login using new password`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tempPassword = this.newPassword
        this.customerService.changePassword(this.login_id, this.newPassword)
          .pipe()
          .subscribe((data: any) => {
            // console.log("registration ",data); 
            this.success(data.message);

            var obj = {
              subject: "Password Change",
              content: `
                  Dear ` + this.user_name + `,<br/><br/>
                  Your Password has been updated to `+ this.tempPassword +`, Please use your new password to login. 
                  <br/><br/>
                  Best regards,<br/>
                  German Experts
                  `,
              tomail: this.email_id
              // tomail: email
            };

            this.customerService.sendMailtoUser(obj).subscribe(
              async (response: any) => {
                console.log("response", response);
                // Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'success', });
              });


            setTimeout(() => {
              this.logout()
            }, 1000);
          }, error => {
            this.errorlogService.logManualValidationError(`profile component|resetPassword()| error:${error}`);
            this.handleError(error);
          });
        
        this.newPassword = '';
      }
    });
  }


  async logout() {

    localStorage.removeItem('search');
    sessionStorage.clear();
    this.customerService.offlineuser(this.login_id).pipe()
      .subscribe((data: any) => {
        var RoutingConstant = "login";
        localStorage.removeItem('search');
        this.cookieService.deleteCookie('login');
        this.cookieService.deleteCookie('geMobileAdminCurrentUser');
        this.router.navigate(["/" + RoutingConstant]);

      });
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    // this.alertService.success('Saved successfully');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    //  this.alertService.success(error);
  }
}
