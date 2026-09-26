import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import Swal from 'sweetalert2';
import { AddEditEventPlannerFormComponent } from '../add-edit-event-planner-form/add-edit-event-planner-form.component';


@Component({
  selector: 'app-add-event-planner-form',
  templateUrl: './add-event-planner-form.component.html',
  styleUrls: ['./add-event-planner-form.component.css']
})
export class AddEventPlannerFormComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditEventPlannerFormComponent,{ static: false })
  public addForm!: AddEditEventPlannerFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddEventPlannerFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private EventService:EventService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

public save() {
  this.isShowErrors = true;
  this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);

  if (this.addForm.addEditForm.valid) {
    const enteredData = this.addForm.addEditForm.value;

    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;

    if (!this.addForm.selectedEventFile) {
  alert("Please select an event image before submitting.");
  return;
}
if (!this.addForm.selectedBannerFile) {
  alert("Please select a banner image before submitting.");
  return;
}

    const formData = new FormData();
    formData.append('event_planner_title', enteredData.event_planner_title);
    formData.append('schedule_id', enteredData.schedule_id);
    formData.append('schedule_type', enteredData.schedule_type);
    formData.append('event_planner_status', enteredData.event_planner_status);
    formData.append('event_id', enteredData.event_id);
    formData.append('template_id', enteredData.template_id);
    formData.append('event_planner_expiry_days', enteredData.event_planner_expiry_days);
    formData.append('calendar_day', new Date(enteredData.calendar_day).toISOString());
    formData.append('country_name', enteredData.country_name || '');
    formData.append('mode_of_message', JSON.stringify(enteredData.mode_of_message));
    formData.append('event_planner_image', this.addForm.selectedEventFile);
    formData.append('event_planner_image', this.addForm.selectedBannerFile);
    formData.append('userid', enteredData.userid);

    this.EventService.createEventPlanner(formData).subscribe({
      next: (response: any) => {
        if (response.message === "Event Planner Already Exist") {
          this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
          this.handleError(response.message);
          return;
        }

        this.success(response.message);
        this.dialogRef.close('Success');
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error:", err);
        this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
        this.handleError(err);
      }
    });
  } else {
    this.errorlogService.logFormErrors(this.addForm.addEditForm, 'addForm');
  }
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

