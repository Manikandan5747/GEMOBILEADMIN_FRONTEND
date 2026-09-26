import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { EditExpenseComponent } from "./edit-expense/edit-expense.component";
import { AddExpenseComponent } from "./add-expense/add-expense.component";
import { ExpenseTypeService } from "./expense-type.service";
import { ModuleIdList } from "src/app/common/enum";
import { CustomerService } from "src/app/service/customer/customer.service";

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.css']
})
export class ExpenseTypeComponent implements OnInit {

  loading: boolean = false;
  search: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  list: any = [];
  dynamicTableData!: any[];
  userPrivilegeObj: any;
  constructor(private expenseTypeService: ExpenseTypeService, private router: Router,
    private route: ActivatedRoute, private customerService: CustomerService, public dialog: MatDialog) {
    this.getCurrentUserPrivilege();
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.ExpenseType)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  public displayedColumns: string[] = ['actions', 'expensetype', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    debugger
    this.getExpensetype();
  }

  getExpensetype() {
    this.loading = true;
    this.expenseTypeService.getExpensetype().pipe()
      .subscribe((data: any) => {
        console.log("getExpensetype", data);
        this.list = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.list);
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
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getExpensetype();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditExpenseComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getExpensetype();
      }
    });
  }

}


