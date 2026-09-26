import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AddEditManageModuleFormComponent } from '../add-edit-manage-module-form/add-edit-manage-module-form.component';
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-manage-module',
  templateUrl: './edit-manage-module.component.html',
  styleUrls: ['./edit-manage-module.component.css']
})
export class EditManageModuleComponent implements OnInit {
  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditManageModuleFormComponent, { static: false })
  editForm!: AddEditManageModuleFormComponent;
  parentmodid: any;
  module_id: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditManageModuleComponent>,
    private manageModuleService: ManageModuleService, private cookieService: CookieService, private errorlogService: ErrorlogService) {
    this.parentmodid = this.data.parentmodid;
    this.module_id = this.data.module_id;
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
      module_id: parsedData.module_id,
      modulename: parsedData.modulename,
      routename: parsedData.routename,
      isparent: parsedData.isparent == 1 ? '1' : '0',
      parentmodid: parsedData.parentmodid,
      status: parsedData.status == "Active" ? '1' : '0',
      issystemmenu: parsedData.issystemmenu == 1 ? '1' : '0',
      isreport: parsedData.isreport ? '1' : '0',
      ismisc: parsedData.ismisc == 1 ? '1' : '0',
      app: {
        gemobileadmin: parsedData?.app?.gemobileadmin,
        gemotorsadmin: parsedData?.app?.gemotorsadmin
      },
      privilegekey: parsedData?.privilegekey
    });
  }


  public update() {
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      const enteredData = this.editForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      // enteredData.customerId = this.data.customerId;
      enteredData.module_id = this.data.module_id;
      this.manageModuleService.updateModule(enteredData).subscribe(
        (response: any) => {
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