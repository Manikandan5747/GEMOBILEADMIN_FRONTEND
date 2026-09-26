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
import { AddMobileVersionComponent } from "./add-mobile-version/add-mobile-version.component";
import { EditMobileVersionComponent } from "./edit-mobile-version/edit-mobile-version.component";
import { MobileVersionService } from "src/app/service/mobile-version/mobile-version.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";

@Component({
  selector: 'app-mobile-version',
  templateUrl: './mobile-version.component.html',
  styleUrls: ['./mobile-version.component.css']
})
export class MobileVersionComponent implements OnInit {
  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_ONLYFORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  appVersionListList: any;
  dynamicTableData!: any[];
  userPrivilegeObj: any;

  constructor(private customerService:CustomerService,public toastr: ToastrService, private mobileVersionService: MobileVersionService,private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) {  this.getCurrentUserPrivilege()
    }

  public displayedColumns: string[] = ['actions','apptype','appcategory','appversion','appurlapi','versioncreated_at','appstate','status', 'created_by', 'created_at', 'modified_by', 'modified_at', ];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
    this.getAllModels();
  }

  getAllModels() {
    this.loading = true;
    this.mobileVersionService.getAppVersion().pipe()
      .subscribe((data: any) => {
        console.log("getAppVersion", data);
        this.appVersionListList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  loadRecord() {
    this.dynamicTableData = [];
    this.appVersionListList.forEach((element: any) => {
      let row = {
        appid:element.appid,appstate:element.appstate,
        apptype:element.apptype,
        appcategory:element.appcategory,
        appversion:element.appversion,
        appurlapi:element.appurlapi,
        versioncreated_at:element.versioncreated_at,
        status: element && element.status == 1 ? "Active" : "InActive",
        created_by:  element && element.createdbyname ?element.createdbyname :"" ,
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        
        modified_by:  element && element.updatedbyname ?element.updatedbyname :"" ,
        modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
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

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.AppVersion)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }


  iscategoryChange(event: any) {
    const filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddMobileVersionComponent, {
      width: '850px',
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
    debugger
    const dialogRef = this.dialog.open(EditMobileVersionComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data: {
        appid:items.appid,
        apptype:items.apptype,
        appcategory:items.appcategory,
        appversion:items.appversion,
        appurlapi:items.appurlapi,
        versioncreated_at:items.versioncreated_at,
        status: items.status,created_at:items.created_at,
        appstate: items.appstate,
      }
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


  clearSearch(){
    this.search ="";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  deleteRecord(element:any){
    Swal.fire({
      title: 'Are You Sure You Want to Delete This App Category?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
       await this.mobileVersionService.deleteAppCategory(element).pipe()
        .subscribe((data: any) => {
          this.getAllModels();
        })
      }
    })
  }

}


