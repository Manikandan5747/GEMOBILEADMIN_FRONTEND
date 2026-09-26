import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { OpportunityService } from "./opportunity.service";
import Swal from 'sweetalert2';
import { QuotationService } from "../quotation/quotation.service";
import { ConvertQuoteComponent } from "./convert-quote/convert-quote.component";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { AccountService } from "../account/account.service";
import { EditContactFormComponent } from "../account/edit-contact-form/edit-contact-form.component";
import { CampaignsService } from "../campaigns/campaigns.service";
import { StageService } from "../stage/stage.service";
import { DataService } from "src/app/service/encryption/data.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { ErrorlogService } from "src/app/errorlog.service";

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {
  accountname: any;
  name: any;
  modifiedat: any;
  createdat: any;
  stagename: any;
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
  userPrivilegeObj: any;
  totalItemCount: any;
  accountTotalList: any = [];
  campaignList: any = [];
  stageList: any = [];
  stageFilterList: any;
  accountFilterList: any;
  campaignFilterList: any;
  userQuotePrivilegeObj: any;
  userSalesorderPrivilegeObj: any;
  currentuser: any;
  role_id: any;
  privilege: any;
  userTestDrivePrivilegeObj: any;
  testdriveprivilege: any;

  constructor(public campaignsService: CampaignsService, private customerService: CustomerService, private opportunityService: OpportunityService, private router: Router, private quotationService: QuotationService, public accountService: AccountService, private dataService: DataService,
    private route: ActivatedRoute, private manageModuleService: ManageModuleService, private stageService: StageService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege();
  }

  public displayedColumns: string[] = ['actions', 'opportunityrefno', 'opportunityname', 'accountname', 'firstname', 'stagename', 'name', 'createdby', 'createdat', 'modifiedby', 'modifiedat', 'submenu',];

  dataSource!: MatTableDataSource<any>;

  async ngOnInit() {
    this.getOpportunity();
    this.accountTotalList = await this.accountService.get().toPromise();
    this.campaignList = await this.campaignsService.getCampaigns().toPromise();
    this.campaignFilterList = this.campaignList;
    this.accountFilterList = this.accountTotalList;
    this.stageList = await this.stageService.getStage().toPromise();
    this.stageFilterList = this.stageList;

    this.currentuser = await this.customerService.getCurrentUser();
    const obj = this.currentuser ? this.currentuser : "";
    this.role_id = obj[0]?.role_id;
    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.Opportunity, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);
      this.privilege = Result2.data.find(
        ele => ele.child_module_id === ModuleIdList.OpportunityActivity
      );

      this.testdriveprivilege = Result2.data.find(
        ele => ele.child_module_id === ModuleIdList.OpportunityTestDrive
      );
      console.log("Privilege  this.privilege", this.privilege);


      console.log("this.userQuotePrivilegeObj", this.userQuotePrivilegeObj);
      console.log("this.userSalesorderPrivilegeObj", this.userSalesorderPrivilegeObj);

      // Check if user has at least one submenu privilege
      const hasRelatedccess = this.userQuotePrivilegeObj.viewaccess
        || this.userSalesorderPrivilegeObj.viewaccess
        || this.testdriveprivilege?.create_access || this.testdriveprivilege?.edit_access
        || this.privilege.create_access || this.privilege.edit_access;
      if (!hasRelatedccess) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'submenu');
      }
    });
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Opportunity);



    this.userQuotePrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Quote);

    // Check if user has at least one action privilege
    const hasActionAccess = this.userPrivilegeObj.editaccess === 1
      || this.userPrivilegeObj.deleteaccess === 1
      || this.userPrivilegeObj.viewaccess === 1 || this.userQuotePrivilegeObj.createaccess === 1

    if (!hasActionAccess) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    }

    this.userSalesorderPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Salesorder)

    this.userTestDrivePrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.TestDrive)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  getOpportunity() {
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE
    }
    this.opportunityService.getopportunitywithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("getopportunitywithpagination", data);
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


  public addRecord() {
    let obj = {
      key: "app_opportunity",
      value: { isEdit: "ADD" }
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-opportunity']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  public editRecord(items: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_opportunity",
      value: { opportunityid: items.opportunityid, isEdit: "EDIT" }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-opportunity']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  public async convertOpportunity(enteredData: any) {
    if ((enteredData.opportunity_details[0] && enteredData.opportunity_details[0]?.carshowroom_id === null) ||
      (enteredData.opportunity_details[0] && enteredData.opportunity_details[0]?.opportunitydettbid === null)) {
      this.errorlogService.logManualValidationError(`opportunity component|convertOpportunity()|Zero Product Enquiry. Please add products and convert to quote.`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Zero Product Enquiry. Please add products and convert to quote.",
        icon: 'info'
      });
      return
    } else {

      await this.accountService.getByID(enteredData.accountid).pipe().subscribe((data: any) => {
        console.log("getByID", data);
        data.salestype = enteredData.salestype;

        const showMissingDetailsAlert = () => {
          this.errorlogService.logManualValidationError(`opportunity component|convertOpportunity()|Check Your Account details some details are missing.`);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            title: "Check Your Account details some details are missing.",
            icon: 'info'
          });
          data.passport = "true";
          this.editAccountRecord(data);
        };

        const openDialog = () => {
          const dialogRef = this.dialog.open(ConvertQuoteComponent, {
            width: '500px',
            data: enteredData
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'Success') {
              this.ngOnInit();
            }
          });
        };

        if (data.leadtype === "company") {
          if (data.tradelicenno === undefined || data.tradelicenno === null || data.trnnumber === undefined || data.trnnumber === null) {
            showMissingDetailsAlert();
          } else {
            openDialog();
          }
        } else {
          if (data.emiratesid === undefined || data.emiratesid === null) {
            showMissingDetailsAlert();
          } else {
            openDialog();
          }
        }
      });

    }

  }

  public redirectionQuotes(ele: any) {
    let obj = {
      key: "app_quote",
      value: { redirection: true, opportunityrefno: ele.opportunityrefno },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('quote_storage_data_id', response.storage_data_id);
        this.router.navigate(['quotation']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  public redirectionSO(ele: any) {
    let obj = {
      key: "app_quote",
      value: { redirection: true, opportunityid: ele.opportunityid },
    };

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




  public viewRecord(items: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_opportunity",
      value: { opportunityid: items.opportunityid, isEdit: "VIEW" }
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['create-opportunity']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  public gotoactivity(ele: any) {
    // Create an object to store the key and value for 'VIEW'
    let obj = {
      key: "app_opportunity",
      value: {
        entitytype: 'OPPORTUNITY',
        entityid: ele.opportunityid, name: ele.opportunityname
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

  public editAccountRecord(items: any) {
    const dialogRef = this.dialog.open(EditContactFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // if (result == 'Success') {

      // }
    });
  }

  clearSearch() {
    this.search = "";
    this.accountname = "";
    this.modifiedat = "";
    this.createdat = "";
    this.stagename = "";
    this.name = "";
    this.ngOnInit();
  }


  async testdrive(enteredData: any) {

    if ((enteredData.opportunity_details[0] && enteredData.opportunity_details[0]?.carshowroom_id === null) ||
      (enteredData.opportunity_details[0] && enteredData.opportunity_details[0]?.opportunitydettbid === null)) {
        this.errorlogService.logManualValidationError(`opportunity component|testdrive()|Zero Product Enquiry. Please add products and convert to quote.`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Zero Product Enquiry. Please add products and convert to quote.",
        icon: 'info'
      });
      return
    } else {


      await this.accountService.getByID(enteredData.accountid).pipe().subscribe((data: any) => {
        console.log("getByID", data);
        data.salestype = enteredData.salestype;

        const showMissingDetailsAlert = () => {
          this.errorlogService.logManualValidationError(`opportunity component|testdrive()|Check Your Account details some details are missing.`);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            title: "Check Your Account details some details are missing.",
            icon: 'info'
          });
          data.passport = "true";
          this.editAccountRecord(data);
        };

        const openDialog = () => {
          const dialogRef = this.dialog.open(ConvertQuoteComponent, {
            width: '500px',
            data: enteredData
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'Success') {
              this.ngOnInit();
            }
          });
        };

        if (data.leadtype === "company") {
          if (data.tradelicenno === undefined || data.tradelicenno === null || data.trnnumber === undefined || data.trnnumber === null) {
            showMissingDetailsAlert();
          } else {

            let obj = {
              key: "app_opportunity",
              value: { opportunityid: enteredData.opportunityid, },
            };

            this.dataService.createData(obj).subscribe({
              next: (response) => {
                console.log("Data saved successfully:", response);
                this.dataService.setData('storage_data_id', response.storage_data_id);
                this.router.navigate(['test-drive']);
              },
              error: (err) => {
                console.error("Error saving data:", err);
              }
            });

          }
        } else {
          if (data.emiratesid === undefined || data.emiratesid === null) {
            showMissingDetailsAlert();
          } else {

            let obj = {
              key: "app_opportunity",
              value: { opportunityid: enteredData.opportunityid, },
            };

            this.dataService.createData(obj).subscribe({
              next: (response) => {
                console.log("Data saved successfully:", response);
                this.dataService.setData('storage_data_id', response.storage_data_id);
                this.router.navigate(['test-drive']);
              },
              error: (err) => {
                console.error("Error saving data:", err);
              }
            });

          }
        }
      });
    }
  }


  onPageChange(event) {
    this.loading = true;
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": event.pageIndex + 1,
      "pageSize": event.pageSize
    }
    this.opportunityService.getopportunitywithpagination(obj).pipe()
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
    var obj = {
      "search": this.search ? this.search.trim() : "",
      "page": 1,
      "pageSize": this.PAGE_SIZE,
      "accountname": this.accountname,
      "stagename": this.stagename, "name": this.name,
      "createdat": this.addOneDay(this.createdat),
      "modifiedat": this.addOneDay(this.modifiedat),
    }
    this.opportunityService.getopportunitywithpagination(obj).pipe()
      .subscribe((data: any) => {
        console.log("buycardetails", data);
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
      "accountname": this.accountname,
      "stagename": this.stagename,
      "name": this.name,
      "createdat": this.addOneDay(this.createdat),
      "modifiedat": this.addOneDay(this.modifiedat),
    }
    this.opportunityService.getopportunitywithpagination(obj).pipe()
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

  isStageFiltered(item: any) {
    return this.stageFilterList && this.stageFilterList.find((ele: any) => ele.stagename == item.stagename);
  }

  public accountFiltered(item: any) {
    return this.accountFilterList && this.accountFilterList.find((ele: any) => ele.accountname == item.accountname);
  }

  isCampaignFiltered(item: any) {
    return this.campaignFilterList && this.campaignFilterList.find((ele: any) => ele.name == item.name);
  }

  async onDeleteStatusChange(opportunityid: any) {
    let checkProduct = await this.opportunityService.checkOpportunityAvailability(opportunityid).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`opportunity component|onDeleteStatusChange()|This opportunity cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
      Swal.fire({
        title: "This opportunity cannot be deleted because it is associated with Other Module. Please review the related pages below.",
        // toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        text: checkProduct.tables,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Do you want to delete the opportunity? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.opportunityService.deleteOpportunityById(opportunityid).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });
          this.getOpportunity();


        }
      })


    }

  }

}








