import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { AdvancePaymentFormComponent } from '../advance-payment-form/advance-payment-form.component';
import { AdvanceService } from '../advance.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-advance-payment',
  templateUrl: './add-advance-payment.component.html',
  styleUrls: ['./add-advance-payment.component.css']
})
export class AddAdvancePaymentComponent implements OnInit {
  isShowErrors: boolean = false;
  loading: boolean = false;
  @ViewChild(AdvancePaymentFormComponent,{ static: false })
  public addForm!: AdvancePaymentFormComponent;
  user: any;
  currentUser: any;
  constructor(private cookieService: CookieService,
    private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddAdvancePaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public advanceService: AdvanceService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    setTimeout(() => {
      this.addForm.addEditForm.patchValue({
          carshowroom_id: this.data.carshowroom_id,
           isrelated_module:this.data.isrelated_module
      })
  }, 1000);
  }

  public save() {debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      if( enteredData.advancedoc &&  enteredData.advancedoc.length > 0){
        formData.append("advancedoc", enteredData.advancedoc[0]);
      }
   
        this.advanceService.createAdvance(formData).subscribe(
          (response:any) => {
            this.loading = false;
            if(response.message == "The brand name already exists"){
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
              return
            }else{
              this.success(response.message);
              this.dialogRef.close('Success');
            }
        
          },
          (err: HttpErrorResponse) => {
            console.log("err",err)
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
            this.loading = false;
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
    // this.dialogRef.close('Success');
  }

  reset() {
    this.addForm.addEditForm.reset();
  }

}

