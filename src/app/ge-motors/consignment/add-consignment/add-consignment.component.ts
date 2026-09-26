import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ConsignmentFormComponent } from '../consignment-form/consignment-form.component';
import { ConsignmentService } from '../consignment.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-consignment',
  templateUrl: './add-consignment.component.html',
  styleUrls: ['./add-consignment.component.css']
})
export class AddConsignmentComponent implements OnInit {
  loading: boolean = false;
  isShowErrors: boolean = false;
  @ViewChild(ConsignmentFormComponent,{ static: false })
  public addForm!: ConsignmentFormComponent;
  user: any;
  currentUser: any;
  accountid: any;
  allowStatusFieldActive: any;
  constructor(private cookieService: CookieService,private route: ActivatedRoute,
    private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddConsignmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public consignmentService: ConsignmentService,private errorlogService: ErrorlogService) {
      // this.route.queryParams.subscribe(params => {debugger
        this.accountid = this.data.accountid;
         this.allowStatusFieldActive = this.data.allowStatusFieldActive;
      // });
     }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    setTimeout(() => {
      this.addForm.addEditForm.patchValue({
          carshowroom_id: this.data && this.data.carshowroom_id ? this.data.carshowroom_id:null,
          accountid: parseInt(this.accountid),
           isrelated_module:this.data.isrelated_module,
           
      })
  }, 1000);
  }

  public save() {debugger

  



    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      if( enteredData.consignmentdoc &&  enteredData.consignmentdoc.length > 0){
        formData.append("consignmentdoc", enteredData.consignmentdoc[0]);
      }
   
        this.consignmentService.createConsignment(formData).subscribe(
          (response:any) => {
            this.loading = false;
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
            console.log("err",err);
            this.loading = false;
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

