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
  selector: 'app-add-corporate-partners',
  templateUrl: './add-corporate-partners.component.html',
  styleUrls: ['./add-corporate-partners.component.css']
})
export class AddCorporatePartnersComponent implements OnInit {
  title = "Create Corporate Partner";
  @Input('isShowErrors')
  isShowErrors!: boolean;

  imageBase64: any | ArrayBuffer = "assets/images/iconupload.png";
  imagePath: any;
  message!: string;
  loading:boolean=false;
  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  currentUser: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
    private formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<AddCorporatePartnersComponent>, private fb: FormBuilder, private corporatePartnersService: CorporatePartnersService,private errorlogService: ErrorlogService) { }

  get f() {
    return this.addEditForm.controls;
  }

  async ngAfterViewInit() {

    await this.corporatePartnersService.corporatepartnersmax().pipe()
      .subscribe((data: any) => {
        console.log("corporatepartnersmax ", data);
        let count = parseInt(data.count) + 1;
        this.addEditForm.patchValue({
          corporatepartnercode: "GE00" + count.toString(),

        });
      })
  }

  async ngOnInit() {
    debugger


    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.addEditForm = this.fb.group({
      "corporatepartnername": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "corporatepartnercode": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "status": ['1'],
      "created_by": [''],
      "modified_by": [''],
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
    if (this.addEditForm.invalid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      return
    }
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    var formData = new FormData();
    var enteredData = this.addEditForm.value;
    enteredData.userid = obj[0]?.login_id;
    for (let ele in enteredData) {
      formData.append(ele, enteredData[ele]);
    }
    formData.append("imgs", this.imagePath[0]);

    this.corporatePartnersService.createRecords(formData).subscribe(
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
