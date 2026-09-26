import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { ConsignmentService } from '../consignment.service';
import { ConsignmentFormComponent } from '../consignment-form/consignment-form.component';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-consignment',
  templateUrl: './edit-consignment.component.html',
  styleUrls: ['./edit-consignment.component.css']
})
export class EditConsignmentComponent implements OnInit {
  loading: boolean = false;
  isShowErrors: boolean = false;
  consignmentid: any;
  @ViewChild(ConsignmentFormComponent, { static: false })
  editForm!: ConsignmentFormComponent;
  user: any;
  error!: '';
  customerList: any;
  currentUser: any;
  brandlogopath: any;
  accountid: any;
  signature_status: any;
  status: any;
  carshowroom_id: any;
  allowStatusFieldActive: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditConsignmentComponent>,
    public consignmentService: ConsignmentService, private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.consignmentid = datas.consignmentid;
    this.accountid = datas.accountid;
    this.signature_status = datas.signature_status;
    this.status = datas.status;
    this.carshowroom_id = datas.carshowroom_id;
    this.allowStatusFieldActive = datas.allowStatusFieldActive;

    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }


  private fillForm(parsedData: any) {
    debugger
    this.editForm.addEditForm.patchValue({
      consignmentrefno: parsedData.consignmentrefno,
      carshowroom_id: parsedData.carshowroom_id,
      consignmentstartdate: parsedData.consignmentstartdate,
      consignmentenddate: parsedData.consignmentenddate,
      consignmentexpirydate: parsedData.consignmentexpirydate,
      // accountid: parsedData.accountid,
      description: parsedData.description,
      consignmentamount: parsedData.consignmentamount,
      consignmentdoc: parsedData.consignmentdoc,
      status: parsedData.status == 'Active' ? '1' : '0',
      contactid: parsedData.contactid,


      commissionpayment: parsedData.commissionpayment,
      commissionpercentage: parsedData.commissionpercentage,
      durationagreement: parsedData.durationagreement,
      showroomfreeofcharge: parsedData.showroomfreeofcharge && parsedData.showroomfreeofcharge.toString(),
      showroomchargepermonth: parsedData.showroomchargepermonth,
      liableamount: parsedData.liableamount,
      isrelated_module: this.data.isrelated_module

    });
  }


  // ALTER TABLE app_consignmentdettb
  // ADD COLUMN commissionpayment DECIMAL(10, 2),
  // ADD COLUMN commissionpercentage DECIMAL(5, 2),
  // ADD COLUMN durationagreement INT,
  // ADD COLUMN showroomfreeofcharge INT,
  // ADD COLUMN showroomchargepermonth DECIMAL(10, 2),
  // ADD COLUMN liableamount DECIMAL(10, 2);


  public update() {
    debugger
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      this.loading = true;
      const enteredData = this.editForm.addEditForm.value;
      enteredData.consignmentid = this.data.consignmentid;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;

      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      formData.append("updateconsignmentdoc", enteredData.consignmentdoc && enteredData.consignmentdoc[0]);

      this.consignmentService.updateConsignment(formData, this.data.consignmentid).subscribe(
        (response: any) => {
          this.loading = false;
          if (response.message == "Brand Name already exsits") {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${response.message}`);
            this.handleError(response.message);
            return
          } else {
            this.success(response.message);
            this.dialogRef.close('Success');
          }
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
          this.loading = false;
        })
    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

}
