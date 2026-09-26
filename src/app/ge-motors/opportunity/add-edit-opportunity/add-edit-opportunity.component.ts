import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { OpportunityService } from '../opportunity.service';
import { TypeConfigService } from '../../type-config/type-config.service';
import { LeadsService } from '../../leads/leads.service';
import { StageService } from '../../stage/stage.service';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from '../../account/account.service';
import { BrandService } from 'src/app/service/brand/brand.service';
import { DesTextAreaComponent } from '../des-text-area/des-text-area.component';
import { AddCampaignsFormComponent } from '../../campaigns/add-campaigns-form/add-campaigns-form.component';
import { AddContactFormComponent as AddContactFormComponent } from '../../contact/add-contact-form/add-contact-form.component';
import { AddContactFormComponent as AddAccountFormComponent } from '../../account/add-contact-form/add-contact-form.component';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { ModuleIdList } from 'src/app/common/enum';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-opportunity',
  templateUrl: './add-edit-opportunity.component.html',
  styleUrls: ['./add-edit-opportunity.component.css']
})
export class AddEditOpportunityComponent implements OnInit,OnDestroy {

  carList: any = [];
  list: any;
  typeDetailsList: any;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  public productForm!: FormGroup;
  opportunityid: any;
  title: string = "Opportunity";
  formData = new FormData();
  currentUser: any;
  showroomContactDetailList: any = [];
  accountList: any = [];
  contactList: any;
  campaignList: any;
  leadsourcelist: any;
  isEdit: any;
  cartotalList: any;
  autodisabled: boolean = true
  stageList: any;
  minFromDate = new Date();
  selectedOptions: any = [];
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = ['productname', 'description', 'quantity', 'salesPrice', 'amount'];
  // showroomdetidList: any;
  accountFilterList: any;
  // showroomdetidFilterList: any;
  contactFilterList: any;
  campaignFilterList: any;
  stageFilterList: any;
  filteredcartotalList: any;
  contactTotalList: any;
  totalAmount: any;
  brandList: any;
  filteredList: any;
  removeProductList: any = [];
  userGeaccountPrivilegeObj: any;
  userGecontactPrivilegeObj: any;
  userPrivilegeObj: any;
  buttonlabel: string = "Save";
  bankFilteredList: any;
  bankList: any;
  accountTotalList: any;
  bankaccountFilterList: any;
  bankaccountList: any;
  storage_data_id: any;
  expiryDatestatus: boolean = false;
  constructor(private cookieService: CookieService, private customerService: CustomerService, private typeConfigService: TypeConfigService, private elementRef: ElementRef, public showroomCategoryService: ShowroomCategoryService, public dialog: MatDialog, public carDetailsService: CarDetailsService, public stageService: StageService, public accountService: AccountService, public brandService: BrandService, public carCityService: CarCityService,private dataService: DataService,
    private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private pushNotificationService: PushNotificationsService,
    private opportunityService: OpportunityService, private contactService: ContactService, private campaignsService: CampaignsService, public leadsService: LeadsService,private cdr: ChangeDetectorRef,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {
    // this.route.queryParams.subscribe(params => {
    //   this.opportunityid = params['opportunityid'];
    //   this.isEdit = params['isEdit'];
    //   console.log(this.opportunityid, this.opportunityid)
    // });
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
        this.opportunityid = response?.data?.opportunityid;
        this.isEdit = response?.data?.isEdit;
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    this.userGeaccountPrivilegeObj = {};
    this.userGecontactPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Gecampaign)
    this.userGeaccountPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Geaccount);
    this.userGecontactPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Gecontact)
  }

  public bankFiltered(item: any) {
    return this.bankFilteredList.find((ele: any) => ele.bankname == item.bankname);
  }

  async ngOnInit() {
    if (this.isEdit == "EDIT") {
      this.buttonlabel = "Update"
    }
    this.addEditForm = this.fb.group({
      opportunityrefno: [''],
      opportunityname: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      accountid: ['', Validators.required],
      showroomdetid: ['1'],
      contactid: ['',],
      campaignid: ['', Validators.required],
      leadstateid: [''],
      description: [''],
      leadsourceid: ['', Validators.required],
      status: ['1'],
      typeid: ['', Validators.required],
      stageid: ['', Validators.required],
      // probability: [''],
      dealstatusid: ['', Validators.required],
      currencyid: ['1'],
      amount: [''],
      stageprobability: [''],
      forecastcategoryid: [''],
      expectedclosedate: ['', Validators.required],
      exchangerate: [1],
      salestype: ['', Validators.required],
      bankid: [''],
      paymentmode: ['', Validators.required],
    });




    if (!this.opportunityid) {
      let findnextRefno = await this.opportunityService.getfindnextRefno('OPPORTUNITY').toPromise();
      console.log("opportunityrefno", findnextRefno.opportunityrefno);
      this.addEditForm.patchValue({ opportunityrefno: findnextRefno.opportunityrefno });
    }

    this.productForm = this.fb.group({
      products: this.fb.array([])
    });

    // Subscribe to changes in the products array
    this.products.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });

    this.getAllBrand();
    this.bankList = await this.carCityService.getlistbank().toPromise();
    this.bankFilteredList = this.bankList;

    let getAllStage = await this.stageService.getStage().toPromise();
    this.stageList = getAllStage && getAllStage.filter((ele: any) => ele.status == 1);
    this.stageFilterList = this.stageList;
    // var showroomDetailsArr = await this.carDetailsService.getShowroomCarDetails().toPromise();
    // this.showroomdetidList = showroomDetailsArr.filter((ele: any) => {
    //   return ele.showroomcategorytype === null || ele.showroomcategorytype === 'buyaCar';
    // });
    // this.showroomdetidFilterList = this.showroomdetidList;
    // console.log("showroomdetidList", this.showroomdetidList);



    let getAllCampaigns = await this.campaignsService.getCampaigns().toPromise();
    this.campaignList = getAllCampaigns && getAllCampaigns.filter((ele: any) => ele.status == 1);
    this.campaignFilterList = this.campaignList;
    this.contactTotalList = await this.contactService.getContact().toPromise();

    this.leadsourcelist = await this.contactService.leadsourceconfig().toPromise();
    this.getTypeConfig();
    await this.getAllCarDetails();
    this.accountTotalList = await this.accountService.get().toPromise();

    let temtypeid1 = ["1"];
    this.accountList = this.accountTotalList && this.accountTotalList.filter(item =>
      item.typeid.some((id: any) => temtypeid1.includes(id))
    );
    this.accountFilterList = this.accountList;
    console.log("accountList",this.accountList);
    console.log(this.accountList);
    let temtypeid = ["4"];
    this.bankaccountFilterList = this.accountTotalList && this.accountTotalList.filter(item =>
      item.typeid.some((id: any) => temtypeid.includes(id))
    );
    this.bankaccountList = this.bankaccountFilterList;

  }

  paymentmodechange(event: any) {
    const filterValue = event.value;
    const bankidControl = this.addEditForm.controls['bankid'];
    if (filterValue == "finance") {
      bankidControl.setValidators([Validators.required]);
    } else {
      bankidControl.clearValidators();
    }
    bankidControl.updateValueAndValidity();

    let temtypeid = ["4"];
    this.bankaccountFilterList = this.accountTotalList && this.accountTotalList.filter(item =>
      item.typeid.some((id: any) => temtypeid.includes(id))
    );
    this.bankaccountList = this.bankaccountFilterList;

  }

  ngAfterViewInit() {
   
    this.loading = true;
    setTimeout(() => {
      if (this.opportunityid) {
        this.opportunityService.getByIdOpportunity(this.opportunityid).pipe()
          .subscribe(async (data: any) => {
            console.log("getByIdLeads", data);
            this.fillForm(data[0]);
            this.populateProducts(data[0].opportunity_details);
          });
      } else {
        this.addEditForm.patchValue({
          typeid: 1,
          leadsourceid: 2,
          dealstatusid: '5',
          stageid: 1,
          stageprobability: 0,
          forecastcategoryid: "Pipeline",
          campaignid: 6
        });
      }

      if (this.isEdit == 'VIEW') {
        this.addEditForm.disable();
        setTimeout(() => {
          this.disableFormArray();
        }, 200);
      }
      this.loading = false;
    }, 1500);
    this.cdr.detectChanges();
  }

  // Method to populate the products FormArray with opportunity_details data
  populateProducts(opportunityDetails: any[]): void {
    const productsFormArray = this.productForm.get('products') as FormArray;
    opportunityDetails.forEach((detail: any) => {
      productsFormArray.push(this.createProductFormGroup(detail));
    });
  }

  // Method to create a FormGroup for each product detail
  createProductFormGroup(detail: any): FormGroup {
    return this.fb.group({
      brandid: [detail.brandid, Validators.required],
      productname: [detail.carshowroom_id, Validators.required],
      description: [detail.description],
      quantity: [detail.quantity || 1, Validators.required],
      salesprice: [detail.salesprice, Validators.required],
      amount: [detail.amount, Validators.required],
      opportunitydettbid: [detail.opportunitydettbid]
    });
  }



  private async fillForm(parsedData: any) {
    

    let findData = this.contactTotalList && this.contactTotalList.filter((ele: any) => ele.accountid == parsedData.accountid)
    this.contactFilterList = findData;
    this.contactList = findData;

    this.addEditForm.patchValue({
      opportunityrefno: parsedData.opportunityrefno,
      opportunityname: parsedData.opportunityname,
      salutation: parsedData.salutation,
      leadstateid: parsedData.leadstateid,
      address: parsedData.address,
      cityid: parsedData.cityid,
      stateid: parsedData.stateid,
      countryid: parsedData.countryid,
      pincode: parsedData.pincode,
      description: parsedData.description,
      numofemployees: parsedData.numofemployees,
      typeid: parsedData.typeid,
      probability: parsedData.probability,
      dealstatusid: parsedData.dealstatusid && parsedData.dealstatusid.toString(),
      currencyid: parsedData.currencyid && parsedData.currencyid.toString(),
      amount: parsedData.amount,
      stageprobability: parsedData.stageprobability,
      status: parsedData.status && parsedData.status.toString(),
      forecastcategoryid: parsedData.forecastcategoryid,
      expectedclosedate: parsedData.expectedclosedate,
      exchangerate: parsedData.exchangerate,
      leadsourceid: parsedData.leadsourceid,
      accountid: parsedData.accountid,
      showroomdetid: parsedData.showroomdetid,
      campaignid: parsedData.campaignid,
      contactid: parsedData.contactid,
      stageid: parsedData.stageid,
      bankid: parsedData.bankid,
      paymentmode: parsedData.paymentmode,
      salestype: parsedData.salestype
    });
    this.minFromDate = parsedData.expectedclosedate;


    this.carList = this.cartotalList && this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === parsedData.showroomdetid;
    });
    parsedData.opportunity_details.forEach((detail: any) => {
      this.selectedOptions.push(detail.carshowroom_id);
    })

  }

  disableFormArray() {
    // Get reference to the products FormArray
    const productsArray = this.productForm.get('products') as FormArray;
    // Iterate through each form group in the FormArray and disable it
    productsArray.controls.forEach(control => {
      control.disable(); // Disable the form group
    });
  }

  public save() {
    debugger;
    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    this.isShowErrors = true;
    this.loading = true;
    // if (!this.addEditForm.valid && this.isEdit == "EDIT") {
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return
    }

    if (this.productForm.valid) {
      // Proceed with form submission
      console.log('Form is valid. Submitting...');
      // Call your service method or perform other actions here
    } else {
      // Mark all form fields as touched to trigger validation messages
      this.productForm.markAllAsTouched();
      this.loading = false;
      this.errorlogService.logManualValidationError(`add-edit-opportunity component|save()|Check All Mandatory fields`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Check All Mandatory fields", icon: 'error', });
      return

    }
    this.formData = new FormData();
    var enteredData = this.addEditForm.value;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
    enteredData.username = obj[0]?.username;
    enteredData.opportunityid = enteredData.opportunityid || null;
    // enteredData.stageid = enteredData.stageid && enteredData.stageid.stageid || null;
    let productDetails = this.productForm.value.products;
    this.removeProductList && this.removeProductList.forEach((item: any) => {
      this.formData.append(`removeProductList[]`, item);
    });
    productDetails && productDetails.forEach((item: any) => {
      this.formData.append(`productDetails[]`, JSON.stringify(item));
    });

    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }

    if (productDetails && productDetails.length == 0) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Please Create Car and Save the Changes.');
      this.handleError("Please Create Car and Save the Changes.");
      this.addProduct();
      this.loading = false;
      return
    }

    if (productDetails && productDetails[0] && productDetails[0].brandid == null) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Please Create Car and Save the Changes.');
      this.handleError("Please Create Car and Save the Changes.");
      this.addProduct();
      this.loading = false;
      return
    }

    if (this.opportunityid) {
      this.opportunityService.updateOpportunity(this.formData, this.opportunityid,).subscribe(
        async (response: any) => {
          this.loading = false;
          this.success("Opportunity Updated Successfully");
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['opportunity']);
        });
    } else {
      this.opportunityService.createOpportunity(this.formData).subscribe(
        async (response: any) => {
          this.loading = false;
          this.success("Opportunity Created Successfully");
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['opportunity']);

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






  onDateChange(event: any) {debugger
    const selectedDate = new Date(event.value);
    const today = new Date();
    // Reset time to 00:00:00 for fair comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    if (selectedDate < today) {
      let message ="Expected Close Date - Expired. Please Contact the Showroom Manager";
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      let role_id = obj[0]?.role_id;
      this.expiryDatestatus = true;

      let control:any = this.addEditForm.get('expectedclosedate');
      control?.setErrors({ checkexpectedclosedatepast: true });
      control.markAsTouched();

      if(role_id == 1 || role_id == 10 || role_id == 13){
        // message = "In the Sales Order, the Opportunity will be disabled if the Expected Close Date is earlier than today's date.";
        message = "Expected Close Date - Expired. In the Sales Order, the Opportunity will be disabled if the Expected Close Date is earlier than today's date.";
       this.expiryDatestatus = false;
       control?.setErrors({ checkexpectedclosedatepast: false });
       control.markAsTouched();
     }
     this.errorlogService.logManualValidationError(`add-edit-opportunity component|onDateChange()| ${message}`);
      Swal.fire({
        title: message,
        icon: 'question',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
        
        }
      });
    }else{
      this.expiryDatestatus = false;
    }
  }
  

  getTypeConfig() {
    this.typeConfigService.getopportunitytypeConfig().pipe()
      .subscribe((data: any) => {
        console.log("gettypeConfig", data);
        this.list = data;
        this.typeDetailsList = data;
      });
  }

  public typeFiltered(item: any) {
    return this.typeDetailsList.find((ele: any) => ele.typename == item.typename);
  }

  async getAllCarDetails() {
    
    if(this.isEdit == 'VIEW'){
      this.cartotalList = await this.carDetailsService.getCarDetails().toPromise();
      this.filteredcartotalList = this.cartotalList;
    }else{
      let data = await this.carDetailsService.listAllcarwithextraexpense().toPromise();
      // this.cartotalList = data.filter((ele: any) => ele.status == 1);
      console.log("data",data);
      this.cartotalList =  data.filter((ele) => {
        if (ele.status === 1 && ele.soldstatus === 2 && ele.is_delete == 0) {
          return true;
        }
        // Exclude other records
        return false;
      });
      
      // console.log(filteredData);
      
      
      console.log("data",this.cartotalList);

      this.filteredcartotalList = this.cartotalList;
    }

    this.addEditForm.patchValue({ showroomdetid: 1 });
    this.carList = this.cartotalList && this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === 1;
    });
    if (!this.opportunityid) {
      this.addProduct();
    }

  }

  // async getAllCarDetails() {
  //   // this.loading = true;
  //   await this.carDetailsService.getCarDetails().pipe()
  //     .subscribe((data: any) => {
  //       console.log("buycardetails", data);
  //       // this.carList = data.filter((ele: any) => ele.isapprovedstatus == 2);
  //       this.cartotalList = data;
  //       this.filteredcartotalList = data;
  //     });
  // }


  onStageOptionSelected(tempValue: any) {
    if(tempValue == 10 || tempValue == 11){
      let stage = tempValue == 10 ? "Closed Won" :"Closed Lost"
      this.errorlogService.logManualValidationError(`add-edit-opportunity component|onStageOptionSelected()|Unable to Choose a ${stage} Stage In The Opportunity. You Need to Create a Sales Order Instead`);
      Swal.fire({
        title: "Unable to Choose a "+stage+" Stage In The Opportunity. You Need to Create a Sales Order Instead.!",
        icon: 'question',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.addEditForm.patchValue({ stageid: 1 });
        }
      });
      return
    }
    let findData = this.stageList.find((ele: any) => ele.stageid == tempValue)
    this.addEditForm.patchValue({
      stageprobability: findData.stageprobability,
      forecastcategoryid: findData.forecast,
      dealstatusid: findData.dealstatusid && findData.dealstatusid.toString(),
    });
  }

  onAccountOptionSelected(tempValue: any) {
    this.addEditForm.patchValue({
      contactid: null
    })
    let findData = this.contactTotalList.filter((ele: any) => ele.accountid == tempValue)
    this.contactFilterList = findData;
    this.contactList = findData;
  }


  onOptionSelected(event: any) {
    // Reset carList before populating it with filtered values
    this.carList = [];

    // Check if event.option.value is defined and has the expected structure
    if (event.option && event.option.value && event.option.value.showroomdetid) {
      let showroomdetid = event.option.value.showroomdetid;
      // Filter cartotalList based on showroomdetid
      this.carList = this.cartotalList.filter((ele: any) => {
        return ele.carshowroomname === showroomdetid;
      });

    } else {
      console.error('Invalid event source or carshowroom_id is missing.');
    }
  }

  // Getter for easy access to the products form array
  get products() {
    return this.productForm.get('products') as FormArray;
  }

  // // Add a new product row to the form array
  // addProduct() {

  //   const productGroup = this.fb.group({
  //     brandid: [''],
  //     productname: [null, Validators.required],
  //     description: [''],
  //     quantity: [1, Validators.required],
  //     salesprice: [null, Validators.required],
  //     amount: [null, Validators.required],
  //     opportunitydettbid:[null]
  //   });
  //   this.products.push(productGroup); // Add the new product row to the form array

  //   productGroup.get('productname')?.valueChanges.subscribe((value: string) => {
  //     console.log("value",value);
  //     if (value && this.selectedOptions.includes(value)) {
  //       productGroup.get('productname')?.setValue(null);
  //       setTimeout(()=>{   
  //         productGroup.get('salesprice')?.setValue(null);
  //         productGroup.get('amount')?.setValue(null);
  //       }, 1000);

  //       this.handleError("Product already exists");
  //     } else {
  //       this.selectedOptions.push(value); // Track selected option
  //     }
  //   });

  //   //Clear filter
  //   this.filteredList = this.brandList.slice();
  // }

  // Add a new product row to the form array
  addProduct() {

    let productExists = false;

    // Check if any existing product has the same brand id or product name
    this.products.controls.forEach(product => {
      const brandid = product.get('brandid')?.value;
      const productname = product.get('productname')?.value;

      if (!brandid || !productname) {
        this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Brand ID and Product Name are required.');
        this.handleError("Brand ID and Product Name are required.");
        productExists = true; // Set flag to indicate product exists
        return; // Exit the loop early
      }

      // if (this.selectedOptions.includes(productname)) {
      //   this.handleError("Product already exists.");
      //   productExists = true; // Set flag to indicate product exists
      //   return; // Exit the loop early
      // }
    });

    // If product already exists, exit the function
    if (productExists) {
      return;
    }

    // Create a new product form group
    const productGroup = this.fb.group({
      brandid: ['', Validators.required],
      productname: [null, Validators.required],
      description: [''],
      quantity: [1, Validators.required],
      salesprice: [null, Validators.required],
      amount: [null, Validators.required],
      opportunitydettbid: [null]
    });

    // Subscribe to changes in product name to check for duplicates
    productGroup.get('productname')?.valueChanges.subscribe((value: string) => {
      if (value && this.selectedOptions.includes(value)) {
        productGroup.get('productname')?.setValue(null);
        setTimeout(() => {
          productGroup.get('salesprice')?.setValue(null);
          productGroup.get('amount')?.setValue(null);
        }, 1000);

        this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Product already exists');
        this.handleError("Product already exists");
      }

      if (value) {
        this.selectedOptions.push(value); // Track selected option
      }
    });

    // Clear filter
    this.filteredList = this.brandList.slice();

    // Add the new product row to the form array
    this.products.push(productGroup);
  }


  // Remove a product row from the form array
  removeProduct(index: number, product: any) {
    console.log("product", product);
    const selectedProduct = this.products.controls[index];
    const opportunitydettbid = selectedProduct.get('opportunitydettbid')?.value || null;
    if (opportunitydettbid) {
      this.removeProductList.push(opportunitydettbid.toString())
    }
    this.selectedOptions = this.selectedOptions.filter((option: any) => option !== product.productname);

    this.products.removeAt(index);
    this.calculateTotalAmount();
  }


  submitForm() {
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      // Proceed with form submission
      console.log('Form is valid. Submitting...');
      // Call your service method or perform other actions here
    } else {
      // Mark all form fields as touched to trigger validation messages
      this.productForm.markAllAsTouched();
    }
  }


  public accountFiltered(item: any) {
    return this.accountFilterList && this.accountFilterList.find((ele: any) => ele.accountname == item.accountname);
  }

  accountBankFiltered(item: any) {
    return this.bankaccountFilterList && this.bankaccountFilterList.find((ele: any) => ele.accountname == item.accountname);
  }

  isContactFiltered(item: any) {
    return this.contactFilterList && this.contactFilterList.find((ele: any) => ele.contactid == item.contactid);
  }


  isStageFiltered(item: any) {
    return this.stageFilterList && this.stageFilterList.find((ele: any) => ele.stageid == item.stageid);
  }

  isCampaignFiltered(item: any) {
    return this.campaignFilterList && this.campaignFilterList.find((ele: any) => ele.campaignid == item.campaignid);
  }

  isShowroomCarFiltered(item: any) {
    const brandid = this.getProductControl('brandid');    
    return this.filteredcartotalList && this.filteredcartotalList.find((ele: any) => ele.modelname == item.modelname && ele.brandid == brandid?.value);
  }

  getShowroomCarList(tempValue: any) {
    this.filteredcartotalList = this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === 1 && ele.brandid === tempValue;
    });
    const productname = this.getProductControl('productname');
    if (productname) {
      productname.setValue('');
    }

  }

  onOpenedChange(tempValue: any) {
    const brandid = this.getProductControl('brandid');
    this.filteredcartotalList = this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === 1 && ele.brandid === brandid?.value;
    });
  }

  onShowroomCarOptionSelected(tempValue: any, i: any) {
    let selectedCar = this.carList.find((ele: any) => ele.carshowroom_id == tempValue)
    let tempcarprice = selectedCar && selectedCar.carprice ? parseInt(selectedCar.carprice):null;
    if(!tempcarprice){
      this.errorlogService.logManualValidationError(`add-edit-opportunity component|onShowroomCarOptionSelected()|Selected car's price is empty.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Selected car's price is empty.", icon: 'error', });
      const productnameid = this.getProductControl('productname');
      if (productnameid) {
        productnameid.setValue(null);
      }
      return
    }
    
    if (selectedCar) {
      if (i == 0) {
        let oppname = this.addEditForm.controls['opportunityrefno'].value + selectedCar.brandname + " " + selectedCar.modelname;
        this.addEditForm.patchValue({ opportunityname: oppname });
      }

      const brandid = this.getProductControl('brandid');
      const salesPriceControl = this.getProductControl('salesprice');
      const amountControl = this.getProductControl('amount');
      const desControl = this.getProductControl('description');

      if (salesPriceControl && amountControl) {
        salesPriceControl.setValue(selectedCar.carprice);
        amountControl.setValue(selectedCar.carprice);
        
      }

      if(desControl){
        desControl.setValue(selectedCar.description);
      }

      if (brandid) {
        brandid.setValue(selectedCar.brandid);
      }

      if (tempValue) {
        this.selectedOptions.push(tempValue); // Track selected option
      }
    }
  }

  getProductControl(controlName: string): AbstractControl | null {
    const lastIndex = this.products.length - 1;
    if (lastIndex >= 0) {
      const lastProductGroup = this.products.at(lastIndex) as FormGroup;
      return lastProductGroup.get(controlName);
    }
    return null;
  }

  calculateTotalAmount() {
    this.totalAmount = 0; // Reset total amount
    this.products.controls.forEach(product => {
      const amount = product.get('amount')?.value;
      if (amount) {
        this.totalAmount += parseFloat(amount);
        this.addEditForm.patchValue({
          amount: this.totalAmount,
        })

      }
    });
  }

  public isBrandFiltered(item: any) {
    return this.filteredList.find((ele: any) => ele.brandid == item.brandid);
  }


  async getAllBrand() {
    if(this.isEdit == 'VIEW'){
      this.brandList = await this.brandService.getBrand().toPromise();
      this.filteredList = this.brandList.slice();
    }else{
      this.brandList = await this.brandService.listbrandwithactivecars().toPromise();
      this.filteredList = this.brandList.slice();
    }
   
  }


  openDescriptionDialog(i: number): void {
    const productsArray: any = this.productForm.get('products') as FormArray;
    const descriptionValue = productsArray.at(i).get('description').value;

    const dialogRef = this.dialog.open(DesTextAreaComponent, {
      width: '800px',
      data: { description: descriptionValue }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result", result);

      if (result !== undefined) {
        productsArray.at(i).get('description').patchValue(result);
      }
    });
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddCampaignsFormComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.campaignList = await this.campaignsService.getCampaigns().toPromise();
        this.campaignFilterList = this.campaignList;
        this.addEditForm.patchValue({
          campaignid: result,
        })
      }
    });
  }

  public addContactRecord() {
    const dialogRef = this.dialog.open(AddContactFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.contactTotalList = await this.contactService.getContact().toPromise();
        let findData = this.contactTotalList.filter((ele: any) => ele.accountid == result.data.accountid)
        this.contactFilterList = findData;
        this.contactList = findData;
        // this.accountList =await this.accountService.get().toPromise();
        // this.accountFilterList=this.accountList;
        this.addEditForm.patchValue({
          accountid: result.data.accountid, contactid: result.data.contactid,
        })
      }
    });
  }

  addAccountRecord() {
    const dialogRef = this.dialog.open(AddAccountFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,data:{accountCategoryType:true}
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        console.log("result",result);
        
        this.accountList = await this.accountService.get().toPromise();
        this.accountFilterList = this.accountList;
        console.log("accountList",this.accountList);
        

        this.contactTotalList = await this.contactService.getContact().toPromise();
        let findData = this.contactTotalList.filter((ele: any) => ele.accountid == result.data.accountid)
        this.contactFilterList = findData;
        this.contactList = findData;
        let contactid = findData[0] && findData[0].contactid || null;
        this.addEditForm.patchValue({
          accountid: result.data.accountid,
          contactid: contactid
        })
      }
    });
  }


  addBankAccountRecord() {
    const dialogRef = this.dialog.open(AddAccountFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true, data: { typeid: "4" }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      this.accountList = await this.accountService.get().toPromise();
      let temtypeid = ["4"];
      this.bankaccountFilterList = this.accountList && this.accountList.filter(item =>
        item.typeid.some((id: any) => temtypeid.includes(id))
      );
      this.bankaccountList = this.bankaccountFilterList;
      this.addEditForm.patchValue({
        bankid: result.data.accountid
      });
    });
  }

  ngOnDestroy() {
    this.dataService.clearAllData();
  }

}


