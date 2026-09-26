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
import { CarDetailsService } from "src/app/service/car-details/car-details.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
@Component({
  selector: 'app-showroom-car-details',
  templateUrl: './showroom-car-details.component.html',
  styleUrls: ['./showroom-car-details.component.css']
})
export class ShowroomCarDetailsComponent implements OnInit {
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  modelList: any;
  dynamicTableData: any=[];
  userPrivilegeObj: any;
  CREATE_EDIT_CAR = "showroom-contact-details/create-showroom-car-details";
  constructor(private customerService:CustomerService,public toastr: ToastrService, private router: Router, private carDetailsService: CarDetailsService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) {  this.getCurrentUserPrivilege() }

  public displayedColumns: string[] = ['actions','showroomlogo','showroomdetno','showroomname','showroomcategorytype', 'showroomaddress','showroomopenhours', 'showroomlocatedin','status', 'created_by', 'created_at', 'modified_by', 'modified_at',];
  dataSource!: MatTableDataSource<any>;


  ngOnInit() {
    this.toastr.clear();
    this.getAllCarDetails();
    this.loadRecord();
  }
 

  getAllCarDetails() {
    // this.loading = true;
    this.carDetailsService.getShowroomCarDetails().pipe()
      .subscribe((data: any) => {
        console.log("getShowroomCarDetails", data);
        this.dynamicTableData = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.loading = false;
  }


  addRecord() {
    var navigationExtras = { queryParams: { isRefNo:"false" }};
    this.router.navigate([this.CREATE_EDIT_CAR],navigationExtras);
  }

  editRecord(ele: any) {
    var navigationExtras = { queryParams: { showroomdetid: ele.showroomdetid,isRefNo:"false" } };
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

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.CarShowroomDetails)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }


  goToShowroomCon(item:any){
    var navigationExtras = { queryParams: { showroomdetid: item.showroomdetid,isRefNo:"true" } };
    this.router.navigate([this.CREATE_EDIT_CAR],navigationExtras);
  }
}


