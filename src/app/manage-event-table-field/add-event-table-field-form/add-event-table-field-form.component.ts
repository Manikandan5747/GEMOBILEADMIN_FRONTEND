import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import Swal from 'sweetalert2';
import { AddEditEventTableFieldFormComponent } from '../add-edit-event-table-field-form/add-edit-event-table-field-form.component';

@Component({
  selector: 'app-add-event-table-field-form',
  templateUrl: './add-event-table-field-form.component.html',
  styleUrls: ['./add-event-table-field-form.component.css']
})

export class AddEventTableFieldFormComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditEventTableFieldFormComponent,{ static: false })
  public addForm!: AddEditEventTableFieldFormComponent;


  user: any;
  currentUser: any;
  addEditForm: any;
  selectedFields: any[] = [];
  table_id: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddEventTableFieldFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private EventService:EventService,private cookieService: CookieService,private errorlogService: ErrorlogService,   private router: Router) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

public save(): void {
  const form = this.addForm.addEditForm; 
  const tableControl = form.value.table_id;

  if (!tableControl || !tableControl.table_id) {
    form.get('table_id')?.setErrors({ invalid: true });
    return;
  }

  if (!this.addForm.selectedFields || this.addForm.selectedFields.length === 0) {
    form.get('field_name')?.setErrors({ required: true });
    return;
  }

  const tableId = tableControl.table_id;
  const status = form.value.status;
  const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
  const userid = obj ? obj[0]?.login_id : null;

  const payload = {
    table_id: tableId,
    fields: this.addForm.selectedFields.map(f => ({
      field_name: f.COLUMN_NAME,
      field_type: f.DATA_TYPE
    })),
    status,
    userid
  };

  this.EventService.createEventField(payload).subscribe({
    next: (res: any) => {
      if (res.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 2500
        });
        this.dialogRef.close(true); // ✅ Only this one
      } else if (res.message === 'Event Field already exists') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: res.message,
          showConfirmButton: false,
          timer: 2500
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Error saving fields',
          showConfirmButton: false,
          timer: 2500
        });
      }
    },
    error: (err) => {
      console.error(err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error saving fields',
        showConfirmButton: false,
        timer: 2500
      });
    }
  });
}





  reset() {
    this.addForm.addEditForm.reset();
  }

}

