import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { AddEditMobileVersionFormComponent } from '../add-edit-mobile-version-form/add-edit-mobile-version-form.component';
import { MobileVersionService } from 'src/app/service/mobile-version/mobile-version.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-mobile-version',
  templateUrl: './add-mobile-version.component.html',
  styleUrls: ['./add-mobile-version.component.css']
})
export class AddMobileVersionComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditMobileVersionFormComponent,{ static: false })
  public addForm!: AddEditMobileVersionFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddMobileVersionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private mobileVersionService: MobileVersionService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

  public save() {debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
        this.mobileVersionService.createAppVersion(enteredData).subscribe(
          (response:any) => {
            this.success(response.message);
            this.dialogRef.close('Success');
          },
          (err: HttpErrorResponse) => {
            console.log("err",err)
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
            this.handleError(err);
          })
    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    }
  }

  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success'); 
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.dialogRef.close('Success');
  }

  reset() {
    this.addForm.addEditForm.reset();
  }

}

