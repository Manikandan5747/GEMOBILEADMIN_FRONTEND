import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { AddEditExpenseFormComponent } from '../add-edit-expense-form/add-edit-expense-form.component';
import { ExpenseTypeService } from '../expense-type.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  isShowErrors: boolean = false;
  @ViewChild(AddEditExpenseFormComponent, { static: false })
  public addForm!: AddEditExpenseFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService: FormValidationService, public dialogRef: MatDialogRef<AddExpenseComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private expenseTypeService: ExpenseTypeService, private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

  public save() {
    debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      this.expenseTypeService.createExpensetype(enteredData).subscribe(
        (response: any) => {
          this.success(response.message);
          this.dialogRef.close('Success');
        },
        (err: HttpErrorResponse) => {
          console.log("err", err)
          this.errorlogService.logFormErrors(this.addForm.addEditForm,`addForm ${err}`);
          this.handleError(err);
        })
    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.dialogRef.close('Success');
  }

}

