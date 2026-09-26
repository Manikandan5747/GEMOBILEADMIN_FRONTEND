import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
const moment = require('moment');
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { AddUserRoleComponent } from "./add-user-role/add-user-role.component";
import { EditUserRoleComponent } from "./edit-user-role/edit-user-role.component";
import { UserRoleService } from "../service/user-role/user-role.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  userPrivilegeObj: any;
  search:any;
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  userRoleList: any;
  dynamicTableData!: any[];

  constructor( private customerService:CustomerService,public toastr: ToastrService, private router: Router,private userRoleService:UserRoleService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) { 
      this.getCurrentUserPrivilege()
    }

  public displayedColumns: string[] = ['actions','rolename','ipAddress','status', 'created_by', 'created_at', 'modified_by', 'modified_at', ];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    
    this.toastr.clear();
    this.getAllUserModel();
  }
  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.UserRole)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }


  getAllUserModel() {
    this.loading = true;
    this.userRoleService.getUserRole().pipe()
      .subscribe((data: any) => {
        console.log("getUserRole", data);
        this.userRoleList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  loadRecord() {
      this.dataSource = new MatTableDataSource(this.userRoleList);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddUserRoleComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllUserModel();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditUserRoleComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllUserModel();
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

  goImportPage() {
		var navigationExtras = {
			queryParams: { isModelPage: "true" },
		};
    this.router.navigate(['/brand/import-brand'], navigationExtras);
	}

  gotoUserPrivilege(items:any) {
		var navigationExtras = {
			queryParams: {role_id:items.role_id,rolename:items.rolename},
		};
    this.router.navigate(['/user-privilege'], navigationExtras);
	}

}



  