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
import { AdvanceService } from "./advance.service";
import { AddAdvancePaymentComponent } from "./add-advance-payment/add-advance-payment.component";
import { EditAdvancePaymentComponent } from "./edit-advance-payment/edit-advance-payment.component";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList, RoleIdList } from "src/app/common/enum";
import { DataService } from "src/app/service/encryption/data.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
const moment = require('moment');

@Component({
  selector: 'app-advance-payment',
  templateUrl: './advance-payment.component.html',
  styleUrls: ['./advance-payment.component.css']
})
export class AdvancePaymentComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  advanceList: any;
  public addEditForm!: FormGroup;
  currentuser: any;
  carshowroom_id: any;
  showroomname: any;
  brandname: any;
  modelname: any;
  carshowroomrefno: any;
  soldstatus: any;
  status: any;
  carprice: any;
  role_id: any;
  editmenu: boolean = true;
  storage_data_id: any;
  privilege: any;
  privilegesMap = {
    addInactive: false,
    editInactive: false,
    deleteInactive: false,
    allowSignLink: false,
    allowSendEmail: false,
  };
  isrelated_module: boolean = false;
  userPrivilegeObj: any;
  constructor(public advanceService: AdvanceService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private customerService: CustomerService,
    private cookieService: CookieService, private dataService: DataService,
    public dialog: MatDialog, private manageModuleService: ManageModuleService,) {
    this.loading = true;
    this.storage_data_id = this.dataService.getData('storage_data_id');
    if (this.storage_data_id) {
      this.isrelated_module = true;
      this.getRecord(this.storage_data_id);
    } else {
      this.displayedColumns = ['actions', 'carshowroomrefno', 'advancerefno', 'accountname', 'modeofpayment', 'duedate', 'advanceamount', 'advancedoc', 'status', 'narrationnote', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];
      this.getCurrentUserPrivilege();
    
      this.getadvancedetails();
    }
  }

  public displayedColumns: string[] = ['actions', 'advancerefno', 'accountname', 'modeofpayment', 'duedate', 'advanceamount', 'advancedoc', 'status', 'narrationnote', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];

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
        this.soldstatus = response?.data['soldstatus'];
        this.status = response?.data['status']
        this.carprice = response?.data['carprice'];



        this.addEditForm = this.fb.group({
          carshowroomrefno: [''],
          showroomname: [''],
          brandname: [''],
          modelname: [''],
          totalamount: [''],
          description: [''],
          status: ['1'],
        });
        this.getadvancedetails();
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
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.AdvanceMainMenu)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

  this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;
      this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.AdvanceMainMenu, this.role_id).subscribe((Result2: any) => {
        console.log("Privilege Result2", );
        console.log("Privilege Result2", Result2);
        const miscPrivileges = Result2.miscPrivileges || [];

          this.privilegesMap = {//ADVANCE_INACTIVE_BUTTON
            addInactive: true,
            editInactive: true,
            deleteInactive: miscPrivileges.some(p => p.misc_name === 'ADVANCE_INACTIVE_BUTTON' && p.access && p.mapping_field_status),
            allowSignLink: true,
            allowSendEmail: true,
          };
      })

  }

  async ngOnInit() {

  }
  getSubPrivilege() {
    debugger;
    this.loading = true;
    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;

    if (!this.carshowroom_id) {
      this.displayedColumns = ['actions', 'carshowroomrefno', 'advancerefno', 'accountname', 'modeofpayment', 'duedate', 'advanceamount', 'advancedoc', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];

      this.getCurrentUserPrivilege();
      this.privilegesMap = {
        addInactive: true,
        editInactive: true,
        deleteInactive: true,
        allowSignLink: true,
        allowSendEmail: true,
      };
    } else {
      this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ShowroomCars, this.role_id).subscribe((Result2: any) => {
        console.log("Privilege Result2", Result2);
        console.log("Privilege Result2", this.status);

        this.privilege = Result2.data.find(
          ele => ele.child_module_id === ModuleIdList.Advance
        );
        const miscPrivileges = Result2.miscPrivileges || [];
        if (this.status === "InActive") {


          this.privilegesMap = {
            addInactive: miscPrivileges.some(p => p.misc_name === 'ADVANCE_ADD_INACTIVE' && p.access && p.mapping_field_status),
            editInactive: miscPrivileges.some(p => p.misc_name === 'ADVANCE_EDIT_INACTIVE' && p.access && p.mapping_field_status),
            deleteInactive: miscPrivileges.some(p => p.misc_name === 'ADVANCE_INACTIVE_BUTTON' && p.access && p.mapping_field_status),
            allowSignLink: miscPrivileges.some(p => p.misc_name === 'ADVANCE_ALLOW_SIGN_LINK' && p.access && p.mapping_field_status),
            allowSendEmail: miscPrivileges.some(p => p.misc_name === 'ADVANCE_ALLOW_SEND_EMAIL' && p.access && p.mapping_field_status),
          };

        } else {
          this.privilegesMap = {//ADVANCE_INACTIVE_BUTTON
            addInactive: true,
            editInactive: true,
            deleteInactive: miscPrivileges.some(p => p.misc_name === 'ADVANCE_INACTIVE_BUTTON' && p.access && p.mapping_field_status),
            allowSignLink: true,
            allowSendEmail: true,
          };
          this.privilege = Result2.data.find(
            ele => ele.child_module_id === ModuleIdList.Advance
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

  getadvancedetails() {
    this.loading = true;
    this.advanceService.getAdvance(this.carshowroom_id).pipe()
      .subscribe((data: any) => {
        console.log("getadvancedetails ", data);
        this.advanceList = data;
        this.loadRecord();
      });
  }

  calculateTotalExpenseValue(expenses: any[]): string {
    let totalExpenseValue = 0;
    for (const expense of expenses) {
      totalExpenseValue += parseFloat(expense.advanceamount);
    }
    return totalExpenseValue.toFixed(2);
  }

  goback() {
    this.dataService.clearAllData(); history.back();
  }

  loadRecord() {

    var dynamicTableData: any = [];
    this.advanceList && this.advanceList.forEach((element: any) => {
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
    if (this.carshowroom_id) {
      let arr = this.advanceList && this.advanceList.filter((ele: any) => ele.status == 1)
      this.addEditForm.patchValue({
        totalamount: this.calculateTotalExpenseValue(arr),
      });
    }

    this.loading = false;
  }

  isPDF(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

  isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];
    const lowerCaseFileName = fileName.toLowerCase();

    return imageExtensions.some(ext => lowerCaseFileName.endsWith(ext));
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddAdvancePaymentComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: { "carshowroom_id": this.carshowroom_id, isrelated_module: this.isrelated_module }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getadvancedetails();
      }
    });
  }


  editRecord(items: any) {
    items.isrelated_module = this.isrelated_module
    const dialogRef = this.dialog.open(EditAdvancePaymentComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getadvancedetails();
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

    Swal.fire({
      title: 'Are You Sure You Want to InActive This Advance Payment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.advanceService.advanceUpdateStatusToInactive(ele.advanceid).pipe()
          .subscribe((data: any) => {
            this.success(data.message)
            this.getadvancedetails();
          })
      }
    })


  }


  deleteRecord(element: any) {
    Swal.fire({
      title: 'Are You Sure You Want to Delete This Advance Payment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
         await this.advanceService.deleteAdvancerecords(element).pipe()
          .subscribe((data: any) => {
            this.getadvancedetails();
          })
      }
    })
  }


  public async downloadPdf(ele: any) {
    let obj = {
      key: "app_advancedettb",
      value: { advanceid: ele.advanceid, carprice: this.carprice },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('pdf_storage_data_id', response.storage_data_id);
        this.router.navigate(['advance-receipt']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  ngOnDestroy() {

  }

  copyToClipboard(url: string) {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Copied to clipboard", icon: 'success', });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  }

}


