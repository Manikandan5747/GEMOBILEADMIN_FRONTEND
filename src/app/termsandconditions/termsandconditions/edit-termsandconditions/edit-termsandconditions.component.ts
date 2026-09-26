import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { AddEditTermsandconditionsComponent } from '../add-edit-termsandconditions/add-edit-termsandconditions.component';
import Swal from 'sweetalert2';
import { TermsandconditionsService } from '../../termsandconditions.service';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-edit-termsandconditions',
  templateUrl: './edit-termsandconditions.component.html',
  styleUrls: ['./edit-termsandconditions.component.scss']
})
export class EditTermsandconditionsComponent implements OnInit {
  loading:boolean=false;
  isShowErrors: boolean = false;
  action: any = "action";
  @ViewChild(AddEditTermsandconditionsComponent, { static: false })
  editForm!: AddEditTermsandconditionsComponent;
  user: any;
  error!: '';
  currentUser: any;
  PageTitel: any = "Edit Terms and Conditions";
  imageBase64: any;
  tc_pdf_url: any;

  constructor(private cookieService: CookieService,private termsService: TermsandconditionsService, private formValidationService:FormValidationService,@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditTermsandconditionsComponent>,private errorlogService: ErrorlogService
    ) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.tc_pdf_url = this.data.tc_pdf_url;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);



    
  
  }



  private fillForm(parsedData: any) {

 

 
    this.editForm.addEditForm.patchValue({

      "tc_type": parsedData.tc_type,
      "application_id": parsedData.application_id,
      "tc_title": parsedData.tc_title,
      "tc_effective_date": parsedData.tc_effective_date,
      "tc_pdf_url":parsedData.tc_pdf_url,
      "status": parsedData.status == "Active" ? '1' : '0'
    
    });

    
  }

 
 


  
  public update() { 
    debugger
    this.isShowErrors = true;
    // if (this.editForm.addEditForm.valid) {
      this.formValidationService.markFormGroupTouched(this.editForm.addEditForm);

      const enteredData = this.editForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
        // enteredData.role_id = this.data.role_id;
        enteredData.tc_id = obj[0]?.tc_id;  
        enteredData.userid = obj[0]?.login_id;
        const tc_pdf_url = this.editForm.addEditForm.value.tc_pdf_url;
       
  
  
  
        const formData = new FormData();
        formData.append('img', tc_pdf_url[0]);
        for (const ele in enteredData) {
          formData.append(ele, enteredData[ele]);
        }
  
    
       
        this.termsService.updateTermsandConditions(formData,this.data.tc_id).subscribe(
          (response:any) => {
            // this.success(response.message); 
            // this.dialogRef.close('Success');

            
            if(response.message == "Terms and conditions type already exists"  ){
              this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${response.message}`);
              this.handleError(response.message);
            }
            // else if

            //   (response.message && response.message == "Extension code already exists"  ){
            //     this.handleError(response.message);
  
            // }
            else{
              this.dialogRef.close('Success');
              this.success(response.message);
            }
          },
          (err: HttpErrorResponse) => {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${err.error.message}`);
            this.handleError(err.error.message);
          })
    // }
  }

 



  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

  reset() {
    this.editForm.addEditForm.reset();
  }


}
