import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebversionService } from '../../service/webversion.service';
import { AddEditWebversionFormComponent } from '../add-edit-webversion-form/add-edit-webversion-form.component';
import Swal from 'sweetalert2';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-webversion',
  templateUrl: './add-webversion.component.html',
  styleUrls: ['./add-webversion.component.css']
})
export class AddWebversionComponent implements OnInit {
  PageTitel: any = "Web Version";
  isShowErrors: boolean = false;
  @ViewChild(AddEditWebversionFormComponent, { static: false })
  public addForm!: AddEditWebversionFormComponent;
  user: any;
  currentUser: any;
  selectedTheme: any = ""
  loading:boolean=false;

  constructor(private webversionService: WebversionService, private cookieService: CookieService,
    private formValidationService: FormValidationService, private http: HttpClient,
    public dialogRef: MatDialogRef<AddWebversionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private errorlogService: ErrorlogService) { }

  ngOnInit(): void {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

  }


  public save() {
    debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      const enteredData = this.addForm.addEditForm.value;
      // this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
      // const user_id = this.currentUser ? JSON.parse(this.currentUser)?.user_id : "";
      enteredData.created_by = obj[0]?.user_id;
      enteredData.userid = obj[0]?.user_id;


      this.webversionService.createWebversion(enteredData).subscribe(
        (response: any) => {
          this.success(response.message);
          this.dialogRef.close('Success');
        },
        (err: HttpErrorResponse) => {
          console.log("err", err)
          this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
          this.handleError(err);
        })

    } else {
      this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    }
  }




  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

  reset() {
    this.addForm.addEditForm.reset();
  }


}
