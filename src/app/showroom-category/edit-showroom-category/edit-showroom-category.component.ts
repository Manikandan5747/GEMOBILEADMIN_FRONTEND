import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { ShowroomCategoryService } from 'src/app/service/showroom-category/showroom-category.service';
import { AddEditShowroomCategoryFormComponent } from '../add-edit-showroom-category-form/add-edit-showroom-category-form.component';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-showroom-category',
  templateUrl: './edit-showroom-category.component.html',
  styleUrls: ['./edit-showroom-category.component.css']
})
export class EditShowroomCategoryComponent implements OnInit {

  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditShowroomCategoryFormComponent,{ static: false })
  editForm!: AddEditShowroomCategoryFormComponent;

   
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditShowroomCategoryComponent>,
  private showroomCategoryService:ShowroomCategoryService,private cookieService: CookieService,private errorlogService: ErrorlogService) {
 
 }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    // this.parentmodid = this.data.parentmodid;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

private fillForm(parsedData:any) {
  this.editForm.addEditForm.patchValue({
    srcategoryname:parsedData.srcategoryname,
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
      enteredData.srcategoryid = this.data.srcategoryid;
      this.showroomCategoryService.updateShowroomCategory(enteredData).subscribe(
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
