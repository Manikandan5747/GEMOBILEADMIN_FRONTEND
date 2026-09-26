import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleIdList } from 'src/app/common/enum';
import { DateFormat } from 'src/app/common/ui.constant';
import { ErrorlogService } from 'src/app/errorlog.service';
import { BrandService } from 'src/app/service/brand/brand.service';
import { CookieService } from 'src/app/service/cookie.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorMatcherService } from 'src/app/service/form-validation/form-validators.service';
import { PriceInputDirective } from 'src/app/service/form-validation/price-input.directive';
import { ModelService } from 'src/app/service/model/model.service';
import Swal from 'sweetalert2';
import { AccountService } from '../../account/account.service';
import { ModeOfPaymentService } from '../../mode-of-payment/mode-of-payment.service';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { SalesOrderService } from '../../sales-order/sales-order.service';
import { CashRequestService } from '../cash-request.service';


@Component({
  selector: 'app-add-edit-cash-request',
  templateUrl: './add-edit-cash-request.component.html',
  styleUrls: ['./add-edit-cash-request.component.css']
})
export class AddEditCashRequestComponent implements OnInit,OnDestroy {

  @ViewChildren(PriceInputDirective) priceInputDirectives!: QueryList<PriceInputDirective>;
  
  buttonlabel: string = "Save";
  userPrivilegeObj: any;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  title: string = "Cash Request";
  formData = new FormData();
  currentUser: any;
  isEdit: any;
  disableFields: boolean = false;
  cashrequestid: any;
  minFromDate:any=new Date();
  files: any;
  filteredModelList: any;
  modelList: any;
  filteredList: any;
  brandList: any;
  accountFilteredList: any;
  accountList: any;
  imageSrc: any;
  storage_data_id: any;
  settings: any;
  isSettingUser: any;
  paymentstatus: any;
  modeofpaymentList: any;
  modeofpaymentfilteredList: any;
  imageSrc1: any;
  constructor(private cookieService: CookieService, private customerService: CustomerService, public dialog: MatDialog, private elementRef: ElementRef, private router: Router, private route: ActivatedRoute, private fb: FormBuilder,private cashRequestService:CashRequestService,private opportunityService:OpportunityService,
    private formValidationService: FormValidationService,public brandService:BrandService,private modelService:ModelService, private dataService: DataService,public salesOrderService:SalesOrderService,public modeOfPaymentService:ModeOfPaymentService,
  public accountService:AccountService,private errorlogService: ErrorlogService) {

    this.storage_data_id = this.dataService.getData('cash_storage_data_id');
    if(this.storage_data_id){
      this.getRecord(this.storage_data_id);
    }
    
     this.getCurrentUserPrivilege();
  }


  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        console.log("Retrieved data:", response);
        this.cashrequestid = response?.data?.cashrequestid;
        this.isEdit = response?.data?.isEdit;

        if (this.cashrequestid) {
          this.disableFields = true;
          this.cashRequestService.getByIdCashRequest(this.cashrequestid).pipe()
            .subscribe(async (data: any) => {
              console.log("getByIdCashRequest", data);
              setTimeout(() => {
                this.fillForm(data);
              }, 1000);
            });
        }

        if (!this.cashrequestid) {
          let findnextRefno = await this.opportunityService.getfindnextRefno('CASHREQUEST').toPromise();
          console.log("cashrequesrefno", findnextRefno.cashrequesrefno);
          this.addEditForm.patchValue({ cashrequesrefno: findnextRefno.cashrequesrefno });
        }

        if (this.isEdit == 'VIEW') {
          this.addEditForm.disable();
        } 
    
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }


  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Gecampaign)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }




ngAfterViewInit() {
  // Optionally trigger formatting after view initialization if needed
  // this.priceInputDirectives.forEach(directive => directive.formatInputValue());
}

getModeofpayment() {
  this.loading = true;
  this.modeOfPaymentService.getModeofpayment().pipe()
    .subscribe((data: any) => {
      console.log("getModeofpayment", data);
      this.modeofpaymentList = data;
      this.modeofpaymentfilteredList = data;
      this.loading = false;
        });
}

  async ngOnInit() {
    this.loading = true;
    if (this.isEdit == "EDIT") {
      this.buttonlabel = "Update"
    }
    this.addEditForm = this.fb.group({
      cashrequesrefno: ['', Validators.required],
      modeofpaymentid: ['', Validators.required],
      requestdate: ['', Validators.required],
      amount: ['',[Validators.required,this.formValidationService.noWhitespaceValidator, this.formValidationService.decimalNumberValidator(),Validators.min(1)]],
      cardetailsdes: [''],
      buydetailsdes: [''],
      paymentstatus: ['', Validators.required],
      purchasedoc:[''],
      cashrequesttype:['',Validators.required],
      financeremark:[''],
      brandid:['',],
      modelid:['',],
      accountid: ['', ],
      chequecopydoc:['']
    });
  
  
    this.accountList = await this.accountService.get().toPromise();

    this.accountFilteredList = this.accountList;
console.log("this.accountFilteredList",this.accountFilteredList);

  

  
    
    this.loading = false;
    this.getAllBrand();
  this.getModeofpayment();

    this.addEditForm.controls['cashrequesttype'].valueChanges.subscribe(value => {
      const financeremarkControl = this.addEditForm.controls['financeremark'];
      const brandidControl = this.addEditForm.controls['brandid'];
      const modelidControl = this.addEditForm.controls['modelid'];
      const accountidControl = this.addEditForm.controls['accountid'];
    
      if (value === 'carpurchase') {
        financeremarkControl.setValidators([Validators.required]);
        brandidControl.setValidators([Validators.required]);
        modelidControl.setValidators([Validators.required]);
        accountidControl.setValidators([Validators.required]);
      } else {
        financeremarkControl.clearValidators();
        brandidControl.clearValidators();
        modelidControl.clearValidators();
        accountidControl.clearValidators();
      }
    
      // Update the validity of the form controls
      financeremarkControl.updateValueAndValidity();
      brandidControl.updateValueAndValidity();
      modelidControl.updateValueAndValidity();
      accountidControl.updateValueAndValidity();
    });

    this.isCurrentUserAdministrator();
    
  }

  async isCurrentUserAdministrator() {

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.settings = await this.salesOrderService.findSettingsappsetcategory('PAYMENTSTATUS').toPromise();
    let currentUserRole = obj && obj[0] && obj[0].userrole;
    try {
      const settings = await this.settings; 
      this.isSettingUser = settings.some((setting:any) => 
        setting.appsetparameter === currentUserRole && setting.status === 1
      );
    } catch (error) {
      console.error("Error fetching settings:", error);
      this.isSettingUser = false; 
    }
  }

  private async fillForm(parsedData: any) {debugger
    this.addEditForm.patchValue({
      cashrequesrefno: parsedData.cashrequesrefno,
      modeofpaymentid: parsedData.modeofpaymentid,
      requestdate: parsedData.requestdate,
      amount: parsedData.amount,
      cardetailsdes: parsedData.cardetailsdes,
      buydetailsdes: parsedData.buydetailsdes,
      paymentstatus: parsedData.paymentstatus,
      purchasedoc: parsedData.purchasedoc,
      chequecopydoc:parsedData.chequecopydoc,
      cashrequesttype:parsedData.cashrequesttype,
      financeremark:parsedData.financeremark,
      brandid:parsedData.brandid,
      modelid:parsedData.modelid,
      accountid:parsedData.accountid,
    });

    this.paymentstatus = parsedData.paymentstatus;
    this.minFromDate = parsedData.requestdate;
    await this.getModelList(parsedData.brandid, 'Edit');
     // Ensure formatting is applied after form patching
     setTimeout(() => this.triggerDirectiveFormatting(), 0);
  }

  private triggerDirectiveFormatting() {
    this.priceInputDirectives.forEach(directive => directive.formatInputValue());
  }

  public save() {
    debugger;
    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

    this.isShowErrors = true;
    var enteredData = this.addEditForm.value;
    this.loading = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return
    }
    this.formData = new FormData();
    var enteredData = this.addEditForm.value;
    enteredData.leadsid = this.cashrequestid;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
    enteredData.username = obj[0]?.username;
    // if( enteredData.purchasedoc &&  enteredData.purchasedoc.length > 0){
    //   this.formData.append("purchasedoc", enteredData.purchasedoc);
    // }

    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }

    if (this.cashrequestid) {

    //   if (enteredData.cashrequesttype === "carpurchase") {
    //     const purchaseDocMissing = !this.files || this.files.length === 0;
    //     if (purchaseDocMissing && (this.isEdit === "EDIT" && (!enteredData.purchasedoc))) {
    //         this.handleError("Purchase Document is Mandatory");
    //         this.loading = false;
    //         return;
    //     }
    // }

      this.formData.append("updatepurchasedoc",this.files && this.files[0]);

      this.formData.append("updatechequecopydoc",this.files && this.files[0]);

      this.cashRequestService.updateCashRequest(this.formData, this.cashrequestid,).subscribe(
        async (response: any) => {
          this.success("Cash Request Updated Successfully");
          this.loading = false;
          this.router.navigate(['cash-request']);
        });
    } else {

    //   if (enteredData.cashrequesttype === "carpurchase") {
    //     const purchaseDocMissing = !this.files || this.files.length === 0;
    //     if (purchaseDocMissing) {
    //         this.handleError("Purchase Document is Mandatory");
    //         this.loading = false;
    //         return;
    //     }
    // }
      this.cashRequestService.createCashRequest(this.formData).subscribe(
        async (response: any) => {
          if (response.success) {
            this.success("Cash Request Created Successfully");
            this.loading = false;
            this.router.navigate(['cash-request']);
          } else {
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
    if(item){
      await this.modelService.buycarmodelbrandid(item).pipe()
      .subscribe((data: any) => {
        console.log("buycarmodelbrandid", data);
        this.modelList = data;
        this.filteredModelList = this.modelList.slice();
      });
    }
 
  }

  public accountidFiltered(item: any) {
  return this.accountFilteredList.find((ele: any) => ele.accountname == item.accountname);
}
  
  public isModelFiltered(item: any) {
    return this.filteredModelList.find((ele: any) => ele.modelid == item.modelid);
  }
  
  public isBrandFiltered(item: any) {
    return this.filteredList.find((ele: any) => ele.brandid == item.brandid);
  }

  public isModeFiltered(item: any) {
    return this.modeofpaymentfilteredList.find((ele: any) => ele.modeofpaymentid == item.modeofpaymentid);
  }
  
  isPDF(fileName: string): boolean {
    return fileName ? fileName.toLowerCase().endsWith('.pdf') : false;
  }

  isIMG(fileName: string): boolean {
    const imgExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];
    return fileName ? imgExtensions.some(ext => fileName.toLowerCase().endsWith(ext)) : false;
  }

  // async onFileChanged(event: any) {
  //   this.files = event.target.files;
  //   if (this.files.length === 0) {
  //     return;
  //   }

  //   const selectedFile = this.files[0];

  //   if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
  //     this.addEditForm.patchValue({
  //       purchasedoc: selectedFile
  //     });

  //     if (this.isIMG(selectedFile.name)) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.imageSrc = e.target.result;
  //       };
  //       reader.readAsDataURL(selectedFile);
  //     }
  //   } else {
  //     Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
  //     event.target.value = ''; // Clear the file input
  //     this.addEditForm.patchValue({
  //       purchasedoc: null
  //     });
  //   }
  // }

  isImage(fileExtension: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    return imageExtensions.includes(fileExtension);
  }

  async onFileChanged(event: any) {
    this.files = event.target.files;
    if (this.files.length === 0) {
      return;
    }
  
    const selectedFile = this.files[0];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    if (this.isPDF1(selectedFile.name)) {


        // Handle file input
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.isImage(fileExtension)) {
        this.imageSrc = e.target.result; // Preview for images
      }
    };

    reader.readAsDataURL(selectedFile); // Read the file to generate preview
      this.addEditForm.patchValue({
        purchasedoc: selectedFile
      });
    } else {
      this.errorlogService.logManualValidationError(`add-edit-cash-request component|onFileChanged()|Unsupported file type selected. Please select a PDF file`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Unsupported file type selected. Please select a PDF file.",
        icon: 'error',
      });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        purchasedoc: null
      });
    }
  }

  async onFileChanged1(event: any) {
    this.files = event.target.files;
    if (this.files.length === 0) {
      return;
    }
  
    const selectedFile = this.files[0];
    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    if (this.isPDF1(selectedFile.name)) {


        // Handle file input
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.isImage(fileExtension)) {
        this.imageSrc1 = e.target.result; // Preview for images
      }
    };

    reader.readAsDataURL(selectedFile); // Read the file to generate preview
      this.addEditForm.patchValue({
        chequecopydoc: selectedFile
      });
    } else {
      this.errorlogService.logManualValidationError(`add-edit-cash-request component|onFileChanged1()|Unsupported file type selected. Please select a PDF file`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Unsupported file type selected. Please select a PDF file.",
        icon: 'error',
      });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        chequecopydoc: null
      });
    }
  }
  
  // Helper method to check if the file is a PDF
  // isPDF1(fileName: string): boolean {
  //   return fileName.toLowerCase().endsWith('.pdf');
  // }
  
// Helper method to check if the file is a PDF, JPG, JPEG, or PNG
isPDF1(fileName: string): boolean {
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const fileExtension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
  return allowedExtensions.includes(fileExtension);
}

ngOnDestroy() {
  this.dataService.clearData('cash_storage_data_id');
}


}



