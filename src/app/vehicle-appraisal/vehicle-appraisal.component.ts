import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { ViewCarImgComponent } from "./view-car-img/view-car-img.component";
import { DataService } from "../service/encryption/data.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-vehicle-appraisal',
  templateUrl: './vehicle-appraisal.component.html',
  styleUrls: ['./vehicle-appraisal.component.css']
})
export class VehicleAppraisalComponent implements OnInit {
  CommonConstants: any = "https://geapps.germanexperts.ae:7006/"
    CommonConstants1: any = "https://geapps.germanexperts.ae:7007/"
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  search: any;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List: any;


  constructor(public toastr: ToastrService, private customerService: CustomerService, public dialog: MatDialog,private dataService: DataService,
    private router: Router
  ) { }

  public displayedColumns: string[] = ['vehicleappraisalrefno', 'custcode', 'full_name', 'phone_number', 'email', 'brandnames','vehicle_pictures', 'vehicle_mileage', 'vehicle_condition', 'status', 'created_at','actions'];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
    this.getAllList();
  }



  getAllList() {
    this.customerService.getvehicleList().pipe()
      .subscribe(async (data: any) => {
        console.log("getvehicleList ", data);
        this.List = data?.data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);

    setTimeout(() => this.dataSource.sort = this.sort)
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch() {
    this.search = "";
    //  localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  public viewRecord(items: any){
    let obj = {
      key: "app_vehicleappraisal",
      value:  { isEdit:"VIEW",items:items }
    }

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('vehicleappraisal_storage_data_id', response.storage_data_id);
        this.router.navigate(['vehicle-appraisal/view-vehicle']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

}


