import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditContactFormComponent } from '../add-edit-contact-form/add-edit-contact-form.component';
import { AccountService } from '../account.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { Validators } from '@angular/forms';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-contact-form',
  templateUrl: './add-contact-form.component.html',
  styleUrls: ['./add-contact-form.component.css']
})
export class AddContactFormComponent implements OnInit {
  isShowErrors: boolean = false;
  loading: boolean = false;
  addhidedetails: boolean = true;
  @ViewChild(AddEditContactFormComponent, { static: false })
  public addForm!: AddEditContactFormComponent;
  user: any;
  currentUser: any;
  carownertypeid: any;
  typeid: any;
  purchasedetails: any;
  accountCategoryType: any;
  constructor(private formValidationService: FormValidationService, private pushNotificationService: PushNotificationsService,
    public dialogRef: MatDialogRef<AddContactFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService, private cookieService: CookieService, private errorlogService: ErrorlogService
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.carownertypeid = this.data && this.data.carownertypeid;
    this.typeid = this.data && this.data.typeid;
    this.purchasedetails = this.data.purchasedetails;
    this.accountCategoryType = this.data.accountCategoryType;
  }

  ngAfterViewInit() {
    this.loading = true;
    setTimeout(() => {

      const leadtypeControl = this.addForm.addEditForm.controls['leadtype'].value;
      const tradelicennoControl = this.addForm.addEditForm.controls['tradelicenno'];
      const trnnumberControl = this.addForm.addEditForm.controls['trnnumber'];
      const emiratesidControl = this.addForm.addEditForm.controls['emiratesid'];
      // const trafficfilenoControl = this.addForm.addEditForm.controls['trafficfileno'];

      if (leadtypeControl) {
        if (leadtypeControl == "company") {
          tradelicennoControl.setValidators([Validators.required]);
          trnnumberControl.setValidators([Validators.required]);
          // trafficfilenoControl.setValidators([]);
          emiratesidControl.setValidators([]);
        } else {
          tradelicennoControl.setValidators([]);
          trnnumberControl.setValidators([]);
          // trafficfilenoControl.setValidators([Validators.required]);
          emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);

          tradelicennoControl.clearValidators();
          trnnumberControl.clearValidators();
        }
        // trafficfilenoControl.updateValueAndValidity();
        emiratesidControl.updateValueAndValidity();
        trnnumberControl.updateValueAndValidity();
        tradelicennoControl.updateValueAndValidity();
      }


      if (this.accountCategoryType) {
        const leadtypeControl = this.addForm.addEditForm.controls['leadtype'];
        leadtypeControl.setValidators([Validators.required]);
        leadtypeControl.updateValueAndValidity();
      }

      this.loading = false;




    }, 4000);
  }

  public save() {
    debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.addForm.addEditForm.value;
      // if(this.carownertypeid && (enteredData.vehicleregistrationcard == "" || enteredData.vehicleregistrationcard == null)){
      //   this.handleError("Vehicle Registration Card Document is Mandatory.");
      //   this.loading = false;
      //   return
      // }    

      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      const typeList = enteredData.typeid;
      var formData = new FormData();
      for (let ele in typeList) {
        formData.append("typeList", typeList[ele]);
      }
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      if (enteredData.emiratesdoc && enteredData.emiratesdoc.length > 0) {
        formData.append("emiratesdoc", enteredData.emiratesdoc[0]);
      }

      if (enteredData.tradelicencedoc && enteredData.tradelicencedoc.length > 0) {
        formData.append("tradelicencedoc", enteredData.tradelicencedoc[0]);
      }

      if (enteredData.backemiratesdoc && enteredData.backemiratesdoc.length > 0) {
        formData.append("backemiratesdoc", enteredData.backemiratesdoc[0]);
      }

      // if( enteredData.vehicleregistrationcard &&  enteredData.vehicleregistrationcard.length > 0){
      //   formData.append("vehicleregistrationcard", enteredData.vehicleregistrationcard[0]);
      // }    


      this.accountService.create(formData).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.status) {
            this.success("Account Created Successfully");
            this.pushNotificationService.sendMessage(true);
            this.dialogRef.close(response);
          } else {
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
            this.handleError(response.message);
          }
        },
        (err: HttpErrorResponse) => {
          console.log("err", err);
          this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
          this.loading = false;
          this.handleError(err);
        })
    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.loading = false;
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  reset() {
    this.addForm.addEditForm.reset();
  }

}



