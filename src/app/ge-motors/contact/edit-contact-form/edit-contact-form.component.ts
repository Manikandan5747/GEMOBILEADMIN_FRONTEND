import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditContactFormComponent } from '../add-edit-contact-form/add-edit-contact-form.component';
import { ContactService } from '../contact.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-edit-contact-form',
  templateUrl: './edit-contact-form.component.html',
  styleUrls: ['./edit-contact-form.component.css']
})
export class EditContactFormComponent implements OnInit {

  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditContactFormComponent,{ static: false })
  editForm!: AddEditContactFormComponent;
  countryid: any;
  stateid: any;
  cityid: any;
  contactid: any;


   
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditContactFormComponent>,
 private contactService:ContactService,private cookieService: CookieService,private pushNotificationService:PushNotificationsService,
 private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {
 
 }

  ngOnInit() {debugger
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.countryid= this.data.countryid;
    this.stateid= this.data.stateid;
    this.contactid= this.data.contactid;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

private fillForm(parsedData:any) {
  this.editForm.addEditForm.patchValue({
    contactid:parsedData.contactid,
    firstname: parsedData.firstname,
    lastname: parsedData.lastname,
    accountid: parsedData.accountid,
    phonenumber: parsedData.phonenumber,
    mobile: parsedData.mobile,
    email: parsedData.email,
    address: parsedData.address,
    mailingstreet: parsedData.mailingstreet,
    cityid: parsedData.cityid && parseInt(parsedData.cityid),
    stateid: parsedData.stateid,
    countryid: parsedData.countryid,
    pincode: parsedData.pincode,
    description: parsedData.description,
    status: parsedData.status == 1 ? '1' : '0',
    typeid: parsedData.typeid,
emiratesdoc: parsedData.emiratesdoc,
emiratesid: parsedData.emiratesid,
nationality: parsedData.nationality,
salutation:parsedData.salutation,
backemiratesdoc: parsedData.backemiratesdoc,
  });

}


public update() {debugger
  this.isShowErrors = true;
  this.formValidationService.markFormGroupTouched(this.editForm.addEditForm);
  if (this.editForm.addEditForm.valid) {
    const enteredData = this.editForm.addEditForm.value;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
      enteredData.contactid = this.data.contactid;

       
      var formData = new FormData();
      const typeList = enteredData.typeid;
      for (let ele in typeList) {
        formData.append("typeList", typeList[ele]);
      }
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      formData.append("updateemiratesdoc", enteredData.emiratesdoc && enteredData.emiratesdoc[0]);

      formData.append("updatebackemiratesdoc", enteredData.backemiratesdoc && enteredData.backemiratesdoc[0]);

      this.contactService.updateContact(formData,this.data.contactid).subscribe(
        (        response: any) => {
          this.success(response.message);
          this.pushNotificationService.sendMessage(true);
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

