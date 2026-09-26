import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AddEditInternalAppVersionComponent } from '../add-edit-internal-app-version/add-edit-internal-app-version.component'; 
import { MobileVersionService } from 'src/app/service/mobile-version/mobile-version.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-internal-app-version',
  templateUrl: './edit-internal-app-version.component.html',
  styleUrls: ['./edit-internal-app-version.component.css']
})
export class EditInternalAppVersionComponent implements OnInit {

  isShowErrors: boolean = false;
    action: any = "action";
    @ViewChild(AddEditInternalAppVersionComponent,{ static: false })
    editForm!: AddEditInternalAppVersionComponent;
    user: any;
    error!: '';
    currentUser: any;
    customerList: any;
    constructor( @Inject(MAT_DIALOG_DATA) public data: any,private cookieService: CookieService,public dialogRef: MatDialogRef<EditInternalAppVersionComponent>,
    private mobileVersionService: MobileVersionService,private errorlogService: ErrorlogService) { }
  
    ngOnInit() { debugger
      var datas = this.data;
      console.log('datas', datas);
      
      setTimeout(() => {
        this.fillForm(datas);
      }, 200);
    }
  
    ngAfterViewInit(){
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    }
  
  
  private fillForm(parsedData:any) {
    this.editForm.addEditForm.patchValue({
      appcategory:parsedData.appcategory,
      app_type:parsedData.app_type == "TECHNICIAN APP" ? 1 : parsedData.app_type == "DRIVER APP" ? 2 : null,
      mandate_update:parsedData.mandateupdate,
      version_description:parsedData.versiondescription,
      appversion:parsedData.appversion,
      appurlapi:parsedData.appurlapi,
      versioncreated_at:parsedData.versioncreated_at,
      status: parsedData.status == "Active" ? '1' : '0',
      appstate:parsedData?.appstate?.toString() || '',
    });
  }
  
  
  public update() {  
    debugger
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      const enteredData = this.editForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
  
        enteredData.appid = this.data.appid;
        this.mobileVersionService.updateInternalAppVersion(enteredData).subscribe(
          (response:any) => {
            this.success(response.message); 
            this.dialogRef.close('Success');
          },
          (err: HttpErrorResponse) => {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${err.error.message}`);
            this.handleError(err.error.message);
          })
    } else {
        this.errorlogService.logFormErrors(this.editForm.addEditForm, 'EditForm');
      }
  }
  
  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success'); 
  }
  
  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

}
