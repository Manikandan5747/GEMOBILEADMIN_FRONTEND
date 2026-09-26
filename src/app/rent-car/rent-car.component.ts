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
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BrandService } from "src/app/service/brand/brand.service";
import { ModelService } from "src/app/service/model/model.service";
import { ViewCarImgComponent } from "../buy-car/car-details/view-car-img/view-car-img.component";
import { RentShowroomCarService } from "./service/rent-showroom-car.service";
import { OnDestroy } from '@angular/core';
import { Observable, Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-rent-car',
  templateUrl: './rent-car.component.html',
  styleUrls: ['./rent-car.component.css']
})
export class RentCarComponent implements OnInit {
  subscription!: Subscription;
  everyFiveSecond: Observable<number> = timer(2 * 60 * 1000);
  private ngUnsubscribe = new Subject();

  filterStatus:any;
  filterSold:any;
  userPrivilegeObj: any;
  brandlist: any = [];
  search: any;
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  carList: any;
  dynamicTableData!: any[];
  CREATE_EDIT_CAR = "rent-car/add-edit-rentcar";
  homePageRedirection: any;
  currentUser: any;
  filterForm!: FormGroup;
  modelList: any;

  constructor(public modelService: ModelService, public brandService: BrandService, public toastr: ToastrService,
     private customerService: CustomerService, private router: Router, private carDetailsService: RentShowroomCarService,
    private fb: FormBuilder, private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) {
    this.getCurrentUserPrivilege();
    this.route.queryParams.subscribe(params => {
      this.homePageRedirection = params['homePageRedirection'];
    });

  }

  displayedColumns = [ 'actions','rentcarshowroomrefno', 'showroomname', 'brandname', 'modelname', 'img',  'modelyear',  'noofseats', 'status',  'created_by', 'created_at', 'modified_by', 'modified_at', ];
  // public displayedLabelColumns: string[] = ['brandname','modelname','rentcarshowroomrefno', 'modelyear','enginecapacity','mileage','cityname''noofseats','status', 'created By', 'created Date', 'updated By', 'updated Date', 'Action'];
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
    setTimeout(() => {
      if ((obj[0] && obj[0].role_id == 1) || (obj[0] && obj[0].role_id == 4)) {
        this.displayedColumns = ['actions','rentcarshowroomrefno', 'showroomname', 'brandname', 'modelname', 'img',  'modelyear',   'noofseats', 'status','viewcount',   'created_by', 'created_at', 'modified_by', 'modified_at',  ];
      }
    }, 1000)

    this.getAllBrand();
    this.getAllModels();
  }

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
    });
  }



  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.ShowroomCars)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  getAllCarDetails() {
    this.loading = true;
    this.carDetailsService.getCarDetails().pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.carList = data;

        if (this.homePageRedirection == "Approved Car") {
          this.carList = this.carList.filter((ele: any) => ele.isapprovedstatus == 2);
        } else if (this.homePageRedirection == "Pending Car") {
          this.carList = this.carList.filter((ele: any) => ele.isapprovedstatus == 1);
        } else if (this.homePageRedirection == "Sold Car") {
          this.carList = this.carList.filter((ele: any) => ele.soldstatus == 1);
        }

        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  selectionFilterChange(event: any,key:string){
    if(key == "Status"){
      this.filterSold="";
    }else{
      this.filterStatus ="";
    }
   
    if(event.value == "None"){
      this.ngOnInit();
    }else{
      const filterValue = event.value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  loadRecord() {
    this.dynamicTableData = [];
    this.carList.forEach((element: any) => {
      let row = {
        viewcount: element.viewcount ?  element.viewcount:"0",
        carshowroomname: element.carshowroomname ? element.carshowroomname :"",
        isapprovedstatus: element.isapprovedstatus ? element.isapprovedstatus:"",
        showroomname: element.showroomname ? element.showroomname:"",
        carimgpath: element.carimgpath,
        docuploadpath: element && element.docuploadpath ? element.docuploadpath : "-",
        rentcarshowroom_id: element.rentcarshowroom_id ? element.rentcarshowroom_id:"",
        brandname: element.brandname ? element.brandname:"",
        modelname: element.modelname ? element.modelname:"",
        modelyear: element.modelyear ? element.modelyear:"",
        rentcarshowroomrefno: element.rentcarshowroomrefno ? element.rentcarshowroomrefno:"",
        enginecapacity: '',
        mileage: '',
        cityname: element.carcityname ? element.carcityname:"",
        drivetype: element.drivetype ? element.drivetype:"",
        noofcylinder: element.noofcylinder ? element.noofcylinder:"",
        noofseats: element.noofseats ? element.noofseats:"",
        soldstatus: element && element.soldstatus == 1 ? "Sold" : "Available",
        status: element && element.status == 1 ? "Open" : "InActive",
        created_by: element && element.createdbyname ? element.createdbyname : "", cardetailsurl: element.cardetailsurl,
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        modified_by: element && element.updatedbyname ? element.updatedbyname : "", modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        solddate: element.solddate ? moment(element.solddate).format('DD-MMM-YYYY hh:mm:ss A') : "-",
      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });


    var search: any = localStorage.getItem('search');
    if (search) {
      this.search = JSON.parse(search);
      const filterValue = this.search;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    this.loading = false;
  }


  addRecord() {
    if (this.search) {
      localStorage.setItem('search', JSON.stringify(this.search));
    }


    // var navigationExtras = { queryParams: { id:id }};
    this.router.navigate([this.CREATE_EDIT_CAR]);
  }

  editRecord(ele: any) {
    if (this.search) {
      localStorage.setItem('search', JSON.stringify(this.search));
    }
    var navigationExtras = { queryParams: { rentcarshowroom_id: ele.rentcarshowroom_id } };
    this.router.navigate([this.CREATE_EDIT_CAR], navigationExtras);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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


  clearSearch() {
    this.search = "";
    localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearForm() {

  }

  isArray = function (a:any) {
    return (!!a) && (a.constructor === Array);
  };
  isObject = function (a:any) {
    return (!!a) && (a.constructor === Object);
  };

  submitData() {
    debugger
    // this.dataSource.filterPredicate = (data, filter) => {
    //   let displayData = true;
    //   let myFilter = JSON.parse(filter);

    //   for (var key in myFilter) {
    //     if (myFilter[key]) {
    //       if (typeof myFilter[key] === "string") {
    //         if (data[key] != myFilter[key]) {
    //           displayData = false;
    //         }
    //       }
    //       if (this.isArray(myFilter[key])) {
    //         if (!myFilter[key].includes(data[key])) {
    //           displayData = false;
    //         }
    //       }
    //     }
    //   }
    //   return displayData;
    // }
    // this.dataSource.filter = JSON.stringify(this.filterForm.value);
  }
}


