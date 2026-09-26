import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { LeadsService } from "./leads.service";
import Swal from 'sweetalert2';
import { OpportunityService } from "../opportunity/opportunity.service";
import { ConvertOpportunityComponent } from "./convert-opportunity/convert-opportunity.component";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { DataService } from "src/app/service/encryption/data.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

  currentuser: any;
  formData = new FormData();
  loading: boolean = false;
  search: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List: any = [];
  dynamicTableData!: any[];
  currentUser: any;
  userPrivilegeObj: any;
  totalItemCount: any;
  role_id: any; privilege: any;
  constructor(public toastr: ToastrService, private customerService: CustomerService, private leadsService: LeadsService, private router: Router, public opportunityService: OpportunityService,
    private dataService: DataService, private manageModuleService: ManageModuleService, private cookieService: CookieService, public dialog: MatDialog) {
    this.getCurrentUserPrivilege();
  }

  public displayedColumns: string[] = ['actions', 'leadtype', 'accountname', 'firstname', 'lastname', 'name', 'brandname', 'modelname', 'conversionstatus', 'createdby', 'createdat', 'modifiedby', 'modifiedat', 'submenu',];

  dataSource!: MatTableDataSource<any>;

  async ngOnInit() {
    this.getLeads();

    this.currentuser = await this.customerService.getCurrentUser();
    const obj = this.currentuser ? this.currentuser : "";
    this.role_id = obj[0]?.role_id;
    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.Lead, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);
      this.privilege = Result2.data.find(
        ele => ele.child_module_id === ModuleIdList.LeadActivity
      );
      console.log("Privilege  this.privilege", this.privilege);

      // Check if user has at least one submenu privilege
      const hasRelatedccess = this.privilege.create_access
        || this.privilege.edit_access;
      if (!hasRelatedccess) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'submenu');
      }

    });
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Lead)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

    // Check if user has at least one action privilege
    const hasActionAccess = this.userPrivilegeObj.editaccess === 1
      || this.userPrivilegeObj.deleteaccess === 1
      || this.userPrivilegeObj.viewaccess === 1;

    if (!hasActionAccess) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    }
  }

  getLeads() {
    var obj = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    this.loading = true;
    this.leadsService.listAllLeadswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getLeads", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.loading = false;
  }

  onPageChange(event) {

    this.loading = true;
    var obj = {
      "search": this.search,
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize ? event.pageSize : this.PAGE_SIZE
    }

    this.leadsService.listAllLeadswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      },);
  }



  applyFilter(event: Event) {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }

    this.leadsService.listAllLeadswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      },);
  }

  public addRecord() {
    // Create an object to store the key and value for 'ADD'
    let obj = {
      key: "app_leads",
      value: { isEdit: "ADD" }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-leads']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public editRecord(items: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_leads",
      value: { leadsid: items.leadsid, isEdit: "EDIT" }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-leads']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public viewRecord(items: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_leads",
      value: { leadsid: items.leadsid, isEdit: "VIEW" }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-leads']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public async convertOpportunity(enteredData: any) {
    const dialogRef = this.dialog.open(ConvertOpportunityComponent, {
      width: '500px',
      data: enteredData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Success') {
        this.ngOnInit();
      }
    });
  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }



  public gotoactivity(ele: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_leads",
      value: {
        entitytype: 'LEAD',
        entityid: ele.leadsid, name: ele.accountname ? ele.accountname : ele.firstname
      }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['activity']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  sortData(event: any) {
    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "sort": true,
      "sortevent": event
    }

    this.leadsService.listAllLeadswithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      },);
  }

  clearSearch() {
    this.search = "";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async onDeleteStatusChange(leadsid: any) {

    Swal.fire({
      title: 'Do you want to delete the Lead? Once deleted, it cannot be Re-activated. Proceed?',
      icon: 'question',
      //text:checkProduct.tables,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let result = await this.leadsService.deleteLeadById(leadsid).toPromise();
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: result.message,
          icon: 'success',
        });
        this.getLeads();


      }
    })


  }


}


