import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditContactFormComponent } from '../add-edit-contact-form/add-edit-contact-form.component';
import { AccountService } from '../account.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { Validators } from '@angular/forms';
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
  @ViewChild(AddEditContactFormComponent, { static: false })
  editForm!: AddEditContactFormComponent;
  countryid: any;
  stateid: any;
  cityid: any;
  accountid: any;
  leadtype: any;
  carownertypeid: any;
  loading: boolean = false;
  salestype: any;
  hiddenleadtype: boolean =true;
  purchasedetails: any;
  salesorderdetails: any;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditContactFormComponent>,private formValidationService: FormValidationService,
    private accountService: AccountService, private pushNotificationService:PushNotificationsService,private cookieService: CookieService,private errorlogService: ErrorlogService) {

  }

  ngOnInit() {
    debugger
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.carownertypeid = this.data && this.data.carownertypeid;
    this.countryid = this.data.countryid;
    this.stateid = this.data.stateid;
    this.accountid= this.data.accountid;
    this.salestype = this.data.salestype;
    this.hiddenleadtype=true;
    this.salesorderdetails= this.data.salesorderdetails;
    this.purchasedetails = this.data.purchasedetails;
    setTimeout(() => {
      this.fillForm(datas);


      // if(this.purchasedetails){
      //   const emiratesidControl = this.editForm.addEditForm.controls['emiratesid'];
      //   const trafficfilenoControl = this.editForm.addEditForm.controls['trafficfileno'];

      //   emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);
      //   emiratesidControl.updateValueAndValidity();
      //   trafficfilenoControl.setValidators([Validators.required]);
      //   trafficfilenoControl.updateValueAndValidity();
        
      // }

      if(this.salesorderdetails){
        const trafficfilenoControl = this.editForm.addEditForm.controls['trafficfileno'];
        trafficfilenoControl.setValidators([Validators.required]);
        trafficfilenoControl.updateValueAndValidity();
      }
    }, 200);

  
  }

  private async fillForm(parsedData: any) {

    let arr:any =[];
    parsedData.typeid && parsedData.typeid.forEach((element) => {
      let ele = parseInt(element);
      arr.push(ele);
    });

    this.editForm.addEditForm.patchValue({
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
      status: parsedData.status == 1 ? '1' : '0',
      nationality: parsedData.nationality,
      emiratesid: parsedData.emiratesid,
      mobile: parsedData.mobile,
      trafficfileno: parsedData.trafficfileno,
      email: parsedData.email,
      salutation:parsedData.salutation,
      tradelicencedoc:parsedData.tradelicencedoc,
      bankid:parsedData.bankid,
      passportnumber:parsedData.passportnumber,
      backemiratesdoc: parsedData.backemiratesdoc,
      accountholdername:parsedData.accountholdername,
      accountnumber:parsedData.accountnumber,
      ifsccode:parsedData.ifsccode,
      trnnumber:parsedData.trnnumber,
      leadtype:parsedData?.leadtype,
      contactneeded:parsedData?.contactneeded
    });
   
    // let findtheleadtype = await this.accountService.findtheleadtype(parsedData.accountname).toPromise();
    this.leadtype = parsedData.leadtype;
    console.log("leadtype",parsedData.leadtype);

    const tradelicennoControl = this.editForm.addEditForm.controls['tradelicenno'];
    const trnnumberControl = this.editForm.addEditForm.controls['trnnumber'];
    const emiratesidControl = this.editForm.addEditForm.controls['emiratesid'];
    // const trafficfilenoControl = this.editForm.addEditForm.controls['trafficfileno'];
    const nationalityControl = this.editForm.addEditForm.controls['nationality'];
    if (this.leadtype) {
      if (this.leadtype == "company") {
        tradelicennoControl.setValidators([Validators.required]);
        trnnumberControl.setValidators([Validators.required]);
        nationalityControl.setValidators([]);
      } else {
        nationalityControl.setValidators([Validators.required]);
        // trafficfilenoControl.setValidators([Validators.required]);
        emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);

        tradelicennoControl.clearValidators();
        trnnumberControl.clearValidators();
      }
      // trafficfilenoControl.updateValueAndValidity();
      emiratesidControl.updateValueAndValidity();
      trnnumberControl.updateValueAndValidity();
      tradelicennoControl.updateValueAndValidity();
      nationalityControl.updateValueAndValidity();
    }

    const passportnumberControl = this.editForm.addEditForm.controls['passportnumber'];
    if (this.salestype) {
      if (this.salestype == "localsale") {
        passportnumberControl.clearValidators();
      } else {
        passportnumberControl.setValidators([Validators.required]);
      }
      passportnumberControl.updateValueAndValidity();
    }

  }


  public async update() {
    debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.editForm.addEditForm);
    if (this.editForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.editForm.addEditForm.value;

      // if(this.carownertypeid && (enteredData.vehicleregistrationcard == "" || enteredData.vehicleregistrationcard == null)){
      //   this.handleError("Vehicle Registration Card Document is Mandatory.");
      //   this.loading = false;
      //   return
      // }
      
      if(this.leadtype == "company" && (!enteredData.tradelicencedoc)){
        this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm Trade license document is mandatory.`);
        this.handleError("Trade license document is mandatory.");
        this.loading = false;
        return
      }

      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      enteredData.accountid = this.data.accountid;
      
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
      
// // Append updateemiratesdoc
// formData.append("updateemiratesdoc", enteredData.emiratesdoc && enteredData.emiratesdoc.length > 0 ? enteredData.emiratesdoc[0] : '');

// // Append updatetradelicencedoc
// formData.append("updatetradelicencedoc", enteredData.tradelicencedoc && enteredData.tradelicencedoc.length > 0 ? enteredData.tradelicencedoc[0] : '');

// // Append updatevehicleregistrationcarddoc
// formData.append("updatevehicleregistrationcarddoc", enteredData.vehicleregistrationcard && enteredData.vehicleregistrationcard.length > 0 ? enteredData.vehicleregistrationcard[0] : '');

      
      this.accountService.update(formData,this.data.accountid).subscribe(
        (response: any) => {
          this.loading = false;
          this.success("Account Updated Successfully");
          this.pushNotificationService.sendMessage(true);
          this.dialogRef.close('Success');
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
        }
      )

    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
    // this.alertService.success('Saved successfully');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    // this.dialogRef.close('Success');
    //  this.alertService.success(error);
  }

  reset() {
    this.editForm.addEditForm.reset();
  }


}

