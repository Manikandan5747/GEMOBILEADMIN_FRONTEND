


import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { ModeOfPaymentService } from '../mode-of-payment.service';
import { AddEditModeOfPaymentFormComponent } from '../add-edit-mode-of-payment-form/add-edit-mode-of-payment-form.component';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-edit-mode-of-payment',
  templateUrl: './edit-mode-of-payment.component.html',
  styleUrls: ['./edit-mode-of-payment.component.css']
})
export class EditModeOfPaymentComponent implements OnInit {

  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditModeOfPaymentFormComponent,{ static: false })
  editForm!: AddEditModeOfPaymentFormComponent;

   
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditModeOfPaymentComponent>,
 private modeOfPaymentService:ModeOfPaymentService,private cookieService: CookieService,private errorlogService: ErrorlogService) {
 
 }

  ngOnInit() {debugger
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    // this.parentmodid = this.data.parentmodid;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

private fillForm(parsedData:any) {
  this.editForm.addEditForm.patchValue({
    modeofpaymentid:parsedData.modeofpaymentid,
    category:parsedData.category && parsedData.category.toString(),
    modeofpayment:parsedData.modeofpayment,
    status: parsedData.status == 1 ? '1' : '0',
  });
}


public update() {
  this.isShowErrors = true;
  if (this.editForm.addEditForm.valid) {
    const enteredData = this.editForm.addEditForm.value;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.modifiedby = obj[0]?.login_id;
      // enteredData.customerId = this.data.customerId;
      enteredData.modeofpaymentid = this.data.modeofpaymentid;
      this.modeOfPaymentService.updateModeofPayment(enteredData,this.data.modeofpaymentid).subscribe(
        (        response: any) => {
          this.success(response);
          this.dialogRef.close('Success');
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
        }
      )
    
  } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
    }
}

private success(message: any) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message.message, icon: 'success', });
  this.dialogRef.close('Success'); 
 // this.alertService.success('Saved successfully');
}

private handleError(error:any) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.dialogRef.close('Success');
//  this.alertService.success(error);
}

reset() {
  this.editForm.addEditForm.reset();
}


}
