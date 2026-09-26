import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExpenseTypeService } from 'src/app/ge-motors/expense-type/expense-type.service';
import { OpportunityService } from 'src/app/ge-motors/opportunity/opportunity.service';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
 
  expenseList: any;
  filteredExpenseList: any;
  @Input('isShowErrors')
  isShowErrors!: boolean;
  @Input('expenseid')
  expenseid!: any ;

  @Input('expensedoc')
  expensedoc!: any ;

  
  @Input('carshowroom_id')
  carshowroom_id: any;
  
  public matcher = new ErrorMatcherService();
  errors = errorMessages; 
  public addEditForm!: FormGroup;
  validationMessages: any;
  message!: string;
  filePath: any;
  files: any;
  imageSrc: any;
  currentuser: any;
  role_id: any;
  cartotalList: any;
  filteredcartotalList: any;
  constructor(private sanitizer: DomSanitizer,private fb: FormBuilder, private cookieService: CookieService,public carDetailsService:CarDetailsService,
    private formValidationService:FormValidationService,public expenseTypeService: ExpenseTypeService,public opportunityService: OpportunityService,private errorlogService: ErrorlogService) { 
  }

  get f() {
  return this.addEditForm.controls;
  }

  public isExpenseFiltered(item: any) {
    return this.filteredExpenseList.find((ele: any) => ele.expensetypeid == item.expensetypeid);
  }



    
  async ngOnInit() { 

    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;
      
    this.addEditForm = this.fb.group({
      expenserefno: ['', Validators.required],
      carshowroom_id:[''],
      expensedate: ['', Validators.required],
      expensetypeid: ['', Validators.required],
      description: [''],
      expensevalue:['', [Validators.required, Validators.min(1)]],
      expensedoc: [null],
      status: ['1'],
      remark:[''],
      isrelated_module:['']
    });
    this.expenseList = await this.expenseTypeService.getExpensetype().toPromise();
    this.filteredExpenseList = this.expenseList;

    if(!this.expenseid){
      let findnextRefno = await this.opportunityService.getfindnextRefno('EXPENSE').toPromise();
      console.log("expenserefno", findnextRefno.expenserefno);
      this.addEditForm.patchValue({ expenserefno: findnextRefno.expenserefno });
     }

      this.cartotalList = await this.carDetailsService.getCarDetails().toPromise();
      this.filteredcartotalList = this.cartotalList;
      console.log("this.filteredcartotalList",this.filteredcartotalList);
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
        expensedoc: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`expense-form component|onFileChanged()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = ''; // Clear the file input
      this.addEditForm.patchValue({
        expensedoc: null
      });
    }
  }

    isShowroomCarFiltered(item: any) {
    return this.filteredcartotalList && this.filteredcartotalList.find((ele: any) => ele.carshowroom_id == item.carshowroom_id);
  }

   ngAfterViewInit() {
    if(this.carshowroom_id){
       this.addEditForm.patchValue({ carshowroom_id: this.carshowroom_id });
    } else {
      const carshowroomControl = this.addEditForm.controls['carshowroom_id'];
      carshowroomControl.setValidators([Validators.required]);
      carshowroomControl.updateValueAndValidity();
    }
  }

}

