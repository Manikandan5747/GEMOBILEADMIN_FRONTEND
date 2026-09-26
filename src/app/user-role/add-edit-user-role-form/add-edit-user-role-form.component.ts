import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';

@Component({
  selector: 'app-add-edit-user-role-form',
  templateUrl: './add-edit-user-role-form.component.html',
  styleUrls: ['./add-edit-user-role-form.component.css']
})
export class AddEditUserRoleFormComponent implements OnInit {
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
      rolename:['',[Validators.required,this.formValidationService.noWhitespaceValidator, ]],
      dashboardurl:['',Validators.required],
      status: ['1'],
    });
    
   
  }

}
