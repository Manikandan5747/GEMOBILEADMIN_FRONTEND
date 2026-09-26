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
import { EditContactFormComponent } from "./edit-contact-form/edit-contact-form.component";
import { AddContactFormComponent } from "./add-contact-form/add-contact-form.component";
import { AccountService } from "./account.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { TypeConfigService } from "../type-config/type-config.service";
import { Clipboard } from '@angular/cdk/clipboard';
import { DataService } from "src/app/service/encryption/data.service";
import { ErrorlogService } from "src/app/errorlog.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  typename: any;
  modifiedat: any;
  createdat: any;
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
  userPrivilegeObj: any;
  currentuser: any;
  editicon: boolean = false;
  totalItemCount: any;
  typeDetailsList: any;
  typeFilterList: any;
  userPrivilegContactObj: any;
  role_id: any;
  constructor(public typeConfigService: TypeConfigService, private customerService: CustomerService, private accountService: AccountService, private router: Router, private dataService: DataService,
    private route: ActivatedRoute, private clipboard: Clipboard, public dialog: MatDialog,private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege();
  }

  public displayedColumns: string[] = ['actions', 'salutation', 'accountname', 'leadtype', 'accountcode', 'typename', 'mobile', 'createdby', 'createdat', 'modifiedby', 'modifiedat','submenu'];

  dataSource!: MatTableDataSource<any>;


  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Geaccount);
     this.userPrivilegContactObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.Gecontact)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

    // Check if user has at least one action privilege
    const hasActionAccess = this.userPrivilegeObj.editaccess === 1
      || this.userPrivilegeObj.deleteaccess === 1;

    if (!hasActionAccess) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    }

     // Check if user has at least one submenu privilege
      const hasRelatedccess = this.userPrivilegContactObj.listaccess
        || this.userPrivilegContactObj.editaccess;
      if (!hasRelatedccess) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'submenu');
      }

  }

  async ngOnInit() {
    let currentuser = await this.customerService.getCurrentUser();
    let currentuserroleid = currentuser && currentuser[0].role_id;
    if (currentuserroleid == 1) {
      // this.editicon = true;
    }

    await this.typeConfigService.getAccounttypeConfig().pipe()
      .subscribe((data: any) => {
        console.log("getAccounttypeConfig", data);
        this.typeDetailsList = data;
        this.typeFilterList = this.typeDetailsList;
      });




         
    // const obj = this.currentuser ? this.currentuser : "";
    // this.role_id = obj[0]?.role_id;
    // this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.Lead, this.role_id).subscribe((Result2: any) => {
    //   console.log("Privilege Result2", Result2);
    //   this.privilege = Result2.data.find(
    //     ele => ele.child_module_id === ModuleIdList.LeadActivity
    //   );
    //   console.log("Privilege  this.privilege", this.privilege);

    //   // Check if user has at least one submenu privilege
    //   const hasRelatedccess = this.privilege.create_access
    //     || this.privilege.edit_access;
    //   if (!hasRelatedccess) {
    //     this.displayedColumns = this.displayedColumns.filter(col => col !== 'submenu');
    //   }

    // });

    this.getAccount();
  }

  copyLink(ele: string) {
    this.clipboard.copy(ele);
    // this.success("Mobile Copied to Clipboard");
  }


  getAccount() {
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    this.accountService.getaccountwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getAccount", data);
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





  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "typename": this.typename,
      "createdat": this.addOneDay(this.createdat),
      "modifiedat": this.addOneDay(this.modifiedat),
    }

    this.accountService.getaccountwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getaccountwithpagination", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }

  public addRecord() {
    this.router.navigate(['/account/create-account']);
  }



  public editRecord(items: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_account",
      value: { accountid: items.accountid },
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['account/create-account']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }






  public gotoactivity(ele: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_account",
      value: {
        entitytype: 'ACCOUNT',
        entityid: ele.accountid, name: ele.accountname
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



  public gotocontact(ele: any) {
    let obj = {
      key: "app_contact",
      value: { accountid: ele.accountid },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('parent_storage_data_id', response.storage_data_id);
        this.router.navigate(['contact']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  onPageChange(event) {
    console.log('Pagination event:', event);
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize,
      "typename": this.typename,
      "createdat": this.addOneDay(this.createdat),
      "modifiedat": this.addOneDay(this.modifiedat),
    }
    this.accountService.getaccountwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getaccountwithpagination", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loadRecord();
      });
  }


  selectionFilterChange(event: any) {
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "typename": this.typename,
      "createdat": this.addOneDay(this.createdat),
      "modifiedat": this.addOneDay(this.modifiedat),
    }
    this.accountService.getaccountwithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getaccountwithpagination", data);
        this.dataSource = new MatTableDataSource<any>([]);
        this.List = data.data;
        this.totalItemCount = data.total_count;
        this.loading = false;
        this.loadRecord();
      });
  }



  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

  clearSearch() {
    this.search = "";
    this.typename = "";
    this.modifiedat = "";
    this.createdat = "";
    this.ngOnInit();
  }



  addOneDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  istypeFiltered(item: any) {
    return this.typeFilterList.find((ele: any) => ele.typename == item.typename);
  }

  async onDeleteStatusChange(accountid: any) {
    let checkProduct = await this.accountService.checkAccountAvailability(accountid).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`contact component|onDeleteStatusChange()|This Account cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
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
        title: 'Do you want to delete the Account? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.accountService.deleteAccountById(accountid).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });
          this.getAccount();


        }
      })
    }
  }

}


