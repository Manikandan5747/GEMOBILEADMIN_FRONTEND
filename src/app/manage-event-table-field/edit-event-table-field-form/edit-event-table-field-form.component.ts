import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import Swal from 'sweetalert2';
import { AddEditEventTableFieldFormComponent } from '../add-edit-event-table-field-form/add-edit-event-table-field-form.component';



@Component({
  selector: 'app-edit-event-table-field-form',
  templateUrl: './edit-event-table-field-form.component.html',
  styleUrls: ['./edit-event-table-field-form.component.css']
})
export class EditEventTableFieldFormComponent implements OnInit, AfterViewInit {

  currentUser: any;
  isShowErrors: boolean = false;
  field_id: any; 
  @ViewChild(AddEditEventTableFieldFormComponent, { static: false })
  editForm!: AddEditEventTableFieldFormComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditEventTableFieldFormComponent>,
    private EventService: EventService,
    private cookieService: CookieService,
    private errorlogService: ErrorlogService
  ) {   this.field_id = data.field_id;}

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

  ngAfterViewInit(): void {
    if (this.data) {
      setTimeout(() => {
        this.patchChildForm(this.data);
      }, 0);
    }
  }

  private patchChildForm(parsedData: any) {
    this.editForm.patchFormForEdit(parsedData);
  }

  // public update() {
  //   this.isShowErrors = true;

  //   if (this.editForm.addEditForm.invalid) {
  //     this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm invalid');
  //     return;
  //   }

  //   const enteredData = this.editForm.addEditForm.value;
  //   const obj = this.currentUser ? JSON.parse(this.currentUser) : '';
  //   enteredData.userid = obj[0]?.login_id;
  //   enteredData.field_id = this.data.field_id;

  //   const params = {
  //     field_id: this.data.field_id,
  //     table_id: enteredData.table_id?.table_id, 
  //     ...enteredData
  //   };

  //   this.EventService.updateEventTableField(params).subscribe({
  //     next: (response: any) => {
  //       if (
  //         response.message === 'Event Field already exists' ||
  //         response.message === 'Event is in Transaction'
  //       ) {
  //         this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${response.message}`);
  //         this.showError(response.message);
  //         return;
  //       }

  //       if (response.success) {
  //         this.showSuccess(response.message);
  //         this.dialogRef.close('Success'); 
  //       } else {
  //         this.showError('Error updating event field');
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
  //       this.showError(err.error.message);
  //     }
  //   });
  // }

  private showSuccess(message: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2500
    });
  }

 
  private showError(error: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: error,
      showConfirmButton: false,
      timer: 2500
    });
  }

  reset() {
    this.editForm.addEditForm.reset();
    this.editForm.selectedFields = [];
  }

}
