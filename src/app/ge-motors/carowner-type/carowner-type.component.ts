import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { EditCarownerTypeComponent } from "./edit-carowner-type/edit-carowner-type.component";
import { AddCarownerTypeComponent } from "./add-carowner-type/add-carowner-type.component";
import { CarownerTypeService } from "./carowner-type.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";


@Component({
  selector: 'app-carowner-type',
  templateUrl: './carowner-type.component.html',
  styleUrls: ['./carowner-type.component.css']
})
export class CarownerTypeComponent implements OnInit {

  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  list:any=[];
  dynamicTableData!: any[];
  userPrivilegeObj: any;
  constructor(private carownerTypeService: CarownerTypeService,private router: Router,
    private route: ActivatedRoute,private customerService: CustomerService, private cookieService: CookieService, public dialog: MatDialog) { this.getCurrentUserPrivilege();
    }

  public displayedColumns: string[] = ['actions','carownertype','status', 'createdby', 'createdat', 'modifiedby', 'modifiedat', ];

  dataSource!: MatTableDataSource<any>;

    async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.CarOwerType)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  ngOnInit() {debugger
    this.getCarownertype();
  }

  getCarownertype() {
    this.loading = true;
    this.carownerTypeService.getCarownertype().pipe()
      .subscribe((data: any) => {
        console.log("getCarownertype", data);
        this.list = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.list);
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
    const dialogRef = this.dialog.open(AddCarownerTypeComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getCarownertype();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditCarownerTypeComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getCarownertype();
      }
    });
  }

}


