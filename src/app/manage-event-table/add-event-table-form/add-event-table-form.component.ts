import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import Swal from 'sweetalert2';
import { AddEditEventTableFormComponent } from '../add-edit-event-table-form/add-edit-event-table-form.component';


@Component({
  selector: 'app-add-event-table-form',
  templateUrl: './add-event-table-form.component.html',
  styleUrls: ['./add-event-table-form.component.css']
})
export class AddEventTableFormComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditEventTableFormComponent,{ static: false })
  public addForm!: AddEditEventTableFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddEventTableFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private EventService:EventService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

public save() {
  this.isShowErrors = true;
  this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);

  if (!this.addForm.addEditForm.valid) {
    this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
    return;
  }

  const enteredData = this.addForm.addEditForm.value;
  const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
  enteredData.userid = obj[0]?.login_id;

  this.EventService.createEventTable(enteredData).subscribe(
    (response: any) => {
      if (response.message === "Event Module already exists") {
        this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
        this.showError(response.message);
        return;
      }

      if (response.success && response.data) {
        this.showSuccess(response.message);
        this.dialogRef.close({ data: response.data });
      } else {
        this.showError(response.message);
      }
    },
    (err: HttpErrorResponse) => {
      console.log("err", err);
      this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
    }
  );
}

private showSuccess(message: string) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success'});
}

private showError(error: string) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error'});
}

  reset() {
    this.addForm.addEditForm.reset();
  }

}

