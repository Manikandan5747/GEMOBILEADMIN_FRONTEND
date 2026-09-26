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
import { AddSettingComponent } from "./add-setting/add-setting.component";
import { EditSettingComponent } from "./edit-setting/edit-setting.component";
import { SettingService } from "../service/setting/setting.service";
import { CustomerService } from "src/app/service/customer/customer.service";
  import { ModuleIdList } from "src/app/common/enum";
import { CarDetailsService } from "../service/car-details/car-details.service";
import { CommonConstants } from "../common/common.constant";
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  userPrivilegeObj: any;
url:any=CommonConstants.WEBAPI_URL +"/";
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  appSettingList: any;
  dynamicTableData!: any[];
  currentUser: any;
  userrole: any;
  constructor(private carDetailsService: CarDetailsService,private customerService:CustomerService,public toastr: ToastrService, private settingService: SettingService,private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) {
      this.getCurrentUserPrivilege()
     }

  public displayedColumns: string[] = ['actions','appsetcategory','appsetparameter','appsetparametervalue','image','status', 'created_by', 'created_at', 'modified_by', 'modified_at', ];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.userrole = obj[0]?.userrole;
    this.toastr.clear();
    this.getAllSetting();
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.Settings)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }

  getAllSetting() {
    // this.loading = true;
    this.settingService.getSetting(this.userrole).pipe()
      .subscribe((data: any) => {
        console.log("getAllSetting", data);
        this.appSettingList = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.appSettingList);
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
    const dialogRef = this.dialog.open(AddSettingComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllSetting();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditSettingComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data: {
        appsettingid:items.appsettingid,
        appsetcategory :items.appsetcategory,  
        appsetparameter :items.appsetparameter,
        appsetparametervalue  :items.appsetparametervalue,
        settingdate_at :items.settingdate_at,
        settingexpirydate_at :items.settingexpirydate_at,
        status :items.status,  userrole:this.userrole,
        image:items.image
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllSetting();
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

  issolddate3days() {
		this.carDetailsService.issolddate3days().pipe()
			.subscribe((data: any) => {
				var inActiveCount = data && data.data.length;
				Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: inActiveCount + " Cars - InActive", icon: 'success', });
			});
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


