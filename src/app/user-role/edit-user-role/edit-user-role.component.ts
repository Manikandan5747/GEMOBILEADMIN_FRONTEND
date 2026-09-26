import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AddEditUserRoleFormComponent } from '../add-edit-user-role-form/add-edit-user-role-form.component';
import { UserRoleService } from 'src/app/service/user-role/user-role.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.css']
})
export class EditUserRoleComponent implements OnInit {
  isShowErrors: boolean = false;
  action: any = "action";
  @ViewChild(AddEditUserRoleFormComponent,{ static: false })
  editForm!: AddEditUserRoleFormComponent;
  user: any;
  error!: '';
  customerList: any;
  ipAddress: any;
  currentUser: any;
  constructor(private http:HttpClient, @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditUserRoleComponent>,
  private userRoleService: UserRoleService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() { 
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.getIPAddress();
    var datas = this.data;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

  getIPAddress()
  {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }


private fillForm(parsedData:any) {
  this.editForm.addEditForm.patchValue({
    rolename: parsedData.rolename,
    status: parsedData.status == 1 ? '1' : '2',
    dashboardurl:parsedData.dashboardurl
  });
}


public update() { 
  debugger
  this.isShowErrors = true;
  if (this.editForm.addEditForm.valid) {
    const enteredData = this.editForm.addEditForm.value;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.role_id = this.data.role_id;
      enteredData.userid = obj[0]?.login_id;      
      enteredData.ipaddress = this.ipAddress;
     
      this.userRoleService.updateUserRole(enteredData).subscribe(
        (response:any) => {
          this.success(response.message); 
          this.dialogRef.close('Success');
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
