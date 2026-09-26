import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DateFormat } from 'src/app/common/ui.constant';
import { CookieService } from 'src/app/service/cookie.service';
import { ShowroomCategoryService } from 'src/app/service/showroom-category/showroom-category.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service'
import { QuotationService } from '../quotation.service';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { DesTextAreaComponent } from '../../opportunity/des-text-area/des-text-area.component';
import { BrandService } from 'src/app/service/brand/brand.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { AccountService } from '../../account/account.service';
import { EditContactFormComponent } from '../../account/edit-contact-form/edit-contact-form.component';
import { DataService } from 'src/app/service/encryption/data.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-quotation',
  templateUrl: './add-edit-quotation.component.html',
  styleUrls: ['./add-edit-quotation.component.css']
})
export class AddEditQuotationComponent implements OnInit, OnDestroy {

  public productForm!: FormGroup;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  quoteid: any;
  title: string = "Quotation";
  formData = new FormData();
  currentUser: any;
  isEdit: any;
  opportunityList: any;
  // showroomdetidList: any;
  cartotalList: any = [];
  carList: any = [];
  // showroomdetidFilterList: any;
  filteredopportunityList: any;
  filteredcartotalList: any;
  totalDiscount: any = 0;
  totalAmount: any = 0;
  filteredList: any;
  brandList: any;
  taxList: any;
  filteredtaxList: any;
  removeProductList: any = [];
  selectedOptions: any = [];
  removeQuoteProductList: any = [];
  minFromDate = new Date();
  buttonlabel: string = "Save";
  accountid: any;
  opportunityid: any;
  storage_data_id: any;
  expiryDatestatus: boolean = false;
  constructor(private cookieService: CookieService, public showroomCategoryService: ShowroomCategoryService, public dialog: MatDialog, public carDetailsService: CarDetailsService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private cdr: ChangeDetectorRef,private dataService: DataService,
    private quotationService: QuotationService, private pushNotificationService: PushNotificationsService,
    public opportunityService: OpportunityService, public accountService: AccountService, private elementRef: ElementRef, public brandService: BrandService, private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {
    // this.route.queryParams.subscribe(params => {
    //   this.quoteid = params['quoteid'];
    //   this.isEdit = params['isEdit'];
    // });

    this.storage_data_id = this.dataService.getData('storage_data_id');
    if(this.storage_data_id){
      this.getRecord(this.storage_data_id);
    }
  }

  public async getRecord(storage_data_id: any) {
   await this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.quoteid = response?.data?.quoteid;
        this.isEdit = response?.data?.isEdit;
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }

  ngAfterViewInit() {
    this.loading = true;
    setTimeout(async () => {
      if (this.quoteid) {
        this.quotationService.getByIdquotation(this.quoteid).pipe()
          .subscribe(async (data: any) => {
            console.log("getByIdquotation", data);
            this.fillForm(data[0]);
            this.populateProducts(data[0].opportunity_details);
          });
      }
      this.addEditForm.patchValue({ showroomdetid: 1 });

      if (this.isEdit == 'VIEW') {
        this.addEditForm.disable();
        setTimeout(() => {
          this.disableFormArray();
        }, 200);
      }



      

       if (this.isEdit == "EDIT") {
        let getAllOpportunity = await this.opportunityService.getOpportunity().toPromise();
        let totalQuoteList = await this.quotationService.getquotation().toPromise();
        this.opportunityList = getAllOpportunity && getAllOpportunity.filter((ele: any) =>
          this.opportunityid || (ele.status === 1 &&
            ele.dealstatusid !== 2 &&
            ele.opportunity_details && ele.opportunity_details.length > 0 && ele.opportunity_details[0].brandid &&
            !totalQuoteList.some((so: any) => so.opportunityid === ele.opportunityid)
          )
        );
        this.filteredopportunityList = this.opportunityList;
        this.addEditForm.patchValue({ opportunityid: this.opportunityid });
      }
      
      this.loading = false;
    }, 1500);

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.cdr.detectChanges();
  }


  disableFormArray() {
    // Get reference to the products FormArray
    const productsArray = this.productForm.get('products') as FormArray;
    // Iterate through each form group in the FormArray and disable it
    productsArray.controls.forEach(control => {
      control.disable(); // Disable the form group
    });
  }

  async ngOnInit() {
debugger
    if (this.isEdit == "EDIT") {
      this.buttonlabel = "Update"
    }
    this.addEditForm = this.fb.group({
      quoterefno: [''],
      opportunityid: ['', Validators.required],
      quotename: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      expirydate: ['', Validators.required],
      showroomdetid: [''],
      subtotal: [''],
      tax: [],
      discount: [''],
      currencyid: ['1'],
      grandtotal: [''],
      exchangerate: [1],
      description: [''],
      status: ['1'],
      opportunityrefno: [''],
      salestype: ['', Validators.required],
    });
    this.productForm = this.fb.group({
      products: this.fb.array([])
    });

    if (!this.quoteid) {
      let findnextRefno = await this.opportunityService.getfindnextRefno('QUOTATION').toPromise();
      console.log("quoterefno", findnextRefno.quoterefno);
      this.addEditForm.patchValue({ quoterefno: findnextRefno.quoterefno });
    }

    this.getAllBrand();
    // var showroomDetailsArr = await this.carDetailsService.getShowroomCarDetails().toPromise();
    // this.showroomdetidList = showroomDetailsArr.filter((ele: any) => {
    //   return ele.showroomcategorytype === null || ele.showroomcategorytype === 'buyaCar';
    // });
    // this.showroomdetidFilterList = this.showroomdetidList;
    await this.getAllCarDetails();
    let getAllOpportunity = await this.opportunityService.getOpportunity().toPromise();

    if (this.isEdit == "VIEW") {
      this.opportunityList = getAllOpportunity;
      this.filteredopportunityList = this.opportunityList;
    } else if (this.isEdit == "EDIT") {
     
    } else {

      const today = new Date();
      today.setDate(today.getDate() - 1); 

      let totalQuoteList = await this.quotationService.getquotation().toPromise();
      this.opportunityList = getAllOpportunity && getAllOpportunity.filter((ele: any) =>
        ele.status === 1 &&  
        ele.dealstatusid !== 2 &&
        ele.opportunity_details && ele.opportunity_details.length > 0 && ele.opportunity_details[0].brandid &&
        !totalQuoteList.some((so: any) => so.opportunityid === ele.opportunityid)
      );
      this.filteredopportunityList = this.opportunityList;
    }

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
      this.cartotalList = await this.carDetailsService.listAllcarwithextraexpense().pipe()
        .subscribe((data: any) => {
          console.log("buycardetails", data);
          this.cartotalList = data.filter((ele: any) => ele.carshowroomname === 1 && ele.status == 1 && ele.is_delete == 0);
          this.filteredcartotalList = this.cartotalList;
          this.carList = this.cartotalList;
          console.log("buycardetails", this.carList );
        });
    }
  }

  onOpenedChange(tempValue: any) {
    const brandid = this.getProductControl('brandid');
    this.filteredcartotalList = this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === 1 && ele.brandid === brandid?.value;
    });
  }

  private async fillForm(parsedData: any) {
    this.opportunityid = parsedData.opportunityid;
    this.addEditForm.patchValue({
      opportunityid: parsedData.opportunityid,
      quotename: parsedData.quotename,
      expirydate: parsedData.expirydate,
      quoterefno: parsedData.quoterefno,
      subtotal: parsedData.subtotal,
      tax: parsedData.tax,
      discount: parsedData.discount,
      currencyid: parsedData.currencyid && parsedData.currencyid.toString(),
      grandtotal: parsedData.grandtotal,
      exchangerate: parsedData.exchangerate,
      description: parsedData.description,
      status: parsedData.status && parsedData.status.toString(),
      salestype: parsedData.salestype
    });
    this.minFromDate = parsedData.expirydate;
  }

  public save() {
    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    this.isShowErrors = true;
    this.loading = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm')
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return
    }
    this.formData = new FormData();
    var enteredData = this.addEditForm.value;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
    enteredData.username = obj[0]?.username;
    let productDetails = this.productForm.value.products;



    this.removeProductList && this.removeProductList.forEach((item: any) => {
      this.formData.append(`removeProductList[]`, item);
    });
    this.removeQuoteProductList && this.removeQuoteProductList.forEach((item: any) => {
      this.formData.append(`removeQuoteProductList[]`, item);
    });



    productDetails && productDetails.forEach((item: any) => {
      this.formData.append(`productDetails[]`, JSON.stringify(item));
    });


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

    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }

    if (this.quoteid) {
      this.quotationService.updatequotation(this.formData, this.quoteid,).subscribe(
        async (response: any) => {
          this.success("Quotation Updated Successfully");
          this.loading = false;
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['quotation']);
        });
    } else {
      this.quotationService.createquotation(this.formData).subscribe(
        async (response: any) => {
          this.success("Quotation Created Successfully");
          this.loading = false;
          this.pushNotificationService.sendMessage(true);
          this.router.navigate(['quotation']);

        });
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
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

      const totalvalue = parseFloat(selectedCar.carprice) + parseFloat(selectedCar.totalexpensevalue);
      const brandid = this.getProductControl('brandid');
      const salesPriceControl = this.getProductControl('salesprice');
      const amountControl = this.getProductControl('amount');
      const desControl = this.getProductControl('description');
      const taxControl = this.getProductControl('tax');
      const taxvalueControl = this.getProductControl('taxamount');

      const salesPrice = totalvalue || 0;
      const taxAmount = (salesPrice * 5) / 100 || 0;

      if (brandid) {
        brandid.setValue(selectedCar.brandid);
      }

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
  populateProducts(opportunityDetails: any[]): void {debugger
    const productsFormArray = this.productForm.get('products') as FormArray;
    // Clear existing products
    productsFormArray.clear();
    opportunityDetails.forEach((detail: any) => {
      productsFormArray.push(this.createProductFormGroup(detail));
    });
  }

  // Method to create a FormGroup for each product detail
  createProductFormGroup(detail: any): FormGroup {
    // this.selectedOptions.push(detail.carshowroom_id)
    // const salesPrice = detail.salesprice || 0; // Get sales price or default to 0
    // const discount = detail.discount || 0;
    // const taxAmount = (salesPrice * 5) / 100 || 0;
    // const amountWithTax = salesPrice + taxAmount; // Calculate amount with tax

debugger
    this.selectedOptions.push(detail.carshowroom_id)
    const salesPrice = detail.salesprice || 0; // Get sales price or default to 0
    const discount = detail.discount || 0;
    // const taxAmount = salesPrice * (5 / 100);
    // const discountedPrice = (salesPrice - discount) * (5 / 100);
    // const totalAmount = discountedPrice + taxAmount;
    const discountedPrice = salesPrice - discount; // Apply discount to the sales price
    // const taxRate = 0.05; // 5% tax rate
    let taxvalue = detail.tax ?? 5;


    const taxRate = (typeof taxvalue === 'number') ? taxvalue / 100 : 0.05;
    // Calculate tax amount based on the discounted price
    const taxAmount = discountedPrice * taxRate;

    // Calculate total amount by adding the discounted price and tax amount
    const totalAmount = discountedPrice + taxAmount;
    return this.fb.group({
      brandid: [detail.brandid, Validators.required],
      productname: [detail.carshowroom_id, Validators.required],
      description: [detail.description],
      quantity: [detail.quantity, Validators.required,],
      salesprice: [salesPrice, Validators.required],
      discount: [detail.discount ? detail.discount : 0],
      taxamount: [taxAmount ? taxAmount.toFixed(2) : '0'],
      tax: [(typeof taxvalue === 'number') ? taxvalue.toString() : '5'],
      amount: [totalAmount, Validators.required],
      taxcode: [detail.taxid || 1],
      opportunitydettbid: [detail?.opportunitydettbid],
      quotationdettbid: [detail?.quotationdettbid]
    });


  }

  // Getter for easy access to the products form array
  get products() {
    return this.productForm.get('products') as FormArray;
  }

  getShowroomCarList(tempValue: any) {
    this.filteredcartotalList = this.cartotalList.filter((ele: any) => {
      return ele.carshowroomname === 1 && ele.status == 1 && ele.brandid === tempValue;
    });

    const productname = this.getProductControl('productname');
    if (productname) {
      productname.setValue('');
    }

  }

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

    const productGroup = this.fb.group({
      brandid: ['', Validators.required],
      productname: [null, Validators.required],
      description: [''],
      quantity: [1, [Validators.required]],
      salesprice: [null, Validators.required],
      discount: [0],
      amount: [null, Validators.required],
      taxamount: [''],
      tax: [''],
      taxcode: [1],
      opportunitydettbid: [null],
      quotationdettbid: [null]

    });
    this.products.push(productGroup);
    productGroup.get('productname')?.valueChanges.subscribe((value: string) => {
      // console.log("value",value);
      if (value && this.selectedOptions.includes(value)) {
        productGroup.get('productname')?.setValue(null);
        setTimeout(() => {
          productGroup.get('salesprice')?.setValue(null);
          productGroup.get('amount')?.setValue(null);
        }, 1000);

        this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Product already exists');
        this.handleError("Product already exists");
      } else {
        this.selectedOptions.push(value); // Track selected option
      }
    });
  }

  // Remove a product row from the form array
  removeProduct(index: number, product: any) {
    const selectedProduct = this.products.controls[index];
    const opportunitydettbid = selectedProduct.get('opportunitydettbid')?.value || null;
    const quotationdettbid = selectedProduct.get('quotationdettbid')?.value || null;
    if (opportunitydettbid) {
      this.removeProductList.push(opportunitydettbid.toString())
    }
    if (quotationdettbid) {
      this.removeQuoteProductList.push(quotationdettbid.toString())
    }
    this.selectedOptions = this.selectedOptions.filter((option: any) => option !== product.productname);
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

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  public editAccountRecord1(items: any) {
    // items.salesorderdetails = true;
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
        const productsFormArray = this.productForm.get('products') as FormArray;
        productsFormArray.clear();
      }
    });
  }

  async onOpportunityOptionSelected(event: any) {
    const productsFormArray = this.productForm.get('products') as FormArray;
    productsFormArray.clear();

    let findData = this.opportunityList.find((ele: any) => ele.opportunityid == event);
    this.addEditForm.patchValue({
      opportunityrefno: findData.opportunityrefno,
      salestype: findData.salestype
    });

    this.accountid = findData.accountid;
    this.accountService.getByID(this.accountid).pipe().subscribe((data: any) => {
      console.log("getByID", data);
      if (!data.leadtype) {
        this.errorlogService.logManualValidationError(`add-edit-quotation component|onOpportunityOptionSelected()|Check Your Account details Some details are missing.`);
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
        if (data === undefined || data.emiratesid === undefined || data.emiratesid === null || data.emiratesid === "") {
          this.errorlogService.logManualValidationError(`add-edit-quotation component|onOpportunityOptionSelected() 1|Check Your Account details Some details are missing.`);
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
          this.errorlogService.logManualValidationError(`add-edit-quotation component|onOpportunityOptionSelected() 2|Check Your Account details Some details are missing.`);
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

    var opportunity_details = findData.opportunity_details;
    console.log("opportunity_details", opportunity_details);

    let findData2 = this.carList.find((ele: any) => ele.carshowroom_id == opportunity_details[0].carshowroom_id);
    let qname = this.addEditForm.controls['quoterefno'].value + " " + findData2.brandname + " " + findData2.modelname;
    this.addEditForm.patchValue({
      quotename: qname
    });


    this.populateProducts(opportunity_details);
    this.refershTableCounts();
    // }   

    this.addEditForm.patchValue({
      expirydate: findData.expectedclosedate,
    });
    this.expirydatefun(findData.expectedclosedate);
  }

  public isFiltered(item: any) {
    return this.filteredopportunityList.find((ele: any) => ele.opportunityid == item.opportunityid);
  }


  isShowroomCarFiltered(item: any) {
    const brandid = this.getProductControl('brandid');
    return this.filteredcartotalList && this.filteredcartotalList.find((ele: any) => ele.modelname == item.modelname && ele.brandid == brandid?.value);
  }

  // isShowroomFiltered(item: any) {
  //   return this.showroomdetidFilterList.find((ele: any) => ele.showroomdetid == item.showroomdetid);
  // }

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

    if (this.isEdit == 'VIEW') {
      this.brandList = await this.brandService.getBrand().toPromise();
      this.filteredList = this.brandList.slice();
    } else {
      this.brandList = await this.brandService.listbrandwithactivecars().toPromise();
      this.filteredList = this.brandList.slice();
    }
    this.taxList = await this.quotationService.getTax().toPromise();
    this.filteredtaxList = this.taxList.slice();
  }

  getTaxselectedOption(tempValue: number, i: any) {debugger
    let findData: any = this.taxList.find((ele: any) => ele.taxid == tempValue);
    var selectedTax = findData.taxvalue;
    // Update tax and tax amount fields of the selected product
    const selectedProduct = this.products.controls[i];
    selectedProduct.get('tax')?.setValue(selectedTax);
    // const salesPrice = selectedProduct.get('salesprice')?.value;
    // const discount = selectedProduct.get('discount')?.value;
    // const taxAmount = salesPrice * (selectedTax / 100);
    // const totalTotal = taxAmount + salesPrice;
    // selectedProduct.get('taxamount')?.setValue(taxAmount);
    // selectedProduct.get('amount')?.setValue(totalTotal - discount);
    // this.refershTableCounts();


    const salesPrice = selectedProduct.get('salesprice')?.value;
    const discount = selectedProduct.get('discount')?.value;
    const discountedPrice = salesPrice - discount;
    const taxAmount = discountedPrice * (selectedTax / 100);
    const totalAmount = discountedPrice + taxAmount;
    // const totalTotal = taxAmount + salesPrice;
    selectedProduct.get('taxamount')?.setValue(taxAmount);
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
          salesPricediscountControl?.setValue(0);return
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
    selectedProduct.get('taxamount')?.setValue(currenttaxAmount);

    selectedProduct.get('amount')?.setValue(totalAmount);
    this.refershTableCounts();
  }

  refershTableCounts() {
    let tempAmount = 0;
    let tempTax = 0;
    let tempDis = 0;
    let totalsalesprice = 0;
    this.products.controls.forEach(product => {
      const salesprice = product.get('salesprice')?.value || 0;
      const amount = product.get('amount')?.value || 0;
      const taxamount = product.get('taxamount')?.value || 0;
      const disamount = product.get('discount')?.value || 0;

      tempAmount += parseFloat(amount);
      tempTax += parseFloat(taxamount);
      tempDis += parseFloat(disamount);
      totalsalesprice += parseFloat(salesprice);
    });

    // const grandTotal = tempAmount + tempTax - tempDis;

    this.addEditForm.patchValue({
      // subtotal: tempAmount.toFixed(2),
      subtotal: totalsalesprice.toFixed(2),
      tax: tempTax.toFixed(2),
      discount: tempDis.toFixed(2),
      // grandtotal: grandTotal.toFixed(2)
      grandtotal: tempAmount.toFixed(2),
    });
  }

  ngOnDestroy() {
    this.dataService.clearData('storage_data_id');
  }

    // onDateChange(event: any) {
    //   const selectedDate = new Date(event.value);
    //   const today = new Date();
    //   // Reset time to 00:00:00 for fair comparison
    //   selectedDate.setHours(0, 0, 0, 0);
    //   today.setHours(0, 0, 0, 0);
    
    //   if (selectedDate < today) {
    //     Swal.fire({
    //       title: "In the Sales Order, the Quotation will be disabled if the Expiry Date is earlier than today's date.",
    //       icon: 'question',
    //       showCancelButton: false,
    //       confirmButtonColor: '#3085d6',
    //       confirmButtonText: 'OK'
    //     }).then((result) => {
    //       if (result.isConfirmed) {
          
    //       }
    //     });
    //   }
    // }

      onDateChange(event: any) {debugger
        const selectedDate = new Date(event.value);
        const today = new Date();
        // Reset time to 00:00:00 for fair comparison
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
      
        if (selectedDate < today) {
          let message ="Expiry Date - Expired - Expired. Please Contact the Showroom Manager";
          this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
          const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
          let role_id = obj[0]?.role_id;
          this.expiryDatestatus = true;
    
          let control:any = this.addEditForm.get('expirydate');
          control?.setErrors({ checkexpectedclosedatepast: true });
          control.markAsTouched();
    
          if(role_id == 1 || role_id == 10 || role_id == 13){
            // message = "In the Sales Order, the Opportunity will be disabled if the Expected Close Date is earlier than today's date.";
            message = "Expiry Date - Expired. In the Sales Order, the Quotation will be disabled if the Expiry Date is earlier than today's date.";
           this.expiryDatestatus = false;
           control?.setErrors({ checkexpectedclosedatepast: false });
           control.markAsTouched();
         }
         this.errorlogService.logManualValidationError(`add-edit-quotation component|onDateChange()| ${message}`);
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
            this.errorlogService.logManualValidationError(`add-edit-quotation component|expirydatefun()| ${message}`);
            Swal.fire({
              title: message,
              icon: 'question',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            });
          }
        }

}


