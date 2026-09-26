// import { Component, Inject, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import Swal from 'sweetalert2';
// import { OpportunityService } from '../../opportunity/opportunity.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-test-drive-window',
//   templateUrl: './test-drive-window.component.html',
//   styleUrls: ['./test-drive-window.component.css']
// })
// export class TestDriveWindowComponent implements OnInit {
// date:any=new Date();
// time:any;
// customer:any;
//   opportunityid: any;
//   opportunity_details: any;
//   productname:any;
//   constructor(public dialogRef: MatDialogRef<TestDriveWindowComponent>, public opportunityService: OpportunityService,@Inject(MAT_DIALOG_DATA) public data: any,private router: Router,) {
//   }

//   async ngOnInit() {debugger
//     this.opportunityid = this.data.opportunityid;
//     this.opportunity_details=this.data.opportunity_details;
//     const now = new Date();
//     this.time = this.formatTime(now);
//   }

//   formatTime(date: Date): string {
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     return `${hours}:${minutes}`;
//   }

//   async submit() {
//     if(!this.customer){
//       Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Accompanying Test Drive field Mandatory", icon: 'error', });
//       return
//     }
//     this.dialogRef.close();
//     // var navigationExtras = {
//     //   queryParams: { date: this.date, time: this.time,opportunityid:this.opportunityid,index:this.index,customer:this.customer },
//     // };
//     // this.router.navigate(['/opportunity/test-drive'], navigationExtras);
    
//   }

// }
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { TestDriveService } from '../test-drive.service';
import { CookieService } from 'src/app/service/cookie.service';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-test-drive-window',
  templateUrl: './test-drive-window.component.html',
  styleUrls: ['./test-drive-window.component.css']
})
export class TestDriveWindowComponent implements OnInit {
  testDriveForm: FormGroup;
  opportunityid: any;
  opportunity_details: any;
  currentUser: any;
  minDate:any=new Date();
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TestDriveWindowComponent>,public opportunityService:OpportunityService,
    public testDriveService:TestDriveService,private cookieService: CookieService,
    public formValidationService:FormValidationService,
    @Inject(MAT_DIALOG_DATA) public data: any,private errorlogService: ErrorlogService
  ) {
    this.testDriveForm = this.fb.group({
      carshowroom_id: [null, Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      customer: ['', Validators.required],
      testdriverefno:['']
    });
  }

  async ngOnInit(): Promise<void> {

   
      let findnextRefno = await this.opportunityService.getfindnextRefno('TESTDRIVE').toPromise();
      console.log("testdriverefno", findnextRefno);
      this.testDriveForm.patchValue({ testdriverefno: findnextRefno.testdriverefno });
    

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

    this.opportunityid = this.data.opportunityid;
    this.opportunity_details=this.data.opportunity_details;
    const now = new Date();
    let time = this.formatTime(now);
    this.testDriveForm.patchValue({
      date:now,time:time,carshowroom_id:this.opportunity_details[0].carshowroom_id
    })
  }

    formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  submit() {debugger
    this.formValidationService.markFormGroupTouched(this.testDriveForm);
    if (this.testDriveForm.valid) {

      const enteredData = this.testDriveForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      enteredData.opportunityid = this.opportunityid;

      this.testDriveService.createTestDrive(enteredData).subscribe(
        (response:any) => {
          
        })
      // console.log("this.testDriveForm.value",this.testDriveForm.value);
      this.dialogRef.close(this.testDriveForm.value);
    } else {
      this.errorlogService.logFormErrors(this.testDriveForm, 'test drive Form');
    }
  }
}
