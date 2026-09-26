import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { AddEditUserRoleFormComponent } from '../add-edit-user-role-form/add-edit-user-role-form.component';
import { UserRoleService } from 'src/app/service/user-role/user-role.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.css']
})
export class AddUserRoleComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditUserRoleFormComponent,{ static: false })
  public addForm!: AddEditUserRoleFormComponent;
  user: any;
  ipAddress: any;
  currentUser: any;
  constructor(private http:HttpClient,private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddUserRoleComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private userRoleService: UserRoleService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
   this.getIPAddress();
  }

  getIPAddress()
  {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }


  public save() {debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      const enteredData = this.addForm.addEditForm.value;
      enteredData.ipaddress = this.ipAddress;
      enteredData.userid = obj[0]?.login_id;  
        this.userRoleService.createUserRole(enteredData).subscribe(
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

