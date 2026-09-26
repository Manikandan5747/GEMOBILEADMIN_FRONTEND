import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import Swal from 'sweetalert2';
import { AddEditEventFormComponent } from '../add-edit-event-form/add-edit-event-form.component';

@Component({
  selector: 'app-edit-event-form',
  templateUrl: './edit-event-form.component.html',
  styleUrls: ['./edit-event-form.component.css']
})
export class EditManageEventComponent implements OnInit {
  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditEventFormComponent, { static: false })
  editForm!: AddEditEventFormComponent;
  event_id: any;
  main_event_id:any;
  existingImageUrl: string = ''; 
  imageBase64: string | null = null; 
  selectedFile: File | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditManageEventComponent>,
    private EventService: EventService, private cookieService: CookieService, private errorlogService: ErrorlogService) {
    this.event_id = this.data.event_id;
    this.main_event_id = this.data.main_event_id
  }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    
  console.log('Parent: main_event_id to pass:', this.main_event_id);
    var datas = this.data;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
    
  }
 


  private fillForm(parsedData: any) {
    this.editForm.addEditForm.patchValue({
      event_id: parsedData.event_id,
      event_type: parsedData.event_type,
      event_detail: parsedData.event_detail,
      event_status: parsedData.event_status == "inactive" ? '0' : '1',
     
    });
  }


  public update() {
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      const enteredData = this.editForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      // enteredData.customerId = this.data.customerId;
      enteredData.event_id = this.data.event_id;
      const params = {
      id: this.data.event_id,  
      ...enteredData           
    };
      this.EventService.updateEvent(params).subscribe(
        (response: any) => {
          this.success(response);
              if(response.message == "Event already exists" || response.message == "Event is in Transaction"){
              this.errorlogService.logFormErrors(this.editForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
              return
            }else{
                this.success(response);
          this.dialogRef.close('Success');
            }
           
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
        }
      )

    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message.message, icon: 'success', });
    this.dialogRef.close('Success');
    // this.alertService.success('Saved successfully');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.dialogRef.close('Success');
    //  this.alertService.success(error);
  }

  reset() {
    this.editForm.addEditForm.reset();
  }


}