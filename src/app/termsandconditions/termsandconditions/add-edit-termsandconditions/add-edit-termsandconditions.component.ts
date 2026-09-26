import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TermsandconditionsService } from '../../termsandconditions.service';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';

@Component({
  selector: 'app-add-edit-termsandconditions',
  templateUrl: './add-edit-termsandconditions.component.html',
  styleUrls: ['./add-edit-termsandconditions.component.scss']
})
export class AddEditTermsandconditionsComponent implements OnInit {

  @Input('isShowErrors')
  isShowErrors!: boolean;

  @Input('action')
  action!: any;

  // public matcher = new ErrorMatcherService();
  // errors = errorMessages;  // Used on form html.

  public addEditForm!: FormGroup;

  currentUser: any;
  imagePath: any;
  imageBase64!: any | ArrayBuffer;
  files: any;
  isReadOnlyUser: boolean = true;
  pdfPageCount: any;
  contractTypeList: any=[];

  constructor(private fb: FormBuilder,
    private cookieService: CookieService, private termsandconditionsService: TermsandconditionsService,
    private formValidationService: FormValidationService) {
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.addEditForm.controls;
  }

  async ngOnInit() {
    debugger;

    this.imageBase64 = this.action;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.isReadOnlyUser = false;


    this.addEditForm = this.fb.group({
      tc_type: ['',Validators.required],
      application_id: [''],
      tc_title: ['', Validators.required],
      tc_effective_date: [new Date(), Validators.required],
      tc_pdf_url: [''],
      status: ['1'],
      pdfPageCount: [null]
    });
    this.getContractType();

  }


  getContractType() {
    this.termsandconditionsService.getContractType().pipe()
      .subscribe((data: any) => {
        console.log("getContractType", data);
        this.contractTypeList = data;
      });
  }



  async onFileChanged(event: any) {
    debugger
    this.files = event.target.files;
    if (this.files.length === 0) {
      return;
    }
    // const mimeType = this.files[0].type;
    // if (mimeType.match(/image\/*/) == null) {
    //   alert("Only images are supported");
    //   return;
    // }
    const reader = new FileReader();
    const fileInfo = event.target.files[0];
    this.imagePath = this.files;
    if (fileInfo) {
      reader.readAsBinaryString(fileInfo);
      reader.onloadend = async (ee: any) => {
        const count = await ee.currentTarget.result.match(/\/Type[\s]*\/Page[^s]/g).length;
        this.pdfPageCount = count;
        console.log('Number of Pages:', count);
        this.addEditForm.patchValue({
          tc_pdf_url: this.imagePath,
          pdfPageCount: this.pdfPageCount
        });

      }
    }

  }

  removeImg() {
    this.files = [];
    this.imageBase64 = ""
    this.imagePath = [];
  }


}
