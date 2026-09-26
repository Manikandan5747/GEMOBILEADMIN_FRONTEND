import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import Swal from 'sweetalert2'
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-customer-form',
  templateUrl: './add-edit-customer-form.component.html',
  styleUrls: ['./add-edit-customer-form.component.css']
})
export class AddEditCustomerFormComponent implements OnInit {
  @Input('isShowErrors')
  isShowErrors!: boolean;

  @Input('action')
  action!: any;

  @Input('platform')
  platform!: any;

  @Input('isEdit')
  isEdit!: boolean;

  @Input('customertypes')
  customertypes!: any;

  @Input('userpassword')
  userpassword!: any;

  @Input('customerstatus')
  customerstatus!: any;


  public matcher = new ErrorMatcherService();
  errors = errorMessages;
  public addEditForm!: FormGroup;
  validationMessages: any;
  constructor(private fb: FormBuilder, private formValidationService: FormValidationService, private customerService: CustomerService,private errorlogService: ErrorlogService) { }


  get f() {
    return this.addEditForm.controls;
  }

  ngOnInit() {


    this.addEditForm = this.fb.group({
      customername: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      mobilenumber: ['971', [Validators.required, 
        this.formValidationService.noWhitespaceValidator,
      this.formValidationService.decimalNumberValidator(),
      Validators.pattern(/^971\d{9}$/) // 971 + 9 digits = 12 digits total
      ]],
      password: [''],
      customerstatus: ['Approved'],
      // customercode: ['', [Validators.pattern(/^[A-Za-z0-9]+$/)]],
      customercode: [
        '',
        [Validators.required,Validators.pattern(/^[A-Za-z0-9]+$/),
          (control: AbstractControl): ValidationErrors | null => {
            const value = control.value?.trim();
      
            // If empty, no validation needed (optional field)
            if (!value) return null;
            // if (value.toLowerCase() === 'sarath') return null;
            if (!value.toLowerCase().startsWith('cst')) {
              return { prefix: true };
            }
            
            return null;
          }
        ]
      ],
      status: ['1'],
      fcmtoken: ['', this.formValidationService.noWhitespaceValidator],
      emailid: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],

      username: [''],
      userpassword: ['Password123'],
      customertypes: [''],
      dobmonth: [''],
      dobday: [''],
      nationalityname: [''],
    });

    this.validationMessages = {
      'emailid': [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Enter valid email' },
      ],
    }


    setTimeout(() => {
      if (this.customertypes == 'CORPORATE') {
        this.addEditForm.patchValue({ customertypes: 'CORPORATE' })
        const customernameControl = this.addEditForm.controls['customername'];
        customernameControl.clearValidators();
        customernameControl.updateValueAndValidity();

        const usernameControl = this.addEditForm.controls['username'];
        usernameControl.setValidators([Validators.required]);
        usernameControl.updateValueAndValidity();

        const userpasswordControl = this.addEditForm.controls['userpassword'];
        userpasswordControl.setValidators([Validators.required]);
        userpasswordControl.updateValueAndValidity();
      }
    }, 1000);



    this.addEditForm.controls['customertypes'].valueChanges.subscribe((value: any) => {
      const usernameControl = this.addEditForm.controls['username'];
      const userpasswordControl = this.addEditForm.controls['userpassword'];
      if (value == 'CORPORATE') {
        usernameControl.setValidators([Validators.required]);
        userpasswordControl.setValidators([Validators.required]);
        this.addEditForm.patchValue({
          userpassword: "Password123",
          password:'',
          customercode:''
        });

      } else {
        usernameControl.clearValidators();
        userpasswordControl.clearValidators();
      }
      usernameControl.updateValueAndValidity();
      userpasswordControl.updateValueAndValidity();
    })

  }


  radioChange(event: any) {
    const customercodeControl = this.addEditForm.controls['customercode'];
    if (event.value == "Registered" || event.value == "OnHold" || event.value == "Cancel") {
      if(this.customerstatus == "Pending"){
        this.addEditForm.patchValue({
          password: ''
        });
      }
      customercodeControl.setValidators([]);
      customercodeControl.updateValueAndValidity();
    }else{
      customercodeControl.setValidators([Validators.required]);
      customercodeControl.updateValueAndValidity();
    }
    if (event.value == "Approved" && this.customerstatus == "Pending") {
      customercodeControl.setValidators([Validators.required]);
      customercodeControl.updateValueAndValidity();
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.addEditForm.patchValue({
        password: Math.floor(1000 + Math.random() * 9000),//10,000 Combination
      });
    }


  }

  checkCustomerCode() {
    const control = this.addEditForm.get('customercode');
  // Don't proceed if invalid (e.g., doesn't start with 'CST' for non-sarath users)
  if (!control || control.invalid) return;

    const customerCode = this.addEditForm.get('customercode')?.value;
    const customertypes = this.addEditForm.get('customertypes')?.value;
    const mobilenumber = this.addEditForm.get('mobilenumber')?.value;
    

    if (!customerCode) return;
    if (!mobilenumber) return;

    control?.setErrors({ checkCustomerExists: true });
    control.markAsTouched();
     this.formValidationService.markFormGroupTouched(this.addEditForm);
    this.customerService.checkCustomerExists(customerCode,customertypes,mobilenumber)
      .subscribe(
        (response) => {
          console.log("response", response);
          control?.setErrors({ checkCustomerExists: false });
          if (!customerCode.toLowerCase().startsWith('cst')) {
          
            control?.setErrors({ prefix: true });
          }
          control.markAsTouched();
          control.updateValueAndValidity();
          this.formValidationService.markFormGroupTouched(this.addEditForm);
          if (response.status) {
            this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'error', });
            this.addEditForm.patchValue({ customercode: null });
            // const activeRecords = response.activeRecords && response.activeRecords.filter(record => record.customertypes == 'INDIVIDUAL');
            // if(customertypes == "CORPORATE" && activeRecords.length > 0){
            //   Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Customer Code Already Exists With Customer Type Individual", icon: 'error', });
            //   this.addEditForm.patchValue({ customercode: null });
            // }else{
            //   Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'error', });
            //   this.addEditForm.patchValue({ customercode: null });
            // }
           
          }
          
        },
        (error) => {
          console.error("Error checking customer code", error);
        }
      );
  }


}
