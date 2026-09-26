import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { QuotationService } from "./quotation.service";
import Swal from 'sweetalert2';
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { AccountService } from "../account/account.service";
import { DataService } from "src/app/service/encryption/data.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { ErrorlogService } from "src/app/errorlog.service";

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit, OnDestroy {
  modifiedat: any;
  createdat: any;
  userPrivilegeObj: any;
  currentUser: any;
  formData = new FormData();
  loading: boolean = false;
  search: any = "";
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List: any = [];
  dynamicTableData!: any[];
  redirection: boolean = false;
  opportunityrefno: any;
  currentuser: any;
  totalItemCount: any;
  accountTotalList: any;
  accountFilterList: any;
  accountname: any;
  storage_data_id: any;
  userSalesorderPrivilegeObj: any;
  role_id: any;
  privilege: any;
  constructor(public toastr: ToastrService, private manageModuleService: ManageModuleService, private customerService: CustomerService, private quotationService: QuotationService, private router: Router, private dataService: DataService, public accountService: AccountService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
    // this.route.queryParams.subscribe(params => {
    //   this.redirection = params['redirection'];
    //   this.opportunityrefno = params['opportunityrefno'];
    // }); 
    this.storage_data_id = this.dataService.getData('quote_storage_data_id');
    this.getRecord(this.storage_data_id);
    this.getCurrentUserPrivilege();
  }

  public getRecord(storage_data_id: any) {
    if (storage_data_id) {
      this.dataService.findById(storage_data_id).subscribe({
        next: (response: any) => {
          console.log("Retrieved data:", response);
          this.redirection = response?.data['redirection'];
          this.opportunityrefno = response?.data['opportunityrefno'];

          this.getquotation();
        },
        error: (err) => {
          console.error("Error retrieving data:", err);
        }
      });
    } else {
      this.getquotation();
    }

  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Quote);

    this.userSalesorderPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Salesorder)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

     // Check if user has at least one action privilege
    const hasActionAccess = this.userPrivilegeObj.editaccess === 1
      || this.userPrivilegeObj.deleteaccess === 1
      || this.userPrivilegeObj.viewaccess === 1 || this.userPrivilegeObj.printaccess === 1

    if (!hasActionAccess) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    }

  }

  public displayedColumns: string[] = ['actions',  'quoterefno', 'accountname', 'quotename', 'opportunityname', 'createdby', 'createdat', 'modifiedby', 'modifiedat','submenu',];

  dataSource!: MatTableDataSource<any>;

  async ngOnInit() {
    this.currentuser = await this.customerService.getCurrentUser();
    const obj = this.currentuser ? this.currentuser : "";
    this.role_id = obj[0]?.role_id;

    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.Quote, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);
      this.privilege = Result2.data.find(
        ele => ele.child_module_id === ModuleIdList.QuoteActivity
      );
      console.log("Privilege  this.privilege", this.privilege);

        // Check if user has at least one submenu privilege
      const hasRelatedccess = this.userSalesorderPrivilegeObj.viewaccess 
        || this.privilege.create_access || this.privilege.edit_access;
      if (!hasRelatedccess) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'submenu');
      }
    });


    this.accountTotalList = await this.accountService.get().toPromise();
    this.accountFilterList = this.accountTotalList;
  }



  public async downloadQuotepdf(ele: any) {
    let obj = {
      key: "app_quotation",
      value: { quoteid: ele.quoteid },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['quotation/quotepdf']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  getquotation() {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    if (this.redirection) {
      obj.opportunityrefno = this.opportunityrefno;
    }
    this.quotationService.getquotationwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getquotationwithpagination", data);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.loading = false;
  }


  public addRecord() {
    let obj = {
      key: "app_quotation",
      value: { isEdit: "ADD" }
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-quotation']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  public editRecord(items: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_quotation",
      value: { quoteid: items.quoteid, isEdit: "EDIT" }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-quotation']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  public viewRecord(items: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_quotation",
      value: { quoteid: items.quoteid, isEdit: "VIEW" }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-quotation']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  // redirectionSales(ele: any) {
  //   var navigationExtras = {
  //     queryParams: { quoteid: ele.quoteid },
  //   };
  //   this.router.navigate(['/sales-order'], navigationExtras);
  // }


  public redirectionSales(items: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_salesorder",
      value: { quoteid: items.quoteid }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('redir_storage_data_id', response.storage_data_id);
        this.router.navigate(['sales-order']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  // public convertSales(enteredData: any) {
  //   this.formData = new FormData();
  //   this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  //   const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
  //   enteredData.userid = obj[0]?.login_id;
  //   enteredData.salesordername = enteredData.quotename;
  //   for (let ele in enteredData) {
  //     this.formData.append(ele, enteredData[ele]);
  //   }
  //   this.salesOrderService.createSalesorder(this.formData).subscribe(
  //     async (response: any) => {
  //       console.log("response",response);
  //       if(response.success){
  //         Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'success', });
  //         this.router.navigate(['sales-order']);
  //       }else{
  //         Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'info', });
  //       }

  //     });

  // }

  public gotoactivity(ele: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_quotation",
      value: {
        entitytype: 'QUOTE',
        entityid: ele.quoteid, name: ele.quotename
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

  onPageChange(event) {
    this.loading = true;
    var obj: any = {
      "search": this.search ? this.search.trim() : "",
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize
    }
    if (this.redirection) {
      obj.opportunityrefno = this.opportunityrefno;
    }
    this.quotationService.getquotationwithpagination(obj).pipe()
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
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    if (this.redirection) {
      obj.opportunityrefno = this.opportunityrefno;
    }

    if (this.accountname) {
      obj.accountname = this.accountname;
    }
    this.quotationService.getquotationwithpagination(obj).pipe()
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
      "createdat": this.addOneDay(this.createdat),
      "modifiedat": this.addOneDay(this.modifiedat),
    }
    if (this.redirection) {
      obj.opportunityrefno = this.opportunityrefno;
    }

    if (this.accountname) {
      obj.accountname = this.accountname;
    }
    this.quotationService.getquotationwithpagination(obj).pipe()
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
    this.accountname = "";
    this.ngOnInit();
  }
  public accountFiltered(item: any) {
    return this.accountFilterList && this.accountFilterList.find((ele: any) => ele.accountname == item.accountname);
  }


  ngOnDestroy() {
    this.dataService.clearData('quote_storage_data_id');
  }


    async onDeleteStatusChange(quoteid: any) {
      let checkProduct = await this.quotationService.checkQuotationAvailability(quoteid).toPromise();
      console.log('Delete status check result:', checkProduct);
      if (checkProduct.status) {
        this.errorlogService.logManualValidationError(`quotation component|onDeleteStatusChange()|This quotation cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
        Swal.fire({
          title: "This quotation cannot be deleted because it is associated with Other Module. Please review the related pages below.",
          // toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          text: checkProduct.tables,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Do you want to delete the quotation? Once deleted, it cannot be Re-activated. Proceed?',
          icon: 'question',
          //text:checkProduct.tables,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then(async (result) => {
          if (result.isConfirmed) {
            let result = await this.quotationService.deleteQuotationById(quoteid).toPromise();
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

    
}



