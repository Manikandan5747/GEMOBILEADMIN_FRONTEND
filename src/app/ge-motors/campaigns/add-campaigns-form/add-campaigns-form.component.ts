import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditCampaignsFormComponent } from '../add-edit-campaigns-form/add-edit-campaigns-form.component';
import { CampaignsService } from '../campaigns.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-campaigns-form',
  templateUrl: './add-campaigns-form.component.html',
  styleUrls: ['./add-campaigns-form.component.css']
})
export class AddCampaignsFormComponent implements OnInit {
  loading:any=false;
  isShowErrors: boolean = false;
  @ViewChild(AddEditCampaignsFormComponent,{ static: false })
  public addForm!: AddEditCampaignsFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddCampaignsFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private campaignsService:CampaignsService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

  public save() {debugger
    this.isShowErrors = true;
    
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      this.loading =true;
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
        this.campaignsService.createCampaigns(enteredData).subscribe(
          (response:any) => {
            if(response.status){
              this.success(response.message);
              this.loading =false;
              this.dialogRef.close(response.campaignid);
            }else{ this.loading =false;
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
            }
           
           
          },
          (err: HttpErrorResponse) => {
            console.log("err",err)
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
            this.handleError(err);
            this.loading =false;
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

