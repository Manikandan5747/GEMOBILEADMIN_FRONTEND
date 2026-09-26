import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorlogService } from 'src/app/errorlog.service';
import { CookieService } from 'src/app/service/cookie.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { SpecialOfferService } from 'src/app/service/special-offer/special-offer.service';
import { UserRoleService } from 'src/app/service/user-role/user-role.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-login',
  templateUrl: './create-login.component.html',
  styleUrls: ['./create-login.component.css']
})
export class CreateLoginComponent implements OnInit {
  title = "Create User";
  @Input('isShowErrors')
  isShowErrors!: boolean;
  message!: string;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;

  public addEditForm!: FormGroup;
  filteredRoleList: any;
  userRoleList: any;
  currentUser: any;
  constructor(private formValidationService:FormValidationService,private customerService:CustomerService ,
    private userRoleService:UserRoleService,private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<CreateLoginComponent>,private fb: FormBuilder,private specialOfferService:SpecialOfferService,private errorlogService: ErrorlogService) 
  {   }

    get f() {
      return this.addEditForm.controls;
    }
    
  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.getAllUserModel();
    this.addEditForm = this.fb.group({
      password:['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      username: ['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      // role:"MobileAdmin",
      status: ['1'],
      isforcefulllogin:[''],
      emailid: ['',[this.formValidationService.noWhitespaceValidator,Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      role:['',Validators.required],
    });
    if(this.data.login_id){
    this.title = "Edit User"
      var datas = this.data;
      setTimeout(() => {
        this.fillForm(datas);
      }, 200);
    }
 
  }

  private fillForm(parsedData:any) {
    this.addEditForm.patchValue({
      // customername: parsedData.customername,
      password:parsedData.userpassword,
      username: parsedData.username,
      status: parsedData.status == "Active" ? '1' : '0',
      emailid: parsedData.emailid,
      isforcefulllogin: parsedData.isforcefulllogin ,
      role: parsedData.role_id,
       
    });
  }
  


  public isRoleFiltered(item: any) {
    return this.filteredRoleList.find((ele: any) => ele.rolename == item.rolename);
  }

  getAllUserModel() {
    this.userRoleService.getUserRole().pipe()
      .subscribe((data: any) => {
        this.userRoleList = data;
        this.filteredRoleList = data;
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

    if(this.data && this.data.login_id){
      enteredData.userpassword = this.addEditForm.value.password;
      this.customerService.updatelogin(enteredData,this.data.login_id)
      .pipe(first())
      .subscribe(
        data => {
          console.log("data ",data);
          this.dialogRef.close('Success');
        },
        (error: any) => {
          console.log("error ",error);
          this.errorlogService.logManualValidationError(`create-login component|save()|Error: ${error}`);
          Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  
        });
  
    }else{
      this.customerService.createlogin(enteredData)
      .pipe(first())
      .subscribe(
        data => {
          console.log("data ",data);
          this.dialogRef.close('Success');
        },
        (error: any) => {
          console.log("error ",error);
          this.errorlogService.logManualValidationError(`create-login component|save() 2|Error: ${error}`);
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
