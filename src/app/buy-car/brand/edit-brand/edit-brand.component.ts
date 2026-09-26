import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AddEditBrandFormComponent } from '../add-edit-brand-form/add-edit-brand-form.component';
import { BrandService } from 'src/app/service/brand/brand.service';
import { CookieService } from 'src/app/service/cookie.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.css']
})
export class EditBrandComponent implements OnInit {
  isShowErrors: boolean = false;
  action: any = "action";
  @ViewChild(AddEditBrandFormComponent, { static: false })
  editForm!: AddEditBrandFormComponent;
  user: any;
  error!: '';
  customerList: any;
  currentUser: any;
  brandlogopath: any;


  assetlogopath: any;

  company: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditBrandComponent>,
    private brandService: BrandService, private cookieService: CookieService, private errorlogService: ErrorlogService) { }

  ngOnInit() {
    debugger
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    var datas = this.data;
    this.brandlogopath = datas.brandlogopath;
    this.assetlogopath = datas.asset_imagepath;



    setTimeout(() => {
      this.fillForm(datas);
    }, 200);
  }


  private fillForm(parsedData: any) {
    this.editForm.addEditForm.patchValue({
      brandid: parsedData.brandid,
      brandname: parsedData.brandname,
      brandcode: parsedData.brandcode,
      status: parsedData.status == "Active" ? '1' : '0',
      assetbrandname: parsedData.asset_brandname || '',
      assetstatus: parsedData.crm_status == "Active" ? '1' : '0',
      company: parsedData.company ? parsedData.company.toString() : null,

    });
  }


  // public update() { 
  //   debugger
  //   this.isShowErrors = true;
  //   if (this.editForm.addEditForm.valid) {
  //     const enteredData = this.editForm.addEditForm.value;
  //    var tempdata =  enteredData.brandImg;
  //       enteredData.brandid = this.data.brandid;
  //       enteredData.brandImg = this.data.brandlogopath;
  //       const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
  //       enteredData.userid = obj[0]?.login_id;



  //       var formData = new FormData();
  //       for (let ele in enteredData) {
  //         formData.append(ele, enteredData[ele]);
  //       }
  //       formData.append("imgs", tempdata);


  //       this.brandService.updateBrand(formData).subscribe(
  //         (response:any) => {
  //           if(response.message == "Brand Name already exsits"){
  //             this.handleError(response.message);
  //             return
  //           }else{
  //             this.success(response.message);
  //             this.dialogRef.close('Success');
  //           }
  //         },
  //         (err: HttpErrorResponse) => {
  //           this.handleError(err.error.message);
  //         })
  //   }
  // }


  public update() {
    this.isShowErrors = true;
    if (this.editForm.addEditForm.valid) {
      const enteredData = this.editForm.addEditForm.value;


      var tempBrandImg = enteredData.brandImg;
      var tempAssetImg = enteredData.assetImg;

      enteredData.brandid = this.data.brandid;
      enteredData.brandImg = this.data.brandlogopath;
      enteredData.asset_imagepath = this.data.asset_imagepath;


      enteredData.asset_brandname = enteredData.assetbrandname;
      enteredData.crm_status = enteredData.assetstatus;

      const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
      enteredData.userid = obj[0]?.login_id;

      var formData = new FormData();
      for (let ele in enteredData) {
        formData.append(ele, enteredData[ele]);
      }


      if (tempBrandImg) {
        formData.append("imgs", tempBrandImg);
      }


      if (tempAssetImg) {
        formData.append("asset_imgs", tempAssetImg);
      }

      this.brandService.updateBrand(formData).subscribe(
        (response: any) => {
          if (response.message == "Brand Name already exsits") {
            this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${response.message}`);
            this.handleError(response.message);
            return;
          } else {
            this.success(response.message);
            this.dialogRef.close('Success');
          }
        },
        (err: HttpErrorResponse) => {
          this.errorlogService.logFormErrors(this.editForm.addEditForm, `editForm ${err.error.message}`);
          this.handleError(err.error.message);
        })
    } else {
      this.errorlogService.logFormErrors(this.editForm.addEditForm, 'editForm');
    }
  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

}
