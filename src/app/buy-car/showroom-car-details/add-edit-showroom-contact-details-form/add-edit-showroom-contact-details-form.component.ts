import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { PortalUsersStatusService } from 'src/app/service/portalusers-status/portal-users-status.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-showroom-contact-details-form',
  templateUrl: './add-edit-showroom-contact-details-form.component.html',
  styleUrls: ['./add-edit-showroom-contact-details-form.component.css']
})
export class AddEditShowroomContactDetailsFormComponent implements OnInit {
  @Input('isShowErrors')
  isShowErrors!: boolean;
  @Input('portalstatus')
  portalstatus!:any;
  @Input('showroomdetailsno')
  showroomdetailsno!: any ;

  @Input('showroomdcon_id')
  showroomdcon_id!: any ;

  // MOBILE_NO = '[0-9]$';
  public matcher = new ErrorMatcherService();
  errors = errorMessages; 
  public addEditForm!: FormGroup;
  validationMessages: any ={};
  portalUsersStatusList: any;
  constructor(private fb: FormBuilder,private portalUsersStatusService:PortalUsersStatusService, private carDetailsService: CarDetailsService,
    private formValidationService:FormValidationService,private errorlogService: ErrorlogService) { 
  }

  get f() {
  return this.addEditForm.controls;
  }
  
  getisportalusername(event:any){
  console.log("event",event)
  }
    
  async ngOnInit() {
    debugger
    this.addEditForm = this.fb.group({
      showroomddetid:[this.showroomdetailsno],
      showroomconname: ['',[Validators.required,this.formValidationService.noWhitespaceValidator]],
      showroomconno: ['', [Validators.required, ]],
      // Validators.pattern(this.MOBILE_NO)
      showroomconemail:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      isinvite:['0'],
      // showroomconusername:['',Validators.required],
      // showroomconpassword:['',Validators.required],
      status: ['1'],
      isdeletedstatus:['0'],
      remark:[''],
      isportaluser:['0']
    });
    await this.getPortalUsersStatus();
  
  }


  getPortalUsersStatus(){
    this.portalUsersStatusService.getPortalUsersStatus().pipe()
    .subscribe((data: any) => {
      console.log("getPortalUsersStatus", data);
      this.portalUsersStatusList = data;

      if(this.portalstatus == 'APPROVE'){
        this.portalUsersStatusList = this.portalUsersStatusList.filter((ele: any) => ele.portalstatusid != 1);
        
      }
    });
  }

  radioChange(event: any) {
    if(event.value == "0"){
      this.carDetailsService.isAlreadyMapped(this.showroomdcon_id).subscribe(
        (response:any) => {
          console.log("response",response);
          if(response.length > 0){
            this.errorlogService.logManualValidationError(`add-edit-showroom-contact-details-form component|radioChange()|Contact Already Mapped with Car. Please Update the Car First`);
            Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Contact Already Mapped with Car. Please Update the Car First", icon: 'error', });
            this.addEditForm.patchValue({
              status: '1',
             })
             }
        });
    }else{
      var obj={
        username : this.addEditForm.value.showroomconname,
        emailid : this.addEditForm.value.showroomconemail,
        isEmailApi:true
      }
      this.carDetailsService.isAlreadyMappedInUserTable(obj).subscribe(
        (response:any) => {
          console.log("response",response);
          if(response.length > 0){
            this.errorlogService.logManualValidationError(`add-edit-showroom-contact-details-form component|radioChange()|Showroom email Already Mapped with another user.`);
            Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Showroom email Already Mapped with another user.", icon: 'error', });           
            this.addEditForm.patchValue({
              status: '0',
             }) }

        })
    }
  }

  onEmailChange(searchValue: string): void {  
    console.log(searchValue);
    var obj={
      username : this.addEditForm.value.showroomconname,
      emailid : this.addEditForm.value.showroomconemail,
      isEmailApi:true
    }
    this.carDetailsService.isAlreadyMappedInUserTable(obj).subscribe(
      (response:any) => {
        console.log("response",response);
        if(response.length > 0){
          this.errorlogService.logManualValidationError(`add-edit-showroom-contact-details-form component|onEmailChange()|Showroom email Already Mapped with another user.`);
          Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Showroom email Already Mapped with another user.", icon: 'error', });
         
           }
      })
  }

  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
    var obj={
      username : this.addEditForm.value.showroomconname,
      emailid : this.addEditForm.value.showroomconemail,
      isEmailApi:false
    }
    this.carDetailsService.isAlreadyMappedInUserTable(obj).subscribe(
      (response:any) => {
        console.log("response",response);
        if(response.length > 0){
          this.errorlogService.logManualValidationError(`add-edit-showroom-contact-details-form component|onSearchChange()|Showroomconname Already Mapped with another user.`);
          Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Showroomconname Already Mapped with another user.", icon: 'error', });
         
           }
      })
  }

}
