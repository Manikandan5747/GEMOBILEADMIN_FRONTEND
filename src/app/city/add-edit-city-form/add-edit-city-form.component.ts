import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';

@Component({
  selector: 'app-add-edit-city-form',
  templateUrl: './add-edit-city-form.component.html',
  styleUrls: ['./add-edit-city-form.component.css']
})
export class AddEditCityFormComponent implements OnInit {

  @Input('isShowErrors') isShowErrors!: boolean;
  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.  
  public addEditForm!: FormGroup;

  constructor(private fb: FormBuilder,) { }

    // convenience getter for easy access to form fields
    get f() {
      return this.addEditForm.controls;
    }
    
  ngOnInit() {
    this.addEditForm = this.fb.group({
      carcityname: ['',Validators.required],
      status: ["1"],
    });
  }



}

