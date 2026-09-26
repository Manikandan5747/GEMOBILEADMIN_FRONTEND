import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditContactFormComponent } from '../add-edit-contact-form/add-edit-contact-form.component';
import { ContactService } from '../contact.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-edit-contact',
  templateUrl: './add-edit-contact.component.html',
  styleUrls: ['./add-edit-contact.component.css']
})
export class AddEditContactComponent implements OnInit,OnDestroy {
  loading:boolean=false;
  contactid: any;
  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditContactFormComponent,{ static: false })
  addForm!: AddEditContactFormComponent;
  countryid: any;
  stateid: any;
  cityid: any;
  storage_data_id: any;

  constructor(private formValidationService: FormValidationService, 
    private pushNotificationService:PushNotificationsService,private dataService: DataService,
    private route: ActivatedRoute,private router: Router, private contactService:ContactService, private cookieService: CookieService,private errorlogService: ErrorlogService
   ) { 

    this.storage_data_id = this.dataService.getData('storage_data_id');
    
    if(this.storage_data_id){
      this.getRecord(this.storage_data_id);
    }else{
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    }
    
    
   }

   
   public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.contactid = response?.data['contactid'];


        this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
        if (this.contactid) {debugger
          this.contactService.getByID(this.contactid).pipe()
            .subscribe(async (data: any) => {
              console.log("getByIdcontactid", data);
              this.countryid=data.countryid;
              this.stateid=data.stateid;
              this.cityid=data.cityid;
              setTimeout(() => {
                this.fillForm(data);
              }, 1000);
             
            });
        }
        
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }
   
   async ngOnInit(): Promise<void> {
  

  
  }

  public save() {
    if(this.contactid){
  this.update();
  return
    }
    this.isShowErrors = true;
    this.loading = true;
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
        (response: any) => {
          this.loading = false;
          if(response.status){
            this.success(response.message);
            this.pushNotificationService.sendMessage(true);

            this.router.navigate(['contact']);
          }else{
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
            this.handleError(response.message);
          }
        },
        (err: HttpErrorResponse) => {
          console.log("err", err);
          this.loading = false;
          this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
          this.handleError(err);
        })
    }else{
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
      this.loading = false;
    }
  }

  private fillForm(parsedData:any) {
    this.addForm.addEditForm.patchValue({
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


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    // this.dialogRef.close('Success');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    // this.dialogRef.close('Success');
  }

  public async update() {
    
    this.isShowErrors = true;
  
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.addForm.addEditForm.value;

      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      enteredData.contactid = this.contactid;
      
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
      
      this.contactService.updateContact(formData,this.contactid).subscribe(
        (response: any) => {
          this.loading = false;
          this.success(response.message);
          this.pushNotificationService.sendMessage(true);

          this.router.navigate(['contact']);
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err.error.message}`);
          this.handleError(err.error.message);   
          this.loading = false;
        }
      )

    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    }
  }

  ngOnDestroy() {
    this.dataService.clearData('storage_data_id');
  }

}
