import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from 'src/app/service/event/event.service';
import Swal from 'sweetalert2';
import { AddEditEventTemplateFormComponent } from '../add-edit-event-template-form/add-edit-event-template-form.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-event-template-form',
  templateUrl: './edit-event-template-form.component.html',
  styleUrls: ['./edit-event-template-form.component.css']
})
export class EditEventTemplateFormComponent implements OnInit {
  currentUser: any;
  isShowErrors: boolean = false;
  @ViewChild(AddEditEventTemplateFormComponent, { static: false })
  editForm!: AddEditEventTemplateFormComponent;
  template_id: any;
  // company_id:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditEventTemplateFormComponent>,
    private EventService: EventService, private cookieService: CookieService, private errorlogService: ErrorlogService) {
    this.template_id = this.data.template_id;
     this.template_id = data?.template?.template_id;
    // this.company_id = this.data.company_id
  }

  ngOnInit() {
   
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    
  // console.log('Parent: company_id to pass:', this.company_id);
    var datas = this.data;
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
    
  }
//   private fillForm(template: any) {
//   this.editForm.addEditForm.patchValue({
//     template_id: template.template_id,
//     template_name: template.template_name,
//     template_text: template.template_text,
//     sleekflow_template_name: template.sleekflow_template_name,
//     status: template.status == "inactive" ? '0' : '1',
//   });
// }
ngAfterViewInit() {
  setTimeout(() => {
    if (this.data?.template) {
      this.fillForm(this.data.template);
    }
  }, 300); 
}

  private fillForm(template: any) {
    if (!this.editForm || !this.editForm.addEditForm) return;

    this.editForm.addEditForm.patchValue({
      template_id: template.template_id,
      template_name: template.template_name,
      template_text: template.template_text,
      sleekflow_template_name: template.sleekflow_template_name,
      status: template.status == 'inactive' ? '0' : '1'
    });
  }

  onFormReady(form: FormGroup) {
  this.editForm.addEditForm = form; 
  if (this.data?.template) {
    this.fillForm(this.data.template);
  }
}

public update() {
  this.isShowErrors = true;
  if (this.editForm.addEditForm.valid) {
    const enteredData = this.editForm.addEditForm.value;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;

    const templateId = this.data?.template?.template_id;
    console.log("templateId",templateId)

    if (!templateId) {
      this.handleError('Template ID missing');
      return;
    }

    const params = { id: templateId, ...enteredData };

    this.EventService.updateEventTemplate(params).subscribe(
      (response: any) => {
        if (
          response.message === 'Event Template already exists' ||
          response.message === 'Event Template is in Transaction'
        ) {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `addForm ${response.message}`);
          this.handleError(response.message);
          return;
        } else {
          this.success(response);
          this.dialogRef.close(this.editForm.addEditForm.value);
        }
      },
      (err: HttpErrorResponse) => {
        this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
        this.handleError(err.error.message);
      }
    );
  } else {
    this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
  }
}

private handleError(error: any) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    title: error,
    icon: 'error',
  });
 
}



  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message.message, icon: 'success', });
    this.dialogRef.close('Success');
    this.dialogRef.close(this.editForm.addEditForm.value);
    // this.alertService.success('Saved successfully');
  }



  reset() {
    this.editForm.addEditForm.reset();
  }


}