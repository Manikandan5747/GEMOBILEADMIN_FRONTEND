import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import Swal from 'sweetalert2';
import { CrmModelsService } from '../crm-models.service';







@Component({
  selector: 'app-edit-crm-models',
  templateUrl: './edit-crm-models.component.html',
  styleUrls: ['./edit-crm-models.component.css']
})
export class EditCrmModelsComponent implements OnInit {

  title = "CRM Vehicle Models";
  @Input('isShowErrors')
  isShowErrors!: boolean;

  imageBase64: any | ArrayBuffer = "assets/images/iconupload.png";
  imagePath: any = [];
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  currentUser: any;
  minFromDate: any;
  loading: boolean=false;
  endDate!: Date;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
    private formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<EditCrmModelsComponent>, private fb: FormBuilder, private crmmodelservice: CrmModelsService,private errorlogService: ErrorlogService) { }

  get f() {
    return this.addEditForm.controls;
  }

async ngOnInit() {
  this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

  this.addEditForm = this.fb.group({
    "crm_makename": [{ value: '', disabled: true }],
    "crm_modelname": [{ value: '', disabled: true }],
    "status": ['1']
  });

  this.fillForm(this.data);
  this.imageBase64 = this.data.imagepath || 'assets/images/iconupload.png';
}

private fillForm(parsedData: any) {
  this.addEditForm.patchValue({
    "crm_modelname": parsedData.crm_modelname,
    "crm_makename": parsedData.crm_makename,
    "status": parsedData.status == "1" ? '1' : '0'
  });
}

removeImageFlag = false;

async onFileChanged(event: any) {
  const files = event.target.files;
  if (!files || files.length === 0) {
    return;
  }
  const mimeType = files[0].type;
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(mimeType)) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: 'Only JPG, PNG, GIF or WEBP images are supported', icon: 'error' });
    event.target.value = '';
    return;
  }

  this.removeImageFlag = false;
  const reader = new FileReader();
  this.imagePath = files;
  reader.readAsDataURL(files[0]);
  reader.onload = (_event) => {
    this.imageBase64 = reader.result;
  };
}

clearImage() {
  this.imagePath = [];
  this.removeImageFlag = true;
  this.imageBase64 = 'assets/images/iconupload.png';
}

public save() {
  const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
  const formData = new FormData();
  formData.append("userid", obj[0]?.login_id ?? '1');
  formData.append("status", this.addEditForm.value.status);

  if (this.imagePath && this.imagePath.length > 0) {
    formData.append("imgs", this.imagePath[0]);   
  } else if (this.removeImageFlag) {
    formData.append("removeimage", "1");
  }

  this.loading = true;

  this.crmmodelservice.updateCrmModel(this.data.model_imasterid, formData).subscribe(
    (response: any) => {
      this.loading = false;
      if (!response.success) {
        this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
        this.handleError(response.message);
        return;
      }
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: 'Updated successfully', icon: 'success' });
      this.dialogRef.close(response.data);
    },
    (error) => {
      this.loading = false;
      this.handleError(error?.error?.message || 'Update failed');
    }
  );
}

private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 5000, title: error, icon: 'error' });
  this.loading = false;
}
}