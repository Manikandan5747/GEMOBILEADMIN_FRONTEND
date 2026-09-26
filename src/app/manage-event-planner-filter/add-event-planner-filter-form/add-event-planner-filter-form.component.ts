import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { EventService} from 'src/app/service/event/event.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { AddEditEventPlannerFilterFormComponent } from '../add-edit-event-planner-filter-form/add-edit-event-planner-filter-form.component';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-event-planner-filter-form',
  templateUrl: './add-event-planner-filter-form.component.html',
  styleUrls: ['./add-event-planner-filter-form.component.css']
})
export class AddEventPlannerFilterFormComponent implements OnInit {
  isShowErrors: boolean = false;
  @ViewChild(AddEditEventPlannerFilterFormComponent,{ static: false })
  public addForm!: AddEditEventPlannerFilterFormComponent;
  user: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,public dialogRef: MatDialogRef<AddEventPlannerFilterFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private EventService:EventService,private cookieService: CookieService,private errorlogService: ErrorlogService) { }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  }

  public save() {debugger
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addForm.addEditForm);
    if (this.addForm.addEditForm.valid) {
      const enteredData = this.addForm.addEditForm.value;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
    

      // if(enteredData.ismisc && enteredData.miscItems.length == 0){
      //    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Misc Items Zero", icon: 'error', });
      //    return
      // }
        this.EventService.createEventPlannerfilter(enteredData).subscribe(
          (response:any) => {
            this.success(response.message);
            console.log(response.message);
              if(response.message == "Event already exists"){
              this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${response.message}`);
              this.handleError(response.message);
              return
            }else{
              this.success(response.message);
              this.dialogRef.close('Success');
            }
            this.dialogRef.close('Success');
          },
          (err: HttpErrorResponse) => {
            console.log("err",err)
            this.errorlogService.logFormErrors(this.addForm.addEditForm, `addForm ${err}`);
            this.handleError(err);
          })
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

