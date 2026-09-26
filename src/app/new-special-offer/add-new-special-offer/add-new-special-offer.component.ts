import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { NewSpecialOfferService } from '../service/new-special-offer.service';
import { DateAdapter,MAT_DATE_FORMATS, MAT_DATE_LOCALE,} from '@angular/material/core';
import {  AppDateAdapter, DATEPICKER_DATE_FORMATS } from 'src/app/common/format-datepicker';
import { DateFormat } from 'src/app/common/ui.constant';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-new-special-offer',
  templateUrl: './add-new-special-offer.component.html',
  styleUrls: ['./add-new-special-offer.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATEPICKER_DATE_FORMATS },
  ]
})
export class AddNewSpecialOfferComponent implements OnInit {
  loading:boolean=false;
  
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  minFromDate = new Date();
  title = "Special Offer";
  @Input('isShowErrors')
  isShowErrors!: boolean;

  imageBase64: any | ArrayBuffer = "assets/images/iconupload.png";
  imagePath: any;
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  currentUser: any;
  showroomCarDetails: any;
  totalListshowroomCarDetails: any;
  companyList: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
  private carDetailsService: CarDetailsService,
    private formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<AddNewSpecialOfferComponent>, private fb: FormBuilder, private newSpecialOfferService: NewSpecialOfferService,private errorlogService: ErrorlogService) { }

  get f() {
    return this.addEditForm.controls;
  }



  async ngOnInit() {
    debugger
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.addEditForm = this.fb.group({
      "specialoffer_title": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "specialofferdesc": [''],
      "status": ['1'],
      "offer_valid_from":[null,Validators.required],
      "offer_valid_to":[null,Validators.required],
      "promocode": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "specialoffercategoryid":['0',Validators.required],
      "showroomdetid":[''],
      "cmp_id":[null,Validators.required],
      "usagetype":['2',Validators.required]
    });

    this.getAllCarDetails();
     this.newSpecialOfferService.getCompanyList().pipe()
    .subscribe( (data:any) => {
        console.log("companyList",data); 
        this.companyList = data;
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
    debugger;
    console.log("this.addEditForm.value",this.addEditForm.value);
    

    this.isShowErrors = true;

    this.formValidationService.markFormGroupTouched(this.addEditForm);
    if (this.addEditForm.invalid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      return
    }
    if(this.imagePath == undefined){
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm The special offer icon is mandatory');
      this.handleError("The special offer icon is mandatory");
      return
    }
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    var formData = new FormData();
    var enteredData = this.addEditForm.value;
    var tempStartDate = this.setDate(enteredData['offer_valid_from']);
    var tempToDate = this.setDate(enteredData['offer_valid_to']);
    // console.log("tempStartDate",tempStartDate);


    enteredData.userid = obj[0]?.login_id;
    for (let ele in enteredData) {
      formData.append(ele, enteredData[ele]);
    }
    formData.set("offer_valid_from", tempStartDate?.toString() || "");
    formData.set("offer_valid_to", tempToDate?.toString() || "");
    formData.append("imgs", this.imagePath[0]);

    this.newSpecialOfferService.createRecords(formData).subscribe(
      (response: any) => {

        if (response.code == 500) {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
          this.handleError(response.message);
          return
        } else {
          // console.log("response", response);
          this.dialogRef.close('Success');
        }

      });
  }

  setEndDateMinValue() {
    // alert(this.setDate(this.addEditForm.controls['offer_valid_from'].value));
    this.minFromDate = this.addEditForm.controls['offer_valid_from'].value;

    
  }

  setDate(newdate: string) {
    const _ = moment();
    const date = moment(newdate);
    let date1 = date.toDate();
    let gmtDate = new DatePipe('en-Us').transform(date1,"dd-MMM-yyyy hh:mm:ssa");
    return gmtDate;
  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

  onCategoryChange(event: any) {
    debugger
    const filterValue = event.value;
    console.log("filterValue", filterValue);
    if (filterValue == 0 || filterValue == '0') {
      console.log("filterValue", filterValue);
      // this.getAllCarDetails();
      this.showroomCarDetails = this.totalListshowroomCarDetails.filter((ele: any) =>
        ele.showroomdetid == 12);
    } else {
      // this.showroomCarDetails = this.totalListshowroomCarDetails.filter((ele: any) => 
      // ele.showroomcategorytype == "specialOffer" );
      this.showroomCarDetails = this.totalListshowroomCarDetails.filter((ele: any) =>
        ele.showroomcategorytype === "specialOffer" && ele.showroomdetid !== 12
      );

    }
  }

  async getAllCarDetails() {
   await this.carDetailsService.getShowroomCarDetails().pipe().subscribe((data: any) => {
        console.log("getShowroomCarDetails", data);
        this.totalListshowroomCarDetails = data;
      
        this.showroomCarDetails = data.filter((ele: any) => 
        ele.showroomdetid == 12 );
        // console.log(this.showroomCarDetails);
        
        this.addEditForm.patchValue({"showroomdetid":12});

      });
  }

}
