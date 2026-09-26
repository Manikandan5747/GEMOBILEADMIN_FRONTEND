import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-des-text-area',
  templateUrl: './des-text-area.component.html',
  styleUrls: ['./des-text-area.component.css']
})
export class DesTextAreaComponent implements OnInit {
  text: string;
  title: string;
  constructor(
    public dialogRef: MatDialogRef<DesTextAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private customerService: CustomerService, private errorlogService: ErrorlogService
  ) {
    this.title = data.title ? data.title : "Description";
    this.text = data.description;
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  validateCustomerCode(control: any) {
    const value = control.value?.trim() || '';

    if (!value) {
      control.control.setErrors(null);
      return;
    }

    if (!value.toLowerCase().startsWith('cst')) {
      control.control.setErrors({ prefix: true });
    } else {
      control.control.setErrors(null);
    }
  }

  save() {
    debugger
    const value = this.text?.trim() || '';

    if (!value.toLowerCase().startsWith('cst')) {
      // Set the error manually
      this.text = value; // in case it's not synced
      return; // Do not close dialog
    }
    this.checkCustomerCode(value.trim(), this.data.customertypes, this.data.mobilenumber);

  }

  checkCustomerCode(customerCode: string, customertypes: string, mobilenumber: any) {

    this.customerService.checkCustomerExists(customerCode, customertypes, mobilenumber)
      .subscribe(
        (response) => {
          console.log("response", response);
          if (response.status) {
            this.errorlogService.logManualValidationError(`des-text-area component|checkCustomerCode()|Error: ${response.message}`);
            Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'error', });
            return

          } else {
            this.dialogRef.close(this.text); // Close only if valid
          }
        },
        (error: any) => {
          console.error("Error checking customer code", error);
        }
      );
  }

}
