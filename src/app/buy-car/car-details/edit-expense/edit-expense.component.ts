import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { BrandService } from 'src/app/service/brand/brand.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseTypeService } from 'src/app/ge-motors/expense-type/expense-type.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css']
})
export class EditExpenseComponent implements OnInit {

  isShowErrors: boolean = false;
  expenseid: any = "expenseid";
  @ViewChild(ExpenseFormComponent, { static: false })
  editForm!: ExpenseFormComponent;
  user: any;
  error!: '';
  customerList: any;
  currentUser: any;
  brandlogopath: any;
  loading:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditExpenseComponent>,
    private expenseTypeService: ExpenseTypeService, private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.expenseid = datas.expenseid
    this.brandlogopath = datas.brandlogopath;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }


  private fillForm(parsedData: any) {debugger
    this.editForm.addEditForm.patchValue({
      expenserefno: parsedData.expenserefno,
      carshowroom_id: parsedData.carshowroom_id,
      expensedate: parsedData.expensedate,
      expensetypeid: parsedData.expensetypeid,
      description: parsedData.description,
      expensevalue: parsedData.expensevalue,
      expensedoc: parsedData.expensedoc,
      status: parsedData.status == 'Active' ? '1':'0',
      remark: parsedData.remark,
      isrelated_module:this.data.isrelated_module
    });
  }


  public update() {
    debugger
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      const enteredData = this.editForm.addEditForm.value;
      enteredData.expenseid = this.data.expenseid;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      enteredData.modifiedby  = obj[0]?.login_id;
      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }
      formData.append("updateexpensedoc", enteredData.expensedoc && enteredData.expensedoc[0]);

      this.expenseTypeService.updateExpense(formData,this.data.expenseid).subscribe(
        (response: any) => {
          if (response.message == "Brand Name already exsits") {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${response.message}`);
            this.handleError(response.message);
            return
          } else {
            this.success(response.message);
            this.dialogRef.close('Success');
          }
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
        })
    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'EditForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

}
