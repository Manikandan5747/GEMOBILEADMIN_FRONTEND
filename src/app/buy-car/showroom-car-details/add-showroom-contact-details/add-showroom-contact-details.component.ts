import { Component, OnInit,Inject,  ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { AddEditShowroomContactDetailsFormComponent } from '../add-edit-showroom-contact-details-form/add-edit-showroom-contact-details-form.component';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-showroom-contact-details',
  templateUrl: './add-showroom-contact-details.component.html',
  styleUrls: ['./add-showroom-contact-details.component.css']
})
export class AddShowroomContactDetailsComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditShowroomContactDetailsFormComponent,{ static: false })
  public addForm!: AddEditShowroomContactDetailsFormComponent;
  user: any;
  loading:boolean=false;
  showroomdetailsno: any;
  currentUser: any;
  constructor(private cookieService: CookieService,private formValidationService:FormValidationService,private carDetailsService:CarDetailsService,
    public dialogRef: MatDialogRef<AddShowroomContactDetailsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,private errorlogService: ErrorlogService) {
    this.showroomdetailsno =  this.data.showroomdetailsno;
   }

  ngOnInit() {
   
  }

  public save() {debugger
    this.isShowErrors = true;    
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      const enteredData = this.addForm.addEditForm.value;
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.showroomddetid = this.data.showroomddetid;
      enteredData.showroomname = this.data.showroomname;
      enteredData.userid = obj[0]?.login_id;

      debugger
      this.carDetailsService.create(enteredData).subscribe(
        (response: any) => {
          console.log("create response",response)
          if (response.err) {
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
            this.handleError(response.message);
            return
          } else {
            this.success(response.message);
            this.dialogRef.close('Success');
          }
        })
      // this.dialogRef.close(enteredData);
    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

}

