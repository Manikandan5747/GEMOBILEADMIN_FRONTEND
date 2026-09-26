import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AddEditSettingFormComponent } from '../add-edit-setting-form/add-edit-setting-form.component';
import { SettingService } from 'src/app/service/setting/setting.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-setting',
  templateUrl: './edit-setting.component.html',
  styleUrls: ['./edit-setting.component.css']
})
export class EditSettingComponent implements OnInit {
  isShowErrors: boolean = false;
  action: any = "action";
  @ViewChild(AddEditSettingFormComponent,{ static: false })
  editForm!: AddEditSettingFormComponent;
  user: any;
  error!: '';
  currentUser: any;
  customerList: any;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditSettingComponent>,
  private settingService: SettingService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() { 
    var datas = this.data;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

  ngAfterViewInit(){
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }


private fillForm(parsedData:any) {
  this.editForm.addEditForm.patchValue({
    appsettingid:parsedData.appsettingid,
    appsetcategory :parsedData.appsetcategory,  
    appsetparameter :parsedData.appsetparameter,
    appsetparametervalue  :parsedData.appsetparametervalue,
    settingdate_at :parsedData.settingdate_at,
    settingexpirydate_at :parsedData.settingexpirydate_at,
    status: parsedData.status == 1 ? '1' : '0',
    image:parsedData.image
  });
}


public update() { 
  debugger
  this.isShowErrors = true;
  if (this.editForm.addEditForm.valid) {
    const enteredData = this.editForm.addEditForm.value;
      enteredData.appsettingid = this.data.appsettingid;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;

      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      formData.append("updateimagedoc", enteredData.temp_image && enteredData.temp_image[0]);

      this.settingService.updateSetting(formData,this.data.appsettingid).subscribe(
        (response:any) => {
          if(response.message == "Setting Parameter Name already exsits"){
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${response.message}`);
            this.handleError(response.message);
          }else{
            this.success(response.message);
            this.dialogRef.close('Success'); 
          }
         
        
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
        })
  } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
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
