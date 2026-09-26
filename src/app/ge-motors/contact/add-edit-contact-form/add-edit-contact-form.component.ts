import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";  
import { Observable } from 'rxjs';
import { CarCityService } from 'src/app/service/car-city/car-city.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { map, startWith } from 'rxjs/operators';
import { AccountService } from '../../account/account.service';
import { TypeConfigService } from '../../type-config/type-config.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import Swal from 'sweetalert2';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-contact-form',
  templateUrl: './add-edit-contact-form.component.html',
  styleUrls: ['./add-edit-contact-form.component.css']
})
export class AddEditContactFormComponent implements OnInit {

  @Input('isShowErrors') isShowErrors!: boolean;
  @Input('countryid') countryid!: any;
  @Input('stateid') stateid!: any;
  @Input('contactid') contactid!: any;
  
  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.  
  public addEditForm!: FormGroup;
  CarCityList: any;
  cityDetailsList: any;
  countryList: any;
  countryDetailsList: any;
  stateList: any;
  stateDetailsList: any;
  accountList: any;
  files: any;
  list: any;
  typeDetailsList: any;
  accountFilterList: any;
  nationalityList: any;
  nationalityFilteredList: any;
  imageSrc: any;

  imageSrc1: any;
  
  constructor(private fb: FormBuilder,private carCityService: CarCityService,public typeService:TypeConfigService,
    public accountService:AccountService,private formValidationService:FormValidationService,private errorlogService: ErrorlogService) { }

    // convenience getter for easy access to form fields
    get f() {
      return this.addEditForm.controls;
    }
    
    phoneNumberValidator(control) {
      // const phoneNumberRegex = /^(?:971)?\d{10}$/;
      const phoneNumberRegex = /^\d{9}$/;
      if (!phoneNumberRegex.test(control.value)) {
        return { invalidPhoneNumber: true };
      }
      return null;
    }
    
  async ngOnInit() {
    this.addEditForm = this.fb.group({
      firstname: ['',Validators.required,],
      lastname: ['',Validators.required,],
      accountid: ['',Validators.required,],
      phonenumber:  ['',  [Validators.pattern(/^[0-9\.]+$/)]],
      mobile: ['', [Validators.required, this.phoneNumberValidator]],
      email: ['', [Validators.required, Validators.email]],
      address: ['',],
      mailingstreet: ['',],
      cityid: ['',],
      stateid: ['',],
      countryid: ['',],
      pincode: ['',],
      description: ['',],
      status: ["1"],
      typeid: [''],
      emiratesid: ['', [Validators.required, Validators.pattern(/^\d{15}$/)]],
      emiratesdoc:[''],
      nationality:['',Validators.required],
      salutation:['',Validators.required],
      backemiratesdoc:['']
    });
    this.accountList =await this.accountService.get().toPromise();
    this.accountFilterList=this.accountList;
    this.nationalityList = await this.carCityService.getlistallnationality().toPromise();
   this.nationalityFilteredList = this.nationalityList;
    this.getCountry();
    this.getTypeConfig();
  if(this.countryid){
    this.getStateCity(this.countryid);
    this.getCarCity(this.stateid); 
  }

  // contactid

 

  }

  public nationalityFiltered(item: any) {
    return this.nationalityFilteredList.find((ele: any) => ele.nationalityname == item.nationalityname);
  }

  
  public accountFiltered(item: any) {
    return this.accountFilterList.find((ele: any) => ele.accountname == item.accountname);
  }

  getCountry() {
    this.carCityService.getCountry().pipe()
      .subscribe((data: any) => {
        console.log("getCountry", data);
        this.countryList = data;
        this.countryDetailsList= data;
      });
  }

  public countryFiltered(item: any) {
    return this.countryDetailsList.find((ele: any) => ele.countryname == item.countryname);
  }

  countryFilterChange(event: any) {
    const filterValue = event.value;
    this.stateDetailsList= [];
    this.addEditForm.patchValue({
      stateid: null,
      cityid:null
    });
    this.getStateCity(filterValue);
  }

  stateFilterChange(event: any) {debugger
    const filterValue = event.value;
    this.getCarCity(filterValue);
  }

  getStateCity(filterValue:any) {
    this.carCityService.getStateCity(filterValue).pipe()
      .subscribe((data: any) => {
        console.log("getStateCity", data);
        this.stateList = data;
        this.stateDetailsList= data;
      });
  }

  public stateFiltered(item: any) {
    return this.stateDetailsList.find((ele: any) => ele.statename == item.statename);
  }

  getCarCity(filterValue:any) {
    this.carCityService.getCity(filterValue).pipe()
      .subscribe((data: any) => {
        console.log("getCarCity", data);
        this.CarCityList = data;
        this.cityDetailsList= data;
      });
  }

  public cityFiltered(item: any) {
    return this.cityDetailsList.find((ele: any) => ele.carcityname == item.carcityname);
  }

  displayAccountFn(ele: any) {
    return ele && ele.accountname ? ele.accountname : '';
  }

  getTypeConfig() {
    this.typeService.getAccounttypeConfig().pipe()
      .subscribe((data: any) => {
        console.log("getAccounttypeConfig", data);
        this.list = data;
        this.typeDetailsList = data;
      });
  }
  
  public typeFiltered(item: any) {
    return this.typeDetailsList.find((ele: any) => ele.typename == item.typename);
  }
  
  
  isPDF(fileName: string): boolean {
    return fileName ? fileName.toLowerCase().endsWith('.pdf') : false;
  }

  isIMG(fileName: string): boolean {
    const imgExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];
    return fileName ? imgExtensions.some(ext => fileName.toLowerCase().endsWith(ext)) : false;
  }

  async onFileChanged(event: any) {
    this.files = event.target.files;
    if (this.files.length === 0) {
      return;
    }

    const selectedFile = this.files[0];

    if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        emiratesdoc: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-contact-form component|onFileChanged()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        emiratesdoc: null
      });
    }
  }


  async onFileChangedBackEmirates(event: any) {
    this.files = event.target.files;
    if (this.files.length === 0) {
      return;
    }

    const selectedFile = this.files[0];

    if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        backemiratesdoc: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc1 = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-contact-form component|onFileChangedBackEmirates()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        backemiratesdoc: null
      });
    }
  }

}