import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { TestDriveService } from "./test-drive.service";
import { TestDriveWindowComponent } from "./test-drive-window/test-drive-window.component";
import { OpportunityService } from "../opportunity/opportunity.service";

import { Location } from '@angular/common'; // Import Location service
import { CustomerService } from "src/app/service/customer/customer.service";
import { DataService } from "src/app/service/encryption/data.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { ModuleIdList } from "src/app/common/enum";

@Component({
  selector: 'app-test-drive',
  templateUrl: './test-drive.component.html',
  styleUrls: ['./test-drive.component.css']
})
export class TestDriveComponent implements OnInit, OnDestroy {

  opportunityid: any;
  loading: boolean = false;
  search: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List: any = [];
  dynamicTableData!: any[];
  opportunity_details: any;
  currentuser: any;
  storage_data_id: any;
  role_id: any;
  privilege: any;

  constructor(public toastr: ToastrService, private location: Location, private testDriveService: TestDriveService, private router: Router, private dataService: DataService, private cookieService: CookieService, private manageModuleService: ManageModuleService,
    private route: ActivatedRoute, private customerService: CustomerService, private opportunityService: OpportunityService, public dialog: MatDialog) {
    // this.route.queryParams.subscribe(params => {
    //   this.opportunityid = params['opportunityid'];
    // })

    this.storage_data_id = this.dataService.getData('storage_data_id');
    if (this.storage_data_id) {
      this.getRecord(this.storage_data_id);
    } else {
      this.getTestDrive();
      this.getCurrentUserPrivilege()
    }
  }

  public displayedColumns: string[] = ['actions', 'testdriverefno', 'opportunityname', 'carshowroomrefno', 'brandname', 'modelname', 'chasisno', 'date', 'time', 'accompanying_test_drive', 'createdby', 'created_at',];

  dataSource!: MatTableDataSource<any>;



  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        console.log("Retrieved data:", response);
        this.opportunityid = response?.data['opportunityid'];
        if (this.opportunityid) {
          this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.Opportunity, this.role_id).subscribe((Result2: any) => {
            console.log("Privilege Result2", Result2);
            this.privilege = Result2.data.find(
              ele => ele.child_module_id === ModuleIdList.OpportunityTestDrive
            );
            console.log("Privilege  this.privilege", this.privilege);
          });
        } else {
          this.getCurrentUserPrivilege()
        }
        this.getTestDrive();
        this.currentuser = await this.customerService.getCurrentUser();
        if (this.opportunityid) {
          await this.opportunityService.getByIdOpportunity(this.opportunityid).pipe()
            .subscribe(async (data: any) => {
              console.log("getByIdOpportunity", data);
              this.opportunity_details = data[0] && data[0].opportunity_details;
            });
        }
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  async ngOnInit() {
    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;
  }

  async getCurrentUserPrivilege() {
    this.privilege = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.privilege = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.TestDrive)
    console.log("getCurrentUserPrivilege this.privilege", this.privilege);
  }

  async getTestDrive() {
    this.loading = true;

    if (this.opportunityid) {
      await this.testDriveService.getTestDrive(this.opportunityid).pipe()
        .subscribe((data: any) => {
          this.loading = false;
          console.log("getTestDrive", data);
          this.List = data;
          this.loadRecord();
        });
    } else {

      await this.testDriveService.getAllTestDrives().pipe()
        .subscribe((data: any) => {
          this.loading = false;
          console.log("getTestDrive", data);
          this.List = data;
          this.loadRecord();
        });
    }

  }

  loadRecord() {


    let dataSource = this.List.map(element => {
      const date = new Date(element.date);
      date.setDate(date.getDate() + 1);  // Add one day
      return { ...element, date };       // Replace the original date
    });
    this.dataSource = new MatTableDataSource(dataSource);
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
    const dialogRef = this.dialog.open(TestDriveWindowComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
      data: { opportunityid: this.opportunityid, opportunity_details: this.opportunity_details }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      debugger
      // this.ngOnInit();



      this.storage_data_id = this.dataService.getData('storage_data_id');
      if (this.storage_data_id) {
        this.getRecord(this.storage_data_id);
      } else {
        this.getTestDrive();
      }

    });

  }

  public downloadRecord(element: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_testdrive",
      value: {
        date: element.date, time: element.time, opportunityid: element.opportunityid, customer: element.customer, carshowroom_id: element.carshowroom_id,
        testdrive_id: element.testdrive_id,

        storage_data_id: this.storage_data_id
      },
    };

    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('pdf_storage_data_id', response.storage_data_id);
        this.router.navigate(['opportunity/test-drive']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }

  formatTime(value: string | Date): string {
    let date: Date;

    if (typeof value === 'string') {
      // If value is a string in HH:MM:SS format
      const [hours, minutes, seconds] = value.split(':').map(Number);

      // Create a Date object with a specific date but the provided time
      date = new Date(1970, 0, 1, hours, minutes, seconds);
    } else {
      // If value is already a Date object
      date = value;
    }

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero if necessary

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  ngOnDestroy() {
    this.dataService.clearData('storage_data_id');
  }

}


