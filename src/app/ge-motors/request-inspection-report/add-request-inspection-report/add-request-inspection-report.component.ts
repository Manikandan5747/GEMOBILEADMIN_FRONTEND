// import { Component, OnInit, Input, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
// import Swal from 'sweetalert2';
// import { Subject } from 'rxjs';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { CookieService } from 'src/app/service/cookie.service';
// import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
// import { ErrorlogService } from 'src/app/errorlog.service';
// import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
// import { HttpErrorResponse } from '@angular/common/http';
// import { RequestInspectionReportService } from '../request-inspection-report.service';

// @Component({
//   selector: 'app-add-request-inspection-report',
//   templateUrl: './add-request-inspection-report.component.html',
//   styleUrls: ['./add-request-inspection-report.component.css']
// })
// export class AddRequestInspectionReportComponent implements OnInit {

//   @Input('isShowErrors')
//   isShowErrors!: boolean;

//   @Input('carshowroom_id')
//   carshowroom_id: any;

//   @Input('reg_id')
//   reg_id: any;

//   public matcher = new ErrorMatcherService();
//   errors = errorMessages;
//   public addEditForm!: FormGroup;
//   loading: boolean = false;
// isrelated_module: boolean = false;
//   currentuser: any;
//   role_id: any;

//   cartotalList: any;
//   filteredcartotalList: any;

//   // Customer dropdown: server-side paginated + searched (8,000+ records, 50/page)
//   customerList: any[] = [];
//   customerSearchCtrl = new FormControl('');
//   customerPage = 1;
//   customerLimit = 50;
//   customerTotalPages = 1;
//   customerLoading = false;
//   private customerSearchSubject = new Subject<string>();

//   constructor(
//     private fb: FormBuilder,
//     public inspectionReportRequestService: RequestInspectionReportService,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<AddRequestInspectionReportComponent>,
//     private formValidationService: FormValidationService,
//     private cookieService: CookieService,
//     public carDetailsService: CarDetailsService,
//     private errorlogService: ErrorlogService
//   ) {}

//   get f() {
//     return this.addEditForm.controls;
//   }

//   isShowroomCarFiltered(item: any) {
//     return this.filteredcartotalList && this.filteredcartotalList.find((ele: any) => ele.carshowroom_id == item.carshowroom_id);
//   }

//   ngAfterViewInit() {
//     // Pre-fill and lock the vehicle when opened from a specific car's page
//     if (this.carshowroom_id) {
//       this.addEditForm.patchValue({ carshowroom_id: this.carshowroom_id });
//       this.addEditForm.get('carshowroom_id')?.disable();
//     } else {
//       const carshowroomControl = this.addEditForm.controls['carshowroom_id'];
//       carshowroomControl.setValidators([Validators.required]);
//       carshowroomControl.updateValueAndValidity();
//     }

//     // Pre-fill and lock the customer when opened from a specific customer's context
//     if (this.reg_id) {
//       this.addEditForm.patchValue({ reg_id: this.reg_id });
//       this.addEditForm.get('reg_id')?.disable();
//     }
//   }

//   async ngOnInit() {

//     this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
//     const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
//     this.role_id = obj[0]?.role_id;

//     this.addEditForm = this.fb.group({
//       carshowroom_id: [''],
//       reg_id: ['', Validators.required],
//       request_mode: ['PORTAL_APP'], 
//       request_status: ['PENDING'], 
//       remark: [''],
//       status: ['1']
//     });

//     setTimeout(() => {
//       this.addEditForm.patchValue({
//         carshowroom_id: this.data?.carshowroom_id,
//         reg_id: this.data?.reg_id
//       });
//     }, 500);

//     this.cartotalList = await this.carDetailsService.getCarDetails().toPromise();
//     this.filteredcartotalList = this.cartotalList;

//     // Re-search from page 1 whenever the user types, debounced so we don't
//     // hit the API on every keystroke across 8,000+ customers
//     this.customerSearchSubject.pipe(
//       debounceTime(400),
//       distinctUntilChanged()
//     ).subscribe((search: string) => {
//       this.customerPage = 1;
//       this.customerList = [];
//       this.loadCustomers(search);
//     });

//     this.customerSearchCtrl.valueChanges.subscribe((val: any) => {
//       this.customerSearchSubject.next(val || '');
//     });

//     this.loadCustomers('');
//   }

//   // Loads one page of customers; appends when paging, replaces when searching fresh
//   loadCustomers(search: string = '') {
//     if (this.customerLoading) {
//       return;
//     }
//     this.customerLoading = true;

//     this.inspectionReportRequestService.getCustomers(this.customerPage, this.customerLimit, search).subscribe(
//       (res: any) => {
//         console.log("res",res);

//         this.customerLoading = false;
//         this.customerTotalPages = res.totalPages;
//         this.customerList = this.customerPage === 1 ? res.data : [...this.customerList, ...res.data];
//       },
//       () => {
//         this.customerLoading = false;
//       }
//     );
//        this.isrelated_module = this.data.isrelated_module
//   }

//   // Bound to (scroll) on the options container inside the mat-select panel
//   onCustomerScroll(event: any) {
//     const el = event.target;
//     const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
//     if (reachedBottom && !this.customerLoading && this.customerPage < this.customerTotalPages) {
//       this.customerPage++;
//       this.loadCustomers(this.customerSearchCtrl.value || '');
//     }
//   }

//   public save() {
//     this.isShowErrors = true;
//     this.formValidationService.markFormGroupTouched(this.addEditForm);

//     if (this.addEditForm.valid) {
//       this.loading = true;

//       const obj = this.currentuser ? JSON.parse(this.currentuser) : "";

//       // Plain JSON payload — no file involved, so FormData isn't needed here
//       const payload = {
//         ...this.addEditForm.getRawValue(),
//         created_by: obj[0]?.login_id
//       };

//       this.inspectionReportRequestService.createInspectionReportRequest(payload).subscribe(
//         (response: any) => {
//           this.loading = false;
//           if (response.status === false) {
//             this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
//             this.handleError(response.message);
//             return;
//           }
//           this.success(response.message);
//           this.dialogRef.close('Success');
//         },
//         (err: HttpErrorResponse) => {
//           console.log("err", err);
//           this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${err}`);
//           this.loading = false;
//           this.handleError(err);
//         }
//       );
//     } else {
//       this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
//     }
//   }

//   private success(message: any) {
//     Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success' });
//     this.dialogRef.close('Success');
//   }

//   private handleError(error: any) {
//     Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error' });
//   }

// }


import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CookieService } from 'src/app/service/cookie.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ErrorlogService } from 'src/app/errorlog.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestInspectionReportService } from '../request-inspection-report.service';

@Component({
  selector: 'app-add-request-inspection-report',
  templateUrl: './add-request-inspection-report.component.html',
  styleUrls: ['./add-request-inspection-report.component.css']
})
export class AddRequestInspectionReportComponent implements OnInit {

  @Input('isShowErrors')
  isShowErrors!: boolean;

  @Input('carshowroom_id')
  carshowroom_id: any;

  @Input('reg_id')
  reg_id: any;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;
  public addEditForm!: FormGroup;
  loading: boolean = false;
  isrelated_module: boolean = false;
  currentuser: any;
  role_id: any;

  // Edit-mode support
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  editRequestId: any = null;

  cartotalList: any;
  filteredcartotalList: any;

  customerList: any[] = [];
  customerSearchCtrl = new FormControl('');
  customerPage = 1;
  customerLimit = 50;
  customerTotalPages = 1;
  customerLoading = false;
  private customerSearchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    public inspectionReportRequestService: RequestInspectionReportService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddRequestInspectionReportComponent>,
    private formValidationService: FormValidationService,
    private cookieService: CookieService,
    public carDetailsService: CarDetailsService,
    private errorlogService: ErrorlogService
  ) { }

  get f() {
    return this.addEditForm.controls;
  }

  isShowroomCarFiltered(item: any) {
    return this.filteredcartotalList && this.filteredcartotalList.find((ele: any) => ele.carshowroom_id == item.carshowroom_id);
  }

  ngAfterViewInit() {
    if (this.carshowroom_id) {
      this.addEditForm.patchValue({ carshowroom_id: this.carshowroom_id });
      this.addEditForm.get('carshowroom_id')?.disable();
    } else {
      const carshowroomControl = this.addEditForm.controls['carshowroom_id'];
      carshowroomControl.setValidators([Validators.required]);
      carshowroomControl.updateValueAndValidity();
    }

    if (this.reg_id) {
      this.addEditForm.patchValue({ reg_id: this.reg_id });
      this.addEditForm.get('reg_id')?.disable();
    }
  }

  async ngOnInit() {

    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;

    // Determine edit mode from what's passed into the dialog
    this.isEditMode = this.data.isEditMode ;
    this.isViewMode = this.data.isViewMode ;
    this.editRequestId = this.data?.request_id || null;

    this.addEditForm = this.fb.group({
      carshowroom_id: [''],
      reg_id: ['', Validators.required],
      request_mode: ['PORTAL_APP'],
      request_status: ['PENDING'],
      remark: [''],
      status: ['1'],
      request_ref_no:['']
    });

    setTimeout(() => {
      if (this.isEditMode || this.isViewMode) {
        this.addEditForm.patchValue({
          carshowroom_id: Number(this.data?.carshowroom_id),
          reg_id: Number(this.data?.reg_id),
          request_mode: this.data?.request_mode,
          request_status: this.data?.request_status,
          remark: this.data?.remark,
          status: this.mapStatusToRadioValue(this.data?.status),
          request_ref_no: this.data?.request_ref_no
        });

        // View mode: lock the entire form, no edits allowed
        if (this.isViewMode) {
          this.addEditForm.disable();
        }
      } else {
        this.addEditForm.patchValue({
          carshowroom_id: this.data?.carshowroom_id,
          reg_id: this.data?.reg_id
        });
            // New record: fetch the next ref no once, up front, at create time only
        this.fetchNextRefNo();
      }

   
    }, 1000);

    this.cartotalList = await this.carDetailsService.getCarDetails().toPromise();
    this.filteredcartotalList = this.cartotalList;

    this.customerSearchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((search: string) => {
      this.customerPage = 1;
      this.customerList = [];
      this.loadCustomers(search);
    });

    this.customerSearchCtrl.valueChanges.subscribe((val: any) => {
      this.customerSearchSubject.next(val || '');
    });

    // If editing, make sure the currently-selected customer is preloaded into the
    // dropdown even if they wouldn't otherwise appear on page 1 of the default list
    this.loadCustomers('', this.isEditMode ? this.data?.reg_id : null);

    this.isrelated_module = this.data?.isrelated_module;
  }

  // API returns status as a label ("Active"/"Inactive") on read,
  // but the radio group and create/update payload use '1'/'0'
  private mapStatusToRadioValue(status: any): string {
    if (status === 1 || status === '1' || status === 'Active') {
      return '1';
    }
    if (status === 0 || status === '0' || status === 'Inactive') {
      return '0';
    }
    return '1'; // sensible default
  }

  loadCustomers(search: string = '', ensureRegId: any = null) {
    if (this.customerLoading) {
      return;
    }
    this.customerLoading = true;

    this.inspectionReportRequestService.getCustomers(this.customerPage, this.customerLimit, search).subscribe(
      (res: any) => {
        this.customerLoading = false;
        this.customerTotalPages = res.totalPages;
        this.customerList = this.customerPage === 1 ? res.data : [...this.customerList, ...res.data];

        // Edge case: editing a request whose customer isn't in the first page/result set —
        // without this the mat-select would show blank even though reg_id is set on the form
        if (ensureRegId && !this.customerList.find((c: any) => c.reg_id == ensureRegId)) {
          this.customerList = [
            { reg_id: this.data.reg_id, customername: this.data.customername || `Customer #${this.data.reg_id}` },
            ...this.customerList
          ];
        }
      },
      () => {
        this.customerLoading = false;
      }
    );
  }

  onCustomerScroll(event: any) {
    const el = event.target;
    const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (reachedBottom && !this.customerLoading && this.customerPage < this.customerTotalPages) {
      this.customerPage++;
      this.loadCustomers(this.customerSearchCtrl.value || '');
    }
  }

  public save() {
     // Guard: view mode should never reach the backend
    if (this.isViewMode) {
      return;
    }
    this.isShowErrors = true;
    this.formValidationService.markFormGroupTouched(this.addEditForm);

    if (this.addEditForm.valid) {
      this.loading = true;

      const obj = this.currentuser ? JSON.parse(this.currentuser) : "";

      const payload = {
        ...this.addEditForm.getRawValue(),
        created_by: obj[0]?.login_id
      };

      if (this.isEditMode) {
        payload.modified_by = obj[0]?.login_id;
        this.inspectionReportRequestService.updateById(this.editRequestId, payload).subscribe(
          (response: any) => {
            this.loading = false;
            if (response.status === false) {
              this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
              this.handleError(response.message);
              return;
            }
            this.success(response.message);
            this.dialogRef.close('Success');
          },
          (err: HttpErrorResponse) => {
            this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${err}`);
            this.loading = false;
            this.handleError(err);
          }
        );
      } else {
        this.inspectionReportRequestService.createInspectionReportRequest(payload).subscribe(
          (response: any) => {
            this.loading = false;
            if (response.status === false) {
              this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${response.message}`);
              this.handleError(response.message);
              return;
            }
            this.success(response.message);
            this.dialogRef.close('Success');
          },
          (err: HttpErrorResponse) => {
            this.errorlogService.logFormErrors(this.addEditForm, `addEditForm ${err}`);
            this.loading = false;
            this.handleError(err);
          }
        );
      }
    } else {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success' });
    this.dialogRef.close('Success');
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error' });
  }

  private fetchNextRefNo() {
  this.inspectionReportRequestService.getNextRefNo('INSPECTIONREPORT').subscribe(
    (res: any) => {
      this.addEditForm.patchValue({ request_ref_no: res.request_ref_no });
    },
    (err: HttpErrorResponse) => {
      console.log('err fetching next ref no', err);
      // Non-blocking — form still usable, backend will assign the real ref no atomically on insert
    }
  );
}

}