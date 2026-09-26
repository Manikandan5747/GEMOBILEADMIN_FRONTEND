import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DateFormat, MatTableAttributes } from 'src/app/common/ui.constant';
import { CookieService } from 'src/app/service/cookie.service';
import { ShowroomCategoryService } from 'src/app/service/showroom-category/showroom-category.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ContactService } from '../../contact/contact.service';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { CarCityService } from 'src/app/service/car-city/car-city.service';
import { LeadsService } from '../leads.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { AccountService } from '../../account/account.service';
import { AddCampaignsFormComponent } from '../../campaigns/add-campaigns-form/add-campaigns-form.component';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { ModuleIdList } from 'src/app/common/enum';
import { BrandService } from 'src/app/service/brand/brand.service';
import { ModelService } from 'src/app/service/model/model.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-leads',
  templateUrl: './add-edit-leads.component.html',
  styleUrls: ['./add-edit-leads.component.css']
})
export class AddEditLeadsComponent implements OnInit,OnDestroy {
  buttonlabel:string="Save";
  userPrivilegeObj: any;
  CarCityList: any;
  cityDetailsList: any;
  countryList: any = [];
  countryDetailsList: any = [];
  stateList: any;
  stateDetailsList: any;
  brandList: any;
  filteredList: any;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  leadsid: any;
  title: string = "Manage Lead";
  formData = new FormData();
  currentUser: any;
  campaignList: any;
  leadsratinglist: any;
  leadsourcelist: any;
  isEdit: any;
  disableFields : boolean = false;
  industrylist: any;
  campaignFilteredList: any;
  modelList: any;
  filteredModelList: any;
  storage_data_id: any;
  constructor(private cookieService: CookieService,private customerService:CustomerService,  public showroomCategoryService: ShowroomCategoryService, public dialog: MatDialog, private carCityService: CarCityService, public carDetailsService: CarDetailsService,private modelService:ModelService, private elementRef: ElementRef,
    public accountService: AccountService,public brandService:BrandService,private pushNotificationService:PushNotificationsService,
    private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
    private leadsService: LeadsService, private contactService: ContactService, private campaignsService: CampaignsService, private dataService: DataService,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {debugger

    this.storage_data_id = this.dataService.getData('storage_data_id');
    if(this.storage_data_id){
      this.getRecord(this.storage_data_id);
    }
    this.getCurrentUserPrivilege();
  }


  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.leadsid = response?.data?.leadsid;
        this.isEdit = response?.data?.isEdit;
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.Gecampaign)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }

  phoneNumberValidator(control) {
    const phoneNumberRegex = /^\d{9}$/;
    if (!phoneNumberRegex.test(control.value)) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }
  
  


  async ngOnInit() {  this.loading = true;
  if(this.isEdit == "EDIT"){
    this.buttonlabel = "Update"
  }
    this.addEditForm = this.fb.group({
      firstname: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      accountname: ['', [this.formValidationService.noWhitespaceValidator]],
      salutation: ['', Validators.required],
      lastname: ['', Validators.required],
      campaignid: ['', Validators.required],
      title: ['',],
      leadsratingid: [''],
      leadstateid: [''],
      address: [''],
      street: [''],
      cityid: [''],
      stateid: [''],
      countryid: [''],
      pincode: [''],
      description: [''],
      numofemployees: [''],
      annualrevenue: [''],
      referredby: [''],
      leadsourceid:  ['',Validators.required],
      industryid: [''],
      donotcall: [''],
      status: ['1'],
      phonenumber : [''],
       mobile: ['', [Validators.required, this.phoneNumberValidator]],
      website: [''],
      fax : [''],
      email:  ['', [Validators.email]],
      leadtype: ['',Validators.required],
      brandid:['', Validators.required],
      modelid:['', Validators.required],
    });
     this.getAllBrand();
     let getAllCampaigns = await this.campaignsService.getCampaigns().toPromise();
     this.campaignList = getAllCampaigns && getAllCampaigns.filter((ele: any) => ele.status == 1);
     this.campaignFilteredList = this.campaignList;
    // console.log("getByIdLeads", this.campaignList );
    this.leadsratinglist = await this.contactService.leadsratingconfig().toPromise();
    this.leadsourcelist = await this.contactService.leadsourceconfig().toPromise();
    this.industrylist = await this.leadsService.getindustrylist().toPromise();
    await this.getCountry();
    if (this.leadsid) {
      // this.loading = true;
      // this.disableFields =true;
      this.leadsService.getByIdLeads(this.leadsid).pipe()
        .subscribe(async (data: any) => {
          console.log("getByIdLeads", data);
          setTimeout(() => {
            this.fillForm(data[0]);
          }, 1000);
         
        }); 
    }
    
    if(this.isEdit == 'VIEW'){
      this.addEditForm.disable();
    }this.loading = false;
  }

  private async fillForm(parsedData: any) {
    this.addEditForm.patchValue({
      accountname: parsedData.accountname,
      firstname: parsedData.firstname,    
      salutation: parsedData.salutation,
      lastname: parsedData.lastname,
      campaignid:  parsedData.campaignid,
      title: parsedData.title,
      leadsratingid: parsedData.leadsratingid,
      address: parsedData.address,
      street: parsedData.street,
      cityid: parsedData.cityid,
      stateid: parsedData.stateid,
      countryid: parsedData.countryid,
      pincode: parsedData.pincode,
      description: parsedData.description,
      numofemployees: parsedData.numofemployees,
      annualrevenue: parsedData.annualrevenue,
      leadsourceid: parsedData.leadsourceid,
      industryid: parsedData.industryid,
      donotcall: parsedData.donotcall,
      status: parsedData.status && parsedData.status.toString(),
      phonenumber: parsedData.phonenumber,
      mobile: parsedData.mobile,
      website: parsedData.website,
      fax: parsedData.fax,
      email: parsedData.email,
      leadtype: parsedData.leadtype,
      brandid: parsedData.brandid,
      modelid: parsedData.modelid,
    });
    await this.getModelList(parsedData.brandid, 'Edit');
    if (parsedData.countryid) {
      this.getStateCity(parsedData.countryid);
    }
    if (parsedData.stateid) {
      this.getCarCity(parsedData.stateid);
    }
  }

  public save() {
    debugger;
    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    
    this.isShowErrors = true;
    var enteredData = this.addEditForm.value;
    // if (enteredData.leadtype === "company" && !enteredData.accountname) {
    //   this.handleError("Company Name is required");
    //  }
    this.loading=true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading=false;
      return
    }
    this.formData = new FormData();
    var enteredData = this.addEditForm.value;
    enteredData.leadsid = this.leadsid;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
    enteredData.username = obj[0]?.username;
    // enteredData.campaignid = enteredData.campaignid && enteredData.campaignid.campaignid || null;

    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }

    if (this.leadsid) {
      this.leadsService.updateLead(this.formData, this.leadsid,).subscribe(
        async (response: any) => {
          this.success("Lead Updated Successfully");
          this.loading=false;
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['leads']);
        });
    } else {
      this.leadsService.createLead(this.formData).subscribe(
        async (response: any) => {
          if (response.success) {
            this.success(response.message);
            this.loading=false;
            this.pushNotificationService.sendMessage(true);
            this.router.navigate(['leads']);
          } else {
            this.loading=false;
            this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
            this.handleError(response.message);
            // this.router.navigate(['leads']);
          }
        });
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}



  async getCountry() {
    this.countryList = await this.carCityService.getCountry().toPromise();
    this.countryDetailsList = this.countryList.slice();
    console.log("getCountry", this.countryList);
  }

  public countryFiltered(item: any) {
    return this.countryDetailsList.find((ele: any) => ele.countryname === item.countryname);
  }

  countryFilterChange(event: any) {
    const filterValue = event.value;
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

  public campaignFiltered(item: any) {
    return this.campaignFilteredList.find((ele: any) => ele.name == item.name);
  }

  

  async onContactBlur(value: any) {
    if(!this.leadsid){
      var uniquecheck = await this.contactService.contactnameuniquevalidation({firstname:value}).toPromise();
      console.log('Blur event:', uniquecheck);
      if(uniquecheck.errcode == '1111'){
        this.errorlogService.logManualValidationError(`add-edit-leads component|onContactBlur()|Error: ${uniquecheck.message}`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: uniquecheck.message, icon: 'error', });
        this.addEditForm.patchValue({firstname: ''})
      }
    }    
  }

  async onAccountBlur(value: any) {
    if(!this.leadsid){
    var uniquecheck = await this.accountService.accountnameuniquevalidation({accountname:value}).toPromise();
    console.log('Blur event:', uniquecheck);
    if(uniquecheck.errcode == '1111'){
      this.errorlogService.logManualValidationError(`add-edit-leads component|onAccountBlur()|Error: ${uniquecheck.message}`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: uniquecheck.message, icon: 'error', });
      this.addEditForm.patchValue({accountname: ''})
    }
  }
}

public addRecord() {
  const dialogRef = this.dialog.open(AddCampaignsFormComponent, {
    width: '1200px',
    height: 'fit-content',
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(async (result: any) => {
    if (result) {debugger
      this.campaignList = await this.campaignsService.getCampaigns().toPromise();
      this.campaignFilteredList = this.campaignList;
      this.addEditForm.patchValue({
        campaignid: result,
      })
    }
  });
}

public isBrandFiltered(item: any) {
  return this.filteredList.find((ele: any) => ele.brandid == item.brandid);
}

async getAllBrand() {
  this.brandList = await this.brandService.getBrand().toPromise();
  this.filteredList = this.brandList.slice();
}

async getModelList(item: any, isEdit: string) {
  if (isEdit != 'Edit') {
    this.addEditForm.patchValue({
      modelid: null,
    });
  }
  await this.modelService.buycarmodelbrandid(item).pipe()
    .subscribe((data: any) => {
      console.log("buycarmodelbrandid", data);
      this.modelList = data;
      this.filteredModelList = this.modelList.slice();
    });
}
public isModelFiltered(item: any) {
  return this.filteredModelList.find((ele: any) => ele.modelid == item.modelid);
}


leadtypechange(event: any) {
  const filterValue = event.value;
console.log("filterValue",filterValue);
const companyControl = this.addEditForm.controls['accountname'];
  if (filterValue == "company") {
    companyControl.setValidators([Validators.required]);
  } else {
    companyControl.clearValidators();
  }
  companyControl.updateValueAndValidity();
}


ngOnDestroy() {
  this.dataService.clearAllData();
}

}


