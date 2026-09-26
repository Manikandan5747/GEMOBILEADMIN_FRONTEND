import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { OpportunityService } from 'src/app/ge-motors/opportunity/opportunity.service';
import { AccountService } from '../../account/account.service';
import { ConsignmentService } from '../consignment.service';
import { ContactService } from '../../contact/contact.service';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ErrorlogService } from 'src/app/errorlog.service';
@Component({
  selector: 'app-consignment-form',
  templateUrl: './consignment-form.component.html',
  styleUrls: ['./consignment-form.component.css']
})
export class ConsignmentFormComponent implements OnInit {
  minFromDate = new Date();
  minEndDate = new Date();
  expenseList: any;
  filteredExpenseList: any;
  @Input('isShowErrors')
  isShowErrors!: boolean;
  @Input('consignmentid')
  consignmentid!: any;

  @Input('consignmentdoc')
  consignmentdoc!: any;
  @Input('accountid')
  accountid!: any;

  @Input('signature_status')
  signature_status: any = "PENDING";

  @Input('status')
  status: any;


  @Input('carshowroom_id')
  carshowroom_id: any;

  @Input('allowStatusFieldActive')
  allowStatusFieldActive: any;



  public matcher = new ErrorMatcherService();
  errors = errorMessages;
  public addEditForm!: FormGroup;
  validationMessages: any;
  message!: string;
  filePath: any;
  files: any;
  accountList: any;
  accountFilteredList: any;
  contactTotalList: any = [];
  contactFilterList: any;
  contactList: any;
  imageSrc: any;
  currentuser: any;
  role_id: any;
  cartotalList: any;
  filteredcartotalList: any;
  constructor(private contactService: ContactService, private cookieService: CookieService, private fb: FormBuilder, public consignmentService: ConsignmentService, public opportunityService: OpportunityService, public accountService: AccountService, public carDetailsService: CarDetailsService, private errorlogService: ErrorlogService) {
  }

  get f() {
    return this.addEditForm.controls;
  }

  public isExpenseFiltered(item: any) {
    return this.filteredExpenseList.find((ele: any) => ele.expensetypeid == item.expensetypeid);
  }

  public accountidFiltered(item: any) {
    return this.accountFilteredList.find((ele: any) => ele.accountname
      == item.accountname
    );
  }

  isContactFiltered(item: any) {
    return this.contactFilterList.find((ele: any) => ele.firstname
      == item.firstname
    );
  }

  ngAfterViewInit() {

    setTimeout(() => {
      if (this.accountid) {
        let findData = this.contactTotalList.filter((ele: any) => ele.accountid == this.accountid)
        this.contactFilterList = findData;
        this.contactList = findData;
      }
    }, 1000);

    if (this.carshowroom_id) {
      this.addEditForm.patchValue({ carshowroom_id: this.carshowroom_id });
    } else {
      const carshowroomControl = this.addEditForm.controls['carshowroom_id'];
      carshowroomControl.setValidators([Validators.required]);
      carshowroomControl.updateValueAndValidity();
    }


  }

  async ngOnInit() {

    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;

    this.addEditForm = this.fb.group({
      consignmentrefno: ['', Validators.required],
      carshowroom_id: [''],
      accountid: ['', Validators.required],
      consignmentamount: ['', [Validators.required, Validators.min(1)]],
      consignmentstartdate: ['', Validators.required],
      // consignmentenddate : ['', Validators.required],
      consignmentexpirydate: ['', Validators.required],
      consignmentdoc: [''],
      description: [''],
      status: ['1'],
      remark: [''],
      contactid: [''],
      commissionpayment: ['0', Validators.required],
      commissionpercentage: ['20', Validators.required],
      durationagreement: ['21', Validators.required],
      showroomfreeofcharge: ['2', Validators.required],
      showroomchargepermonth: ['100', Validators.required],
      liableamount: ['10000', Validators.required],
      isrelated_module: ['']
    });

    this.contactTotalList = await this.contactService.getContact().toPromise();
    this.accountList = await this.accountService.get().toPromise();
    this.accountFilteredList = this.accountList;
    console.log("this.accountFilteredList", this.accountFilteredList);

    if (!this.consignmentid) {
      let findnextRefno = await this.opportunityService.getfindnextRefno('CONSIGNMENT').toPromise();
      console.log("consignmentrefno", findnextRefno.consignmentrefno);
      this.addEditForm.patchValue({ consignmentrefno: findnextRefno.consignmentrefno });
    } else {
      this.minFromDate = this.addEditForm.controls['consignmentstartdate'].value;
      this.minEndDate = this.addEditForm.controls['consignmentexpirydate'].value
    }


    if (this.accountid) {
      //   let findData = this.contactTotalList.filter((ele:any) => ele.accountid == this.accountid)
      //     this.contactFilterList=findData;
      //     this.contactList= findData;

      this.addEditForm.patchValue({
        accountid: this.accountid,
      })
    }

    this.cartotalList = await this.carDetailsService.getCarDetails().toPromise();
    this.filteredcartotalList = this.cartotalList;
    console.log("this.filteredcartotalList", this.filteredcartotalList);

  }




  isShowroomCarFiltered(item: any) {
    return this.filteredcartotalList && this.filteredcartotalList.find((ele: any) => ele.carshowroom_id == item.carshowroom_id);
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
        consignmentdoc: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`consignment-form component|onFileChanged()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        consignmentdoc: null
      });
    }
  }


  setEndDateMinValue() {
    this.minEndDate = this.addEditForm.controls['consignmentstartdate'].value;

    const startDate = this.addEditForm.get('consignmentstartdate')?.value;
    if (startDate) {
      const expiryDate = new Date(startDate);
      expiryDate.setDate(expiryDate.getDate() + 90);
      this.minEndDate = expiryDate;
      this.addEditForm.get('consignmentexpirydate')?.setValue(expiryDate);
    }
  }
  onAccountOptionSelected(tempValue: any) {
    debugger
    let findData = this.contactTotalList.filter((ele: any) => ele.accountid == tempValue)
    this.contactFilterList = findData;
    this.contactList = findData;
  }

  onStatusChange(event: any) {
    if (event.value === '1') {
      console.log("User selected Active");
      this.consignmentService.getConsignment(this.carshowroom_id).pipe()
        .subscribe((data: any) => {
          console.log("getConsignment ", data);
          let consignmentList = data && data.find(ele => ele.status == 1);
          if (consignmentList) {
            this.addEditForm.patchValue({ status: '0' });
            this.errorlogService.logManualValidationError(`consignment-form component|onStatusChange()|You cannot activate this record because another record is already active.`);
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "You cannot activate this record because another record is already active.", icon: 'error', });
          }

        });
    }
  }

}

