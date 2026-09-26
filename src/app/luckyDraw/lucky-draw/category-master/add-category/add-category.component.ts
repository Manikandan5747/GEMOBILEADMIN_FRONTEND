import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { LeadsService } from 'src/app/ge-motors/leads/leads.service';
import { DateFormat } from 'src/app/common/ui.constant';
import { LuckDrawService } from '../../luck-draw.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  buttonlabel: string = "Save";
  DATE_FORMAT = DateFormat.DATE_FORMAT;


  loading: boolean = false;
  addEditForm!: FormGroup;
  category_id: any;
  title: string = "Manage Category";
  formData = new FormData();
  currentUser: any;
  isEdit: any;
  isShowErrors: boolean = false;

  constructor(
    private cookieService: CookieService, 
    private customerService: CustomerService, 
    private elementRef: ElementRef,
    private router: Router, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    private luckydrawService: LuckDrawService,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService
  ) {
    this.route.queryParams.subscribe(params => {
      this.category_id = params['category_id'];
      this.isEdit = params['isEdit'];
    });
  }


  get formControl(): any { return this.addEditForm.controls; }

   ngOnInit() {
    this.loading = true;
    this.buttonlabel = this.isEdit === "EDIT" ? "Update" : "Save";
    this.addEditForm = this.fb.group({
      category_name: ['', [Validators.required, this.formValidationService.textFieldValidator()]],
      invoice_pricerangefrom: ['', [Validators.required, Validators.min(0)]],
      invoice_pricerangeto: ['', [Validators.required, Validators.min(0)]],
      status: ['1', Validators.required],
    }, { validator: this.priceRangeValidator() });

    if (this.category_id) {
      this.luckydrawService.getByIdCategory(this.category_id).subscribe((data: any) => {
        setTimeout(() => this.fillForm(data[0]), 1000);
      });
    }

    if (this.isEdit === 'VIEW') {
      this.addEditForm.disable();
    }
    this.loading = false;
  }

  priceRangeValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const fromPrice = formGroup.get('invoice_pricerangefrom')?.value;
      const toPrice = formGroup.get('invoice_pricerangeto')?.value;
  
      // Ensure fromPrice is strictly less than toPrice
      if (fromPrice !== null && toPrice !== null && fromPrice >= toPrice) {
        return { priceRangeInvalid: true };
      }
      return null;
    };
  }
  
  private fillForm(parsedData: any) {
    this.addEditForm.patchValue({
      title: parsedData.title,
      donotcall: parsedData.donotcall,

      category_name:parsedData.category_name,
      invoice_pricerangefrom: parsedData.invoice_pricerangefrom,
      invoice_pricerangeto: parsedData.invoice_pricerangeto,
      status: parsedData.status && parsedData.status.toString(),
    });
  }

  public save() {
    this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

    this.isShowErrors = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return;
    }

    this.loading = true;
    this.formData = new FormData();
    const enteredData = this.addEditForm.value;
    enteredData.category_id = this.category_id;

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : {};
    enteredData.created_by = obj[0]?.login_id;
    enteredData.modified_by = obj[0]?.login_id;
    enteredData.username = obj[0]?.username;

    for (let key in enteredData) {
      this.formData.append(key, enteredData[key]);
    }

    if (this.category_id) {
      this.luckydrawService.updateCategory(this.formData, this.category_id).subscribe((response: any) => {
        
        if (response) {
          this.success("Lead Updated Successfully");
        this.loading = false;
        this.router.navigate(['/luckyDraw/listCategory']);
        } else {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
          this.handleError(response.message);
          this.loading = false;
        }

      });
    } else {
      this.luckydrawService.createCategory(this.formData).subscribe((response: any) => {
        if (response) {
          this.success(response.message);
          this.loading = false;
          this.router.navigate(['/luckyDraw/listCategory']);
        } else {
          this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
          this.handleError(response.message);
          this.loading = false;
        }
      });
    }
  }

  private success(message: string) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success' });
  }

  private handleError(error: string) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error' });
    this.loading = false;
  }
}