import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CommonConstants } from 'src/app/common/common.constant';

@Component({
  selector: 'app-add-edit-setting-form',
  templateUrl: './add-edit-setting-form.component.html',
  styleUrls: ['./add-edit-setting-form.component.css']
})
export class AddEditSettingFormComponent implements OnInit {
  @Input('isShowErrors')
  isShowErrors!: boolean;

  @Input('userrole')
  userrole!: any;

  url:any=CommonConstants.WEBAPI_URL +"/";
  public matcher = new ErrorMatcherService();
  errors = errorMessages;
  public addEditForm!: FormGroup;
  validationMessages: any;
  files: any;
  imageSrc: any;

  constructor(private fb: FormBuilder,
    private formValidationService: FormValidationService) {
  }


  get f() {
    return this.addEditForm.controls;
  }

  async onFileChanged1(event: any) {debugger
    this.files = event.target.files;
    if (this.files.length === 0) {
      return;
    }
    const selectedFile = this.files[0];

    if (this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        temp_image: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.addEditForm.patchValue({
        temp_image: null
      });
    }
  }


  isIMG(fileName: string): boolean {
    const imgExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];
    return fileName ? imgExtensions.some(ext => fileName.toLowerCase().endsWith(ext)) : false;
  }


  ngOnInit() {

    this.addEditForm = this.fb.group({
      appsetcategory: ['', Validators.required],
      appsetparameter: ['', [Validators.required, this.formValidationService.noWhitespaceValidator,]],
      appsetparametervalue: ['', [Validators.required, this.formValidationService.noWhitespaceValidator,]],
      settingdate_at:[''],
      settingexpirydate_at:[''],
      status: ['1'],
      image:[''],
      temp_image:['']
    });


  }

}
