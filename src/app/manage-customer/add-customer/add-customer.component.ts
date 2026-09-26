import { Component, OnInit, Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'
import { AddEditCustomerFormComponent } from '../add-edit-customer-form/add-edit-customer-form.component';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  loading: boolean = false;
  isShowErrors: boolean = false;
  @ViewChild(AddEditCustomerFormComponent, { static: false })
  public addForm!: AddEditCustomerFormComponent;
  user: any;
  isEdit: boolean = false;
  customertypes: string = "CORPORATE";
  currentUser: any;
  constructor(private formValidationService: FormValidationService, public dialogRef: MatDialogRef<AddCustomerComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService, private cookieService: CookieService,
    private notificationService: NotificationService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }


  public async save() {
    this.loading = true;
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (!this.addForm.addEditForm.valid) {
      this.loading = false;
      return
    }
    await this.checkCustomerCode();
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

  reset() {
    this.addForm.addEditForm.reset();
  }


  async checkCustomerCode() {
    let customerstatus = this.addForm.addEditForm.get('customerstatus')?.value;
    const control = this.addForm.addEditForm.get('customercode');
    if (!control || control.invalid && customerstatus == 'Approved') {
      this.loading = false;
      return
    };

    const customerCode = this.addForm.addEditForm.get('customercode')?.value;
    const customertypes = this.addForm.addEditForm.get('customertypes')?.value;
    const mobilenumber = this.addForm.addEditForm.get('mobilenumber')?.value;

    if (!customerCode && customerstatus == 'Approved') {
      this.loading = false;
      return
    };

    if (!mobilenumber && customerstatus == 'Approved') {
      this.loading = false;
      return
    };

    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);

    if (customerstatus == 'Approved') {
      await this.customerService.checkCustomerExists(customerCode, customertypes, mobilenumber)
        .subscribe(
          (response) => {
            console.log("response", response);
            
            if (!customerCode.toLowerCase().startsWith('cst')) {
              control?.setErrors({ prefix: true });
            }
            control.markAsTouched();
            control.updateValueAndValidity();
            this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
            if (response.status) {
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addEditForm ${response.message}`);
              Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'error', });
              this.addForm.addEditForm.patchValue({ customercode: null });
              this.loading = false;
              return
            }

            if (this.addForm.addEditForm.value.customerstatus == "Approved") {
              if (!this.addForm.addEditForm.value.customercode) {
                this.errorlogService.logFormErrors(this.addForm.addEditForm, `addEditForm customer code required`);
                const customercodeControl = this.addForm.addEditForm.controls['customercode'];
                customercodeControl.setValidators([Validators.required]);
                customercodeControl.updateValueAndValidity();
              }
            }

            this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);

            if (this.addForm.addEditForm.valid) {
              const enteredData = this.addForm.addEditForm.value;
              const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
              enteredData.created_by = obj[0]?.login_id;

              this.customerService.createCustomer(enteredData).subscribe(
                (response: any) => {
                  this.loading = false;
                  if (response.messagecode == "409") {
                    this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
                    this.handleError(response.message);
                  } else {
                    this.success(response.message);
                    this.dialogRef.close('Success');
                  }
                },
                (err: HttpErrorResponse) => {
                  console.log("err", err)
                  this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
                  this.handleError(err);
                });
            } else {
              this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
              this.loading = false;
            }
          },
          (error) => {
            this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm Error checking customer code');
            console.error("Error checking customer code", error);
          }
        );
    } else {
      this.loading = true;
      if (this.addForm.addEditForm.valid) {
        const enteredData = this.addForm.addEditForm.value;
        const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
        enteredData.created_by = obj[0]?.login_id;

        this.customerService.createCustomer(enteredData).subscribe(
          (response: any) => {
            this.loading = false;
            if (response.messagecode == "409") {
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
            } else {
              this.success(response.message);
              this.dialogRef.close('Success');
            }
          },
          (err: HttpErrorResponse) => {
            console.log("err", err)
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
            this.handleError(err);
          });
      } else {
        this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
        this.loading = false;
      }
    }


  }

}

