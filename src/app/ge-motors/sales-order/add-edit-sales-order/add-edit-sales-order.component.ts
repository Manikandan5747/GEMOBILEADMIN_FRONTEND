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
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { TypeConfigService } from '../../type-config/type-config.service';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { SalesOrderService } from '../sales-order.service';
import { DesTextAreaComponent } from '../../opportunity/des-text-area/des-text-area.component';
import { BrandService } from 'src/app/service/brand/brand.service';
import { QuotationService } from '../../quotation/quotation.service';
import { AccountService } from '../../account/account.service';
import { AddContactFormComponent as AddAccountFormComponent } from '../../../ge-motors/account/add-contact-form/add-contact-form.component';
import { OpportunityAdvanceSearchComponent } from '../opportunity-advance-search/opportunity-advance-search.component';
import { EditContactFormComponent } from '../../account/edit-contact-form/edit-contact-form.component';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { ModeOfPaymentService } from '../../mode-of-payment/mode-of-payment.service';
import { ErrorlogService } from 'src/app/errorlog.service';
@Component({
  selector: 'app-add-edit-sales-order',
  templateUrl: './add-edit-sales-order.component.html',
  styleUrls: ['./add-edit-sales-order.component.css']
})
export class AddEditSalesOrderComponent implements OnInit, OnDestroy {
  expiryDatestatus: boolean = false;
  minFromDate = new Date();
  public productForm!: FormGroup;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  salesorderid: any;
  title: string = "Sales Order";
  formData = new FormData();
  currentUser: any;
  isFinanceAccess: boolean = false;
  today = new Date();
  isEdit: any;
  opportunityList: any;
  // showroomdetidList: any;
  cartotalList: any;
  carList: any;
  filteredopportunityList: any;
  // showroomdetidFilterList: any;
  filteredcartotalList: any;
  selectedOptions: any = [];
  totalDiscount: any = 0;
  totalAmount: any = 0;
  buttonlabel: string = "Save";

  filteredList: any;
  brandList: any;
  taxList: any;
  filteredtaxList: any;
  quotationList: any;
  quotationfilteredList: any;
  accountList: any = [];
  accountFilteredList: any = [];
  files: any;
  accountid: any;
  imageSrc: any;
  imageSrcback: any;
  files1: any;
  opportunityid: any;
  storage_data_id: any;
  imageSrclpo: any;
  modeofpaymentList: any;
  modeofpaymentfilteredList: any;
  constructor(private cookieService: CookieService, private typeConfigService: TypeConfigService, public accountService: AccountService, private elementRef: ElementRef, public modeOfPaymentService: ModeOfPaymentService, public showroomCategoryService: ShowroomCategoryService, public dialog: MatDialog, public carDetailsService: CarDetailsService, public brandService: BrandService, private quotationService: QuotationService,
    private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private pushNotificationService: PushNotificationsService,
    private salesOrderService: SalesOrderService, public opportunityService: OpportunityService, private cdr: ChangeDetectorRef, private dataService: DataService,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {

    this.storage_data_id = this.dataService.getData('storage_data_id');
    this.getRecord(this.storage_data_id);
    // this.route.queryParams.subscribe(params => {
    //   this.salesorderid = params['salesorderid'];
    //   this.isEdit = params['isEdit'];
    //   console.log(this.salesorderid, this.salesorderid)
    // });
  }

  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.salesorderid = response?.data['salesorderid'];
        this.isEdit = response?.data['isEdit'];
        this.isFinanceAccess = response?.data['isFinanceAccess'];
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }

  disableFormArray() {
    // Get reference to the products FormArray
    const productsArray = this.productForm.get('products') as FormArray;
    // Iterate through each form group in the FormArray and disable it
    productsArray.controls.forEach(control => {
      control.disable(); // Disable the form group
    });
  }


  ngAfterViewInit() {
    this.loading = true;
    setTimeout(async () => {
      if (this.salesorderid) {
        this.salesOrderService.getByIdSalesorder(this.salesorderid).pipe()
          .subscribe(async (data: any) => {
            console.log("getByIdSalesorder", data);
            this.fillForm(data[0]);
            this.populateProducts(data[0].opportunity_details);
          });
        this.minFromDate = this.addEditForm.controls['expirydate'].value;
      }
      this.addEditForm.patchValue({ showroomdetid: 1 });
      if (this.isEdit == 'VIEW') {
        this.addEditForm.disable();
        setTimeout(() => {
          this.disableFormArray();
        }, 1000);

      } this.loading = false;

      if (this.isEdit == "EDIT") {
        let getAllOpportunity = await this.opportunityService.getOpportunity().toPromise();
        let totalSalesorderList = await this.salesOrderService.getSalesorder().toPromise();
        this.opportunityList = getAllOpportunity && getAllOpportunity.filter((ele: any) =>
          this.opportunityid || (ele.status === 1 &&
            ele.dealstatusid !== 2 &&
            ele.opportunity_details && ele.opportunity_details.length > 0 && ele.opportunity_details[0].brandid &&
            !totalSalesorderList.some((so: any) => so.opportunityid === ele.opportunityid)
          )
        );
        this.filteredopportunityList = this.opportunityList;
        this.addEditForm.patchValue({ opportunityid: this.opportunityid });
      }

    }, 1000);
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.cdr.detectChanges();
  }


  public accountidFiltered(item: any) {
    return this.accountFilteredList.find((ele: any) => ele.accountname == item.accountname);
  }

  addAccountRecord() {
    const dialogRef = this.dialog.open(AddAccountFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true, data: { typeid: "3" }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      // if (result) {
      // this.accountList = await this.accountService.get().toPromise();
      // this.accountFilteredList = this.accountList;

      let accounttotalList = await this.accountService.get().toPromise();
      let temtypeid = ["3"];
      this.accountFilteredList = accounttotalList && accounttotalList.filter(item =>
        item.typeid.some((id: any) => temtypeid.includes(id))
      );
      this.accountList = this.accountFilteredList;

      this.addEditForm.patchValue({
        excutedby: result.data.accountid
      })
      // }
    });
  }


  public editAccountRecord(items: any) {
    const dialogRef = this.dialog.open(EditContactFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log("result", result);

      if (result == 'Success') {

      } else {
        this.addEditForm.patchValue({ salestype: null });
      }
    });
  }

  salesTypechange(event: any) {
    const filterValue = event.value;

    if (filterValue == "export") {
      this.accountService.getByID(this.accountid).pipe().subscribe((data: any) => {
        console.log("getByID", data);
        if (data === undefined || data.passportnumber === undefined || data.passportnumber === null || data.passportnumber == '') {
          this.errorlogService.logManualValidationError(`add-edit-sales-order component|salesTypechange()|Check Your Account details some details are missing.`);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            title: "Check Your Account details some details are missing.",
            icon: 'info'
          });
          data.passport = "true";
          this.editAccountRecord(data);
        }
      })
    }
  }





  async ngOnInit() {
    if (this.isEdit == "EDIT") {
      this.buttonlabel = "Update"
    }
    this.addEditForm = this.fb.group({
      salesorderrefno: [''],
      opportunityid: ['', Validators.required],
      salesordername: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      expirydate: ['', Validators.required],
      showroomdetid: [1],
      subtotal: [''],
      tax: [''],
      discount: [''],
      currencyid: ['1'],
      grandtotal: [''],
      exchangerate: [1],
      description: [''],
      status: ['1'],
      quoteid: [''],
      excutedby: ['', Validators.required],
      showexcutedby: [false],
      dealstatusid: ['', Validators.required],
      vehicleregistrationdoc: [null],
      vehicleregistrationdocback: [null],
      lporegistrationcard: [null],
      salestype: ['', Validators.required],
      // directorname: ['']


      paymentstatus: ['', ],
      modeofpaymentid: ['', ],
      paymentdate: [],
      paymentremark: [''],

    });

    this.productForm = this.fb.group({
      products: this.fb.array([])
    });


    this.getModeofpayment();

    let accounttotalList = await this.accountService.get().toPromise();
    let temtypeid = ["3"];
    this.accountFilteredList = accounttotalList && accounttotalList.filter(item =>
      item.typeid.some((id: any) => temtypeid.includes(id))
    );
    this.accountList = this.accountFilteredList;


    if (!this.salesorderid) {
      let findnextRefno = await this.opportunityService.getfindnextRefno('SALESORDER').toPromise();
      console.log("salesorderrefno", findnextRefno.salesorderrefno);
      this.addEditForm.patchValue({ salesorderrefno: findnextRefno.salesorderrefno });
    }

    await this.getAllBrand();
    // var showroomDetailsArr = await this.carDetailsService.getShowroomCarDetails().toPromise();
    // this.showroomdetidList = showroomDetailsArr.filter((ele: any) => {
    //   return ele.showroomcategorytype === null || ele.showroomcategorytype === 'buyaCar';
    // });
    // this.showroomdetidFilterList =this.showroomdetidList;
    await this.getAllCarDetails();
    await this.getquotation();
    let getAllOpportunity = await this.opportunityService.getOpportunity().toPromise();

    if (this.isEdit == "VIEW") {
      this.opportunityList = getAllOpportunity;
      this.filteredopportunityList = this.opportunityList;
      console.log("this.opportunityList", this.opportunityList);
    } else if (this.isEdit == "EDIT") {

    }
    else {

      const today = new Date();
      today.setDate(today.getDate() - 1); // Increase today by one day
      let totalSalesorderList = await this.salesOrderService.getSalesorder().toPromise();
      console.log("this.getAllOpportunity", getAllOpportunity);

      this.opportunityList = getAllOpportunity && getAllOpportunity.filter((ele: any) =>
        ele.status === 1 &&
        ele.dealstatusid !== 2 &&
        ele.opportunity_details && ele.opportunity_details.length > 0 && ele.opportunity_details[0].brandid &&
        !totalSalesorderList.some((so: any) => so.opportunityid === ele.opportunityid)
      );

      //&&
      //new Date(ele.expectedclosedate) >= today
      this.filteredopportunityList = this.opportunityList;
      console.log("this.opportunityList", this.opportunityList);
    }



    // this.addEditForm.controls['dealstatusid'].valueChanges.subscribe(value => {
    //   const directorname = this.addEditForm.controls['directorname'];
    //   if (value == 2 || value == '2') {
    //     directorname.setValidators([Validators.required]);
    //   } else {
    //     directorname.clearValidators();
    //   }
    //   directorname.updateValueAndValidity();
    // })
     
  }

  isPastDate(dateStr: string): boolean {
    if (!dateStr) return false;
    const expectedDate = new Date(dateStr);
    const today = new Date();

    // Normalize both to 00:00 to avoid time conflicts
    expectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return expectedDate < today; // Disable if date is in the past
  }



  async getAllCarDetails() {
    if (this.isEdit == 'VIEW') {
      this.cartotalList = await this.carDetailsService.getCarDetails().toPromise();
      this.filteredcartotalList = this.cartotalList;
      this.carList = this.cartotalList;
    } else {
      await this.carDetailsService.listAllcarwithextraexpense().pipe()
        .subscribe((data: any) => {
          console.log("buycardetails", data);
          this.cartotalList = data;
          this.carList = data;
          this.filteredcartotalList = data;
        });
    }
  }

  private async fillForm(parsedData: any) {
    this.opportunityid = parsedData.opportunityid;
    this.addEditForm.patchValue({
      opportunityid: parsedData.opportunityid,
      salesordername: parsedData.salesordername,
      expirydate: parsedData.expirydate,
      salesorderrefno: parsedData.salesorderrefno,
      subtotal: parsedData.subtotal,
      tax: parsedData.tax,
      discount: parsedData.discount,
      currencyid: parsedData.currencyid && parsedData.currencyid.toString(),
      grandtotal: parsedData.grandtotal,
      exchangerate: parsedData.exchangerate,
      description: parsedData.description,
      status: parsedData.status && parsedData.status.toString(),
      quoteid: parsedData.quoteid,
      excutedby: parsedData.excutedby,
      showexcutedby: parsedData.showexcutedby,
      vehicleregistrationdoc: parsedData.vehicleregistrationdoc,
      vehicleregistrationdocback: parsedData.vehicleregistrationdocback,
      lporegistrationcard: parsedData.lporegistrationcard,
      salestype: parsedData.salestype,
      dealstatusid: parsedData.dealstatusid && parsedData.dealstatusid.toString(),

      paymentstatus: parsedData.paymentstatus,
      modeofpaymentid: parsedData.modeofpaymentid,
      paymentdate: parsedData.paymentdate,
      paymentremark: parsedData.paymentremark,
      // directorname: parsedData.directorname,
    });

    this.isBeforeExpiryDate(parsedData.expirydate);

  }

  public save() {
    debugger


    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    this.isShowErrors = true;
    this.loading = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return
    }
    this.formData = new FormData();
    var enteredData = this.addEditForm.value;

    if (enteredData.dealstatusid == 2 || enteredData.dealstatusid == '2') {
      if (enteredData.vehicleregistrationdoc == null || enteredData.vehicleregistrationdoc == "") {
        this.loading = false;
        this.info("Please add the front side of the vehicle registration card");
        return;
      }

      if (enteredData.vehicleregistrationdocback == null || enteredData.vehicleregistrationdocback == "") {
        this.loading = false;
        this.info("Please add the Back side of the vehicle registration card");
        return;
      }
    }



    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
    enteredData.username = obj[0]?.username;
    let productDetails = this.productForm.value.products;
    enteredData.salesorderid = this.salesorderid;
    // productDetails && productDetails.forEach((item: any) => {
    //   if(item.soldstatus == true){
    //     this.info( "Please remove the sold car and save the changes.");
    //     break
    //   }
    //   this.formData.append(`productDetails[]`, JSON.stringify(item));
    // });
    // if (productDetails && !this.salesorderid) {


    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }
    if (this.salesorderid) {

      if (productDetails && productDetails.length > 0) {
        for (const item of productDetails) {
          this.formData.append(`productDetails[]`, JSON.stringify(item));
        }
      }

      this.formData.append("updatevehicleregistrationdoc", enteredData.vehicleregistrationdoc && enteredData.vehicleregistrationdoc[0]);
      this.formData.append("updatevehicleregistrationdocback", enteredData.vehicleregistrationdocback && enteredData.vehicleregistrationdocback[0]);

      this.formData.append("updatelporegistrationcard", enteredData.lporegistrationcard && enteredData.lporegistrationcard[0]);




      this.salesOrderService.updateSalesorder(this.formData, this.salesorderid,).subscribe(
        async (response: any) => {
          this.success("Sales Order Updated Successfully");
          this.loading = false;
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['sales-order']);
        });
    } else {

      if (productDetails && productDetails.length > 0) {
        for (const item of productDetails) {
          if (item.soldstatus === true) {
            this.loading = false;
            this.info("Please Remove the Sold Car and Save the Changes.");
            return; // Stop the loop
          }
          this.formData.append(`productDetails[]`, JSON.stringify(item));
        }
      }

      this.salesOrderService.createSalesorder(this.formData).subscribe(
        async (response: any) => {
          this.success("Sales Order Created Successfully");
          this.loading = false;
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['sales-order']);
        });
    }
  }

  private success(message: any) {
    this.loading = false;
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private info(message: any) {
    this.loading = false;
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 5000, title: message, icon: 'info', });
    return
  }

  // onShowroomCarOptionSelected(tempValue: any) {
  //   let selectedCar = this.carList.find((ele: any) => ele.carshowroom_id == tempValue)
  //   if (selectedCar) {
  //     const salesPriceControl = this.getProductControl('salesprice');
  //     const amountControl = this.getProductControl('amount');
  //     const desControl = this.getProductControl('description');
  //     const taxControl = this.getProductControl('tax');
  //     const taxvalueControl = this.getProductControl('taxamount');
  //     const salesPrice = selectedCar.carprice || 0;
  //     const taxAmount = (salesPrice * 5) / 100 || 0;
  //     if (salesPriceControl && amountControl) {
  //       salesPriceControl.setValue(selectedCar.carprice);
  //       amountControl.setValue(selectedCar.carprice);
  //     }
  //     if (desControl) {
  //       desControl.setValue(selectedCar.description);
  //     }
  //     if (taxControl) {
  //       taxControl.setValue(5);
  //     }
  //     if (taxvalueControl) {
  //       taxvalueControl.setValue(taxAmount);
  //     }
  //     this.refershTableCounts();
  //   }
  // }

  onShowroomCarOptionSelected(tempValue: any, i: any) {
    let selectedCar = this.carList.find((ele: any) => ele.carshowroom_id == tempValue);
    if (selectedCar) {
      // console.log("selectedCar",selectedCar);
      // if(i==0){
      //   let oppname =this.addEditForm.controls['salesorderrefno'].value + selectedCar.brandname + " "+selectedCar.modelname;
      //   this.addEditForm.patchValue({ salesordername: oppname});
      // }

      // const totalvalue = parseFloat(selectedCar.carprice) + parseFloat(selectedCar.totalexpensevalue) + parseFloat(selectedCar.totaladvanceamount) + parseFloat(selectedCar.totalconsignmentamount);
      const totalvalue = parseFloat(selectedCar.carprice) + parseFloat(selectedCar.totalexpensevalue);

      const salesPriceControl = this.getProductControl('salesprice');
      const amountControl = this.getProductControl('amount');
      const desControl = this.getProductControl('description');
      const taxControl = this.getProductControl('tax');
      const taxvalueControl = this.getProductControl('taxamount');

      const salesPrice = totalvalue || 0;
      const taxAmount = (salesPrice * 5) / 100 || 0;

      if (salesPriceControl && amountControl) {
        salesPriceControl.setValue(salesPrice);
        amountControl.setValue(salesPrice);
      }
      if (desControl) {
        desControl.setValue(selectedCar.description);
      }
      if (taxControl) {
        taxControl.setValue(5);
      }
      if (taxvalueControl) {
        taxvalueControl.setValue(taxAmount);
      }
      this.refershTableCounts();
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

  // Method to populate the products FormArray with opportunity_details data
  async populateProducts(opportunityDetails: any[]): Promise<void> {
    console.log("opportunityDetails", opportunityDetails);

    await this.salesOrderService.productdetailswithsoldstatus(opportunityDetails).subscribe(
      async (productArr: any) => {
        console.log("productArr", productArr.productDetails);
        let arr = productArr.productDetails;
        const productsFormArray = this.productForm.get('products') as FormArray;
        productsFormArray.clear();
        console.log("arr", arr);
        arr && arr.forEach((detail: any) => {
          productsFormArray.push(this.createProductFormGroup(detail));
        });

        this.refershTableCounts();
      });

  }

  // Method to create a FormGroup for each product detail
  createProductFormGroup(detail: any): FormGroup {
    console.log("detail", detail);

    // const salesPrice = detail.salesprice || 0; // Get sales price or default to 0
    // const taxAmount = (salesPrice * 5) / 100 || 0; 
    // const amountWithTax = salesPrice + taxAmount; // Calculate amount with tax
    this.selectedOptions.push(detail.carshowroom_id)
    const salesPrice = detail.salesprice || 0; // Get sales price or default to 0
    const discount = detail.discount || 0;
    // const taxAmount = salesPrice * (5 / 100);
    // const discountedPrice = (salesPrice - discount) * (5 / 100);
    // const totalAmount = discountedPrice + taxAmount;
    const discountedPrice = salesPrice - discount; // Apply discount to the sales price

    let taxvalue = detail.tax ?? 5;
    // const taxRate = taxvalue || 0.05; // 5% tax rate
    const taxRate = (typeof taxvalue === 'number') ? taxvalue / 100 : 0.05;
    // Calculate tax amount based on the discounted price
    const taxAmount = discountedPrice * taxRate;

    // Calculate total amount by adding the discounted price and tax amount
    const totalAmount = discountedPrice + taxAmount;

    return this.fb.group({
      brandid: [detail.brandid, Validators.required],
      productname: [detail.carshowroom_id, Validators.required],
      description: [detail.description],
      quantity: [detail.quantity, Validators.required],
      salesprice: [salesPrice, Validators.required],
      discount: [detail.discount ? detail.discount : 0],
      taxamount: [taxAmount ? taxAmount.toFixed(2) : '0'],
      tax: [(typeof taxvalue === 'number') ? taxvalue : 5],
      amount: [totalAmount, Validators.required],
      taxcode: [detail.taxid || 1],
      soldstatus: [detail.soldstatus],
    });
  }

  // Getter for easy access to the products form array
  get products() {
    return this.productForm.get('products') as FormArray;
  }

  getShowroomCarList(tempValue: any) {
    this.filteredcartotalList = this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === 1 && ele.brandid === tempValue;
    });
  }

  addProduct() {
    const productGroup = this.fb.group({
      brandid: ['', Validators.required],
      productname: [null, Validators.required],
      description: [''],
      quantity: [1, Validators.required],
      salesprice: [null, Validators.required],
      discount: [0],
      amount: [null, Validators.required],
      taxamount: [''],
      tax: [''],
      taxcode: [1],
      soldstatus: ['']
    });
    this.products.push(productGroup);
  }

  // Remove a product row from the form array
  removeProduct(index: number) {
    this.products.removeAt(index);
    this.calculateTotalDiscount();
    this.refershTableCounts();
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


  public editAccountRecord1(items: any) {
    items.salesorderdetails = true;
    const dialogRef = this.dialog.open(EditContactFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {

      } else {
        this.addEditForm.patchValue({ opportunityid: null });
      }
    });
  }

  onOpenedChange(tempValue: any) {
    const brandid = this.getProductControl('brandid');
    this.filteredcartotalList = this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === 1 && ele.brandid === brandid?.value;
    });
  }


  onOpportunityOptionSelected(event: any) {
    this.addEditForm.patchValue({
      quoteid: '',
      salesordername: '',
      expirydate: '',
      showroomdetid: '',
      subtotal: '',
      tax: '',
      discount: '',
      grandtotal: '',
      description: '',
      excutedby: '',
      salestype: '',
      vehicleregistrationdoc: null,
      vehicleregistrationdocback: null,
      lporegistrationcard: null,
      dealstatusid: ''
    });
    this.imageSrc = null;
    this.imageSrcback = null;
    this.imageSrclpo = null;
    if (event == 'null') {
      this.addEditForm.patchValue({
        quoteid: '',
      });
      this.quotationfilteredList = this.quotationList;
      const productsFormArray = this.productForm.get('products') as FormArray;
      productsFormArray.clear();
    }
    let findData = this.opportunityList.find((ele: any) => ele.opportunityid == event);
    var opportunity_details = findData.opportunity_details;
    this.accountid = findData.accountid;

    this.accountService.getByID(this.accountid).pipe().subscribe((data: any) => {
      console.log("getByID", data);

       if (!data.leadtype) {
                this.errorlogService.logManualValidationError(`add-edit-sales-order component|onOpportunityOptionSelected()|Check Your Account details some details are missing.`);
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 5000,
                  title: "Check Your Account details Some details are missing.",
                  icon: 'info'
                });data.purchasedetails = true;
                this.editAccountRecord1(data);
                this.expirydatefun(findData.expectedclosedate);
              
            }else if (data.leadtype == "individual") {
        if (data === undefined || data.emiratesid === undefined || data.emiratesid === null || data.emiratesid === "" || data.trafficfileno === undefined || data.trafficfileno === null || data.trafficfileno === "") {
          this.errorlogService.logManualValidationError(`add-edit-sales-order component|onOpportunityOptionSelected() 1|Check Your Account details some details are missing.`);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            title: "Check Your Account details Some details are missing.",
            icon: 'info'
          });
          this.editAccountRecord1(data);
          this.expirydatefun(findData.expectedclosedate);
        }
      } else {
        if (data.tradelicenno === undefined || data.tradelicenno === null || data.trnnumber === undefined || data.trnnumber === null) {
          this.errorlogService.logManualValidationError(`add-edit-sales-order component|onOpportunityOptionSelected() 2|Check Your Account details some details are missing.`);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            title: "Check Your Account details Some details are missing.",
            icon: 'info'
          });
          this.editAccountRecord1(data);
          this.expirydatefun(findData.expectedclosedate);
        }
      }

    });

    let findData2 = this.carList && this.carList.find((ele: any) => ele.carshowroom_id == opportunity_details[0].carshowroom_id);
    let qname = this.addEditForm.controls['salesorderrefno'].value + " " + findData2.brandname + " " + findData2.modelname;
    this.addEditForm.patchValue({
      salesordername: qname, salestype: findData.salestype
    });

    this.populateProducts(opportunity_details);
    this.refershTableCounts();
    // 

    this.addEditForm.patchValue({
      expirydate: findData.expectedclosedate,
    });
    this.expirydatefun(findData.expectedclosedate);

    this.quotationfilteredList = this.quotationList && this.quotationList.filter((ele: any) => ele.opportunityid == event);

    // let findRec = this.quotationfilteredList && this.quotationfilteredList.find((ele:any)=> ele.opportunityid == this.addEditForm.controls['quoteid'].value);
    // console.log("findRec",findRec);


  }


  onQuoteOptionSelected(event: any) {
    if (event == 'null') {
      const productsFormArray = this.productForm.get('products') as FormArray;
      productsFormArray.clear();

      this.addEditForm.patchValue({
        opportunityid: '',
      });

    } else {
      this.quotationService.getByIdquotation(event).pipe()
        .subscribe(async (data: any) => {
          console.log("getByIdquotation", data);
          this.addEditForm.patchValue({
            opportunityid: data[0]?.opportunityid,
            expirydate: data[0]?.expirydate,
          });
          this.accountid = data[0] && data[0].accountid;

          let carshowroom_id = data[0] && data[0].opportunity_details && data[0].opportunity_details[0].carshowroom_id;
          let findData2 = this.carList.find((ele: any) => ele.carshowroom_id == carshowroom_id);
          let qname = this.addEditForm.controls['salesorderrefno'].value + " " + findData2.brandname + " " + findData2.modelname;
          this.addEditForm.patchValue({
            salesordername: qname, salestype: data[0]?.salestype
          });

          this.populateProducts(data[0].opportunity_details);

        });
    }

  }

  public isFiltered(item: any) {
    return this.filteredopportunityList.find((ele: any) => ele.opportunityid == item.opportunityid);
  }

  public isFilteredOuote(item: any) {
    return this.quotationfilteredList.find((ele: any) => ele.quoteid == item.quoteid);
  }



  // isShowroomFiltered(item: any) {
  //   return this.showroomdetidFilterList.find((ele: any) => ele.showroomdetid == item.showroomdetid);
  // }

  isShowroomCarFiltered(item: any) {
    return this.filteredcartotalList.find((ele: any) => ele.carshowroomrefno == item.carshowroomrefno);
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

  public isBrandFiltered(item: any) {
    return this.filteredList.find((ele: any) => ele.brandid == item.brandid);
  }

  public isTaxFiltered(item: any) {
    return this.filteredtaxList.find((ele: any) => ele.taxid == item.taxid);
  }

  async getAllBrand() {
    this.brandList = await this.brandService.getBrand().toPromise();
    this.filteredList = this.brandList.slice();

    this.taxList = await this.quotationService.getTax().toPromise();
    this.filteredtaxList = this.taxList.slice();
  }

  getTaxselectedOption(tempValue: number, i: any) {
    debugger
    let findData: any = this.taxList.find((ele: any) => ele.taxid == tempValue);
    var selectedTax = findData.taxvalue;
    // Update tax and tax amount fields of the selected product
    const selectedProduct = this.products.controls[i];
    selectedProduct.get('tax')?.setValue(selectedTax);




    const salesPrice = selectedProduct.get('salesprice')?.value;
    const discount = selectedProduct.get('discount')?.value;
    const discountedPrice = salesPrice - discount;
    const taxAmount = discountedPrice * (selectedTax / 100);
    const totalAmount = discountedPrice + taxAmount;
    // const totalTotal = taxAmount + salesPrice;
    selectedProduct.get('taxamount')?.setValue(taxAmount ? taxAmount.toFixed(2) : '0');
    selectedProduct.get('amount')?.setValue(totalAmount);
    this.refershTableCounts();
  }

  calculateTotalDiscount() {
    this.totalDiscount = 0; // Reset total discount
    let totalAmountWithTax = 0; // Initialize total amount with tax

    this.products.controls.forEach(product => {
      const discount = product.get('discount')?.value || 0; // Handle null or undefined discount
      const amountControl = product.get('amount');
      const amount = amountControl?.value || 0; // Handle null or undefined amount

      // Calculate discounted amount
      const discountedAmount = amount - discount;

      // Update amount with discounted amount
      if (amountControl) { // Ensure amountControl exists before setting value
        amountControl.patchValue(discountedAmount);
      }

      // Update total discount
      this.totalDiscount += discount;

      // Calculate total amount including tax for each product
      totalAmountWithTax += discountedAmount;
    });

    // Calculate total tax for all products
    const totalTax = totalAmountWithTax * 0.05; // Assuming tax rate is 5%

    // Calculate grand total including tax and considering total discount
    // const grandTotal = totalAmountWithTax + totalTax;
    const grandTotal = totalAmountWithTax;

    // Update form with calculated values
    this.addEditForm.patchValue({
      discount: this.totalDiscount,
      grandtotal: grandTotal
    });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  getDiscountselectedOption(discountValue: any, i: any) {
    const selectedProduct = this.products.controls[i];
    const productname = selectedProduct.get('productname')?.value || 0;
    const salesPricediscountControl = selectedProduct.get('discount');

    if (discountValue === '' || discountValue === null || discountValue === undefined || isNaN(discountValue) || discountValue <= 0) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Discount must be a numeric value.');
      this.handleError("Discount must be a numeric value.");
      salesPricediscountControl?.setValue('');
    }
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    const role_id = obj[0]?.role_id;
    if (role_id == 1 || role_id == 10) {

    } else {
      if (productname) {
        let data = this.cartotalList && this.cartotalList.find((ele: any) => ele.carshowroom_id == productname);
        let carmaxdiscount = parseInt(data.maxdiscount, 10) || 0;
        let discountValueInt = parseInt(discountValue, 10) || 0;
        if (carmaxdiscount < discountValueInt) {
          this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Product maximum discount exists');
          this.handleError("Product maximum discount exists");
          salesPricediscountControl?.setValue(0);
          return
        }
      }
    }



    const salesPrice = selectedProduct.get('salesprice')?.value || 0;
    const selectedTax = selectedProduct.get('tax')?.value || 0;
    const discountedPrice = salesPrice - discountValue;
    const taxAmount = discountedPrice * (selectedTax / 100);
    const totalAmount = discountedPrice + taxAmount;

    const currenttaxAmount = (salesPrice - discountValue) * (selectedTax / 100);

    // selectedProduct.get('amount')?.setValue(totalAmount);

    selectedProduct.get('taxamount')?.setValue(currenttaxAmount ? currenttaxAmount.toFixed(2) : '0');

    selectedProduct.get('amount')?.setValue(totalAmount);
    this.refershTableCounts();
  }


  refershTableCounts() {
    let tempAmount = 0;
    let tempTax = 0;
    let tempDis = 0;
    let totalsalesprice = 0;
    this.products.controls.forEach(product => {
      const amount = product.get('amount')?.value || 0;
      const salesprice = product.get('salesprice')?.value || 0;
      const taxamount = product.get('taxamount')?.value || 0;
      const disamount = product.get('discount')?.value || 0;

      tempAmount += parseFloat(amount);
      tempTax += parseFloat(taxamount);
      tempDis += parseFloat(disamount);
      totalsalesprice += parseFloat(salesprice);
    });

    // const grandTotal = tempAmount + tempTax - tempDis;

    // this.addEditForm.patchValue({
    //   subtotal: tempAmount.toFixed(2),
    //   tax: tempTax.toFixed(2),
    //   discount: tempDis.toFixed(2),
    //   grandtotal: grandTotal.toFixed(2)
    // });
    this.addEditForm.patchValue({
      // subtotal: tempAmount.toFixed(2),
      subtotal: totalsalesprice.toFixed(2),
      tax: tempTax.toFixed(2),
      discount: tempDis.toFixed(2),
      // grandtotal: grandTotal.toFixed(2)
      grandtotal: tempAmount.toFixed(2),
    });
  }


  getquotation() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    this.quotationService.getquotation().pipe()
      .subscribe((data: any) => {
        console.log("getquotation", data);
        this.quotationList = data && data.filter((ele: any) => ele.status == 1)
        this.quotationfilteredList = this.quotationList;
      });
  }//&& new Date(ele.expirydate) >= today)

  public advancesearch() {
    const dialogRef = this.dialog.open(OpportunityAdvanceSearchComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      // data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      debugger
      this.addEditForm.patchValue({
        opportunityid: result
      })
      let findData = this.opportunityList.find((ele: any) => ele.opportunityid == result);
      var opportunity_details = findData.opportunity_details;
      this.quotationfilteredList = this.quotationList && this.quotationList.filter((ele: any) => ele.opportunityid == result);
      this.populateProducts(opportunity_details);
      this.refershTableCounts();
    });
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
        vehicleregistrationdoc: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-sales-order component|onFileChanged()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = '';
      this.addEditForm.patchValue({
        vehicleregistrationdoc: null
      });
    }
  }

  async onFileChanged2(event: any) {
    this.files1 = event.target.files;
    if (this.files1.length === 0) {
      return;
    }

    const selectedFile = this.files1[0];

    if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        vehicleregistrationdocback: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrcback = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-sales-order component|onFileChanged2()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = '';
      this.addEditForm.patchValue({
        vehicleregistrationdocback: null
      });
    }
  }

  async onFileChanged3(event: any) {
    this.files1 = event.target.files;
    if (this.files1.length === 0) {
      return;
    }

    const selectedFile = this.files1[0];

    if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        lporegistrationcard: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrclpo = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-sales-order component|onFileChanged3()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = '';
      this.addEditForm.patchValue({
        lporegistrationcard: null
      });
    }
  }

  ngOnDestroy() {
    this.dataService.clearData('storage_data_id');
  }

  dealstatus(ele: any) {
    if (ele == "2") {
      let productname = this.products.value && this.products.value[0] ? this.products.value[0].productname : null;
      if (productname) {
        this.carDetailsService.getCarDetailsByID(productname).pipe()
          .subscribe(async (data: any) => {
            console.log("data", data);
            let record = data && data[0];
            if ((record.carownertypeid == 2 || record.carownertypeid == 1) && !record.carowner) {
              this.errorlogService.logManualValidationError(`add-edit-sales-order component|dealstatus()|Seller Details For The Showroom Car Are Currently Unavailable.`);
              Swal.fire({
                title: "Seller Details For The Showroom Car Are Currently Unavailable.",
                // text: 'Thank you for signing our contract',
                icon: 'error',
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonColor: '#f89923',
                cancelButtonColor: '#b1b1b1',
                confirmButtonText: 'Ok'
              });

              this.addEditForm.patchValue({
                dealstatusid: ''
              });
            }
          })
      }
    }else if(ele == "3" || ele == "4"){
      this.addEditForm.patchValue({
        vehicleregistrationdocback: null,vehicleregistrationdoc:null
      });
    } else {
      // this.addEditForm.patchValue({
      //   vehicleregistrationdocback: null,vehicleregistrationdoc:null
      // });
    }
  }


  onDateChange(event: any) {
    debugger
    const selectedDate = new Date(event.value);
    const today = new Date();
    // Reset time to 00:00:00 for fair comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
      let message = "The Sales Order Has Expired. You Cannot Edit It Because The Expiry Date Is Earlier Than Today's Date. Please Contact Showroom Manager";
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      let role_id = obj[0]?.role_id;
      this.expiryDatestatus = true;

      let control: any = this.addEditForm.get('expirydate');
      control?.setErrors({ checkexpectedclosedatepast: true });
      control.markAsTouched();

      if (role_id == 1 || role_id == 10 || role_id == 13) {
        // message = "In the Sales Order, the Opportunity will be disabled if the Expected Close Date is earlier than today's date.";
        message = "Expiry Date - Expired. In the Sales Order, the Quotation will be disabled if the Expiry Date is earlier than today's date.";
        this.expiryDatestatus = false;
        control?.setErrors({ checkexpectedclosedatepast: false });
        control.markAsTouched();
      }
      this.errorlogService.logManualValidationError(`add-edit-sales-order component|onDateChange()|${message}`);
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
    } else if (selectedDate.getTime() == today.getTime()) {

    } else {
      // this.expiryDatestatus = false;



      let message = "The Sales Order Has Expired. You Cannot Edit It Because The Expiry Date Is Earlier Than Today's Date. Please Contact Showroom Manager";
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      let role_id = obj[0]?.role_id;
      this.expiryDatestatus = true;

      let control: any = this.addEditForm.get('expirydate');
      control?.setErrors({ checkexpectedclosedatepast: true });
      control.markAsTouched();

      if (role_id == 1 || role_id == 10 || role_id == 13) {
        message = "Expiry Date - Expired. In the Sales Order, the Quotation will be disabled if the Expiry Date is earlier than today's date.";
        this.expiryDatestatus = false;
        control?.setErrors({ checkexpectedclosedatepast: false });
        control.markAsTouched();
      }
      this.errorlogService.logManualValidationError(`add-edit-sales-order component|onDateChange() 2| ${message}`);
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


    }
  }


  isBeforeExpiryDate(expiryDate: string): any {debugger
    const currentDate = new Date();
    const expiry = new Date(expiryDate);

    // Remove time portion by setting time to midnight
    currentDate.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    let status = currentDate <= expiry;

    if (!status) {

      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      let role_id = obj[0]?.role_id;
      this.expiryDatestatus = true;

      let control: any = this.addEditForm.get('expirydate');
      control?.setErrors({ checkexpectedclosedatepast: true });
      control.markAsTouched();

      let message = "Sales order is Expired . Kindly Contact Showroom Manager";
      if (role_id == 1 || role_id == 10 || role_id == 13) {
        message = "Firstly Sales order is Expired . Please select a valid future date."
        this.expiryDatestatus = false;

        let control: any = this.addEditForm.get('expirydate');
        control?.setErrors({ checkexpectedclosedatepast: false });
        control.markAsTouched();
      }
      this.errorlogService.logManualValidationError(`add-edit-sales-order component|isBeforeExpiryDate()|${message}`);
      Swal.fire({
        title: message,
        icon: 'error',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonColor: '#f89923',
        cancelButtonColor: '#b1b1b1',
        confirmButtonText: 'Ok'
      });

    }
  }


  expirydatefun(expectedclosedate) {
    const selectedDate = new Date(expectedclosedate);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
      let message = "The Sales Order Has Expired. You Cannot Edit It Because The Expiry Date Is Earlier Than Today's Date. Please Contact Showroom Manager";
      this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      let role_id = obj[0]?.role_id;
      this.expiryDatestatus = true;

      let control: any = this.addEditForm.get('expirydate');
      control?.setErrors({ checkexpectedclosedatepast: true });
      control.markAsTouched();

      if (role_id == 1 || role_id == 10 || role_id == 13) {
        // message = "In the Sales Order, the Opportunity will be disabled if the Expected Close Date is earlier than today's date.";
        message = "Expiry Date - Expired. In the Sales Order, the Quotation will be disabled if the Expiry Date is earlier than today's date.";
        this.expiryDatestatus = true;
        control?.setErrors({ checkexpectedclosedatepast: true });
        control.markAsTouched();
      }
      this.errorlogService.logManualValidationError(`add-edit-sales-order component|expirydatefun()|${message}`);

      Swal.fire({
        title: message,
        icon: 'question',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  }

  getModeofpayment() {
    this.modeOfPaymentService.getModeofpayment().pipe()
      .subscribe((data: any) => {
        console.log("getModeofpayment", data);
        this.modeofpaymentList = data;
        this.modeofpaymentfilteredList = data;
      });
  }

  public isModeFiltered(item: any) {
    return this.modeofpaymentfilteredList.find((ele: any) => ele.modeofpaymentid == item.modeofpaymentid);
  }


  
}