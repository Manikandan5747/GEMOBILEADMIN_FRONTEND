import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { AddEditManageModuleFormComponent } from '../add-edit-manage-module-form/add-edit-manage-module-form.component';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-manage-module',
  templateUrl: './add-manage-module.component.html',
  styleUrls: ['./add-manage-module.component.css']
})
export class AddManageModuleComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditManageModuleFormComponent,{ static: false })
  public addForm!: AddEditManageModuleFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddManageModuleComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private manageModuleService:ManageModuleService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

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

      // if(enteredData.ismisc && enteredData.miscItems.length == 0){
      //    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Misc Items Zero", icon: 'error', });
      //    return
      // }
        this.manageModuleService.createModule(enteredData).subscribe(
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

