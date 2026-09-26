import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseTypeService } from 'src/app/ge-motors/expense-type/expense-type.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
  
  isShowErrors: boolean = false;
  @ViewChild(ExpenseFormComponent,{ static: false })
  public addForm!: ExpenseFormComponent;
  user: any;
  currentUser: any;
  constructor(private cookieService: CookieService,
    private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddExpenseComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public expenseTypeService: ExpenseTypeService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    setTimeout(() => {
      this.addForm.addEditForm.patchValue({
          carshowroom_id: this.data.carshowroom_id,
           isrelated_module :this.data.isrelated_module
      })
  }, 1000);
  }

  public save() {debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      enteredData.userid = obj[0]?.login_id;
      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      if( enteredData.expensedoc &&  enteredData.expensedoc.length > 0){
        formData.append("expensedoc", enteredData.expensedoc[0]);
      }
   
        this.expenseTypeService.createExpense(formData).subscribe(
          (response:any) => {
            if(response.message == "The brand name already exists"){
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
              return
            }else{
              this.success(response.message);
              this.dialogRef.close('Success');
            }
        
          },
          (err: HttpErrorResponse) => {
            console.log("err",err)
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
            this.handleError(err);
          })
    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addEditForm');
    }
  }

  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success'); 
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    // this.dialogRef.close('Success');
  }

  reset() {
    this.addForm.addEditForm.reset();
  }

}

