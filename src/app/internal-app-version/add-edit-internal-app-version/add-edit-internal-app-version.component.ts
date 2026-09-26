import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';

@Component({
  selector: 'app-add-edit-internal-app-version',
  templateUrl: './add-edit-internal-app-version.component.html',
  styleUrls: ['./add-edit-internal-app-version.component.css']
})
export class AddEditInternalAppVersionComponent implements OnInit {

   @Input('isShowErrors')
  isShowErrors!: boolean;
  public matcher = new ErrorMatcherService();
  errors = errorMessages; 
  public addEditForm!: FormGroup;
  validationMessages: any;
  brandList: any;
  constructor(private fb: FormBuilder,
    private formValidationService:FormValidationService) { 
  }


  get f() {
  return this.addEditForm.controls;
  }
    
  ngOnInit() {
 
    this.addEditForm = this.fb.group({
      appcategory:['',Validators.required],
      appversion:['',[Validators.required,this.formValidationService.noWhitespaceValidator, ]],
      appurlapi:['https://germanexperts.ae/',Validators.required],
      versioncreated_at:[new Date()],
      status: ['1'],
      remark:[''],
      appstate:['false'],
      app_type: [ 0,Validators.required],
      mandate_update: [true],
      version_description: ['']
    });
    
   
  }
}
