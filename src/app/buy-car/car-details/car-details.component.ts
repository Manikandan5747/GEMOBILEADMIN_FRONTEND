import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { CarDetailsService } from "src/app/service/car-details/car-details.service";
import { ViewCarImgComponent } from "./view-car-img/view-car-img.component";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList, RoleIdList } from "src/app/common/enum";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BrandService } from "src/app/service/brand/brand.service";
import { ModelService } from "src/app/service/model/model.service";
import { OnDestroy } from '@angular/core';
import { Observable, Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from "src/app/service/encryption/data.service";
import { SalesOrderService } from "src/app/ge-motors/sales-order/sales-order.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { ErrorlogService } from "src/app/errorlog.service";

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {

  subscription!: Subscription;
  everyFiveSecond: Observable<number> = timer(2 * 60 * 1000);
  private ngUnsubscribe = new Subject();
  role_id: any;
  menu: boolean = true;
  filterStatus: any;
  filterSold: any;
  userPrivilegeObj: any;
  brandlist: any = [];
  search: any = "";
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = "50";
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  carList: any;
  dynamicTableData!: any[];
  CREATE_EDIT_CAR = "car-details/add-edit-car";
  homePageRedirection: any;
  currentUser: any;
  filterForm!: FormGroup;
  modelList: any;
  totalItemCount: any;
  private debounceTimer: any;
  isSettingUser: boolean = false;
  settings: any;
  isSettingUser_advance: boolean = false;
  isSettingUser_expense: boolean = false;
  isSettingUser_consign: boolean = false;
  privilege: any;
  create_access_consignment: any = false;
  create_access_expense: any = false;
  create_access_advance: any = false;
  create_access_purchase: any = false;
  create_request_inspection_report: any = false;
  divhasAccess: boolean = false;

  constructor(public modelService: ModelService, public brandService: BrandService, public toastr: ToastrService, private dataService: DataService, private customerService: CustomerService, private router: Router, private carDetailsService: CarDetailsService, private changeDetectorRef: ChangeDetectorRef, private manageModuleService: ManageModuleService,
    private fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog, public salesOrderService: SalesOrderService, private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege();
    this.route.queryParams.subscribe(params => {
      this.homePageRedirection = params['homePageRedirection'];
    });

  }

  displayedColumns = ['actions', 'carshowroomrefno', 'carownertypecode', 'brandname', 'modelname', 'img', 'carvideopath', 'modelyear', 'mileage', 'noofcylinder', 'viewcount', 'chasisno', 'status', 'soldstatus', 'created_by', 'created_at', 'modified_by', 'modified_at', 'submenu',];

  dataSource!: MatTableDataSource<any>;

  getAllBrand() {
    this.loading = true;
    this.brandService.getBrand().pipe()
      .subscribe((data: any) => {
        console.log("getBrand ", data);
        this.brandlist = data;
      });
  }


  getAllModels() {
    this.loading = true;
    this.modelService.getCarModel().pipe()
      .subscribe((data: any) => {
        console.log("getCarModel", data);
        this.modelList = data;
        this.loadRecord();
      });
  }

  ngAfterViewInit() {
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.role_id = obj[0] && obj[0].role_id;


    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ShowroomCars, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);

      this.privilege = Result2.data.filter(ele => ele.child_module_id == ModuleIdList.Consignment);

      let expensePrivilege = Result2.data.filter(ele => ele.child_module_id == ModuleIdList.Expense);

      let advancePrivilege = Result2.data.filter(ele => ele.child_module_id == ModuleIdList.Advance);

      let purchasePrivilege = Result2.data.filter(ele => ele.child_module_id == ModuleIdList.PurchaseAgreement);

      let requestInspectionReportPrivilege = Result2.data.filter(ele => ele.child_module_id == ModuleIdList.RequestInspectionReport);

      console.log("Privilege  this.Expense", this.privilege);

      this.create_access_consignment = this.privilege.some(p => p.create_access === true || p.edit_access === true);
      this.create_access_expense = expensePrivilege.some(p => p.create_access === true || p.edit_access === true);
      this.create_access_advance = advancePrivilege.some(p => p.create_access === true || p.edit_access === true);
      this.create_access_purchase = purchasePrivilege.some(p => p.create_access === true || p.edit_access || p.printaccess === true);

      this.create_request_inspection_report = requestInspectionReportPrivilege.some(p => p.view_access === true || p.create_access === true || p.edit_access || p.printaccess === true);


      // Check if user has at least one submenu privilege
      const hasRelatedccess = this.create_access_expense
        || this.create_access_consignment || this.create_access_advance || this.create_access_purchase;
      if (!hasRelatedccess) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'submenu');
      }

      const miscPrivileges = Result2.miscPrivileges || [];
      this.divhasAccess = miscPrivileges.some(p => p.misc_name === 'SHOWROOM_CAR_DETAILS_DIV' && p.access && p.mapping_field_status)
    });

    setTimeout(() => {
      if ((obj[0] && obj[0].role_id == 1)) {
        this.displayedColumns = ['actions', 'carshowroomrefno', 'carownertypecode', 'brandname', 'modelname', 'img', 'carvideopath', 'modelyear', 'mileage', 'noofcylinder', 'status', 'soldstatus', 'solddate', 'viewcount', 'chasisno', 'created_by', 'created_at', 'modified_by', 'modified_at', 'submenu',];
      }

      if ((obj[0] && obj[0].role_id == RoleIdList.ShowroomSalesman) || (obj[0] && obj[0].role_id == RoleIdList.ShowroomSupervisor)) {
        this.displayedColumns = ['actions', 'carshowroomrefno', 'carownertypecode', 'brandname', 'modelname', 'img', 'carvideopath', 'modelyear', 'mileage', 'chasisno', 'status', 'soldstatus', 'solddate', 'created_by', 'submenu',];
      }
    }, 100)

    this.getAllBrand();
    this.getAllModels();
  }

  // async isCurrentUserAdministrator() {
  //   this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  //   const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
  //   this.settings = await this.salesOrderService.findSettingsappsetcategory('PURCHASEAGREEMENT').toPromise();

  //   let settings_advance = await this.salesOrderService.findSettingsappsetcategory('ADVANCE').toPromise();
  //   let settings_expense = await this.salesOrderService.findSettingsappsetcategory('EXPENSE').toPromise();
  //   let settings_consig = await this.salesOrderService.findSettingsappsetcategory('CONSIGNMENT').toPromise();

  //   let currentUserRole = obj && obj[0] && obj[0].userrole;
  //   try {
  //     const settings = await this.settings;
  //     this.isSettingUser = settings.some((setting: any) =>
  //       setting.appsetparameter === currentUserRole && setting.status === 1
  //     );

  //     this.isSettingUser_advance = settings_advance.some((setting: any) =>
  //       setting.appsetparameter === currentUserRole && setting.status === 1
  //     );

  //     this.isSettingUser_expense = settings_expense.some((setting: any) =>
  //       setting.appsetparameter === currentUserRole && setting.status === 1
  //     );

  //     this.isSettingUser_consign = settings_consig.some((setting: any) =>
  //       setting.appsetparameter === currentUserRole && setting.status === 1
  //     );
  //   } catch (error) {
  //     console.error("Error fetching settings:", error);
  //     this.isSettingUser = false;
  //     this.isSettingUser_advance = false;
  //     this.isSettingUser_expense = false;
  //     this.isSettingUser_consign = false;
  //   }
  //   // alert(this.isSettingUser)
  // }

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

    //Filter form group
    this.filterForm = this.fb.group({
      modelid: [''],
      brandid: [''],
      status: [''],
    });

    this.toastr.clear();
    this.getAllCarDetails();
    this.everyTwoMins();
    // this.isCurrentUserAdministrator();
  }


  ngOnDestroy() {
    // Unsubscribe from the observable
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Every 2 mins, this script will run
  everyTwoMins() {
    this.subscription = this.everyFiveSecond.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.getAllCarDetails();
      this.paginator.pageSize = parseInt(this.PAGE_SIZE);
    });
  }


  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.ShowroomCars)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }


  onPageChange(event) {
    debugger
    // Perform actions when pagination changes
    console.log('Pagination event:', event);
    // For example, you can fetch data from backend based on new page index
    // this.getData(event.pageIndex, event.pageSize);
    this.loading = true;
    var obj: any = {
      "search": this.search,
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize
    }

    // Add status conditionally
    if (this.filterStatus != "None" && this.filterStatus != undefined) {
      obj.status = this.filterStatus == "Open" ? 1 : 0;
    } else {
      this.filterStatus = "None";
    }

    // Add soldstatus conditionally
    if (this.filterSold != "None" && this.filterSold != undefined) {
      obj.soldstatus = this.filterSold == "Sold" ? 1 : 2;
    } else {
      this.filterSold = "None";
    }


    this.carDetailsService.getCarDetailswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.carList = data.data;
        this.totalItemCount = data.total_count;
        // this.totalItemCount = data.total_count;
        // this.PAGINATION_RANGE = this.PAGINATION_RANGE;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }

  getAllCarDetails() {
    var search: any = localStorage.getItem('search');
    var filterStatus: any = localStorage.getItem('filterStatus');
    var filterSold: any = localStorage.getItem('filterSold');

    this.search = JSON.parse(search);
    this.filterStatus = JSON.parse(filterStatus);
    this.filterSold = JSON.parse(filterSold);

    this.loading = true;
    var obj: any = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }

    // Add status conditionally
    if (this.filterStatus != "None" && this.filterStatus != undefined) {
      obj.status = this.filterStatus == "Open" ? 1 : 0;
    } else {
      this.filterStatus = "None";
    }

    // Add soldstatus conditionally
    if (this.filterSold != "None" && this.filterSold != undefined) {
      obj.soldstatus = this.filterSold == "Sold" ? 1 : 2;
    } else {
      this.filterSold = "None";
    }


    this.carDetailsService.getCarDetailswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.carList = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  selectionFilterChange(event: any, key: string) {
    const filterValue = event.value;
    var search: any = localStorage.getItem('search');
    this.search = JSON.parse(search);
    this.loading = true;

    let obj: any = {};

    // Add status conditionally
    if (this.filterStatus != "None" && this.filterStatus != undefined) {
      obj.status = this.filterStatus == "Open" ? 1 : 0;
      localStorage.setItem('filterStatus', JSON.stringify(this.filterStatus));
    } else {
      this.filterStatus = "None";
    }

    // Add soldstatus conditionally
    if (this.filterSold != "None" && this.filterSold != undefined) {
      obj.soldstatus = this.filterSold == "Sold" ? 1 : 2;
      localStorage.setItem('filterSold', JSON.stringify(this.filterSold));
    } else {
      this.filterSold = "None";
    }

    if (this.search) {
      localStorage.setItem('search', JSON.stringify(this.search));
    }

    // Add search, page, and pageSize
    obj.search = this.search == null ? '' : this.search;
    obj.page = 1;
    obj.pageSize = this.PAGE_SIZE;

    console.log("obj", obj);




    this.carDetailsService.getCarDetailswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.carList = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      }, error => {
        this.error = error;
      });

  }

  // loadRecord() {
  //   this.dynamicTableData = [];
  //   this.carList && this.carList.forEach((element: any) => {
  //     let row = {
  //       advance_active_count: element.advance_active_count || '0',
  //       expense_active_count: element.expense_active_count || '0',
  //       consignment_active_count: element.consignment_active_count || '0',
  //       request_active_count: element.request_active_count || '0',
  //       viewcount: element.viewcount || '0',
  //       carshowroomname: element.carshowroomname,
  //       isapprovedstatus: element.isapprovedstatus,
  //       carvideopath: element.carvideopath,
  //       showroomname: element.showroomname,
  //       carimgpath: element.carimgpath,
  //       holdingperiod: element.holdingperiod,
  //       docuploadpath: element && element.reportpath ? element.reportpath : "-",
  //       carshowroom_id: element.carshowroom_id,
  //       brandname: element.brandname,
  //       modelname: element.modelname,
  //       carownertype: element.carownertype,
  //       carownertypecode: element.carownertypecode,
  //       carowner: element.carowner,
  //       carprice: element.carprice,
  //       chasisno: element.chasisno,
  //       modelyear: element.modelyear,
  //       carshowroomrefno: element.carshowroomrefno,
  //       enginecapacity: element.enginecapacity,
  //       mileage: element.mileage,
  //       cityname: element.carcityname,
  //       drivetype: element.drivetype,
  //       noofcylinder: element.noofcylinder,
  //       noofseats: element.noofseats, carownertypeid: element.carownertypeid,
  //       purchasedetails: element.purchasedetails,
  //       soldstatus: element && element.soldstatus == 1 ? "Sold" : "Available",
  //       status: element && element.status == 1 ? "Open" : "InActive",
  //       created_by: element && element.createdbyname ? element.createdbyname : "", cardetailsurl: element.cardetailsurl,
  //       created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //       modified_by: element && element.updatedbyname ? element.updatedbyname : "", modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //       solddate: element.solddate ? moment(element.solddate).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //       showmobileappdate: element.showmobileappdate ? moment(element.showmobileappdate).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //     }
  //     this.dynamicTableData.push(row);
  //   })
  //   this.dataSource = new MatTableDataSource(this.dynamicTableData);


  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 2000);
  // }

  loadRecord() {
  this.dynamicTableData = (this.carList || []).map((element: any) => ({
    advance_active_count: element.advance_active_count || '0',
    expense_active_count: element.expense_active_count || '0',
    consignment_active_count: element.consignment_active_count || '0',
    request_active_count: element.request_active_count || '0',
    viewcount: element.viewcount || '0',
    carshowroomname: element.carshowroomname,
    isapprovedstatus: element.isapprovedstatus,
    carvideopath: element.carvideopath,
    showroomname: element.showroomname,
    carimgpath: element.carimgpath,
    holdingperiod: element.holdingperiod,
    docuploadpath: element.reportpath ?? '-',
    carshowroom_id: element.carshowroom_id,
    brandname: element.brandname,
    modelname: element.modelname,
    carownertype: element.carownertype,
    carownertypecode: element.carownertypecode,
    carowner: element.carowner,
    inspectionreporturl: element.inspectionreporturl,
    carprice: element.carprice,
    chasisno: element.chasisno,
    modelyear: element.modelyear,
    carshowroomrefno: element.carshowroomrefno,
    enginecapacity: element.enginecapacity,
    mileage: element.mileage,
    cityname: element.carcityname,
    drivetype: element.drivetype,
    noofcylinder: element.noofcylinder,
    noofseats: element.noofseats,
    carownertypeid: element.carownertypeid,
    purchasedetails: element.purchasedetails,
    soldstatus: element.soldstatus == 1 ? 'Sold' : 'Available',
    status: element.status == 1 ? 'Open' : 'InActive',
    created_by: element.createdbyname ?? '',
    cardetailsurl: element.cardetailsurl,
    created_at: this.formatDate(element.created_at),
    modified_by: element.updatedbyname ?? '',
    modified_at: this.formatDate(element.modified_at),
    solddate: this.formatDate(element.solddate),
    showmobileappdate: this.formatDate(element.showmobileappdate),
  }));

  this.dataSource = new MatTableDataSource(this.dynamicTableData);

  setTimeout(() => (this.loading = false), 2000);
}

private formatDate(value: any): string {
  return value ? moment(value).format('DD-MMM-YYYY hh:mm:ss A') : '-';
}

  addRecord() {
    if (this.search) {
      localStorage.setItem('search', JSON.stringify(this.search));
      localStorage.setItem('filterStatus', JSON.stringify(this.filterStatus));
      localStorage.setItem('filterSold', JSON.stringify(this.filterSold));
    }

    let obj = {
      key: "app_cardetails",
      value: { divhasAccess: this.divhasAccess, }
    };
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate([this.CREATE_EDIT_CAR]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  // editRecord(ele: any) {
  //   if (this.search) {
  //     localStorage.setItem('search', JSON.stringify(this.search));
  //     localStorage.setItem('filterStatus', JSON.stringify(this.filterStatus));
  //     localStorage.setItem('filterSold', JSON.stringify(this.filterSold));
  //   }
  //   var navigationExtras = { queryParams: { carshowroom_id: ele.carshowroom_id, }, };
  //   this.router.navigate([this.CREATE_EDIT_CAR], navigationExtras);
  // }

  public editRecord(items: any) {
    if (this.search) {
      localStorage.setItem('search', JSON.stringify(this.search));
      localStorage.setItem('filterStatus', JSON.stringify(this.filterStatus));
      localStorage.setItem('filterSold', JSON.stringify(this.filterSold));
    }
    let obj = {
      key: "app_cardetails",
      value: { carshowroom_id: items.carshowroom_id, divhasAccess: this.divhasAccess, }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate([this.CREATE_EDIT_CAR]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  onSearchInput(event: Event): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.applyFilter();
    }, 500); // 500ms debounce delay
  }


  applyFilter() {
    if (this.search) {
      localStorage.setItem('search', JSON.stringify(this.search));
      localStorage.setItem('filterStatus', JSON.stringify(this.filterStatus));
      localStorage.setItem('filterSold', JSON.stringify(this.filterSold));
    }
    // const filterValue = (event.target as HTMLInputElement).value;
    this.loading = true;
    var obj: any = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }

    // Add status conditionally
    if (this.filterStatus != "None" && this.filterStatus != undefined) {
      obj.status = this.filterStatus == "Open" ? 1 : 0;
    } else {
      this.filterStatus = "None";
    }

    // Add soldstatus conditionally
    if (this.filterSold != "None" && this.filterSold != undefined) {
      obj.soldstatus = this.filterSold == "Sold" ? 1 : 2;
    } else {
      this.filterSold = "None";
    }


    this.carDetailsService.getCarDetailswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.carList = data.data;
        this.totalItemCount = data.total_count;
        // this.totalItemCount = data.total_count;
        // this.PAGINATION_RANGE = this.PAGINATION_RANGE;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  public viewCarImg(carimgpath: any) {
    const dialogRef = this.dialog.open(ViewCarImgComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data: carimgpath
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {

      }
    });
  }

  goToShowroom(item: any) {
    debugger
    var link = "showroom-contact-details/create-showroom-car-details";
    var navigationExtras = { queryParams: { showroomdetid: item.carshowroomname } };
    this.router.navigate([link], navigationExtras);
  }

  public goToExpenseDetails(item: any) {
    this.loading = true;
    let obj = {
      key: "app_expensedettb",
      value: item
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        var link = "car-details/expense-detail";
        this.loading = false;
        this.router.navigate([link]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  public goToAdvanceDetails(item: any) {
    this.loading = true;
    let obj = {
      key: "app_advancedettb",
      value: item
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.loading = false;
        var link = "car-details/advance-payment";
        this.router.navigate([link]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public goToConsignmentDetails(item: any) {
    this.loading = true;
    let obj = {
      key: "app_advancedettb",
      value: item
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.loading = false;
        var link = "car-details/consignment";
        this.router.navigate([link]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public goToRequestInspectionReport(item: any) {
    this.loading = true;
    let obj = {
      key: "app_inspection_report_requests",
      value: item
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.loading = false;
        var link = "car-details/request-inspection-report";
        this.router.navigate([link]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  clearSearch() {
    this.search = "";
    this.filterStatus = "";
    this.filterSold = "";
    localStorage.removeItem('search');
    localStorage.removeItem('filterStatus');
    localStorage.removeItem('filterSold');
    const filterValue = this.search;
    this.ngOnInit();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearForm() {

  }

  isArray = function (a: any) {
    return (!!a) && (a.constructor === Array);
  };
  isObject = function (a: any) {
    return (!!a) && (a.constructor === Object);
  };



  public viewRecord(ele: any) {
    let obj = {
      key: "app_cardetails",
      value: { carshowroom_id: ele.carshowroom_id, isEdit: "VIEW", divhasAccess: this.divhasAccess, }
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate([this.CREATE_EDIT_CAR]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  submitData() {

  }


  public downloadpdf(ele: any) {
    let obj = {
      key: "app_purchaseagreement",
      value: {
        carshowroom_id: ele.carshowroom_id, showroomname: ele.showroomname, brandname: ele.brandname, carprice: ele.carprice,
        modelname: ele.modelname, carshowroomrefno: ele.carshowroomrefno, accountid:
          ele.carowner && ele.carowner.toString()
      },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        var link = "purchase-agreement";
        this.router.navigate([link]);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  async onDeleteStatusChange(carshowroom_id: any) {
    let checkProduct = await this.carDetailsService.checkProduct(carshowroom_id).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`car-details component|onDeleteStatusChange()|This car cannot be deleted because it is associated with active contracts. Please review the related pages below. ${checkProduct.tables}`);
      Swal.fire({
        title: "This car cannot be deleted because it is associated with active contracts. Please review the related pages below.",
        // toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,

        text: checkProduct.tables,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Do you want to delete the car? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.carDetailsService.updateCarInActiveById(carshowroom_id).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });

          this.getAllCarDetails();
        }
      })


    }

  }


}


