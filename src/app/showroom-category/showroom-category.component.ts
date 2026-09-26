import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { ShowroomCategoryService } from "../service/showroom-category/showroom-category.service";
import { EditShowroomCategoryComponent } from "./edit-showroom-category/edit-showroom-category.component";
import { AddShowroomCategoryComponent } from "./add-showroom-category/add-showroom-category.component";
import { CustomerService } from "../service/customer/customer.service";
import { ModuleIdList } from "../common/enum";

@Component({
  selector: 'app-manage-showroomcategory',
  templateUrl: './showroom-category.component.html',
  styleUrls: ['./showroom-category.component.css']
})

export class ShowroomCategoryComponent implements OnInit {
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  userPrivilegeObj: any;
  appShowroomcategoryList: any;

  constructor(public toastr: ToastrService, private router: Router,
    private customerService: CustomerService,
    private route: ActivatedRoute, public dialog: MatDialog, private showroomCategoryService: ShowroomCategoryService) {
    this.getCurrentUserPrivilege();
  }

  public displayedColumns: string[] = ['actions', 'srcategoryname', 'status', 'created_by', 'created_at', 'modified_by', 'modified_at',];
  dataSource!: MatTableDataSource<any>;


  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.ShowroomCategory)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }


  ngOnInit() {
    this.toastr.clear();
    this.getAllshowroomcategorys();
  }

  getAllshowroomcategorys() {
    this.loading = true;
    this.showroomCategoryService.getShowroomCategory()
      .subscribe((data: any) => {
        console.log("getShowroomcategory", data);
        this.appShowroomcategoryList = data;
        this.loadRecord();
      });
  }

  loadRecord() {
    this.dataSource = new MatTableDataSource(this.appShowroomcategoryList);
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
    const dialogRef = this.dialog.open(AddShowroomCategoryComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllshowroomcategorys();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditShowroomCategoryComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
      data: items,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllshowroomcategorys();
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

}


