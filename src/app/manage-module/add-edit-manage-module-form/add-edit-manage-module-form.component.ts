import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';

@Component({
  selector: 'app-add-edit-manage-module-form',
  templateUrl: './add-edit-manage-module-form.component.html',
  styleUrls: ['./add-edit-manage-module-form.component.css']
})
export class AddEditManageModuleFormComponent implements OnInit {
  @Input('isShowErrors') isShowErrors!: boolean;
  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.

  @Input('parentmodid') parentmodid!: any;
  @Input('module_id') module_id!: any;


  public addEditForm!: FormGroup;
  moduleList: any;
  miscMappingList: any;
  constructor(private fb: FormBuilder, private manageModuleService: ManageModuleService) { }


  // convenience getter for easy access to form fields
  get f() {
    return this.addEditForm.controls;
  }

  ngAfterViewInit() {
    debugger
    if (this.parentmodid) {
      this.addEditForm.patchValue({
        parentmodid: this.parentmodid,
      })
    }
  }
  async ngOnInit() {





    this.addEditForm = this.fb.group({
      modulename: ['', Validators.required],
      routename: ['', Validators.required],
      parentmodid: [''],
      status: ["1"],
      isparent: ['0'],
      issystemmenu: ['0'],
      isreport: ['0'],
      ismisc: ['0'],
      iconname: [''],
      menuorder: [''],
      miscItems: this.fb.array([]),
      // ✅ Add privileges as nested group
      app: this.fb.group({
        gemobileadmin: [false],
        gemotorsadmin: [false]
      }),
      privilegekey:['']
    });

    await this.manageModuleService.getModule("false").pipe()
      .subscribe((data: any) => {
        console.log("getModule", data);
        this.moduleList = data;

        if (this.parentmodid) {
          this.addEditForm.patchValue({
            parentmodid: this.parentmodid,
          })
        }

      });





    // this.addEditForm.get('ismisc')?.valueChanges.subscribe((val) => {
    //   if (val === '1' && this.miscItems.length === 0) {
    //     this.addMiscItem();
    //   }
    // });
    this.addEditForm.get('ismisc')?.valueChanges.subscribe((val) => {
      if (val === '1') {
        // If no items, add one
        if (this.miscItems.length === 0) {
          this.addMiscItem();
        }

        // Add Validators.required to each misc_name
        this.miscItems.controls.forEach((ctrl) => {
          ctrl.get('misc_name')?.setValidators(Validators.required);
          ctrl.get('misc_name')?.updateValueAndValidity();
        });
      } else {
        // Remove Validators.required when ismisc is '0'
        this.miscItems.controls.forEach((ctrl) => {
          ctrl.get('misc_name')?.clearValidators();
          ctrl.get('misc_name')?.updateValueAndValidity();
        });
      }
    });

    if (this.module_id) {
      this.manageModuleService.miscMapping(this.module_id).pipe()
        .subscribe((data: any) => {
          console.log("miscMapping", data);
          this.miscMappingList = data;
          const formArray = this.miscItems;
          formArray.clear(); // Clear previous values if needed

          data.forEach(item => {
            formArray.push(this.createMiscItem(item));
          });
        });

    }


  }

  createMiscItem(item: any): FormGroup {
    return this.fb.group({
      misc_id: [item.misc_id || null], // assuming misc_id comes from DB
      misc_name: [item.misc_name || ''],
      status: [item.status !== undefined ? item.status : true]
    });
  }


  get miscItems() {
    return this.addEditForm.get('miscItems') as FormArray;
  }

  addMiscItem() {
    const item = this.fb.group({
      misc_name: ['', Validators.required],
      status: [true]
    });
    this.miscItems.push(item);
  }

  removeMiscItem(index: number) {
    this.miscItems.removeAt(index);
  }



}

