import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditContactFormComponent } from '../add-edit-contact-form/add-edit-contact-form.component';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { ErrorlogService } from 'src/app/errorlog.service';
@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.css']
})
export class AddEditAccountComponent implements OnInit,OnDestroy {
  isShowErrors: boolean = false;
  @ViewChild(AddEditContactFormComponent, { static: false })
  public addForm!: AddEditContactFormComponent;
  loading: boolean = false;
  user: any;
  currentUser: any;
  accountid: any;
  leadtype!: string;
  countryid: any;
  stateid: any;
  cityid: any;
  storage_data_id: any;
  constructor(private formValidationService: FormValidationService, private route: ActivatedRoute,private dataService: DataService,
    private accountService: AccountService, private router: Router, private pushNotificationService: PushNotificationsService,
    private cookieService: CookieService,private errorlogService: ErrorlogService
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
        this.accountid = response?.data['accountid'];


        this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
        if (this.accountid) {
          debugger
          this.accountService.getByID(this.accountid).pipe()
            .subscribe(async (data: any) => {
              console.log("getByIdLeads", data);
              this.countryid = data.countryid;
              this.stateid = data.stateid;
              this.cityid = data.cityid;
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
    debugger
    if (this.accountid) {
      this.update();
      return
    }
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;

      var formData = new FormData();
      const typeList = enteredData.typeid;
      console.log("typeList", typeList);

      typeList && typeList.forEach((ele: any) => {
        formData.append("typeList", ele);
      });


      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      if (enteredData.emiratesdoc && enteredData.emiratesdoc.length > 0) {
        formData.append("emiratesdoc", enteredData.emiratesdoc[0]);
      }
      if (enteredData.tradelicencedoc && enteredData.tradelicencedoc.length > 0) {
        formData.append("tradelicencedoc", enteredData.tradelicencedoc[0]);
      }

      if (enteredData.backemiratesdoc && enteredData.backemiratesdoc.length > 0) {
        formData.append("backemiratesdoc", enteredData.backemiratesdoc[0]);
      }

      this.accountService.create(formData).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.status) {
            this.success("Account Created Successfully");
            this.pushNotificationService.sendMessage(true);
            this.router.navigate(['account']);
          } else {
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
            this.handleError(response.message);
          }
        },
        (err: HttpErrorResponse) => {
          console.log("err", err)
          this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
          this.handleError(err);
          this.loading = false;
        })
    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    }
  }

  private async fillForm(parsedData: any) {
    let arr: any = [];
    parsedData.typeid && parsedData.typeid.forEach((element) => {
      let ele = parseInt(element);
      arr.push(ele);
    });
    this.addForm.addEditForm.patchValue({
      accountname: parsedData.accountname,
      accountcode: parsedData.accountcode,
      phonenumber: parsedData.phonenumber,
      typeid: arr,
      fax: parsedData.fax,
      website: parsedData.website,
      address: parsedData.address,
      billingstreet: parsedData.billingstreet,
      cityid: parsedData.cityid && parseInt(parsedData.cityid),
      stateid: parsedData.stateid,
      countryid: parsedData.countryid,
      pincode: parsedData.pincode,
      description: parsedData.description,
      tradelicenno: parsedData.tradelicenno,
      emiratesdoc: parsedData.emiratesdoc,
      backemiratesdoc: parsedData.backemiratesdoc,
      status: parsedData.status == 1 ? '1' : '0',
      nationality: parsedData.nationality,
      emiratesid: parsedData.emiratesid,
      mobile: parsedData.mobile,
      trafficfileno: parsedData.trafficfileno,
      email: parsedData.email,
      salutation: parsedData.salutation,
      tradelicencedoc: parsedData.tradelicencedoc,
      bankid: parsedData.bankid,
      passportnumber: parsedData.passportnumber,
      // vehicleregistrationcard: parsedData.vehicleregistrationcard,
      trnnumber: parsedData.trnnumber,
      accountholdername: parsedData.accountholdername,
      accountnumber: parsedData.accountnumber,
      ifsccode: parsedData.ifsccode,
      leadtype: parsedData?.leadtype,
      contactneeded:parsedData?.contactneeded
    });


    // let findtheleadtype = await this.accountService.findtheleadtype(parsedData.accountname).toPromise();
    // this.leadtype = parsedData.leadtype;
    // console.log("this.leadtype", this.leadtype);

    // const tradelicennoControl = this.addForm.addEditForm.controls['tradelicenno'];
    // const trnnumberControl = this.addForm.addEditForm.controls['trnnumber'];
    // const emiratesidControl = this.addForm.addEditForm.controls['emiratesid'];
    // const trafficfilenoControl = this.addForm.addEditForm.controls['trafficfileno'];

    // if (this.leadtype) {
    //   if (this.leadtype == "company") {
    //     tradelicennoControl.setValidators([Validators.required]);
    //     trnnumberControl.setValidators([Validators.required]);
    //   } else {

    //     trafficfilenoControl.setValidators([Validators.required]);
    //     emiratesidControl.setValidators([Validators.required]);

    //     tradelicennoControl.clearValidators();
    //     trnnumberControl.clearValidators();
    //   }
    //   trafficfilenoControl.updateValueAndValidity();
    //   emiratesidControl.updateValueAndValidity();
    //   trnnumberControl.updateValueAndValidity();
    //   tradelicennoControl.updateValueAndValidity();
    // }

  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.loading = false;
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  public async update() {
    debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    console.log(this.addForm.addEditForm);

    if (this.addForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.addForm.addEditForm.value;



      if (this.leadtype == "company" && (!enteredData.tradelicencedoc)) {
        this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm Trade license document is mandatory.`);
        this.handleError("Trade license document is mandatory.");
        this.loading = false;
        return
      }

      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      enteredData.accountid = this.accountid;

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

      formData.append("updatetradelicencedoc", enteredData.tradelicencedoc && enteredData.tradelicencedoc[0]);
      // formData.append("updatevehicleregistrationcarddoc", enteredData.vehicleregistrationcard && enteredData.vehicleregistrationcard[0]);



      this.accountService.update(formData, this.accountid).subscribe(
        (response: any) => {
          this.success("Account Updated Successfully");
          this.loading = false;
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['account']);
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err.error.message}`);
          this.handleError(err.error.message);
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
