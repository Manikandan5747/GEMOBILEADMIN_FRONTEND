import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
const moment = require('moment');
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
// import Swal from 'sweetalert2';
import { ActivatedRoute } from "@angular/router";
// import { ExportToPDFService } from "src/app/service/exportPDF/export-to-pdf.service";
// import { ExportToExcelService } from "src/app/service/exportExcel/export-to-excel.service";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { SpecialOfferService } from "src/app/service/special-offer/special-offer.service";
import { NotificationService } from "src/app/service/notification/notification.service";
import { ExportToPDFService } from "src/app/service/exportPDF/export-to-pdf.service";
import { ExportToExcelService } from "src/app/service/exportExcel/export-to-excel.service";
import { CarDetailsService } from "src/app/service/car-details/car-details.service";
import { BrandService } from "src/app/service/brand/brand.service";
import { ModelService } from "src/app/service/model/model.service";
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent implements OnInit {
  personList: any = [];
  dynamicTableData: any = [];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  list: any;
  dataForExcel: any = [];
  testAttributesMap = new Map();
  public displayedColumns: string[] = [];
  public displayedLabelColumns: string[] = [];
  // specialOfferList: any;
  // notificationList: any;
  enableShowButton: boolean = false;
  carList: any;
  page: any;
  brandList: any;
  modelList: any;
  filteredModelList: any;
  filteredList: any;
  showroomCarDetailsList: any;
  filteredShowroomDetailsList: any;
  currentUser: any;
  loading: boolean = false;
  role_id: any;

  constructor(private customerService: CustomerService,
    private exportToPDFService: ExportToPDFService, private cookieService: CookieService, private exportToExcelService: ExportToExcelService,
    private carDetailsService: CarDetailsService, private brandService: BrandService,
    public dialog: MatDialog) { }

  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.role_id = this.currentUser ? JSON.parse(this.currentUser)[0]?.role_id : "";
    // var dashboardurl = this.currentUser ? JSON.parse(this.currentUser)[0]?.dashboardurl : "";
    
  }


  getAllCarDetails() {
    this.loading = true;
    this.displayedColumns = ['carshowroomrefno', 'showroomname', 'brandname', 'modelname', 'carvideopath', 'modelyear', 'enginecapacity', 'mileage', 'cityname', 'drivetype', 'noofcylinder', 'noofseats', 'status', 'soldstatus', 'created_by', 'created_at', 'modified_by', 'modified_at'];
    this.displayedLabelColumns = ['carshowroomrefno', 'showroomname', 'brandname', 'modelname', 'carvideopath', 'modelyear', 'enginecapacity', 'mileage', 'cityname', 'drivetype', 'noofcylinder', 'noofseats', 'status', 'soldstatus', 'created_by', 'created_at', 'modified_by', 'modified_at'];
    this.carDetailsService.getCarDetails().pipe()
      .subscribe((data: any) => {
        this.carList = data;
        this.carDetailsloadRecord();
        this.getAllBrand();
        this.getShowroomDetails();
      });
  }

  async carDetailsloadRecord() {
    this.dynamicTableData = [];
    await this.carList.forEach((element: any) => {
      let row = {
        carshowroomrefno: element.carshowroomrefno,
        showroomname: element.showroomname,
        brandname: element.brandname,
        modelname: element.modelname,
        carvideopath: element.carvideopath,
        modelyear: element.modelyear,
        enginecapacity: element.enginecapacity,
        mileage: element.mileage,
        cityname: element.cityname,
        drivetype: element.drivetype,
        noofcylinder: element.noofcylinder,
        noofseats: element.noofseats,
        status: element && element.status == 1 ? "Active" : "InActive",
        soldstatus: element && element.soldstatus == 1 ? "Sold" : "Stock",
        created_by: element && element.createdbyname ? element.createdbyname : "",
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        modified_by: element && element.updatedbyname ? element.updatedbyname : "",
        modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.sort = this.sort)
    }, 200);
    this.loading = false;
  }

  getAllCustomer() {
    this.loading = true;
    this.displayedColumns = ['username', 'customertypes', 'customername', 'mobilenumber', 'emailid', 'customercode', 'customerstatus', 'block_status', 'status', 'created_by', 'created_at', 'modified_by', 'modified_at'];
    this.displayedLabelColumns = ['USERNAME', 'CUSTOMERTYPES', 'Customer Name', 'Customer Mobile Number', 'Email', 'Customer Code', 'Customer Status', 'Block Status', 'Status', 'Created By', 'Created Date', 'Updated By', 'Updated Date'];

    this.customerService.getCustomer().pipe().subscribe((data: any) => {
      this.personList = data;
      this.loadRecord();
      this.loading = false;
    });
  }

  getUser() {
    this.displayedColumns = ['username', 'userpassword', 'userrole', 'status', 'created_by', 'created_at',];
    this.displayedLabelColumns = ['Username', 'User Password', 'User Role', 'Status', 'Created By', 'Created Date'];
    this.customerService.getList().pipe()
      .subscribe((data: any) => {
        // console.log("getList", data);
        this.list = data;
        this.loadUserRecord();
      });
  }

  // getAllSpecialOffer(){
  //   this.displayedColumns = ['spclofferurl','spclofferpath','status','created_by', 'created_at'];
  //   this.displayedLabelColumns = ['Special Offer URL','Special Offer Path','Status','Created By', 'Created At'];
  //   this.specialOfferService.getSpecialoffer().pipe()
  //   .subscribe( (data:any) => {
  //     //  console.log("getSpecialoffer ",data); 
  //       this.specialOfferList = data;
  //       this.loadSpecialOfferRecord();
  //     });
  // }

  // getAllNotification(){
  //   this.displayedColumns = ['notificationtitle','notificationcontent','notifytype','fcmtoken','status','readreceipts','created_by', 'created_at'];
  //   this.displayedLabelColumns = ['Notification Title','Notification Content','Notify Type','Fcm Token','Status','Readreceipts','Created By', 'Created At'];
  //   this.notificationService.getNotification().pipe()
  //   .subscribe( (data:any) => {
  //     //  console.log("getNotification ",data); 
  //       this.notificationList = data;
  //       this.loadNotificationRecord();
  //     });
  // }

  // loadNotificationRecord(){
  //   this.dynamicTableData = [];
  //   this.notificationList.forEach((element:any) => {
  //     let row: any = {
  //       fcmtoken: element.fcmtoken ? element.fcmtoken : "-",
  //       campaign_id: element.campaign_id ? element.campaign_id : "-",
  //       notificationtitle: element.notificationtitle ? element.notificationtitle : "-",
  //       notificationcontent: element.notificationcontent ? element.notificationcontent : "-", 
  //       notifytype: element.notifytype ? element.notifytype :" -",
  //       readreceipts: element&& element.readreceipts == 0 ? "unread" : "read",
  //       created_by: "Mobile Admin",
  //       status: element&& element.status == 1 ? "Active":"InActive",
  //       created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //     }
  //     this.dynamicTableData.push(row);
  //   })
  //   this.dataSource = new MatTableDataSource(this.dynamicTableData);
  //   setTimeout(() => {
  //     this.dataSource.paginator = this.paginator;
  //     setTimeout(() => this.dataSource.sort = this.sort)
  //   }, 200);
  // }


  loadUserRecord() {
    this.dynamicTableData = [];
    this.list.forEach((element: any) => {
      let row: any = {
        username: element.username,
        userpassword: element.userpassword,
        userrole: element.userrole,
        status: element && element.status == 1 ? "Active" : "InActive",
        created_by: "Mobile Admin",
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.sort = this.sort)
    }, 200);
  }


  loadRecord() {
    this.dynamicTableData = [];
    this.dynamicTableData = this.personList.map((element: any) => ({
      username: element.username || "-",
      customertypes: element.customertypes || "-",
      customername: element.customername,
      mobilenumber: element.mobilenumber,
      emailid: element.emailid || "-",
      customercode: element.customercode,
      customerstatus: element.customerstatus,
      block_status: element.block_status === 1 ? "Blocked" : "Open",
      status: element.status === 1 ? "Active" : "Inactive",
      created_by: "Mobile Admin",
      created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
      modified_by: element.modified_by ? "Mobile Admin" : "-",
      modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
    }));

    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  // loadSpecialOfferRecord() {
  //   this.dynamicTableData = [];
  //   this.specialOfferList.forEach((element:any) => {
  //     let row: any = {
  //       spf_id: element.spf_id ? element.spf_id : "-",
  //       spclofferpath: element.spclofferpath ? element.spclofferpath : "-",
  //       spcloffertext: element.spcloffertext ? element.spcloffertext : "-", 
  //       spclofferurl: element.spclofferurl ? element.spclofferurl :" -",
  //       status: element&& element.status == 1 ? "Active":"InActive",
  //       created_by: "Mobile Admin",
  //       created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //       modified_by:  element && element.modified_by ? "Mobile Admin" : "-",
  //       modified_at:  element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //     }
  //     this.dynamicTableData.push(row);
  //   })
  //   this.dataSource = new MatTableDataSource(this.dynamicTableData);
  //   setTimeout(() => {
  //     this.dataSource.paginator = this.paginator;
  //     setTimeout(() => this.dataSource.sort = this.sort)
  //   }, 200);
  // }


  clearFilter() {
    this.dataSource.filter = '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onBookChange(event: any) {
    if (event.value == "None") {
      this.clearFilter();
    } else {
      const filterValue = event.value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  exportExcel() {
    this.dataSource.filteredData.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })
    this.exportToExcelService.exportAsExcelFile(this.displayedLabelColumns, this.dataForExcel, "Report Excel", '', "Report Excel");
    this.dataForExcel = [];
  }
  exportPdf() {
    let tableBody: any = this.dataSource.filteredData;
    this.exportToPDFService.exportPdf(this.displayedLabelColumns, tableBody, "Report PDF", this.testAttributesMap, "GERMAN EXPERTS CAR MAINTENANCE", "GE MOBILE ADMIN REPORT", "Admin");
  }

  onPageChange(page: any) {
    console.log("page", page)
    this.enableShowButton = true;
    this.page = page.value;
  }

  showReport() {
    debugger
    this.loading = true;
    // this.page
    if (this.page == 'Registration') {
      this.getAllCustomer();
    } else {
      this.getAllCarDetails();
    }
  }

  async getAllBrand() {
    this.brandList = await this.brandService.getBrand().toPromise();
    this.filteredList = this.brandList.slice();
  }

  async getModelList(item: any, isEdit: string) {
    // console.log("item", item);
    if (item == "None") {
      this.clearFilter();
    } else {
      const filterValue = item;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    // await this.modelService.buycarmodelbrandid(item).pipe()
    //   .subscribe((data: any) => {
    //     console.log("buycarmodelbrandid", data);
    //     this.modelList = data;
    //     this.filteredModelList = this.modelList.slice();
    //   });
  }

  public isFiltered(item: any) {
    return this.filteredList.find((ele: any) => ele.brandid == item.brandid);
  }

  async getShowroomDetails() {
    this.showroomCarDetailsList = await this.carDetailsService.getShowroomCarDetails().toPromise();
    this.filteredShowroomDetailsList = this.showroomCarDetailsList
  }

  public isShowroomDetailFiltered(item: any) {
    return this.filteredShowroomDetailsList.find((ele: any) => ele.showroomname == item.showroomname);
  }

  // public isModelFiltered(item: any) {
  //   return this.filteredModelList.find((ele: any) => ele.modelid == item.modelid);
  // }
}
