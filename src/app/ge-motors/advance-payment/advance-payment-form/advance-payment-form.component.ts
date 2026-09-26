import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { OpportunityService } from 'src/app/ge-motors/opportunity/opportunity.service';
import { AdvanceService } from '../advance.service';
import { AccountService } from '../../account/account.service';
import { ContactService } from '../../contact/contact.service';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ErrorlogService } from 'src/app/errorlog.service';
@Component({
  selector: 'app-advance-payment-form',
  templateUrl: './advance-payment-form.component.html',
  styleUrls: ['./advance-payment-form.component.css']
})
export class AdvancePaymentFormComponent implements OnInit {
  minFromDate:any=new Date();
  expenseList: any;
  filteredExpenseList: any;
  @Input('isShowErrors')
  isShowErrors!: boolean;
  @Input('advanceid')
  advanceid!: any;

  @Input('advancedoc')
  advancedoc!: any;
 @Input('carshowroom_id')
  carshowroom_id: any;

  
  @Input('accountid')
  accountid!: any;
  public matcher = new ErrorMatcherService();
  errors = errorMessages;
  public addEditForm!: FormGroup;
  validationMessages: any;
  message!: string;
  filePath: any;
  files: any;
  accountList: any;
  accountFilteredList: any;
  imageSrc: any;
  // contactTotalList: any;
  // contactFilterList: any;
  // contactList: any;

  currentuser: any;
  role_id: any;
  cartotalList: any;
  filteredcartotalList: any;
  
  constructor(private fb: FormBuilder, public advanceService: AdvanceService,
    private contactService:ContactService, private cookieService: CookieService,public opportunityService: OpportunityService,public accountService:AccountService,public carDetailsService:CarDetailsService,private errorlogService: ErrorlogService) {
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

    ngAfterViewInit() {

   

    if (this.carshowroom_id) {
      this.addEditForm.patchValue({ carshowroom_id: this.carshowroom_id });
    } else {
      const carshowroomControl = this.addEditForm.controls['carshowroom_id'];
      carshowroomControl.setValidators([Validators.required]);
      carshowroomControl.updateValueAndValidity();
    }


  }

  // isContactFiltered(item: any) {
  //   return this.contactFilterList.find((ele: any) => ele.firstname
  // == item.firstname
  // );
  // }

  async ngOnInit() {

    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;

    this.addEditForm = this.fb.group({
      advancerefno: ['', Validators.required],
      carshowroom_id: [''],
      accountid: ['', Validators.required],
      contactid:  [''],
      duedate: ['', Validators.required],
      description: [''],
      advanceamount:  ['', [Validators.required, Validators.min(1)]],
      advancedoc: [null],
      status: ['1'],
      remark: [''],
      modeofpayment:['', Validators.required],
      forpaymentof:[''],
      narrationnote:[''],
      recievedby:['', Validators.required],
      isrelated_module:['']
    });
    if (!this.advanceid) {
      let findnextRefno = await this.opportunityService.getfindnextRefno('ADVANCE').toPromise();
      console.log("advancerefno", findnextRefno.advancerefno);
      this.addEditForm.patchValue({ advancerefno: findnextRefno.advancerefno });
    }else{
      this.minFromDate =this.addEditForm.controls['duedate'].value;
    }
    // this.contactTotalList = await this.contactService.getContact().toPromise();
   
    var accountTotalList = await this.accountService.get().toPromise();
    let temtypeid = ["1", "2"]; 
    this.accountList = accountTotalList && accountTotalList.filter(item => 
        item.typeid.some(id => temtypeid.includes(id))
    ); 
    this.accountFilteredList = this.accountList;
    
    console.log("this.accountFilteredList",this.accountFilteredList);
    // console.log("this.contactTotalList",this.contactTotalList);

    // if(this.accountid){
    //   let findData = this.contactTotalList.filter((ele:any) => ele.accountid == this.accountid)
    //     this.contactFilterList=findData;
    //     this.contactList= findData;
    // }
  this.cartotalList = await this.carDetailsService.getCarDetails().toPromise();
      this.filteredcartotalList = this.cartotalList;
      console.log("this.filteredcartotalList",this.filteredcartotalList);
     
    
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
        advancedoc: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`advance-payment-form component|onFileChanged()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        advancedoc: null
      });
    }
  }
}

