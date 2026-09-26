import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import Swal from 'sweetalert2';
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { OpportunityService } from "src/app/ge-motors/opportunity/opportunity.service";
import { ConvertOpportunityComponent } from "src/app/ge-motors/leads/convert-opportunity/convert-opportunity.component";
import { InventoryService } from "../inventory.service";
@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class ListInventoryComponent implements OnInit {

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
  constructor(public toastr: ToastrService, private customerService: CustomerService, private luckydrawService:InventoryService, private router: Router, public opportunityService: OpportunityService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) {
    this.getCurrentUserPrivilege();
  }

  displayedColumns: string[] = ['actions','gift_name','category_type','category_name', 'qty','win_qty','gift_image','status', 'createdbyname', 'created_at', 'modifiedby', 'modified_at', ];


  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.getLeads();
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.LuckyInventory)
  }

  getLeads() {
    var obj = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    this.loading = true;
    this.luckydrawService.listAllCategoryMasterpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getLeads", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    // setTimeout(() => {
    //   this.dataSource.sort = this.sort;
    // });
    // this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  onPageChange(event) {

    this.loading = true;
    var obj = {
      "search": this.search,
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize ? event.pageSize : this.PAGE_SIZE
    }

    this.luckydrawService.listAllCategoryMasterpagination(obj).pipe()
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

    this.luckydrawService.listAllCategoryMasterpagination(obj).pipe()
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      },);
  }

  public addRecord() {
    var navigationExtras = { queryParams: { isEdit: "ADD" } };
    this.router.navigate(['luckyDraw/addLuckyInventory'], navigationExtras);
  }

  public editRecord(items: any) {
    var navigationExtras = { queryParams: { isEdit: "EDIT", inventory_id: items.inventory_id } };
    this.router.navigate(['luckyDraw/addLuckyInventory'], navigationExtras);
  }

  public viewRecord(items: any) {
    var navigationExtras = { queryParams: { isEdit: "VIEW", inventory_id: items.inventory_id } };
    this.router.navigate(['luckyDraw/addLuckyInventory'], navigationExtras);
  }





  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }




  sortData(event: any) {
    console.log("event", event);

    this.loading = true;
    var obj = {
      "search": this.search,
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "sort": true,
      "sortevent": event
    }

    this.luckydrawService.listAllCategoryMasterpagination(obj).pipe()
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
    this.getLeads();
  }


}