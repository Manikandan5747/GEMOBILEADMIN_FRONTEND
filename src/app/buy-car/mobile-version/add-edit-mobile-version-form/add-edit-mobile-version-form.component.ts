import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';

@Component({
  selector: 'app-add-edit-mobile-version-form',
  templateUrl: './add-edit-mobile-version-form.component.html',
  styleUrls: ['./add-edit-mobile-version-form.component.css']
})
export class AddEditMobileVersionFormComponent implements OnInit {
  
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
      apptype:['',Validators.required],
      appversion:['',[Validators.required,this.formValidationService.noWhitespaceValidator, ]],
      appurlapi:['https://germanexperts.ae/',Validators.required],
      versioncreated_at:[new Date()],
      status: ['1'],
      remark:[''],
      appstate:['false']
    });
    
   
  }

}
