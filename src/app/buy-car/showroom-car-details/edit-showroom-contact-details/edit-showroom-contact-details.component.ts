import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { BrandService } from 'src/app/service/brand/brand.service';
import { AddEditShowroomContactDetailsFormComponent } from '../add-edit-showroom-contact-details-form/add-edit-showroom-contact-details-form.component';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-showroom-contact-details',
  templateUrl: './edit-showroom-contact-details.component.html',
  styleUrls: ['./edit-showroom-contact-details.component.css']
})
export class EditShowroomContactDetailsComponent implements OnInit {
  isShowErrors: boolean = false;
  action: any = "action";
  @ViewChild(AddEditShowroomContactDetailsFormComponent,{ static: false })
  editForm!: AddEditShowroomContactDetailsFormComponent;
  user: any;
  error!: '';
  customerList: any;
  showroomdetailsno: any;
  showroomdcon_id: any;
  currentUser: any;
  portalstatus: any;
  
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private cookieService: CookieService,public dialogRef: MatDialogRef<EditShowroomContactDetailsComponent>,
  private carDetailsService: CarDetailsService,private errorlogService: ErrorlogService) { 
    this.showroomdetailsno =  this.data.showroomdetailsno;
  }

  ngOnInit() {
    var datas = this.data;
    this.showroomdcon_id = this.data.showroomdcon_id;
    this.portalstatus = this.data.portalstatus;
    console.log("datas",datas)
    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }


private fillForm(parsedData:any) {debugger
  this.editForm.addEditForm.patchValue({
    showroomconemail: parsedData.showroomconemail,
    showroomconname: parsedData.showroomconname,
    showroomconno: parsedData.showroomconno,
    isportaluser:parsedData.isportaluser.toString(),
    showroomddetid: parsedData.showroomddetid,
    status: parsedData.status == 1 ? '1' : '0',
  });
}

ngAfterViewInit(){
  this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
}

public update() { 
  debugger
  this.isShowErrors = true;
  if (this.editForm.addEditForm.valid) {
    const enteredData = this.editForm.addEditForm.value;
      enteredData.showroomddetid = this.data.showroomddetid;
      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;
      this.carDetailsService.update(enteredData,this.data.showroomdcon_id).subscribe(
        (response:any) => {
          if(response.err){
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${response.message}`);
            this.handleError(response.message);
            return
          }else{
            this.success(response.message);
            this.dialogRef.close('Success');
          }
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `EditForm ${err.error.message}`);
          this.handleError(err.error.message);
        })
  } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'EditForm');
    }
}

private success(message:any) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  this.dialogRef.close('Success'); 
}

private handleError(error:any) {
  Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
}

}
