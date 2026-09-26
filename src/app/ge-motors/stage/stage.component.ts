import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { StageService } from "./stage.service";
import Swal from 'sweetalert2'
import { ErrorlogService } from "src/app/errorlog.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {


  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List:any=[];
  dynamicTableData!: any[];
userPrivilegeObj: any;
  constructor(public toastr: ToastrService, private stageService: StageService,private router: Router,private customerService: CustomerService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
       this.getCurrentUserPrivilege();
    }

  public displayedColumns: string[] = ['actions','stagename','stageprobability','weightage','forecast','dealstatusid','minage','maxage','status', 'createdby', 'createdat', 'modifiedby', 'modifiedat', ];

  dataSource!: MatTableDataSource<any>;


   async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Stage)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  ngOnInit() {
    this.getStage();
  }

  getStage() {
    this.loading = true;
    this.stageService.getStage().pipe()
      .subscribe((data: any) => {
        console.log("getStage", data);
        this.List = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
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
    var navigationExtras = { queryParams: { isEdit:"ADD" }};
    this.router.navigate(['create-stage'],navigationExtras);
  }

  public editRecord(items: any) {
    var navigationExtras = { queryParams: { isEdit:"EDIT",stageid:items.stageid }};
    this.router.navigate(['create-stage'],navigationExtras);
  }

  transformdealstatusid(value: number): string {
    switch (value) {
      case 2:
        return 'Success';
      case 3:
        return 'Lost';
      case 4:
        return 'Not Interested';
      case 5:
        return 'Progress';
      default:
        return '';
    }
  }

    async onDeleteStatusChange(stageid: any) {
    let checkProduct = await this.stageService.checkStageAvailability(stageid).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`stage component|onDeleteStatusChange()|This Account cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
      Swal.fire({
        title: "This Account cannot be deleted because it is associated with Other Module. Please review the related pages below.",
        // toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        text: checkProduct.tables,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Do you want to delete the Stage? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.stageService.deleteStageById(stageid).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });
          this.getStage();


        }
      })
    }
  }

}


