import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { CarCityService } from 'src/app/service/car-city/car-city.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { TypeConfigService } from '../../type-config/type-config.service';
import { OpportunityService } from '../../opportunity/opportunity.service';
import Swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ContactService } from '../../contact/contact.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorlogService } from 'src/app/errorlog.service';



export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // If the value is empty, it's considered valid (optional field)
      return null;
    }
    const valid = /^\d+$/.test(control.value); // Checks if the value contains only digits
    return valid ? null : { numeric: true };
  };
}


@Component({
  selector: 'app-add-edit-contact-form',
  templateUrl: './add-edit-contact-form.component.html',
  styleUrls: ['./add-edit-contact-form.component.css']
})
export class AddEditContactFormComponent implements OnInit {
  @Input('typeid') typeid!: any;
  @Input('isShowErrors') isShowErrors!: boolean;
  @Input('salestype') salestype!: any;
  @Input('countryid') countryid!: any;
  @Input('stateid') stateid!: any;
  @Input('accountid') accountid!: any;
  @Input('carownertypeid') carownertypeid!: any;
  @Input('leadtype') leadtype!: any;
  @Input('hiddenleadtype') hiddenleadtype: any =false;
  @Input('addhidedetails') addhidedetails: any =false;
  @Input('purchasedetails') purchasedetails: any =false;
  @Input('accountCategoryType') accountCategoryType: any =false;
  
  
  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.  
  addEditForm!: FormGroup;
  CarCityList: any;
  cityDetailsList: any;
  countryList: any;
  countryDetailsList: any;
  stateList: any;
  stateDetailsList: any;
  list: any;
  typeDetailsList: any;
  files: any;
  nationalityList: any;
  nationalityFilteredList: any;
  files1: any;
  bankFilteredList: any;
  bankList: any;
  files2: any;
  imageSrc: any;
  tradeImageSrc: any;
  vehicleImageSrc: any;
  files3: any;
  imageSrc1: any;

  constructor(private contactService: ContactService,private route: ActivatedRoute,
     private fb: FormBuilder, private carCityService: CarCityService, private typeConfigService: TypeConfigService, public opportunityService: OpportunityService, private formValidationService: FormValidationService,private errorlogService: ErrorlogService) { }

  // convenience getter for easy access to form fields
  get f() {
    return this.addEditForm.controls;
  }

  phoneNumberValidator(control) {
    const phoneNumberRegex = /^\d{9}$/;
    if (!phoneNumberRegex.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }

  async ngOnInit() {
    debugger
    this.addEditForm = this.fb.group({
      accountname: ['', Validators.required],
      accountcode: [''],
      phonenumber: ['', [ numericValidator()]],
      fax: [''],
      typeid: ['', Validators.required],
      website: [''],
      address: [''],
      billingstreet: ['',],
      cityid: ['',],
      stateid: ['',],
      countryid: ['',],
      pincode: ['',],
      description: ['',],
      status: ["1"],
      emiratesdoc: [''],
      tradelicenno: ['',],
      nationality: [''],
      contactneeded: [false],
      // emiratesid: ['', Validators.required],
      emiratesid: ['', [Validators.required, Validators.pattern(/^\d{15}$/)]],
      mobile: ['', [Validators.required, this.phoneNumberValidator]],
      email: ['', [this.formValidationService.noWhitespaceValidator, Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      trafficfileno: [''],
      salutation: ['', Validators.required],
      tradelicencedoc: [''],
      passportnumber: [''],
      bankid: ['',],
      vehicleregistrationcard: [''],
      trnnumber: [''],
      accountholdername: [''],
      accountnumber: ['', [Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      ifsccode: ['', [Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      leadtype:[''],
      backemiratesdoc:['']
    });

    this.addEditForm.controls['typeid'].valueChanges.subscribe((value: number[]) => {
      const trnnumberControl = this.addEditForm.controls['trnnumber'];
      const emiratesidControl = this.addEditForm.controls['emiratesid'];
      const nationalityControl = this.addEditForm.controls['nationality'];
      // const trafficfilenoControl = this.addEditForm.controls['trafficfileno'];
      const mobileControl = this.addEditForm.controls['mobile'];
      const salutationControl = this.addEditForm.controls['salutation'];
      const emailControl = this.addEditForm.controls['email'];

      // Clear all validators initially
      trnnumberControl.clearValidators();
      emiratesidControl.clearValidators();
      nationalityControl.clearValidators();
      // trafficfilenoControl.clearValidators();
      mobileControl.clearValidators();
      salutationControl.clearValidators();
      emailControl.clearValidators();

      // Set validators based on the selected values
      if (value.includes(4)) {
        // nationalityControl.setValidators([]);
        mobileControl.setValidators([]);
        salutationControl.setValidators([]);
        emailControl.setValidators([]);
      }

      if (value.includes(6)) {
        trnnumberControl.setValidators([Validators.required]);
        // nationalityControl.setValidators([Validators.required]);
        // trafficfilenoControl.setValidators([Validators.required]);
        mobileControl.setValidators([Validators.required, this.phoneNumberValidator]);
        salutationControl.setValidators([Validators.required]);
        emailControl.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])
      }

      if (value.includes(1)) {
        // emiratesidControl.setValidators([Validators.required]);
        // nationalityControl.setValidators([Validators.required]);
        // trafficfilenoControl.setValidators([Validators.required]);
        mobileControl.setValidators([Validators.required, this.phoneNumberValidator]);
        salutationControl.setValidators([Validators.required]);
        emailControl.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])
      }

      if (value.includes(2)) {
        // emiratesidControl.setValidators([Validators.required]);
        // nationalityControl.setValidators([Validators.required]);
        mobileControl.setValidators([Validators.required, this.phoneNumberValidator]);
        // trafficfilenoControl.setValidators([Validators.required]);
        salutationControl.setValidators([Validators.required]);
        emailControl.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])
      }

      if (value.includes(5)) {
        // emiratesidControl.setValidators([Validators.required]);
        // nationalityControl.setValidators([Validators.required]);
        mobileControl.setValidators([Validators.required, this.phoneNumberValidator]);
        salutationControl.setValidators([Validators.required]);
        emailControl.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])
      }

      if (value.includes(3)) {
        emiratesidControl.setValidators([]);
        // nationalityControl.setValidators([Validators.required]);
        mobileControl.setValidators([Validators.required, this.phoneNumberValidator]);
        salutationControl.setValidators([Validators.required]);
        emailControl.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])
      }
    
      // Update the value and validity of the controls
      trnnumberControl.updateValueAndValidity();
      emiratesidControl.updateValueAndValidity();
      // nationalityControl.updateValueAndValidity();
      // trafficfilenoControl.updateValueAndValidity();
      mobileControl.updateValueAndValidity();
      salutationControl.updateValueAndValidity();
      emailControl.updateValueAndValidity();
    });


    const tradelicennoControl = this.addEditForm.controls['tradelicenno'];
    const trnnumberControl = this.addEditForm.controls['trnnumber'];
    const emiratesidControl = this.addEditForm.controls['emiratesid'];
    // const trafficfilenoControl = this.addEditForm.controls['trafficfileno'];
    const nationalityControl = this.addEditForm.controls['nationality'];

    if (this.leadtype) {
      if (this.leadtype == "company") {
        tradelicennoControl.setValidators([Validators.required]);
        trnnumberControl.setValidators([Validators.required]);
        nationalityControl.setValidators([]);
      } else {
        nationalityControl.setValidators([Validators.required]);
        // trafficfilenoControl.setValidators([Validators.required]);
        emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);

        tradelicennoControl.clearValidators();
        trnnumberControl.clearValidators();
      }
      // trafficfilenoControl.updateValueAndValidity();
      emiratesidControl.updateValueAndValidity();
      trnnumberControl.updateValueAndValidity();
      tradelicennoControl.updateValueAndValidity();
      nationalityControl.updateValueAndValidity();
    }


    const passportnumberControl = this.addEditForm.controls['passportnumber'];
    if(this.salestype){
      if (this.salestype == "localsale") {
        passportnumberControl.clearValidators();
      } else { 
        passportnumberControl.setValidators([Validators.required]);
      }
      passportnumberControl.updateValueAndValidity();
    }
   


    if (!this.accountid) {
      let findnextRefno = await this.opportunityService.getfindnextRefno('ACCOUNT').toPromise();
      console.log("accountrefno", findnextRefno.accountcode);
      this.addEditForm.patchValue({ accountcode: findnextRefno.accountcode });
    }
    this.nationalityList = await this.carCityService.getlistallnationality().toPromise();
    this.nationalityFilteredList = this.nationalityList;

    this.bankList = await this.carCityService.getlistbank().toPromise();
    this.bankFilteredList = this.bankList;

    this.getCountry();
    if (this.countryid) {
      this.getStateCity(this.countryid);
      this.getCarCity(this.stateid);
    }
    this.getTypeConfig();


    if(this.accountCategoryType){
      this.addEditForm.patchValue({
        typeid: [1]
      });
    }

    if(this.purchasedetails){
      const leadtypeControl = this.addEditForm.controls['leadtype'];
      leadtypeControl.setValidators([Validators.required]);
      leadtypeControl.updateValueAndValidity();
    }
    
  }

  getCountry() {
    this.carCityService.getCountry().pipe()
      .subscribe((data: any) => {
        console.log("getCountry", data);
        this.countryList = data;
        this.countryDetailsList = data;
      });
  }

  public countryFiltered(item: any) {
    return this.countryDetailsList.find((ele: any) => ele.countryname == item.countryname);
  }

  public nationalityFiltered(item: any) {
    return this.nationalityFilteredList.find((ele: any) => ele.nationalityname == item.nationalityname);
  }

  public bankFiltered(item: any) {
    return this.bankFilteredList.find((ele: any) => ele.bankname == item.bankname);
  }

  countryFilterChange(event: any) {
    const filterValue = event.value;
    this.stateDetailsList = [];
    this.addEditForm.patchValue({
      stateid: null,
      cityid: null
    });
    this.getStateCity(filterValue);
  }

  stateFilterChange(event: any) {
    debugger
    const filterValue = event.value;
    this.getCarCity(filterValue);
  }

  getStateCity(filterValue: any) {
    this.carCityService.getStateCity(filterValue).pipe()
      .subscribe((data: any) => {
        console.log("getStateCity", data);
        this.stateList = data;
        this.stateDetailsList = data;
      });
  }

  public stateFiltered(item: any) {
    return this.stateDetailsList.find((ele: any) => ele.statename == item.statename);
  }

  getCarCity(filterValue: any) {
    this.carCityService.getCity(filterValue).pipe()
      .subscribe((data: any) => {
        console.log("getCarCity", data);
        this.CarCityList = data;
        this.cityDetailsList = data;
      });
  }

  public cityFiltered(item: any) {
    return this.cityDetailsList.find((ele: any) => ele.carcityname == item.carcityname);
  }

  async getTypeConfig() {
    debugger
    await this.typeConfigService.getAccounttypeConfig().pipe()
      .subscribe((data: any) => {
        console.log("getAccounttypeConfig", data);
        this.list = data;
        this.typeDetailsList = data;

        if (this.carownertypeid == 1) {
          this.addEditForm.patchValue({
            typeid: [2], leadtype: 'individual',
          });
          const emiratesidControl = this.addEditForm.controls['emiratesid'];
          emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);
          emiratesidControl.updateValueAndValidity();
          
          
        } else if (this.carownertypeid == 2) {
          this.addEditForm.patchValue({
            typeid: [5], leadtype: 'individual',
          });

          const tradelicennoControl = this.addEditForm.controls['tradelicenno'];
          const emiratesidControl = this.addEditForm.controls['emiratesid'];
          emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);
          emiratesidControl.updateValueAndValidity();
          tradelicennoControl.setValidators([Validators.required]);
          tradelicennoControl.updateValueAndValidity();
        }else if (this.carownertypeid == 3) {
          this.addEditForm.patchValue({
            typeid: [2], leadtype: 'individual',
          });
          const emiratesidControl = this.addEditForm.controls['emiratesid'];
          emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);
          emiratesidControl.updateValueAndValidity();
        
        }

        if(this.typeid){
          this.addEditForm.patchValue({
            typeid: [parseInt(this.typeid)]
          })
        }
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

  async onFileChanged1(event: any) {
    this.files1 = event.target.files;
    if (this.files1.length === 0) {
      return;
    }

    const selectedFile = this.files1[0];

    if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        tradelicencedoc: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.tradeImageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-contact-form component|onFileChanged1()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        tradelicencedoc: null
      });
    }
  }

  // onFileChanged2(event: any) {
  //   this.files3 = event.target.files;
  //   if (!this.files3 || this.files3.length === 0) {
  //     return;
  //   }
  //   const selectedFile = this.files3[0];

  //   if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
  //     this.addEditForm.patchValue({
  //       vehicleregistrationcard: selectedFile
  //     });

  //     if (this.isIMG(selectedFile.name)) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.vehicleImageSrc = e.target.result;
  //       };
  //       reader.readAsDataURL(selectedFile);
  //     }
  //   } else {
  //     Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
  //     event.target.value = ''; // Clear the file input
  //     this.addEditForm.patchValue({
  //       vehicleregistrationcard: null
  //     });
  //   }
  // }


  async handleChange(event: MatCheckboxChange) {
    if (event.checked) {
      var uniquecheck = await this.contactService.contactnameuniquevalidation({ firstname: this.addEditForm.controls['accountname'].value }).toPromise();
      console.log('Blur event:', uniquecheck);
      if (uniquecheck.errcode == '1111') {
        this.errorlogService.logManualValidationError(`add-edit-contact-form component|handleChange()|Error: ${uniquecheck.message}`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: uniquecheck.message, icon: 'error', });
        this.addEditForm.patchValue({ contactneeded: false })
      }
    } else {
      // Checkbox is unchecked
      console.log('Checkbox is unchecked');
    }
  }


  leadtypeChange(event:any){
    const tradelicennoControl = this.addEditForm.controls['tradelicenno'];
    const trnnumberControl = this.addEditForm.controls['trnnumber'];
    const emiratesidControl = this.addEditForm.controls['emiratesid'];
    const trafficfilenoControl = this.addEditForm.controls['trafficfileno'];
    this.route.url.subscribe(urlSegments => {
      let url = urlSegments.map(segment => segment.path).join('/');
      console.log("url",url);
      
      if(url != 'create-account'){
        if(event.value == 'company'){
          tradelicennoControl.setValidators([Validators.required]);
          trnnumberControl.setValidators([Validators.required]);
          emiratesidControl.setValidators([]);
          // trafficfilenoControl.setValidators([]);
          if(this.purchasedetails){
            trafficfilenoControl.setValidators([]);
                     }

        }else{
          tradelicennoControl.setValidators([]);
          trnnumberControl.setValidators([]);
          emiratesidControl.setValidators([Validators.required, Validators.pattern(/^\d{15}$/)]);

          if(this.purchasedetails){
 trafficfilenoControl.setValidators([Validators.required]);
          }
         
        }
        trnnumberControl.updateValueAndValidity();
        tradelicennoControl.updateValueAndValidity();
        emiratesidControl.updateValueAndValidity();
        trafficfilenoControl.updateValueAndValidity();
      }
    });
}
    
  

}