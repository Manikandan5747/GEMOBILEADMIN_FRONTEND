import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DateFormat, MatTableAttributes } from 'src/app/common/ui.constant';
import { AddShowroomContactDetailsComponent } from '../add-showroom-contact-details/add-showroom-contact-details.component';
import { EditShowroomContactDetailsComponent } from '../edit-showroom-contact-details/edit-showroom-contact-details.component';
import { CookieService } from 'src/app/service/cookie.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { ShowroomCategoryService } from 'src/app/service/showroom-category/showroom-category.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-showroom-car-details-form',
  templateUrl: './add-edit-showroom-car-details-form.component.html',
  styleUrls: ['./add-edit-showroom-car-details-form.component.css']
})

export class AddEditShowroomCarDetailsFormComponent implements OnInit {

  public displayedColumns: string[] = ['showroomconname', 'showroomconno', 'showroomconemail', 'portalstatus', 'status', 'created_by', 'created_at', 'modified_by', 'modified_at', 'actions'];
  public displayedLabelColumns: string[] = ['showroomconname', 'showroomconno', 'showroomconemail', 'portalstatus', 'status', 'created By', 'created Date', 'updated By', 'updated Date', 'Action'];
  dataSource!: MatTableDataSource<any>;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  showroomdetid: any;
  title: string = "Car Showroom Details";
  imagePath: any;
  imageBase64: any;
  formData = new FormData();
  showroomdetailsno: any;
  shrlogo: any;
  currentUser: any;
  showroomContactDetailList: any = [];
  showroomCategoryList: any = [];
  isRefNo: any = "false";
  carShowroomDetailsByIDList: any = {};

  constructor(private cookieService: CookieService, public showroomCategoryService: ShowroomCategoryService, public dialog: MatDialog, private pushNotificationService: PushNotificationsService,
    private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
    private carDetailsService: CarDetailsService,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {
    this.route.queryParams.subscribe(params => {
      this.showroomdetid = params['showroomdetid'];
      this.isRefNo = params['isRefNo'];
      this.isRefNo = this.isRefNo == undefined ? "true" : this.isRefNo;
      console.log(this.showroomdetid, this.showroomdetid)

    });
  }



  async getfindnextshowroomRefno() {
    await this.carDetailsService.getfindnextshowroomRefno().pipe()
      .subscribe((data: any) => {
        console.log("getnextRefno", data.showroomrefno);
        this.showroomdetailsno = data.showroomrefno;
      });
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }

  async ngAfterViewInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    if (!this.showroomdetid) {
      await this.getfindnextshowroomRefno();
      setTimeout(() => {
        this.addEditForm.patchValue({ showroomdetno: this.showroomdetailsno });
      }, 1000)
    }
  }

  async ngOnInit() {

    // console.log("this.isRefNo",this.isRefNo);

    this.addEditForm = this.fb.group({
      showroomdetno: ['', Validators.required],
      showroomname: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      showroomaddress: ['',],
      showroomaddress2: [''],
      showroomlocatedin: ['',],
      showroomopenhours: ['',],
      showroomserviceoptions: ['',],
      status: ['1'],
      srcategoryid: ['', Validators.required],
      remark: [''],
      showroomCategoryType:['',Validators.required]
    });

    if (this.showroomdetid) {
      this.showroomContactDetailList = [];
      this.carDetailsService.getCarShowroomDetailsByID(this.showroomdetid).pipe()
        .subscribe(async (data: any) => {
          console.log("getCarShowroomDetailsByID", data);
          this.fillForm(data[0]);
        });

      if (this.isRefNo == "true") {
        this.addEditForm.disable();

      } else {
        this.displayedColumns = ['showroomconname', 'showroomconno', 'showroomconemail', 'portalstatus', 'status', 'created_by', 'created_at', 'modified_by', 'modified_at'];
        this.displayedLabelColumns = ['showroomconname', 'showroomconno', 'showroomconemail', 'portalstatus', 'status', 'created By', 'created Date', 'updated By', 'updated Date'];
      }
    }

    this.showroomCategoryList = await this.showroomCategoryService.getShowroomCategory().toPromise();
    // console.log("showroomCategoryList",this.showroomCategoryList) 

  }

  private async fillForm(parsedData: any) {
    this.shrlogo = parsedData.showroomlogo;
    this.showroomContactDetailList = parsedData && parsedData.contactdetails ? parsedData.contactdetails : [];
    this.loadRecord();
    this.addEditForm.patchValue({
      showroomdetno: parsedData.showroomdetno,
      showroomname: parsedData.showroomname,
      showroomaddress: parsedData.showroomaddress,
      showroomaddress2: parsedData.showroomaddress2,
      showroomlocatedin: parsedData.showroomlocatedin,
      showroomopenhours: parsedData.showroomopenhours,
      showroomserviceoptions: parsedData.showroomserviceoptions,
      status: parsedData && parsedData.status == 1 ? 1 : 0,
      srcategoryid: parsedData.srcategoryid,
      showroomCategoryType:parsedData.showroomcategorytype ? parsedData.showroomcategorytype :""

    });

    // this.carShowroomDetailsByIDList = this.addEditForm.value;
  }



  public save() {
    debugger;
    this.isShowErrors = true;

    if (!this.addEditForm.valid && this.isRefNo == "false") {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      return
    }
    this.formData = new FormData();
    var enteredData = this.addEditForm.value;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
   
    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }

    if (this.imagePath && this.imagePath[0]) {
      this.formData.append('logo', this.imagePath[0]);
    } else if (this.shrlogo) {
      this.formData.append("shrlogo", this.shrlogo);
    } else {
      this.errorlogService.logFormErrors(this.addEditForm, `addEditForm Logo is Mandatory`);
      this.handleError("Logo is Mandatory")
    }

    if (this.showroomdetid) {
      this.carDetailsService.updateShowroomCarDetails(this.formData, this.showroomdetid,).subscribe(
        async (response: any) => {
          if (response && response.data.length > 0) {
            this.errorlogService.logManualValidationError(`add-edit-showroom-car-details-form component|save()|Error:${response.data}`);
            Swal.fire({ toast: true, position: 'center', showConfirmButton: false, timer: 3000, title: response.data, icon: 'error', });
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
              },
              buttonsStyling: false
            });
            var str = "";
            response.data && response.data.forEach((element: any) => {
              str = str + " , " + element.showroomconusername;
            });
            swalWithBootstrapButtons.fire('Username Already Exist', str,'error')
            this.errorlogService.logManualValidationError(`add-edit-showroom-car-details-form component|save()|Error:Username Already Exist ${str}`);
          }
          // console.log("response", response);
          var pushObj = {
            'title': "Car Showroom Updated",
            'alertContent': this.addEditForm.value.showroomname + " Updated in GE -Motors",
          }
          await this.notify(pushObj);
          this.pushNotificationService.sendMessage(false);
          this.router.navigate(['showroom-contact-details']);

        });
    } else {
      this.carDetailsService.createShowroomCarDetails(this.formData).subscribe(
        async (response: any) => {
          // console.log("response", response);
          var pushObj = {
            'title': "Car Showroom Added",
            'alertContent': "New " + this.addEditForm.value.showroomname + " Added in GE -Motors",
          }
          await this.notify(pushObj);
          this.pushNotificationService.sendMessage(false);
          this.router.navigate(['showroom-contact-details']);
          this.success("Showroom cars details saved successfully");

        });
    }

  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}



  async onFileChanged(event: any) {
    debugger
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = "Only images are supported.";
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imageBase64 = reader.result;
    }
  }


  loadRecord() {
    console.log("this.showroomContactDetailList", this.showroomContactDetailList)
    this.dataSource = new MatTableDataSource(this.showroomContactDetailList.reverse());
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddShowroomContactDetailsComponent, {
      width: '950px',
      height: 'fit-content',
      disableClose: true,
      data: {
        showroomdetailsno: this.showroomdetailsno ? this.showroomdetailsno : this.addEditForm.value.showroomdetno,
        showroomname : this.addEditForm.value.showroomname,
        showroomddetid:parseInt(this.showroomdetid)
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      debugger
      if (result == 'Success') {
        this.ngOnInit();
      }
    });
  }

  public editRecord(items: any) {
    this.carDetailsService.isAlreadyMapped(items.showroomdcon_id).subscribe(
      (response: any) => {
        console.log("response", response);
        if (response.length > 0) {
          this.errorlogService.logManualValidationError(`add-edit-showroom-car-details-form component|editRecord()|Do you want to edit Record? Contact Already Mapped with Car!`);
          // Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 8000, title: "Contact Already Mapped with Car.", icon: 'error', });
          Swal.fire({
            title: 'Do you want to edit Record?',
            text: "Contact Already Mapped with Car!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              this.editpopup(items);
            }
          });
        } else {
          this.editpopup(items);
        }
      });
  }




  editpopup(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditShowroomContactDetailsComponent, {
      width: '950px',
      height: 'fit-content',
      disableClose: true,
      data: {
        portalstatus: items.portalstatus,
        showroomdetailsno: this.showroomdetailsno ? this.showroomdetailsno : this.addEditForm.value.showroomdetno,
        showroomconemail: items.showroomconemail,
        showroomconname: items.showroomconname,
        showroomconno: items.showroomconno,
        showroomdcon_id: items.showroomdcon_id,
        showroomddetid: items.showroomddetid,
        status: items.status,
        isportaluser: items.isportaluser,
      }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result == 'Success') {
        debugger
        // this.carDetailsService.getCarShowroomDetailsByID(this.showroomdetid).pipe()
        //   .subscribe(async (data: any) => {
            // var tempArr: any = [];
            // var newRes = data && data.contactdetails ? data.contactdetails : [];
            // this.showroomContactDetailList.forEach((ele2: any) => {
            //   if (!ele2.showroomdcon_id) {
            //     console.log("ele2", ele2)
            //     tempArr.push(ele2)
            //   }
            // });
            // // console.log("tempArr",tempArr);
            // this.showroomContactDetailList = [];
            // this.showroomContactDetailList = [...newRes, ...tempArr];
            await this.ngOnInit();
          // });

      }
    });
  }

  notify(obj: any) {
    let data: Array<any> = [];
    data.push({
      'title': obj.title,
      'alertContent': obj.alertContent,
    });
    this.pushNotificationService.generateNotification(data);
  }

  deleteRecord(item: any) {
    debugger
    this.showroomContactDetailList = this.showroomContactDetailList.filter((object: any) => {
      return object.showroomconno !== item.showroomconno;
    });
    this.loadRecord();
  }
}


