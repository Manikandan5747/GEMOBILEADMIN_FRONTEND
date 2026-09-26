import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList, } from "src/app/common/enum";
import { DataService } from "src/app/service/encryption/data.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { RequestInspectionReportService } from "./request-inspection-report.service";
import { AddRequestInspectionReportComponent } from "./add-request-inspection-report/add-request-inspection-report.component";
const moment = require('moment');


@Component({
  selector: 'app-request-inspection-report',
  templateUrl: './request-inspection-report.component.html',
  styleUrls: ['./request-inspection-report.component.css']
})

export class RequestInspectionReportComponent implements OnInit, OnDestroy {
  request_mode: string = '';
  request_status: string = '';
  searchValue: string = '';
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  requestInspectionReportList: any;
  public addEditForm!: FormGroup;
  currentuser: any;
  carshowroom_id: any;
  showroomname: any;
  brandname: any;
  modelname: any;
  carshowroomrefno: any;
  status: any;
  role_id: any;
  editmenu: boolean = true;
  storage_data_id: any;
  privilege: any;
  // privilegesMap = {
  //   addInactive: false,
  //   editInactive: false,
  //   deleteInactive: false,
  //   allowSignLink: false,
  //   allowSendEmail: false,
  // };
  isrelated_module: boolean = false;
  userPrivilegeObj: any;
  constructor(public requestInspectionReportService: RequestInspectionReportService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private customerService: CustomerService,
    private cookieService: CookieService, private dataService: DataService,
    public dialog: MatDialog, private manageModuleService: ManageModuleService,) {


    this.loading = true;
    this.storage_data_id = this.dataService.getData('storage_data_id');
    if (this.storage_data_id) {
      this.isrelated_module = true;
      this.getRecord(this.storage_data_id);
    } else {
      this.displayedColumns = ['actions', 'carshowroomrefno', 'request_ref_no', 'requested_by_name', 'request_mode', 'request_status',  'status', 'created_by_name', 'created_at', 'modified_by_name', 'modified_at','action_info'];
      this.getCurrentUserPrivilege();

      this.getRequestInspectionReportDetails();
    }
  }

  public displayedColumns: string[] = ['actions', 'request_ref_no', 'requested_by_name', 'request_mode', 'request_status',  'status', 'created_by_name', 'created_at', 'modified_by_name', 'modified_at','action_info'];

  dataSource!: MatTableDataSource<any>;

  get formControl(): any { return this.addEditForm.controls; }



  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.carshowroom_id = response?.data['carshowroom_id'];
        this.showroomname = response?.data['showroomname'];
        this.brandname = response?.data['brandname'];
        this.modelname = response?.data['modelname'];
        this.carshowroomrefno = response?.data['carshowroomrefno'];
        this.status = response?.data['status']



        this.addEditForm = this.fb.group({
          carshowroomrefno: [''],
          showroomname: [''],
          brandname: [''],
          modelname: [''],
          description: [''],
          status: ['1'],
        });
        this.getRequestInspectionReportDetails();
        this.fillForm();
        this.getSubPrivilege();

      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }


  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.RequestInspectionReportMainMenu)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;
    // this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.RequestInspectionReportMainMenu, this.role_id).subscribe((Result2: any) => {
    //   console.log("Privilege Result2",);
    //   console.log("Privilege Result2", Result2);
    //   const miscPrivileges = Result2.miscPrivileges || [];

      // this.privilegesMap = {//ADVANCE_INACTIVE_BUTTON
      //   addInactive: true,
      //   editInactive: true,
      //   deleteInactive: miscPrivileges.some(p => p.misc_name === 'REQUEST_INSPECTION_INACTIVE_BUTTON' && p.access && p.mapping_field_status),
      //   allowSignLink: true,
      //   allowSendEmail: true,
      // };
    // })

  }

  async ngOnInit() { }

  getSubPrivilege() {
    debugger;
    this.loading = true;
    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;

    if (!this.carshowroom_id) {
      this.displayedColumns = ['actions', 'carshowroomrefno', 'advancerefno', 'accountname', 'modeofpayment', 'duedate', 'advanceamount', 'advancedoc', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];

      this.getCurrentUserPrivilege();
      // this.privilegesMap = {
      //   addInactive: true,
      //   editInactive: true,
      //   deleteInactive: true,
      //   allowSignLink: true,
      //   allowSendEmail: true,
      // };
    } else {
      this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ShowroomCars, this.role_id).subscribe((Result2: any) => {
        console.log("Privilege Result2", Result2);
        console.log("Privilege Result2", this.status);

        this.privilege = Result2.data.find(
          ele => ele.child_module_id === ModuleIdList.RequestInspectionReport
        );
        const miscPrivileges = Result2.miscPrivileges || [];
        if (this.status === "InActive") {


          // this.privilegesMap = {
          //   addInactive: miscPrivileges.some(p => p.misc_name === 'REQUEST_INSPECTION_ADD_INACTIVE' && p.access && p.mapping_field_status),
          //   editInactive: false,
          //   deleteInactive: miscPrivileges.some(p => p.misc_name === 'ADVANCE_INACTIVE_BUTTON' && p.access && p.mapping_field_status),
          //   allowSignLink: false,
          //   allowSendEmail: false,
          // };

        } else {
          // this.privilegesMap = {
          //   addInactive: true,
          //   editInactive: true,
          //   deleteInactive: miscPrivileges.some(p => p.misc_name === 'REQUEST_INSPECTION_INACTIVE_BUTTON' && p.access && p.mapping_field_status),
          //   allowSignLink: true,
          //   allowSendEmail: true,
          // };
          this.privilege = Result2.data.find(
            ele => ele.child_module_id === ModuleIdList.RequestInspectionReport
          );
        }

        console.log("Privilege  this.privilege", this.privilege);
      })
    }


  }

  private async fillForm() {
    this.addEditForm.patchValue({
      carshowroomrefno: this.carshowroomrefno,
      showroomname: this.showroomname,
      brandname: this.brandname,
      modelname: this.modelname,
      totalamount: '',
    });
  }

  getRequestInspectionReportDetails() {
    this.loading = true;
    this.requestInspectionReportService.getRequestInspectionReport(this.carshowroom_id).pipe()
      .subscribe((data: any) => {
        console.log("getRequestInspectionReportDetails ", data);
        this.requestInspectionReportList = data.data;
        this.loadRecord();
      });
  }

  goback() {
    this.dataService.clearAllData();
    history.back();
  }

  loadRecord() {
    var dynamicTableData: any = [];
    this.requestInspectionReportList && this.requestInspectionReportList.forEach((element: any) => {
      let row = {
        ...element,
        status: element.status == 1 ? "Active" : "In-Active",
        modifiedat: element.modifiedat ? moment(element.modifiedat).format('DD-MMM-YYYY hh:mm:ss A') : "",
        createdat: element.createdat ? moment(element.createdat).format('DD-MMM-YYYY hh:mm:ss A') : "",
      }
      dynamicTableData.push(row);
    })

    this.dataSource = new MatTableDataSource(dynamicTableData);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;



    this.route.queryParams.subscribe(params => {
      this.request_status = params['request_status'];
      if (this.request_status == 'TOTAL') {
        this.clearSearch();
      } else {
        this.applyFilters();
      }
    });

    this.loading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.searchValue = filterValue.trim().toLowerCase();

    this.applyFilters();
  }

  applyFilters() {

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const searchMatch =
        !this.searchValue ||
        Object.values(data).some((value: any) =>
          value !== null &&
          value !== undefined &&
          value.toString().toLowerCase().includes(this.searchValue)
        );

      const modeMatch =
        !this.request_mode ||
        data.request_mode === this.request_mode;

      const statusMatch =
        !this.request_status ||
        data.request_status === this.request_status;

      return searchMatch && modeMatch && statusMatch;
    };

    // Any value change triggers MatTableDataSource filtering
    this.dataSource.filter =
      this.searchValue +
      this.request_mode +
      this.request_status;
  }


  public addRecord() {
    const dialogRef = this.dialog.open(AddRequestInspectionReportComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: { "carshowroom_id": this.carshowroom_id, isrelated_module: this.isrelated_module,  }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getRequestInspectionReportDetails();
      }
    });
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  inActiveRecord(ele: any) {
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    Swal.fire({
      title: 'Are You Sure You Want to InActive This Request Inspection Report?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.requestInspectionReportService.inActiveInspectionReportRequest(ele.request_id, obj[0]?.login_id).pipe()
          .subscribe((data: any) => {
            this.success(data.message)
            this.getRequestInspectionReportDetails();
          })
      }
    })


  }


  public editRecord(element) {
    element.isrelated_module = true;
    element.isEditMode = true
    const dialogRef = this.dialog.open(AddRequestInspectionReportComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: element
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getRequestInspectionReportDetails();
      }
    });
  }

  public viewRecord(element) {
    element.isrelated_module = true;
    element.isViewMode = true
    const dialogRef = this.dialog.open(AddRequestInspectionReportComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: element
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getRequestInspectionReportDetails();
      }
    });
  }


getActionInfoTooltip(element: any): string {
  const name = element?.actioned_by_name || 'N/A';
  const date = element?.actioned_at
    ? moment(element.actioned_at).format('DD-MMM-YYYY hh:mm:ss A')
    : 'N/A';

  if (element?.request_status === 'APPROVED') {
    return `Approved by: ${name}\nApproved Date: ${date}`;
  }
  if (element?.request_status === 'REJECTED') {
    return `Rejected by: ${name}\nRejected Date: ${date}`;
  }
  return '';
}


  ngOnDestroy() {

  }

  clearSearch() {
    this.searchValue = '';
    this.request_mode = '';
    this.request_status = '';
    this.dataSource.filter = '';
  }

}
