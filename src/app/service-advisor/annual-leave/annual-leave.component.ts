import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import Swal from 'sweetalert2';
import { ServiceAdvisorService } from '../service-advisor.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-annual-leave',
  templateUrl: './annual-leave.component.html',
  styleUrls: ['./annual-leave.component.css']
})
export class AnnualLeaveComponent implements OnInit {

  isReadOnlyUser: boolean = true;
  title = "Annual Leave";
  @Input('isShowErrors')
  isShowErrors!: boolean;
  public addEditForm!: FormGroup;
  currentUser: any;
  loading: boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
    private formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<AnnualLeaveComponent>, private fb: FormBuilder, private serviceAdvisorService: ServiceAdvisorService,private errorlogService: ErrorlogService) { }

  get f() {
    return this.addEditForm.controls;
  }

  async ngOnInit() {
    this.isReadOnlyUser = false;

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

    this.addEditForm = this.fb.group({
      leavestartdate:[new Date(), Validators.required],
      leaveenddate:[new Date(), Validators.required],
      leavestatus:['']
    })

    //synced_at: element.synced_at ? moment(element.synced_at).format( "DD-MMM-yyyy hh:mm:ss a") : "-",

    // this.addEditForm = this.fb.group({
    //   leavestartdate: [moment().format('DD-MMM-yyyy'), Validators.required],
    //   leaveenddate: [moment().format('DD-MMM-yyyy'), Validators.required]
    // });


    //console.log("this.data", this.data);

    this.fillForm(this.data);


  }
  private fillForm(parsedData: any) {
    const currentDate = new Date().toISOString().split('T')[0]; 

    this.addEditForm.patchValue({
      "leavestartdate": parsedData.leavestartdate ,
      "leaveenddate": parsedData.leaveenddate,
      "leavestatus":parsedData.leavestatus
    });
  }

  public save() {debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addEditForm);
    if (this.addEditForm.valid) {
      const enteredData = this.addEditForm.value;
      enteredData.appservice_id = this.data.appservice_id;

// Handle leave start date

if (enteredData.leavestartdate) {
  const startDate = this.parseDate(enteredData.leavestartdate);

  if (startDate) { // Check if the date is valid
    enteredData.leavestartdate = this.formatDate(startDate);
  } else {
    console.error('Invalid date:', enteredData.leavestartdate);
    enteredData.leavestartdate = null; // or handle the error appropriately
  }
} else {
  console.error('startdate is undefined');
  enteredData.leavestartdate = null; // or handle the error appropriately
}


// Handle leave end ate
if (enteredData.leaveenddate) {
  const endDate = this.parseDate(enteredData.leaveenddate);

  if (endDate) { // Check if the date is valid
    enteredData.leaveenddate = this.formatDate(endDate);
  } else {
    console.error('Invalid date:', enteredData.leaveenddate);
    enteredData.leaveenddate = null; // or handle the error appropriately
  }
} else {
  console.error('leaveenddate is undefined');
  enteredData.leaveenddate = null; // or handle the error appropriately
}
        this.serviceAdvisorService.createAnnualLeave(enteredData).subscribe(
          (response:any) => {
            
            if(response[0].message == "Error in database"){
              this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response[0].message}`);
              this.handleError(response[0].message);
            }else{
              this.dialogRef.close('Success');
              this.success(response[0].message);
            }
             
             
            },
            (err: HttpErrorResponse) => {
              console.log("err",err)
              this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${err}`);
              this.handleError(err);
            }
          )
    } else {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
    }
  }


  public parseDate(dateString: string): Date | null {
    //console.log("DATESTRING",dateString);
    
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date : null;
  }
  
  public formatDate(date: Date): string {
    //console.log("formatDate");

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}


}
