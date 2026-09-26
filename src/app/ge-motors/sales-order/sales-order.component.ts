import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import Swal from 'sweetalert2';
import { SalesOrderService } from "../sales-order/sales-order.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { AccountService } from "../account/account.service";
import { DataService } from "src/app/service/encryption/data.service";
import { SignLinkComponent } from "./sign-link/sign-link.component";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit, OnDestroy {
  modifiedat: any;
  dealstatusid: any;
  createdat: any;
  userPrivilegeObj: any;
  currentUser: any;
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
  quoteid: any;
  opportunityid: any;
  currentuser: any;
  totalItemCount: any;
  accountTotalList: any;
  accountFilterList: any;
  accountname: any;
  storage_data_id: any;
  settings: any;
  isSettingUser: boolean = false;
  role_id: any;
  privilege: any;
  privilegesMap!: {
    allowPrintSalesContract: false,
    allowPrintProformaInvoice: false,
    allowPrintSalesOrder:false,
    allowCopyLink: false,
    allowSignLink: false,
    allowSendEmail: false,
    isFinanceAccess:false
  };

  constructor(public toastr: ToastrService, private router: Router, private salesOrderService: SalesOrderService, private dataService: DataService,
    private manageModuleService: ManageModuleService,

    private route: ActivatedRoute, private customerService: CustomerService, private cookieService: CookieService, public dialog: MatDialog, public accountService: AccountService,) {
    this.storage_data_id = this.dataService.getData('redir_storage_data_id');

    this.getRecord(this.storage_data_id);

    this.getCurrentUserPrivilege();
    // this.route.queryParams.subscribe(params => {
    //   this.quoteid = params['quoteid'];
    //   this.opportunityid = params['opportunityid'];
    // });
  }

  public displayedColumns: string[] = ['actions', 'salesorderrefno', 'accountname', 'salesordername', 'quotename', 'opportunityname', 'dealstatusid', 'signature_status', 'paymentstatus', 'modeofpayment', 'createdby', 'createdat', 'modifiedby', 'modifiedat', 'submenu',];

  dataSource!: MatTableDataSource<any>;

  public getRecord(storage_data_id: any) {
    if (storage_data_id) {
      this.dataService.findById(storage_data_id).subscribe({
        next: (response: any) => {
          console.log("Retrieved data:", response);
          this.quoteid = response?.data['quoteid'];
          this.opportunityid = response?.data['opportunityid'];

          this.getSalesorder();
        },
        error: (err) => {
          console.error("Error retrieving data:", err);
        }
      });
    } else {
      this.getSalesorder();
    }

  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Salesorder)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
    // Check if user has at least one action privilege
    const hasActionAccess = this.userPrivilegeObj.editaccess === 1
      || this.userPrivilegeObj.deleteaccess === 1
      || this.userPrivilegeObj.printaccess === 1
      || this.userPrivilegeObj.viewaccess === 1;

    if (!hasActionAccess) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    }
  }





  async ngOnInit() {
    this.currentuser = await this.customerService.getCurrentUser();
    const obj = this.currentuser ? this.currentuser : "";
    this.role_id = obj[0]?.role_id;
    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.Salesorder, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);
      this.privilege = Result2.data.find(
        ele => ele.child_module_id === ModuleIdList.SalesorderActivity
      );
      console.log("Privilege  this.privilege", this.privilege);
      const miscPrivileges = Result2.miscPrivileges || [];
      this.privilegesMap = {
        allowPrintSalesContract: miscPrivileges.some(p => p.misc_name === 'PRINT_SALES_CONTRACT' && p.access && p.mapping_field_status),
        allowPrintProformaInvoice: miscPrivileges.some(p => p.misc_name === 'PRINT_PROFORMA_INVOICE' && p.access && p.mapping_field_status),
         allowPrintSalesOrder: miscPrivileges.some(p => p.misc_name === 'PRINT_SALES_ORDER' && p.access && p.mapping_field_status),
        allowCopyLink: miscPrivileges.some(p => p.misc_name === 'SALES_CONTRACT_ALLOW_COPY_LINK' && p.access && p.mapping_field_status),
        allowSignLink: miscPrivileges.some(p => p.misc_name === 'SALES_CONTRACT_SIGN_LINK' && p.access && p.mapping_field_status),
        allowSendEmail: miscPrivileges.some(p => p.misc_name === 'SALES_CONTRACT_ALLOW_SEND_EMAIL' && p.access && p.mapping_field_status),

        isFinanceAccess: miscPrivileges.some(p => p.misc_name === 'VIEW_SALES_ORDER_PAYMENT_DIV' && p.access && p.mapping_field_status),
      };

      // Check if user has at least one submenu privilege
      const hasRelatedccess = this.privilegesMap.allowPrintProformaInvoice
        || this.privilegesMap.allowPrintSalesContract
        || this.privilege?.create_access
        || this.privilege?.delete_access
        || this.privilegesMap.allowSignLink || this.privilegesMap.allowPrintSalesOrder
      if (!hasRelatedccess) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'submenu');
      }
    });

    this.accountTotalList = await this.accountService.get().toPromise();
    this.accountFilterList = this.accountTotalList;
  }

  getSalesorder() {
    debugger
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }

    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }
    this.salesOrderService.getsalesorderwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getSalesorder", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });


  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.loading = false;
  }



  public viewRecord(items: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_salesorder",
      value: { salesorderid: items.salesorderid, isEdit: "VIEW",
        isFinanceAccess:this.privilegesMap.isFinanceAccess
       }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-salesorder']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  public addRecord() {
    let obj = {
      key: "app_salesorder",
      value: { isEdit: "ADD",isFinanceAccess:this.privilegesMap.isFinanceAccess }
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-salesorder']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  public editRecord(items: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_salesorder",
      value: { salesorderid: items.salesorderid, isEdit: "EDIT",isFinanceAccess:this.privilegesMap.isFinanceAccess }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-salesorder']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public async downloadSOpdf(ele: any, title: any) {
    let obj = {
      key: "app_salesorder",
      value: { salesorderid: ele.salesorderid, title: title },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('pdf_storage_data_id', response.storage_data_id);
        this.router.navigate(['sales-order/salesorderpdf']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public async downloadSCpdf(ele: any, title: any) {

    let obj = {
      key: "app_salesorder",
      value: { salesorderid: ele.salesorderid, },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('pdf_storage_data_id', response.storage_data_id);
        this.router.navigate(['sales-contract']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  public gotoactivity(ele: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_salesorder",
      value: {
        entitytype: 'SALESORDER',
        entityid: ele.salesorderid, name: ele.salesordername
      },
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
        return 'Unknown';
    }
  }


  onPageChange(event) {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize
    }
    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }

    if (this.accountname) {
      obj.accountname = this.accountname;
    }

    this.salesOrderService.getsalesorderwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getopportunitywithpagination", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }

  applyFilter(event: Event) {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1, "dealstatusid": this.dealstatusid,
      "pageSize": this.PAGE_SIZE
    }
    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }
    this.salesOrderService.getsalesorderwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }

  selectionFilterChange(event: any) {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "dealstatusid": this.dealstatusid,
      "createdat": this.addOneDay(this.createdat),
      "modifiedat": this.addOneDay(this.modifiedat),
    }
    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }


    if (this.accountname) {
      obj.accountname = this.accountname;
    }

    this.salesOrderService.getsalesorderwithpagination(obj).pipe()
      .subscribe((data: any) => {
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loading = false;
        this.loadRecord();
      });
  }

  addOneDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  clearSearch() {
    this.search = "";
    this.modifiedat = "";
    this.createdat = "";
    this.dealstatusid = "";
    this.accountname = "";
    // this.ngOnInit();

    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1, "dealstatusid": this.dealstatusid,
      "pageSize": this.PAGE_SIZE
    }
    if (this.quoteid) {
      obj.quoteid = this.quoteid;
    }
    if (this.opportunityid) {
      obj.opportunityid = this.opportunityid;
    }
    this.salesOrderService.getsalesorderwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });

  }

  isBeforeExpiryDate(expiryDate: string): boolean {
    let role_id = this.currentuser[0] && this.currentuser[0].role_id;
    if (role_id == 1) {
      return true
    }
    const currentDate = new Date();
    const expiry = new Date(expiryDate);

    // Remove time portion by resetting time to midnight
    currentDate.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    return currentDate <= expiry;

  }


  public accountFiltered(item: any) {
    return this.accountFilterList && this.accountFilterList.find((ele: any) => ele.accountname == item.accountname);
  }

  ngOnDestroy() {
    this.dataService.clearData('redir_storage_data_id');
  }

  public openPopup(items: any) {
    debugger
    items.privilegesMap = this.privilegesMap;
    const dialogRef = this.dialog.open(SignLinkComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {

      this.getSalesorder();
    });
  }

  async onDeleteStatusChange(salesorderid: any) {


    Swal.fire({
      title: 'Do you want to delete the sales order? Once deleted, it cannot be Re-activated. Proceed?',
      icon: 'question',
      //text:checkProduct.tables,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let result = await this.salesOrderService.deleteSalesOrderById(salesorderid).toPromise();
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: result.message,
          icon: 'success',
        });
        this.getRecord(this.storage_data_id);


      }
    })
  }


}



