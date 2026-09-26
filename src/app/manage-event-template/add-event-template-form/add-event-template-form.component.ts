import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { EventService} from 'src/app/service/event/event.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { AddEditEventTemplateFormComponent } from '../add-edit-event-template-form/add-edit-event-template-form.component';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-event-template-form',
  templateUrl: './add-event-template-form.component.html',
  styleUrls: ['./add-event-template-form.component.css']
})
export class AddEventTemplateFormComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditEventTemplateFormComponent,{ static: false })
  public addForm!: AddEditEventTemplateFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddEventTemplateFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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

  this.EventService.createTemplate(enteredData).subscribe(
    (response: any) => {
      if (response.message === "Event Template already exists") {
        this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
        this.handleError(response.message);
        return;
      }

      const createdTemplate = response.data;
      this.success(response.message);

      this.dialogRef.close({ newTemplateId: createdTemplate.template_id });
    },
    (err: HttpErrorResponse) => {
      console.log("err", err);
      this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
      this.handleError(err);
    }
  );
}

  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success'); 
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.dialogRef.close('Success');
  }

  reset() {
    this.addForm.addEditForm.reset();
  }

}

