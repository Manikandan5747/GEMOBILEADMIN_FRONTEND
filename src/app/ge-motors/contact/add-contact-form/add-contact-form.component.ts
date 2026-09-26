import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ContactService } from '../contact.service';
import { AddEditContactFormComponent } from '../add-edit-contact-form/add-edit-contact-form.component';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-contact-form',
  templateUrl: './add-contact-form.component.html',
  styleUrls: ['./add-contact-form.component.css']
})
export class AddContactFormComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditContactFormComponent,{ static: false })
  public addForm!: AddEditContactFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,private pushNotificationService:PushNotificationsService,
    public dialogRef: MatDialogRef<AddContactFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private contactService:ContactService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

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
       const typeList = enteredData.typeid;
       for (let ele in typeList) {
         formData.append("typeList", typeList[ele]);
       }
       for (let ele in enteredData) {
         formData.append(ele, enteredData[ele]);
       }
       if( enteredData.emiratesdoc &&  enteredData.emiratesdoc.length > 0){
         formData.append("emiratesdoc", enteredData.emiratesdoc[0]);
       }

       if (enteredData.backemiratesdoc && enteredData.backemiratesdoc.length > 0) {
        formData.append("backemiratesdoc", enteredData.backemiratesdoc[0]);
      }
        this.contactService.createContact(formData).subscribe(
          (response:any) => {
            if(response.status){
              this.success(response.message);
              this.pushNotificationService.sendMessage(true);
              this.dialogRef.close(response);
            }else{
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
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
    // this.dialogRef.close('Success'); 
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    // this.dialogRef.close('Success');
  }

  reset() {
    this.addForm.addEditForm.reset();
  }

}



