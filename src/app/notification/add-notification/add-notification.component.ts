import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { SpecialOfferService } from 'src/app/service/special-offer/special-offer.service';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { CustomerService } from 'src/app/service/customer/customer.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { filter } from 'rxjs-compat/operator/filter';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.css']
})
export class AddNotificationComponent implements OnInit {
  error = '';
  @Input('isShowErrors')
  isShowErrors!: boolean;
  categoryList = ['GE Public Notification', 'Private Notification', 'Specific Notification']
  loading:boolean=false;
  public matcher = new ErrorMatcherService();
  errors = errorMessages;
  currentUser: any;
  public addEditForm!: FormGroup;
  customerList: any;
  approvedCustomerList: any = [];
  userDetailsList: any=[];
  constructor(private customerService: CustomerService, @Inject(MAT_DIALOG_DATA) public data: any, private notificationService: NotificationService,
    private formValidationService: FormValidationService, private cookieService: CookieService,
    public dialogRef: MatDialogRef<AddNotificationComponent>, private fb: FormBuilder,private errorlogService: ErrorlogService) {
  }


  get f() {
    return this.addEditForm.controls;
  }

  async ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

    this.addEditForm = this.fb.group({
      notificationcontent: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      notificationtitle: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      notifytype: ['Private Notification', Validators.required],
      readreceipts: [0],
      fcmtoken: [''],
      created_by: [''],
      modified_by: [''],
      status: [1],
      user_id: ['']
    });

   await this.getAllCustomer();
  }


  async getAllCustomer() {
   this.customerService.getCustomer().pipe()
      .subscribe((data: any) => {
        console.log("registration ", data);
        this.customerList = data;
        this.approvedCustomerList = this.customerList.filter((ele: any) => ele.customerstatus == "Approved");
        this.userDetailsList = this.approvedCustomerList;
      }, error => {
        this.error = error;
      });
  }


  public async save() {
    debugger
    this.isShowErrors = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      return
    }
    this.formValidationService.markFormGroupTouched(this.addEditForm);
    var registration_ids: any[] = [];
    var notificationCredentials: any[] = [];
    var userObj: any = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.addEditForm.value.userid = userObj[0]?.login_id;

    await this.notificationService.getAllapikey_Notify(this.addEditForm.value).subscribe(
      (response: any) => {
        console.log("CreateNotification", response);
        notificationCredentials = response.data;
      });


    this.customerList && this.customerList.forEach((element: any) => {
      if (element.fcmtoken && this.addEditForm.value.notifytype == 'Private Notification' && element.customerstatus == 'Approved') {
        this.addEditForm.value.fcmtoken = element.fcmtoken;
        registration_ids.push(element.fcmtoken);
      }
      //Specific User
      else if (element.fcmtoken && this.addEditForm.value.notifytype == 'Specific Notification' && element.customerstatus == 'Approved' && parseInt(this.addEditForm.value.user_id) == element.reg_id) {
        this.addEditForm.value.fcmtoken = element.fcmtoken;
        registration_ids.push(element.fcmtoken);
      }
    });


    setTimeout(async () => {
      if (this.addEditForm.value.notifytype == 'GE Public Notification') {
        await this.notificationService.getAllapikey_Notify(this.addEditForm.value).subscribe(
          (response: any) => {
            debugger
            console.log("CreateNotification", response);
            notificationCredentials = response.data;

            var gepublicnotification = notificationCredentials && notificationCredentials.find((ele: any) => ele.appsetparameter == "gepublicnotification");
            var obj ={
              "message": {
                "topic": gepublicnotification.appsetparametervalue,
                "notification": {
                  "title": this.addEditForm.value.notificationtitle,
                  "body": this.addEditForm.value.notificationcontent,
                }
              }
            }            
            this.notificationService.publicPushNotification(obj, notificationCredentials).subscribe(
              (response: any) => {
                console.log("publicPushNotification response", response);

                // if(response.success){
                var obj = {
                  "notificationcontent": this.addEditForm.value.notificationcontent,
                  "notificationtitle": this.addEditForm.value.notificationtitle,
                  "notifytype": this.addEditForm.value.notifytype,
                  "readreceipts": 0,
                  "fcmtoken": null,
                  "status": 1,
                  "userid": 18,
                  "messagestatus": response && response.error ? "Failure":"Success"  ,
                  "messagesrc": "WEB"

                }
                this.notificationService.CreateNotification(obj).subscribe(
                  (response: any) => {
                    debugger
                    console.log("CreateNotification", response);
                  });
                this.success("Notification Sent");
                this.dialogRef.close('Success');
              });
          });

      }else if (this.addEditForm.value.notifytype == 'Specific Notification') {
        let Obj =  {
          "message": {
            "token": registration_ids[0],
             "notification": {
              "title": this.addEditForm.value.notificationtitle,
              "body": this.addEditForm.value.notificationcontent,
            },
          }
        };

        await this.notificationService.pushNotification(Obj, notificationCredentials).subscribe(
          (response: any) => {
            console.log("response", response);
           
              var enterData = this.addEditForm.value;
              enterData.messagestatus = response && response.name  ? "Success" : "Failure";
              enterData.messagesrc = "WEB";
  
              this.notificationService.CreateNotification(enterData).subscribe(
                (response: any) => {
                
                  console.log("CreateNotification", response);
                  this.success("Notification Sent");
         this.dialogRef.close('Success');
                });
          });
       } else {

        // Split the registration IDs into chunks
        const chunks = this.chunkArray(registration_ids, 500);

        // Create an array of objects with notification and each chunk of registration IDs
        const resultArray = chunks.map(chunk => {
          // return {
          //   registration_ids: chunk,
          //   notification: {
          //     title: this.addEditForm.value.notificationtitle,
          //     body: this.addEditForm.value.notificationcontent,
          //   },
          // };
          return {
            "message": {
              "token": chunk,
               "notification": {
                "title": this.addEditForm.value.notificationtitle,
                "body": this.addEditForm.value.notificationcontent,
              },
            }
          }
        });

        console.log(resultArray);


        resultArray && resultArray.forEach(async (element,index) => {
         await this.notificationService.pushNotification(element, notificationCredentials).subscribe(
            (response: any) => {
              console.log("response", response);
              if(index == 0){
                var enterData = this.addEditForm.value;
                enterData.messagestatus = response.success == 1 ? "Success" : "Failure";
                enterData.messagesrc = "WEB";
    
             // Find the record with matching reg_id
              // const findRecords = this.approvedCustomerList && this.approvedCustomerList.find((ele: any) => ele.reg_id === this.addEditForm.value.reg_id);
              // const customercode = findRecords && findRecords.customercode ? findRecords.customercode:null;
              // enterData.customercode = customercode;
                this.notificationService.CreateNotification(enterData).subscribe(
                  (response: any) => {
                  
                    console.log("CreateNotification", response);
                  });
              }
            
             
            });
         });  
         
         this.success("Notification Sent");
         this.dialogRef.close('Success');
      }
    }, 5000);




  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}


  public userFiltered(item: any) {
    return this.userDetailsList.find((ele: any) => ele.customername == item.customername);
  }

  chunkArray(array: any, chunkSize: any) {
    const resultArray :any= [];
    for (let i = 0; i < array.length; i += chunkSize) {
      resultArray.push(array.slice(i, i + chunkSize));
    }
    return resultArray;
  }

}
