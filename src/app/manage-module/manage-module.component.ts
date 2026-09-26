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
import { AddManageModuleComponent } from "./add-manage-module/add-manage-module.component";
import { EditManageModuleComponent } from "./edit-manage-module/edit-manage-module.component";
import { ManageModuleService } from "../service/manage-module/manage-module.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";

@Component({
  selector: 'app-manage-module',
  templateUrl: './manage-module.component.html',
  styleUrls: ['./manage-module.component.css']
})
export class ManageModuleComponent implements OnInit {
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  appVersionListList: any;
  dynamicTableData!: any[];
  userPrivilegeObj: any;

  constructor(public toastr: ToastrService,private router: Router, private customerService:CustomerService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog,private manageModuleService:ManageModuleService) { 
      this.getCurrentUserPrivilege()
    }

  public displayedColumns: string[] = ['actions','modulename','routename','parentmodulename','isparent','isreport','issystemmenu','status', 'created_by', 'created_at', 'modified_by', 'modified_at', ];



  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
    this.getAllModels();
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.Module)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }

  getAllModels() {
    this.loading = true;
    this.manageModuleService.getAllListModule("false").pipe()
      .subscribe((data: any) => {
        console.log("getModule", data);
        this.appVersionListList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  loadRecord() {debugger
    this.dynamicTableData = [];
    this.appVersionListList.forEach((element: any) => {
      let row = {
        module_id:element.module_id,
        modulename:element.modulename,
        routename:element.routename,
        isparent:element.isparent,
        parentmodid:element.parentmodid,
        parentmodulename:element.parentmodulename ? element.parentmodulename:"",
        issystemmenu:element.issystemmenu,
        isreport:element.isreport && element.isreport.toString(),
        status: element && element.status == 1 ? "Active" : "InActive",
        created_by:  element && element.createdbyname ?element.createdbyname :"" ,
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        modified_by:  element && element.updatedbyname ?element.updatedbyname :"" ,
        modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        ismisc:element.ismisc,
        app:element.app || null,
        privilegekey:element.privilegekey || null
      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
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
    const dialogRef = this.dialog.open(AddManageModuleComponent, {
      width: '900px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllModels();
      }
    });
  }

  public editRecord(items: any) {
    console.log("this.dynamicTableData",this.dynamicTableData);
    
    debugger
    const dialogRef = this.dialog.open(EditManageModuleComponent, {
     width: '900px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllModels();
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

}


