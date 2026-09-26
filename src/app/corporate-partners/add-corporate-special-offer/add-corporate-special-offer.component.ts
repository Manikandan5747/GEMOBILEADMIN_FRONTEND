import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { SpecialOfferService } from 'src/app/service/special-offer/special-offer.service';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { first } from 'rxjs/operators';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { UserRoleService } from 'src/app/service/user-role/user-role.service';
import { CookieService } from 'src/app/service/cookie.service';
import { CorporatePartnersService } from 'src/app/service/corporate-partners/corporate-partners.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-corporate-special-offer',
  templateUrl: './add-corporate-special-offer.component.html',
  styleUrls: ['./add-corporate-special-offer.component.css']
})
export class AddCorporateSpecialOfferComponent implements OnInit {

  title = "Create Corporate Special Offer";
  @Input('isShowErrors')
  isShowErrors!: boolean;
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  filteredRoleList: any;
  currentUser: any;
  corporatepartnersList: any;
  constructor(private corporatePartnersService:CorporatePartnersService,private formValidationService:FormValidationService,private customerService:CustomerService ,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<AddCorporateSpecialOfferComponent>,private fb: FormBuilder,private specialOfferService:SpecialOfferService,private errorlogService: ErrorlogService) 
  {   }

    get f() {
      return this.addEditForm.controls;
    }
    
  ngOnInit() {



    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.getAllSpecialOffer();
    // alert(this.data.partnerid)
    this.addEditForm = this.fb.group({
      corporatespecialofferdesc:['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      offerexpirydate: [''],
      status: ['1'],
      corporatepromocode:['',Validators.required],
      partnerid:['',Validators.required]
    });
    if(this.data && this.data.corporatespecialofferid){
    this.title = "Edit Corporate Special Offer";
      var datas = this.data;
      setTimeout(() => {
        this.fillForm(datas);
      }, 200);
    }
 
  }

  private fillForm(parsedData:any) {
    this.addEditForm.patchValue({
      corporatespecialofferdesc: parsedData.corporatespecialofferdesc,
      offerexpirydate:parsedData.offerexpirydate,
      username: parsedData.username,
      status: parsedData.status == "Active" ? '1' : '0',
      corporatepromocode: parsedData.corporatepromocode,
      partnerid: parsedData.partnerid ,
       
    });
  }
  


  public isRoleFiltered(item: any) {
    return this.filteredRoleList.find((ele: any) => ele.corporatepartnername == item.corporatepartnername);
  }

  getAllSpecialOffer(){
    this.corporatePartnersService.getCorporatepartners().pipe()
    .subscribe( (data:any) => {
       console.log("getCorporatepartners ",data); 
        this.corporatepartnersList = data;
        this.filteredRoleList = data;


        this.addEditForm.patchValue({
          partnerid: parseInt(this.data.partnerid) , 
        });
      });
  }

  public save() {
    debugger
    this.isShowErrors = true;

    this.formValidationService.markFormGroupTouched(this.addEditForm);
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      return
    }
    const enteredData = this.addEditForm.value;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;

    if(this.data && this.data.corporatespecialofferid){
      enteredData.corporatespecialofferid = this.data.corporatespecialofferid;
      this.corporatePartnersService.updateCorporatespecialoffer(enteredData)
      .pipe(first())
      .subscribe(
        data => {
          console.log("data ",data);
          this.dialogRef.close('Success');
        },
        (error: any) => {
          console.log("error ",error);
          this.errorlogService.logManualValidationError(`add-corporate-special-offer component|save()|Error: ${error}`);
          Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  
        });
  
    }else{
      this.corporatePartnersService.createCorporatespecialoffer(enteredData)
      .pipe(first())
      .subscribe(
        data => {
          console.log("data ",data);
          this.dialogRef.close('Success');
        },
        (error: any) => {
          console.log("error ",error);
          this.errorlogService.logManualValidationError(`add-corporate-special-offer component|save() 2|Error: ${error}`);
          Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  
        });
  
    }

  }

  
  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }




}
