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
import { CampaignsService } from "./campaigns.service";
import { AddCampaignsFormComponent } from "./add-campaigns-form/add-campaigns-form.component";
import { EditCampaignsFormComponent } from "./edit-campaigns-form/edit-campaigns-form.component";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { ErrorlogService } from "src/app/errorlog.service";
const moment = require('moment');

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  loading: boolean = false;
  userPrivilegeObj: any;
  search: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  campaignList: any = [];
  dynamicTableData!: any[];

  constructor(public toastr: ToastrService, private campaignsService: CampaignsService, private router: Router,
    private route: ActivatedRoute, private customerService: CustomerService, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege();
  }

  public displayedColumns: string[] = ['actions', 'campaignrefno', 'name', 'typename', 'startdate', 'enddate', 'status', 'createdbyname', 'createdat', 'updatedbyname', 'modifiedat',];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    debugger
    this.getCampaigns();
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Gecampaign)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  getCampaigns() {
    this.loading = true;
    this.campaignsService.getCampaigns().pipe()
      .subscribe((data: any) => {
        console.log("getCampaigns", data);
        this.campaignList = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    var dynamicTableData: any = [];
    this.campaignList && this.campaignList.forEach((element: any) => {
      let row = {
        campaignrefno: element.campaignrefno,
        name: element.name,
        typename: element.typename,
        type: element.type,
        actualcost: element.actualcost,
        budgetedcost: element.budgetedcost,
        campaignid: element.campaignid,
        parentcampaign: element.parentcampaign,
        telestatustemplate: element.telestatustemplate,
        expectedrevenue: element.expectedrevenue,
        expectedresponse: element.expectedresponse,
        startdate: element.startdate,
        description: element.description,
        enddate: element.enddate,
        status: element.status == 1 ? "Active" : "In-Active",
        createdbyname: element.createdbyname,
        updatedbyname: element.updatedbyname,
        modifiedat: element.modifiedat ? moment(element.modifiedat).format('DD-MMM-YYYY hh:mm:ss A') : "",
        createdat: element.createdat ? moment(element.createdat).format('DD-MMM-YYYY hh:mm:ss A') : "",
      }
      dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(dynamicTableData);
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
    const dialogRef = this.dialog.open(AddCampaignsFormComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // if (result == 'Success') {
      this.getCampaigns();
      // }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditCampaignsFormComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // if (result == 'Success') {
      this.getCampaigns();
      // }
    });
  }


  clearSearch() {
    this.search = "";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  deleteRecord(items: any) {
    this.campaignsService.deleteRecord(items).pipe()
      .subscribe((data: any) => {
        console.log("deleteRecord", data);
        this.ngOnInit();
      });
  }

  async onDeleteStatusChange(campaignid: any) {
    let checkProduct = await this.campaignsService.checkCampaignAvailability(campaignid).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`campaigns component|onDeleteStatusChange()|This Campaign cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
      Swal.fire({
        title: "This Campaign cannot be deleted because it is associated with Other Module. Please review the related pages below.",
        // toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        text: checkProduct.tables,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Do you want to delete the Campaign? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.campaignsService.deleteCampaignById(campaignid).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });
          this.getCampaigns();


        }
      })
    }
  }


}



