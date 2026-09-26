import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { DateAdapter,MAT_DATE_FORMATS, MAT_DATE_LOCALE,} from '@angular/material/core';
import {  AppDateAdapter, DATEPICKER_DATE_FORMATS } from 'src/app/common/format-datepicker';
import { NewSpecialOfferService } from '../service/new-special-offer.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-edit-new-special-offer',
  templateUrl: './edit-new-special-offer.component.html',
  styleUrls: ['./edit-new-special-offer.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATEPICKER_DATE_FORMATS },
  ]
})
export class EditNewSpecialOfferComponent implements OnInit {
  loading:boolean=false;
  title = "Special Offer";
  @Input('isShowErrors')
  isShowErrors!: boolean;

  imageBase64: any | ArrayBuffer = "assets/images/iconupload.png";
  imagePath: any=[];
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  currentUser: any;
  minFromDate: any;
  showroomCarDetails: any;
  totalListshowroomCarDetails: any;
  companyList: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
    private formValidationService: FormValidationService,  private carDetailsService: CarDetailsService,
    public dialogRef: MatDialogRef<EditNewSpecialOfferComponent>, private fb: FormBuilder,private newSpecialOfferService: NewSpecialOfferService,private errorlogService: ErrorlogService) { }

  get f() {
    return this.addEditForm.controls;
  }

  async ngOnInit() {
    
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.addEditForm = this.fb.group({
      "specialoffer_title": ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "specialofferdesc": [''],
      "status": ['1'],
      "offer_valid_from":[null,Validators.required],
      "offer_valid_to":[null,Validators.required],
      "promocode":['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      "specialoffercategoryid":['',Validators.required],
      "showroomdetid":[''],
      "cmp_id":[null,Validators.required],
      "usagetype":['2',Validators.required]
    });
    console.log("this.data",this.data);
    
   
    this.imageBase64 = this.data.specialofferimg;

   await this.getAllCarDetails();
   await this.newSpecialOfferService.getCompanyList().pipe()
   .subscribe( (data:any) => {
       console.log("companyList",data); 
       this.companyList = data;
      });
  }

  private fillForm(parsedData:any) {debugger
    this.addEditForm.patchValue({
      "specialoffer_title": parsedData.specialoffer_title,
      "specialofferdesc" : parsedData.specialofferdesc,
      "offer_valid_from" : parsedData.offer_valid_from,
      "offer_valid_to" : parsedData.offer_valid_to,
      "promocode" : parsedData.promocode,
      "status": parsedData.status == "Active" ? '1' : '0',
      "specialoffercategoryid": parsedData.specialoffercategoryid.toString(),
      "showroomdetid":parsedData.showroomdetid,
      "cmp_id":parsedData.cmp_id || '',
      "cmp_name":parsedData.cmp_name || '',
      "usagetype":parsedData.usagetype == 'Multiple'? "2":"1",
    });

    if(parsedData.specialoffercategoryid.toString() == '0'){
      this.showroomCarDetails = this.totalListshowroomCarDetails.filter((ele: any) => 
      ele.showroomdetid == 12 );
    }else{
      this.showroomCarDetails = this.totalListshowroomCarDetails.filter((ele: any) => 
      ele.showroomcategorytype == "specialOffer" );
    }

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
    var tempStartDate = this.setDate(enteredData['offer_valid_from']);
    var tempToDate = this.setDate(enteredData['offer_valid_to']);
    enteredData.userid = obj[0]?.login_id;
    enteredData.specialofferid = this.data.specialofferid;
    enteredData.specialofferimg = this.data.specialofferimg
    for (let ele in enteredData) {
      formData.append(ele, enteredData[ele]);
    }
    formData.set("offer_valid_from", tempStartDate?.toString() || "");
    formData.set("offer_valid_to", tempToDate?.toString() || "");
    if(this.imagePath && this.imagePath.length > 0){
      formData.append("imgs", this.imagePath[0]);
    }
   

    this.newSpecialOfferService.updateRecords(formData,this.data.specialofferid).subscribe(
      (response: any) => {

        if (response.code == 500) {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
          this.handleError(response.message);
        } else {
          // console.log("response", response);
          this.dialogRef.close('Success');
        }

      });
  }
  setEndDateMinValue() {
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
        this.fillForm(this.data);
      });
  }

}
