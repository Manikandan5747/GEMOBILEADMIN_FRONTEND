import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditCityFormComponent } from '../add-edit-city-form/add-edit-city-form.component';
import { CarCityService } from 'src/app/service/car-city/car-city.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.css']
})
export class EditCityComponent implements OnInit {

  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditCityFormComponent, { static: false })
  editForm!: AddEditCityFormComponent;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditCityComponent>,
    private carCityService: CarCityService, private cookieService: CookieService, private errorlogService: ErrorlogService) {

  }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    // this.parentmodid = this.data.parentmodid;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

  private fillForm(parsedData: any) {
    this.editForm.addEditForm.patchValue({
      carcityid: parsedData.carcityid,
      carcityname: parsedData.carcityname,
      status: parsedData.status == 1 ? '1' : '0',
    });
  }


  public update() {
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      const enteredData = this.editForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      // enteredData.customerId = this.data.customerId;
      enteredData.carcityid = this.data.carcityid;
      this.carCityService.updateCarCity(enteredData).subscribe(
        (response: any) => {
          this.success(response);
          this.dialogRef.close('Success');
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${err.error.message}`);
          this.handleError(err.error.message);
        }
      )

    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message.message, icon: 'success', });
    this.dialogRef.close('Success');
    // this.alertService.success('Saved successfully');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.dialogRef.close('Success');
    //  this.alertService.success(error);
  }

  reset() {
    this.editForm.addEditForm.reset();
  }


}
