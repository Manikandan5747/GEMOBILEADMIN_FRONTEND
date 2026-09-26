import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'
import { AddEditCustomerFormComponent } from '../add-edit-customer-form/add-edit-customer-form.component';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { Validators } from '@angular/forms';
import { ErrorlogService } from 'src/app/errorlog.service';
const moment = require('moment');

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  isShowErrors: boolean = false;
  action: any = "action";
  @ViewChild(AddEditCustomerFormComponent, { static: false })
  editForm!: AddEditCustomerFormComponent;
  user: any;
  error!: '';
  customerList: any;
  currentUser: any;
  platform: string = "";
  customertypes: any;
  userpassword: any;
  customerstatus: any;
  loading: boolean = false;
  constructor(private cookieService: CookieService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditCustomerComponent>,
    private formValidationService: FormValidationService,
    private customerService: CustomerService, private notificationService: NotificationService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    setTimeout(() => {
      this.platform = datas?.platform;
      this.customertypes = datas?.customertypes;
      this.userpassword = datas?.userpassword;
      this.customerstatus = datas?.customerstatus;
      this.fillForm(datas);
    }, 200);
    this.getAllCustomer();
  }


  // getAllCustomer() {
  //   this.customerService.getCustomer().pipe()
  //     .subscribe((data: any) => {
  //       console.log("registration ", data);
  //       this.customerList = data;
  //     }, error => {
  //       this.error = error;
  //     });
  // }

  async getAllCustomer() {
  try {
    const data = await this.customerService.getCustomer().toPromise();
    console.log("✅ Registration data:", data);
    this.customerList = data;
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
  }
}



  private fillForm(parsedData: any) {
    this.editForm.addEditForm.patchValue({
      customername: parsedData.customername,
      mobilenumber: parsedData.mobilenumber,
      customerstatus: parsedData.customerstatus,
      customercode: parsedData.customercode,
      status: parsedData.status == 1 ? '1' : '2',
      created_at: parsedData.created_at,
      created_by: parsedData.created_by,
      modified_at: parsedData.modified_at,
      emailid: parsedData.emailid,
      username: parsedData.username,
      userpassword: parsedData.userpassword,
      customertypes: parsedData.customertypes,
      password: parsedData.password,
      dobmonth: parsedData.dobmonth,
      dobday: parsedData.dobday,
      nationalityname: parsedData.nationalityname,
    });
    const customercodeControl = this.editForm.addEditForm.controls['customercode'];
    if (parsedData.customerstatus == "Registered" || parsedData.customerstatus == "OnHold" || parsedData.customerstatus == "Cancel") {
      customercodeControl.setValidators([]);
      customercodeControl.updateValueAndValidity();
    }
  }


  public update() {
    debugger;
    this.loading = true;
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.editForm.addEditForm);
    if (!this.editForm.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
      this.loading = false;
      return
    }
    this.checkCustomerCode();
  }



  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

  reset() {
    this.editForm.addEditForm.reset();
  }


  checkCustomerCode() {
    let customerstatus = this.editForm.addEditForm.get('customerstatus')?.value;
    const control = this.editForm.addEditForm.get('customercode');
    if (!control || control.invalid && customerstatus == 'Approved') {
      this.loading = false;
      return
    };

    const customerCode = this.editForm.addEditForm.get('customercode')?.value;
    const customertypes = this.editForm.addEditForm.get('customertypes')?.value;
    const mobilenumber = this.editForm.addEditForm.get('mobilenumber')?.value;


    if (!customerCode && customerstatus == 'Approved') {
      this.loading = false;
      return
    };
    if (!mobilenumber && customerstatus == 'Approved') {
      this.loading = false;
      return
    };


    this.formValidationService.markFormGroupTouched(this.editForm.addEditForm);
   
    if (customerstatus == 'Approved'){
      this.customerService.checkCustomerExists(customerCode, customertypes, mobilenumber)
      .subscribe(
        (response) => {
          this.loading = false;
          console.log("response", response);

          if (!customerCode.toLowerCase().startsWith('cst')) {
            control?.setErrors({ prefix: true });
          }
          control.markAsTouched();
          control.updateValueAndValidity();
          this.formValidationService.markFormGroupTouched(this.editForm.addEditForm);
          if (response.status) {
            this.loading = false;
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${response.message}`);
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'error', });
            this.editForm.addEditForm.patchValue({ customercode: null });
            return

          }

          this.loading = true;

          if (this.editForm.addEditForm.value.customerstatus == "Cancel") {
            this.editForm.addEditForm.patchValue({
              password: "",
            })
          } else if (this.editForm.addEditForm.value.customerstatus == "OnHold" || this.editForm.addEditForm.value.customerstatus == "Registered") {
          } else {
            if (this.editForm.addEditForm.value.customertypes == 'INDIVIDUAL' && !this.editForm.addEditForm.value.customercode) {
              // this.handleError("Please Enter Customer Code");
              const customercodeControl = this.editForm.addEditForm.controls['customercode'];
              customercodeControl.setValidators([Validators.required]);
              customercodeControl.updateValueAndValidity();
              this.loading = false;
              return;
            }
            if (this.editForm.addEditForm.value.customertypes == 'INDIVIDUAL' && !this.editForm.addEditForm.value.password) {
              this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm Please Enter OTP`);
              this.handleError("Please Enter OTP");
              this.loading = false;
              return;
            }
          }

          if (this.editForm.addEditForm.value.customerstatus == "Approved") {
            if (!this.editForm.addEditForm.value.customercode) {
              const customercodeControl = this.editForm.addEditForm.controls['customercode'];
              customercodeControl.setValidators([Validators.required]);
              customercodeControl.updateValueAndValidity();
              this.loading = false;
              return;
            }
          }

          var customercode = this.editForm.addEditForm.value.customercode ? this.editForm.addEditForm.value.customercode : "";
          let obj = this.customerList && this.customerList.find((o: any) => o.customercode === customercode);
          // console.log("obj",obj)
          if (obj && obj.customercode) {
            if (obj.reg_id != this.data.reg_id) {
              this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm Customer code already exists`);
              this.handleError("Customer code already exists");
              this.loading = false;
              return;
            }
          }



          if (this.editForm.addEditForm.valid) {
            const enteredData = this.editForm.addEditForm.value;
            const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
            enteredData.modified_by = obj[0]?.login_id;
            enteredData.reg_id = this.data.reg_id;
            enteredData.mobilepassword = this.editForm.addEditForm.value.password;


            if (this.customertypes == "CORPORATE" && this.editForm.addEditForm.value.customertypes == 'CORPORATE') {
              delete enteredData.userpassword; // Remove the userpassword field
            }
            this.customerService.updateCustomer(enteredData).subscribe(
              (response: any) => {
                this.loading = false;
                console.log("response", response)
                this.success(response.message);


                var customerstatus = this.editForm.addEditForm.value.customerstatus;
                if (this.editForm.addEditForm.value.customertypes == 'INDIVIDUAL' && customerstatus == 'Approved') {
                  var SecurityPin = this.editForm.addEditForm.value.password;
                  var customername = this.editForm.addEditForm.value.customername;
                  // var date = moment(new Date()).format('DD-MMM-YYYY hh:mm:ss A');
                  var messageContent = "Dear " + customername + ", Your mobile app registration has been approved.Your mobile app security pin is " + SecurityPin + ". KINDLY ENSURE YOUR SECURITY PIN IS NOT SHARED WITH ANYONE."
                  var obj = {
                    "data": this.data,
                    "messageContent": messageContent,
                  }

                  this.notificationService.sendSMS(obj, response.data).subscribe(
                    (response: any) => {
                      console.log("response", response);
                      this.success("Notification Sent");
                      this.dialogRef.close('Success');
                    });
                }
                this.dialogRef.close('Success');
              },
              (err: HttpErrorResponse) => {
                this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
                this.handleError(err.error.message);
              }
            )

          } else {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
            this.loading = false;
          }

        },
        (error) => {
          console.error("Error checking customer code", error);
        }
      );
    }else{ this.loading = true;
      if (this.editForm.addEditForm.valid) {
        const enteredData = this.editForm.addEditForm.value;
        const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
        enteredData.modified_by = obj[0]?.login_id;
        enteredData.reg_id = this.data.reg_id;
        enteredData.mobilepassword = this.editForm.addEditForm.value.password;


        if (this.customertypes == "CORPORATE" && this.editForm.addEditForm.value.customertypes == 'CORPORATE') {
          delete enteredData.userpassword; // Remove the userpassword field
        }
        this.customerService.updateCustomer(enteredData).subscribe(
          (response: any) => {
            this.loading = false;
            console.log("response", response)
            this.success(response.message);
            this.dialogRef.close('Success');
          },
          (err: HttpErrorResponse) => {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
            this.handleError(err.error.message);
          }
        )

      } else {
        this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
        this.loading = false;
      }
    }
   
  }


}
