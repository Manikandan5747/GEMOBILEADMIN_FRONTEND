import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { CampaignsService } from '../campaigns.service';
import { AddEditCampaignsFormComponent } from '../add-edit-campaigns-form/add-edit-campaigns-form.component';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-campaigns-form',
  templateUrl: './edit-campaigns-form.component.html',
  styleUrls: ['./edit-campaigns-form.component.css']
})
export class EditCampaignsFormComponent implements OnInit {
  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditCampaignsFormComponent,{ static: false })
  editForm!: AddEditCampaignsFormComponent;
  campaignid: any;
  loading:any=false;
   
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<EditCampaignsFormComponent>,
 private campaignsService:CampaignsService,private cookieService: CookieService,private errorlogService: ErrorlogService) {
 
 }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.campaignid = this.data.campaignid;
    
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }

private fillForm(parsedData:any) {
  this.editForm.addEditForm.patchValue({
    campaignid:parsedData.carcityid,
    name:parsedData.name, 
    campaignrefno:parsedData.campaignrefno, 
    type:parsedData.type, 
    telestatustemplate:parsedData.telestatustemplate, 
    owner:parsedData.owner, 
    campaignstatus:parsedData.campaignstatus, 
    parentcampaign:parsedData.parentcampaign,
    description:parsedData.description, 
    startdate:parsedData.startdate, 
    enddate:parsedData.enddate, 
    expectedrevenue:parsedData.expectedrevenue, 
    budgetedcost:parsedData.budgetedcost, 
    actualcost:parsedData.actualcost, 
    expectedresponse:parsedData.expectedresponse, 
    status: parsedData.status == 'Active' ? '1' : '0',
  });
}


public update() {
  this.isShowErrors = true;

  if (this.editForm.addEditForm.valid) {
    this.loading =true;
    const enteredData = this.editForm.addEditForm.value;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
      // enteredData.customerId = this.data.customerId;
      enteredData.campaignid = this.data.campaignid;
      this.campaignsService.updateCampaigns(enteredData).subscribe(
        (        response: any) => {
          this.success(response);
          this.loading =false;
          this.dialogRef.close('Success');
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err}`);
          this.handleError(err.error.message);
          this.loading =false;
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

