import { Component, OnInit, Input} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { WebversionService } from '../../service/webversion.service';
import { ErrorMatcherService } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';


@Component({
  selector: 'app-add-edit-webversion-form',
  templateUrl: './add-edit-webversion-form.component.html',
  styleUrls: ['./add-edit-webversion-form.component.css']
})
export class AddEditWebversionFormComponent implements OnInit {
  @Input('isShowErrors')
  isShowErrors!: boolean;
  public matcher = new ErrorMatcherService();
  errors = ""; 
  public addEditForm!: FormGroup;
  webversionList:any;


  constructor(private fb:FormBuilder,private formValidationService:FormValidationService,private webversionService:WebversionService) { }

  get f() {
    return this.addEditForm.controls;
  }

  ngOnInit(): void {
    debugger
  
    this.addEditForm = this.fb.group({
      webcategory: ['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      webversion: ['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      weburl: ['https://germanexperts.ae/',[Validators.required]],
      powered_by: ['',[Validators.required]],
      company_name: ['',[Validators.required]],
      status: ['1']

    });

    this.getwebversionList();
    
  }

  getwebversionList(){
    this.webversionService.getwebversionList().pipe()
    .subscribe( (data:any) => {
        console.log("getWebversionList",data); 
        this.webversionList = data.data;

       });
  }

  }


