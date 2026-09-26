import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { ExpenseTypeService } from "src/app/ge-motors/expense-type/expense-type.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AddExpenseComponent } from "../add-expense/add-expense.component";
import { EditExpenseComponent } from "../edit-expense/edit-expense.component";
import * as moment from "moment";
import { ModuleIdList, RoleIdList } from "src/app/common/enum";
import { DataService } from "src/app/service/encryption/data.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { CustomerService } from "src/app/service/customer/customer.service";

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css']
})
export class ExpenseDetailComponent implements OnInit, OnDestroy {
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  expenseList: any;
  carshowroom_id: any;
  showroomname: any;
  brandname: any;
  modelname: any;
  carshowroomrefno: any;
  public addEditForm!: FormGroup;
  soldstatus: any;
  status: any;

  role_id: any;
  editmenu: boolean = true;
  currentuser: any;
  storage_data_id: any;
  privilege: any;
  privilegesMap = {
    addInactive: false,
    editInactive: false,
    deleteInactive: false,

  };
  userPrivilegeObj: any;
  isrelated_module: boolean = false;
  constructor(public expenseTypeService: ExpenseTypeService, private fb: FormBuilder, private dataService: DataService, private router: Router, private customerService: CustomerService,
    private cookieService: CookieService, public dialog: MatDialog,
    private manageModuleService: ManageModuleService,) {
    this.loading = true;
    this.storage_data_id = this.dataService.getData('storage_data_id');
    if (this.storage_data_id) {
      this.getRecord(this.storage_data_id);
      this.isrelated_module = true;
    } else {
      this.displayedColumns = ['actions', 'carshowroomrefno', 'expenserefno', 'expensetype', 'expensedate', 'expensevalue', 'expensedoc', 'status', 'remark', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];
      this.getCurrentUserPrivilege();

      this.getExpensedetails();
    }
  }

  public displayedColumns: string[] = ['actions', 'expenserefno', 'expensetype', 'expensedate', 'expensevalue', 'expensedoc', 'status', 'remark', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];
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
        this.status = response?.data['status'];


        this.addEditForm = this.fb.group({
          carshowroomrefno: [''],
          showroomname: [''],
          brandname: [''],
          modelname: [''],
          totalamount: [''],
          description: [''],
          status: ['1'],
        });
        this.getExpensedetails();
        this.fillForm(); this.getSubPrivilege();
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }


  async getCurrentUserPrivilege() {
    debugger
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.ExpenseMainMenu)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);




    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;
    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ExpenseMainMenu, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2",);
      console.log("Privilege Result2", Result2);
      const miscPrivileges = Result2.miscPrivileges || [];


      this.privilegesMap = {
        addInactive: true,
        editInactive: true,
        deleteInactive: miscPrivileges.some(p => p.misc_name === 'EXPENSE_INACTIVE_BUTTON' && p.access && p.mapping_field_status),
      };


    })

  }

  ngOnInit() { }

  getSubPrivilege() {


    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;

    if (!this.carshowroom_id) {
      this.displayedColumns = ['actions', 'carshowroomrefno', 'expenserefno', 'expensetype', 'expensedate', 'expensevalue', 'expensedoc', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];

      this.getCurrentUserPrivilege();
      this.privilegesMap = {
        addInactive: true,
        editInactive: true,
        deleteInactive: true,
      };
    } else {
      this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ShowroomCars, this.role_id).subscribe((Result2: any) => {
        console.log("Privilege Result2", Result2);
  this.privilege = Result2.data.find(
            ele => ele.child_module_id === ModuleIdList.Expense
          );
          const miscPrivileges = Result2.miscPrivileges || [];
        if (this.status === "InActive") {
        

          this.privilegesMap = {
            addInactive: miscPrivileges.some(p => p.misc_name === 'EXPENSE_ADD_INACTIVE' && p.access && p.mapping_field_status),
            editInactive: miscPrivileges.some(p => p.misc_name === 'EXPENSE_EDIT_INACTIVE' && p.access && p.mapping_field_status),
            deleteInactive: miscPrivileges.some(p => p.misc_name === 'EXPENSE_INACTIVE_BUTTON' && p.access && p.mapping_field_status),

          };

        } else {
          this.privilegesMap = {
            addInactive: true,
            editInactive: true,
            deleteInactive: miscPrivileges.some(p => p.misc_name === 'EXPENSE_INACTIVE_BUTTON' && p.access && p.mapping_field_status),

          };
          this.privilege = Result2.data.find(
            ele => ele.child_module_id === ModuleIdList.Expense
          );
        }
        console.log("Privilege  this.privilege", this.privilege);
      });
    }

  }

  private async fillForm() {
    this.addEditForm.patchValue({
      carshowroomrefno: this.carshowroomrefno,
      showroomname: this.showroomname,
      brandname: this.brandname,
      modelname: this.modelname,
      totalamount: '',
      // description: parsedData.description,
      // status: parsedData.status && parsedData.status.toString(),
    });
  }

  getExpensedetails() {
    this.loading = true;
    this.expenseTypeService.getExpensedetails(this.carshowroom_id).pipe()
      .subscribe((data: any) => {
        console.log("getExpensedetails ", data);
        this.expenseList = data;
        this.loadRecord();
      });
  }

  calculateTotalExpenseValue(expenses: any[]): string {
    let totalExpenseValue = 0;
    for (const expense of expenses) {
      totalExpenseValue += parseFloat(expense.expensevalue);
    }
    return totalExpenseValue.toFixed(2);
  }


  loadRecord() {
    var dynamicTableData: any = [];
    this.expenseList && this.expenseList.forEach((element: any) => {
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
      this.expenseList = this.expenseList.filter((ele: any) => ele.status == 1)
      this.addEditForm.patchValue({
        totalamount: this.calculateTotalExpenseValue(this.expenseList),
      });
    }


    this.loading = false;
  }

  goback() {
    this.dataService.clearAllData();
    var link = "car-details";
    this.router.navigate([link]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: { "carshowroom_id": this.carshowroom_id, isrelated_module: this.isrelated_module }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getExpensedetails();
      }
    });
  }


  editRecord(items: any) {
    items.isrelated_module = this.isrelated_module;
    const dialogRef = this.dialog.open(EditExpenseComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getExpensedetails();
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

  deleteRecord(ele: any) {
    Swal.fire({
      title: 'Are You Sure You Want to Delete This Expense?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.expenseTypeService.deleteExpenseById(ele.expenseid).pipe()
          .subscribe((data: any) => {
            this.success(data.message)
            this.getExpensedetails();
          })
      }
    })


  }

  isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];
    const lowerCaseFileName = fileName.toLowerCase();

    return imageExtensions.some(ext => lowerCaseFileName.endsWith(ext));
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

  inActiveRecord(ele: any) {

    Swal.fire({
      title: 'Are You Sure You Want to InActive This Expense?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.expenseTypeService.expenseupdateStatusToInactive(ele.expenseid).pipe()
          .subscribe((data: any) => {
            this.success(data.message)
            this.getExpensedetails();
          })
      }
    })


  }

}


