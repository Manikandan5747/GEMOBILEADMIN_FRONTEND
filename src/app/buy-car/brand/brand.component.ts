import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
const moment = require('moment');
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { EditBrandComponent } from "./edit-brand/edit-brand.component";
import { AddBrandComponent } from "./add-brand/add-brand.component";
import { BrandService } from "src/app/service/brand/brand.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { ErrorlogService } from "src/app/errorlog.service";

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  loading: boolean = false;
  search: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  brandList: any;
  dynamicTableData!: any[];
  userPrivilegeObj: any;
  constructor(private customerService: CustomerService, public toastr: ToastrService, private brandService: BrandService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) { this.getCurrentUserPrivilege() }

  public displayedColumns: string[] = ['actions', 'brandid', 'brandname', 'brandcode', 'brandlogopath', 'status', 'created_by', 'created_at', 'modified_by', 'modified_at',];
  public displayedLabelColumns: string[] = ['Action', 'brandid', 'brandname', 'brandcode', 'brandlogopath', 'status', 'created By', 'created Date', 'updated By', 'updated Date',];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
    this.getAllBrand();
  }

  getAllBrand() {
    this.loading = true;
    this.brandService.getBrand().pipe()
      .subscribe((data: any) => {
        console.log("getBrand ", data);
        this.brandList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }
  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Brand)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  loadRecord() {
    this.dynamicTableData = [];
    this.brandList && this.brandList.forEach((element: any) => {
      let row = {
        brandlogopath: element && element.brandlogopath,
        brandid: element.brandid,
        brandname: element.brandname,
        brandcode: element.brandcode,
        status: element && element.status == 1 ? "Active" : "InActive",
        created_by: element && element.createdbyname ? element.createdbyname : "",
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        modified_by: element && element.updatedbyname ? element.updatedbyname : "",
        modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",

        company: element && element.company,
        asset_brandname: element.asset_brandname,
        crm_status: element && element.crm_status == 1 ? "Active" : "InActive",
        asset_imagepath: element?.asset_imagepath


      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
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
    const dialogRef = this.dialog.open(AddBrandComponent, {
      width: '750px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllBrand();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    this.brandService.brandIsAlreadyMapped(items.brandid).subscribe(
      (response: any) => {
        console.log("response", response);
        if (response.length > 0) {
          this.errorlogService.logManualValidationError(`Brand component|editRecord()|Brand Already Mapped with Car!}`);
          // Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 8000, title: "Contact Already Mapped with Car.", icon: 'error', });
          Swal.fire({
            title: 'Do you want to edit Record?',
            text: "Brand Already Mapped with Car!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.editpopup(items);
            }
          });
        } else {
          this.editpopup(items);
        }
      })

  }

  editpopup(items: any) {
    // delete items.brandlogopath
    const dialogRef = this.dialog.open(EditBrandComponent, {
      width: '750px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllBrand();
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


  clearSearch() {
    this.search = "";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async onDeleteStatusChange(brandid: any) {
    let checkProduct = await this.brandService.checkBrandAvailability(brandid).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`Brand component|onDeleteStatusChange()|This Brand cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
      Swal.fire({
        title: "This Brand cannot be deleted because it is associated with Other Module. Please review the related pages below.",
        // toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        text: checkProduct.tables,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Do you want to delete the Brand? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.brandService.deleteBrandById(brandid).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });
          this.getAllBrand();

        }
      })
    }
  }

}


