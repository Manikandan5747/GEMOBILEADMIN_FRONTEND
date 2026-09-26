import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { AdvancePaymentFormComponent } from '../advance-payment-form/advance-payment-form.component';
import { AdvanceService } from '../advance.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-advance-payment',
  templateUrl: './edit-advance-payment.component.html',
  styleUrls: ['./edit-advance-payment.component.css']
})
export class EditAdvancePaymentComponent implements OnInit {
  loading: boolean = false;
  isShowErrors: boolean = false;
  advanceid: any ;
  @ViewChild(AdvancePaymentFormComponent, { static: false })
  editForm!: AdvancePaymentFormComponent;
  user: any;
  error!: '';
  customerList: any;
  currentUser: any;
  brandlogopath: any;
  accountid: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditAdvancePaymentComponent>,
  public advanceService: AdvanceService, private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.advanceid = datas.advanceid
    this.brandlogopath = datas.brandlogopath;
    this.accountid =  datas.accountid;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }


  private fillForm(parsedData: any) {debugger
    this.editForm.addEditForm.patchValue({
      advancerefno: parsedData.advancerefno,
      carshowroom_id: parsedData.carshowroom_id,
      duedate: parsedData.duedate,
      accountid: parsedData.accountid,
      description: parsedData.description,
      advanceamount: parsedData.advanceamount,
      advancedoc: parsedData.advancedoc,
      contactid: parsedData.contactid,
      status: parsedData.status == 'Active' ? '1':'0',
      modeofpayment:parsedData.modeofpayment,
      forpaymentof:parsedData.forpaymentof,
      narrationnote:parsedData.narrationnote,
      recievedby:parsedData.recievedby,
      isrelated_module :this.data.isrelated_module
    });
  }


  public update() {
    debugger
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.editForm.addEditForm.value;
      enteredData.advanceid = this.data.advanceid;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;

      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      formData.append("updateadvancedoc", enteredData.advancedoc && enteredData.advancedoc[0]);

      this.advanceService.updateAdvance(formData,this.data.advanceid).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.message == "Brand Name already exsits") {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${response.message}`);
            this.handleError(response.message);
            return
          } else {
            this.success(response.message);
            
            this.dialogRef.close('Success');
          }
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
        })
    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'addForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

}
