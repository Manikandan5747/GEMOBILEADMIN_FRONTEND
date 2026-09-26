import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { SpecialOfferService } from 'src/app/service/special-offer/special-offer.service';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-special-offer-form',
  templateUrl: './add-edit-special-offer-form.component.html',
  styleUrls: ['./add-edit-special-offer-form.component.scss']
})
export class AddEditSpecialOfferFormComponent implements OnInit {
  title = "Create Mobile App Banners";
  @Input('isShowErrors')
  isShowErrors!: boolean;

  @Input('spclofferpath')
  spclofferpath!: any ;

  imageBase64: any | ArrayBuffer = "https://i.pravatar.cc/500?img=7";
  imagePath: any;
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  currentUser: any;
  companyList: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private cookieService: CookieService,
  private formValidationService:FormValidationService,
  public dialogRef: MatDialogRef<AddEditSpecialOfferFormComponent>,private fb: FormBuilder,private specialOfferService:SpecialOfferService,private errorlogService: ErrorlogService) 
  {   }

    get f() {
      return this.addEditForm.controls;
    }
    
  async ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.addEditForm = this.fb.group({
      // spcloffertext: ['',Validators.required],
      spclofferurl:  ['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      status: ['1'],
      created_by:[''],
      modified_by:[''],
      cmp_id:['',Validators.required]
    });

    await this.specialOfferService.getCompanyList().pipe()
    .subscribe( (data:any) => {
        console.log("companyList",data); 
        this.companyList = data;
       });
  }
  

 


  async onFileChanged(event:any) {
    debugger
    const files = event.target.files;
    if (files.length === 0){
      return;
    } 
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
    }
  
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imageBase64 = reader.result;
    // event.target.files.filename = this.imagePath[0].name;
    // this.addEditForm.value.img = this.imagePath[0].File;
    }
  }


  public save() {debugger
    this.isShowErrors = true;
    if(!this.addEditForm.value.spclofferurl){
      this.errorlogService.logManualValidationError('Please Enter Special Offer URL');
      this.handleError("Please Enter Special Offer URL");
    }

    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    
   this.specialOfferService.uploadImg(this.imagePath[0],this.addEditForm.value.spclofferurl,this.addEditForm.value.cmp_id,obj[0]?.login_id).subscribe(
      (response:any) => {
      console.log("response",response);
      this.dialogRef.close('Success');
      });
  }

  
  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }




}
