import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { CorporatePartnersService } from 'src/app/service/corporate-partners/corporate-partners.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-corporate-partners',
  templateUrl: './edit-corporate-partners.component.html',
  styleUrls: ['./edit-corporate-partners.component.css']
})
export class EditCorporatePartnersComponent implements OnInit {
  title = "Edit Corporate Partner";
  @Input('isShowErrors')
  isShowErrors!: boolean;
  loading:boolean=false;
  imageBase64: any | ArrayBuffer = "assets/images/iconupload.png";
  imagePath: any;
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  currentUser: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
    private formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<EditCorporatePartnersComponent>, private fb: FormBuilder, private corporatePartnersService: CorporatePartnersService,private errorlogService: ErrorlogService) { }

  get f() {
    return this.addEditForm.controls;
  }

  async ngOnInit() {
    
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.addEditForm = this.fb.group({
      "corporatepartnername": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "corporatepartnercode": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "status": ['1']
    });
    this.fillForm(this.data);
    this.imageBase64 = this.data.corporatepartnericonpath
  }

  private fillForm(parsedData:any) {
    this.addEditForm.patchValue({
      corporatepartnername: parsedData.corporatepartnername,
      corporatepartnercode:parsedData.corporatepartnercode,
      status: parsedData.status == "Active" ? '1' : '0',
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

    this.formValidationService.markFormGroupTouched(this.addEditForm);
   
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    var formData = new FormData();
    var enteredData = this.addEditForm.value;
    enteredData.userid = obj[0]?.login_id;
    enteredData.partnerid = this.data.partnerid;
    enteredData.corporatepartnericonpath = this.data.corporatepartnericonpath
    for (let ele in enteredData) {
      formData.append(ele, enteredData[ele]);
    }
    if(this.imagePath && this.imagePath.length > 0){
      formData.append("imgs", this.imagePath[0]);
    }
   

    this.corporatePartnersService.updateRecords(formData,this.data.partnerid).subscribe(
      (response: any) => {

        if (response.code == 550) {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
          this.handleError(response.message);
        } else {
          // console.log("response", response);
          this.dialogRef.close('Success');
        }

      });
  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}




}
