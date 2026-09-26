import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import Swal from 'sweetalert2';
import { ServiceAdvisorService } from '../service-advisor.service';
import { ErrorlogService } from 'src/app/errorlog.service';



@Component({
  selector: 'app-edit-servise-advisor',
  templateUrl: './edit-servise-advisor.component.html',
  styleUrls: ['./edit-servise-advisor.component.css']
})
export class EditServiseAdvisorComponent implements OnInit {

  title = "Service Advisor";
  @Input('isShowErrors')
  isShowErrors!: boolean;

  imageBase64: any | ArrayBuffer = "assets/images/iconupload.png";
  imagePath: any = [];
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  currentUser: any;
  minFromDate: any;
  loading: boolean=false;
  endDate!: Date;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
    private formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<EditServiseAdvisorComponent>, private fb: FormBuilder, private serviceAdvisorService: ServiceAdvisorService,private errorlogService: ErrorlogService) { }

  get f() {
    return this.addEditForm.controls;
  }

  async ngOnInit() {

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.addEditForm = this.fb.group({
      "name": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "phone": [''],
      "email": [''],
      "crmrole__name":[''],
      "workshift":[''],
      "status": ['1'],
      "type": ['bodyshop'],
      "location__name":[''],
      "leavestatus":['']
    });
    console.log("this.data", this.data);

    this.fillForm(this.data);
    this.imageBase64 = this.data.imgpath;
    this.endDate = new Date(this.data.leaveenddate); // Example end date
     // Subscribe to valueChanges observable
     this.addEditForm.controls['leavestatus'].valueChanges.subscribe(value => {
      // console.log(value);
      
      this.onLeaveStatusChange(value);
    });

  }

  private fillForm(parsedData: any) {
    this.addEditForm.patchValue({
      "name": parsedData.name,
      "phone": parsedData.phone,
      "email": parsedData.email,
      "crmrole__name": parsedData.crmrole__name,
      "status": parsedData.status == "1" ? '1' : '0',
      "type": parsedData.type == "bodyshop" ? 'bodyshop' : 'workshop',
      "workshift":parsedData.workshift,
      "location__name":parsedData?.location__name,
      "leavestatus":parsedData?.leavestatus.toString()
    });
  }


  async onFileChanged(event: any) {
    debugger
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imageBase64 = reader.result;
      // event.target.files.filename = this.imagePath[0].name;
      // this.addEditForm.value.img = this.imagePath[0].File;
    }
  }





  public save() {
    debugger
    this.isShowErrors = true;
    this.loading = true;
    this.formValidationService.markFormGroupTouched(this.addEditForm);
    if (this.addEditForm.invalid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      return
    }
  //   if ((this.imagePath && this.imagePath.length == 0) && !this.imageBase64) {
  //     Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Image is mandatory", icon: 'error', });
  //   return
  // }
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    var formData = new FormData();
    var enteredData = this.addEditForm.value;
    enteredData.userid = obj[0]?.login_id;
    enteredData.appservice_id = this.data.appservice_id;
    enteredData.imgpath = this.imageBase64;

     for (let ele in enteredData) {

      formData.append(ele, enteredData[ele]);
    }

    if (this.imagePath && this.imagePath.length > 0) {
      formData.append("imgpath", this.imagePath[0]);
    }

    this.serviceAdvisorService.updateRecords(formData, this.data.appservice_id).subscribe(
      (response: any) => {

        if (response.code == 500) {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
          this.handleError(response.message);
        } else {
          this.loading = false;
          this.dialogRef.close('Success');
        }

      });
  }




  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 5000, title: error, icon: 'error', });
  this.loading = false;
}


onLeaveStatusChange(event: any): void {
  const leaveStatus = event;
  console.log("leaveStatus",leaveStatus);
  
  const today = new Date();

  if (leaveStatus === '0' && this.endDate > today) {
    // Show alert or handle validation
    this.errorlogService.logFormErrors(this.addEditForm, `addEditForm Leave End Date has not yet been reached`);
    this.handleError('Leave End Date has not yet been reached');
    // Optionally, you can use MatSnackBar for a nicer alert
 
    this.addEditForm.patchValue({
      "leavestatus": '1',})
   
  }
}


// onRadioChange(event: any) {
//   let selectedValue = event.value;
//   console.log('Selected value:', this.data);
//    if(this.data.leavestartdate == null && selectedValue == 1){
//     Swal.fire({
//       title: "Please add a leave date through the + button",
//       icon: 'info',
//       showCancelButton: false,
//       confirmButtonColor: '#3085d6',
//       confirmButtonText: 'OK'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.addEditForm.patchValue({ leavestatus: '0' });
//       }
//     });
//     return
//    }
// }

onRadioChange(event: any) {
  let selectedValue = event.value;
  console.log('Selected value:', this.data);
  
  // Check if leaveenddate is null or is a past date
  if ((!this.data.leaveenddate || new Date(this.data.leaveenddate) < new Date()) && selectedValue == 1) { 
    this.errorlogService.logManualValidationError(`edit-service-advisor component|onRadioChange()|Please add a valid future leave date through the + button`);
    Swal.fire({
      title: "Please add a valid future leave date through the + button",
      icon: 'info',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    }).then((result) => {
      // if (result.isConfirmed) {
        this.addEditForm.patchValue({ leavestatus: '0' });
      // }
    });
    return;
  }
}


}
