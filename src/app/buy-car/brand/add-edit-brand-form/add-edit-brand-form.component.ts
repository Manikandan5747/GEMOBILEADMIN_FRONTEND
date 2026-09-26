import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CustomerService } from 'src/app/service/customer/customer.service';

@Component({
  selector: 'app-add-edit-brand-form',
  templateUrl: './add-edit-brand-form.component.html',
  styleUrls: ['./add-edit-brand-form.component.css']
})
export class AddEditBrandFormComponent implements OnInit {

  imageBase64: any | ArrayBuffer = "";

  @Input('isShowErrors')
  isShowErrors!: boolean;
  @Input('action')
  action!: any;

  @Input('brandlogopath')
  brandlogopath!: any;

  @Input('company')
  companyInput!: any;



  public matcher = new ErrorMatcherService();
  errors = errorMessages;
  public addEditForm!: FormGroup;
  validationMessages: any;
  message!: string;
  imagePath: any;

  assetImageBase64: any | ArrayBuffer = "";
  assetImagePath: any;
  companyList: any

  @Input('assetlogopath')
  assetlogopath!: any;

  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder, private formValidationService: FormValidationService, private customerService: CustomerService) {
  }

  get f() {
    return this.addEditForm.controls;
  }

  ngOnInit() {
    debugger
    if (this.brandlogopath) {
      this.imageBase64 = this.brandlogopath;
    }

    if (this.assetlogopath) {
      this.assetImageBase64 = this.assetlogopath;
    }

    this.addEditForm = this.fb.group({
      brandname: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      brandcode: ['', [Validators.required, this.formValidationService.noWhitespaceValidator,]],
      status: ['1'],
      remark: [''],
      brandImg: [null],

      company: ['1', [Validators.required]],
      assetbrandname: ['', [this.formValidationService.noWhitespaceValidator]],
      assetstatus: ['1'],
      assetImg: [null]
    });

    if (this.companyInput) {
      this.addEditForm.patchValue({
        company: this.companyInput
      });
    }


    this.customerService.getCompanyList().pipe()
      .subscribe((data: any) => {
        console.log("getCompanyList ", data);
        this.companyList = data;
      });

  }

  cmpChange(cmp_id: number) {
    this.addEditForm.patchValue({
      company: String(cmp_id)
    });
  }


  // async onFileChanged(event: any) {
  //   debugger
  //   const files = event.target.files;
  //   if (files.length === 0) {
  //     return;
  //   }
  //   const mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }
  //   this.addEditForm.patchValue({
  //     brandImg: files[0],
  //   })


  //   const reader = new FileReader();

  //   reader.onload = (e: any) => {
  //       this.imageBase64 = e.target.result; // Preview for images
  //   };


  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]);
  // }


  async onFileChanged(event: any) {
    debugger
    const inputElement = event.target;
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    // Determine which file input was used
    if (inputElement.id === 'imageUpload') {
      this.addEditForm.patchValue({
        brandImg: files[0],
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageBase64 = e.target.result; // Preview for brand logo
      };
      this.imagePath = files;
      reader.readAsDataURL(files[0]);
    }
    else if (inputElement.id === 'assetimageUpload') {
      this.addEditForm.patchValue({
        assetImg: files[0],
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.assetImageBase64 = e.target.result;
      };
      this.assetImagePath = files;
      reader.readAsDataURL(files[0]);
    }
  }

}
