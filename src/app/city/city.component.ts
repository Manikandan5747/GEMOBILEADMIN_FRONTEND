import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { CarCityService } from "../service/car-city/car-city.service";
import { AddCityComponent } from "./add-city/add-city.component";
import { EditCityComponent } from "./edit-city/edit-city.component";


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  CarCityList:any=[];
  dynamicTableData!: any[];

  constructor(public toastr: ToastrService, private carCityService: CarCityService,private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) {
    }

  public displayedColumns: string[] = ['actions','carcityname','status', 'created_by', 'created_at', 'modified_by', 'modified_at',];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {debugger
    this.toastr.clear();
    this.getCarCity();
  }

  getCarCity() {
    this.loading = true;
    this.carCityService.getCarCity().pipe()
      .subscribe((data: any) => {
        console.log("getCarCity", data);
        this.CarCityList = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.CarCityList);
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
    const dialogRef = this.dialog.open(AddCityComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getCarCity();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditCityComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
      data: {
        carcityid:items.carcityid,
        carcityname:items.carcityname,
        status: items.status,
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getCarCity();
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

  clearSearch(){
    this.search ="";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


