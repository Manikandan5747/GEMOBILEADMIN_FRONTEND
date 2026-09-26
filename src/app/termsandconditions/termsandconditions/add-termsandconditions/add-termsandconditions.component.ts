import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
// import { UsersService } from '../../users.service';
import { TermsandconditionsService } from '../../termsandconditions.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddEditTermsandconditionsComponent } from '../add-edit-termsandconditions/add-edit-termsandconditions.component';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-termsandconditions',
  templateUrl: './add-termsandconditions.component.html',
  styleUrls: ['./add-termsandconditions.component.scss']
})
export class AddTermsandconditionsComponent implements OnInit {

  PageTitel: any = "Create Terms and Conditions";
  isShowErrors: boolean = false;
  @ViewChild(AddEditTermsandconditionsComponent,{ static: false })
  public addForm!: AddEditTermsandconditionsComponent;
  user: any;
  currentUser:any;
  imagePath: any;

  constructor(private cookieService: CookieService,private termsService: TermsandconditionsService,public dialogRef: MatDialogRef<AddTermsandconditionsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private formValidationService:FormValidationService,private errorlogService: ErrorlogService ) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

  }

  public save() {
    const userimage = this.addForm.addEditForm.value.tc_pdf_url;
    var tc_type = this.addForm.addEditForm.value.tc_type;
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {

     
    
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      const enteredData = this.addForm.addEditForm.value;
    
      console.log("enteredData",enteredData);
     
    enteredData.userid = obj[0]?.login_id;


      const formData = new FormData();
      formData.append('img', userimage && userimage[0]);
      for (const ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
formData.set('tc_type',tc_type.toString())
        this.termsService.createTermsandConditions(formData).subscribe(
          (response:any) => {
            if(response.message == "Terms and conditions type already exists"  ){
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
            }
         
            else{
              this.dialogRef.close('Success');
              this.success(response.message);
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
