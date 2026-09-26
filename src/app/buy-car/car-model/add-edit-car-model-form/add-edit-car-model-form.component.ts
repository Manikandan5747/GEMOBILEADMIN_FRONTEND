import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatRadioChange } from '@angular/material/radio';
import { ErrorlogService } from 'src/app/errorlog.service';
import { BrandService } from 'src/app/service/brand/brand.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-add-edit-car-model-form',
  templateUrl: './add-edit-car-model-form.component.html',
  styleUrls: ['./add-edit-car-model-form.component.css']
})
export class AddEditCarModelFormComponent implements OnInit {
  @Input('isShowErrors')
  isShowErrors!: boolean;
  

  @Input('alreadyMapped')
  alreadyMapped!: any;

    @Input('brandid')
  brandid!: any;

filteredList:any

  brandList: any[] = [];
  filteredBrandList: any[] = [];
  searchBrand: string = '';

  

  public matcher = new ErrorMatcherService();
  errors = errorMessages; 
  public addEditForm!: FormGroup;
  validationMessages: any;
  constructor(private fb: FormBuilder,private brandService: BrandService,
    private formValidationService:FormValidationService,private errorlogService: ErrorlogService) { 
  }


  onStatusChange(event: MatRadioChange): void {debugger
    const selectedValue = event.value;
    console.log('Selected status:', selectedValue);
  
    // Perform your logic here
    if (selectedValue === '1') {
      console.log('Active selected');
     
    } else if (selectedValue === '0') {
      console.log('Inactive selected');
      if(this.alreadyMapped == 'true'){
        this.addEditForm.patchValue({
          status: '1'
        });
        this.errorlogService.logManualValidationError(`add-edit-car-model component|onStatusChange()|Model Already Mapped with Car!`);
        Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Model Already Mapped with Car!", icon: 'error', });
      }
    }
  }
  

  get f() {
  return this.addEditForm.controls;
  }
    
  ngOnInit() { debugger
   this.getAllBrand();
    this.addEditForm = this.fb.group({
      modelname: ['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      brandid:['',Validators.required],
      modelcode:['',[Validators.required,this.formValidationService.noWhitespaceValidator, ]],
      status: ['1'],
      remark:['']
    });

     if(this.brandid){
      // console.log("addEditForm",this.addEditForm);
      
    this.addEditForm.patchValue({
      brandid: this.brandid,
    });
  }
    
   
  }


  public isBrandFiltered(item: any) {
  return this.filteredList && this.filteredList.find((ele: any) => ele.brandid == item.brandid);
}

async getAllBrand() {
  this.brandList = await this.brandService.getBrand().toPromise();
  this.filteredList = this.brandList.slice();

   
}

//  async getAllBrand() {
//    await this.brandService.getBrand().pipe()
//       .subscribe((data: any) => {
//         console.log("getBrand", data);
//         this.brandList = data;
//         this.filteredBrandList = data;
//   console.log("getBrand", this.brandid);
// if(this.brandid){
//     this.addEditForm.patchValue({
//       brandid: this.brandid.toString(),
//     });
// }

//       });
  }

// }
