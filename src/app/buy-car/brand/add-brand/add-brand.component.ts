import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { AddEditBrandFormComponent } from '../add-edit-brand-form/add-edit-brand-form.component';
import { BrandService } from 'src/app/service/brand/brand.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})
export class AddBrandComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditBrandFormComponent,{ static: false })
  public addForm!: AddEditBrandFormComponent;
  user: any;
  currentUser: any;
  constructor(private cookieService: CookieService,
    private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddBrandComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private brandService: BrandService,private errorlogService: ErrorlogService) { }

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



      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }

      if (!enteredData.brandImg || !enteredData.brandImg.size) {
        this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm Brand Logo is mandatory`);
        this.handleError("Brand Logo is mandatory");
        return;
      }
      formData.append("imgs", enteredData.brandImg);

        this.brandService.createBrand(formData).subscribe(
          (response:any) => {
            if(response.message == "The brand name already exists"){
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
              return
            }else{
              this.success(response.message);
              this.dialogRef.close('Success');
            }
        
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
    // this.dialogRef.close('Success');
  }

  reset() {
    this.addForm.addEditForm.reset();
  }

}

