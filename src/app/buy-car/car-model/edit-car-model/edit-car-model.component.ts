import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ModelService } from 'src/app/service/model/model.service';
import Swal from 'sweetalert2';
import { AddEditCarModelFormComponent } from '../add-edit-car-model-form/add-edit-car-model-form.component';

@Component({
  selector: 'app-edit-car-model',
  templateUrl: './edit-car-model.component.html',
  styleUrls: ['./edit-car-model.component.css']
})
export class EditCarModelComponent implements OnInit {
  isShowErrors: boolean = false;
  action: any = "action";
  @ViewChild(AddEditCarModelFormComponent, { static: false })
  editForm!: AddEditCarModelFormComponent;
  user: any;
  currentUser: any;
  customerList: any;
  alreadyMapped: any;
  brandid:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditCarModelComponent>,
    private modelService: ModelService, private cookieService: CookieService, private errorlogService: ErrorlogService) { }

  ngOnInit() {
    debugger
    var datas = this.data;
    this.alreadyMapped = this.data.alreadyMapped;
     this.brandid = this.data.brandid;
    setTimeout(() => {
      this.fillForm(datas);
    }, 1000);
  }

  ngAfterViewInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

  }


  private fillForm(parsedData: any) {
    this.editForm.addEditForm.patchValue({
      // brandid: parsedData.brandid.toString(),
      modelid: parsedData.modelid,
      modelname: parsedData.modelname,
      modelcode: parsedData.modelcode,
      status: parsedData.status == 1 ? '1' : '0',
    });
  }


  public update() {
    debugger
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      const enteredData = this.editForm.addEditForm.value;
      enteredData.modelid = this.data.modelid;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      this.modelService.updateCarModel(enteredData).subscribe(
        (response: any) => {
          if (response.message == "Model Name already exsits") {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${response.message}`);
            this.handleError(response.message);
            return
          } else {
            this.success(response.message);
            this.dialogRef.close('Success');
          }
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${err.error.message}`);
          this.handleError(err.error.message);
        })
    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'EditForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

}
