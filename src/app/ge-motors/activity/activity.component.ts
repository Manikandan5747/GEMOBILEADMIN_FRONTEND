import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { ActivityService } from "./activity.service";
import { DataService } from "src/app/service/encryption/data.service";
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit,OnDestroy {

 
  // @Input('entitytype') entitytype!: any;
  // @Input('entityid') entityid!: any; 
  // @Input('name') name!: any;

  
  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  activityList: any;
  storage_data_id: any;
  entityid: any;
  entitytype: any;
  name: any;
  constructor(public toastr: ToastrService,private router: Router,
    private customerService:CustomerService, private route: ActivatedRoute, private cookieService: CookieService,private activityService:ActivityService, private dataService: DataService,public dialog: MatDialog) {

      this.storage_data_id = this.dataService.getData('storage_data_id');
      this.getRecord(this.storage_data_id);
      // this.route.queryParams.subscribe(params => {
      //   this.entityid = params['entityid'];
      //   this.entitytype = params['entitytype'];
      //   this.name = params['name'];
      //   // this.closedactivity = params['closedactivity'];  
      // });
    }


    public getRecord(storage_data_id: any) {
      this.dataService.findById(storage_data_id).subscribe({
        next: (response: any) => {
          console.log("Retrieved data:", response);
          this.entityid = response?.data?.entityid;
          this.entitytype = response?.data?.entitytype;
          this.name = response?.data?.name;

          this.getActivity();
        },
        error: (err) => {
          console.error("Error retrieving data:", err);
        }
      });
    }

  public displayedColumns: string[] = ['subject','activitystatus','duedate','priority','username','status', 'createdby', 'createdat','modifiedby','modifiedat','actions'];
  public displayedCompleteActivityColumns: string[] = ['subject','activitystatus','duedate','priority','username','status', 'createdby', 'createdat','modifiedby','modifiedat',];

  openActivityDataSource!: MatTableDataSource<any>;
  compltedActivityDataSource!: MatTableDataSource<any>;

  ngOnInit() {
    
  }


  getActivity() {debugger
    this.loading = true;
    let obj ={
      "entitytype": this.entitytype,
      "entityid": this.entityid
    } 
    this.activityService.getActivity(obj).pipe()
      .subscribe((data: any) => {
        console.log("getActivity", data);
        this.activityList = data;
        this.loadRecordOpenActivity();
        this.loadRecordCompltedActivity();
      });
  }


  loadRecordOpenActivity() {
    let openActivity = this.activityList && this.activityList.filter((ele:any)=> ele.activitystatus != 'Completed');
    this.openActivityDataSource = new MatTableDataSource(openActivity);
    this.loading = false;
  }

  loadRecordCompltedActivity() {
    let completedActivity = this.activityList && this.activityList.filter((ele:any)=> ele.activitystatus == 'Completed');
    this.compltedActivityDataSource = new MatTableDataSource(completedActivity);
    this.loading = false;
  }


  public addRecord() {
    // Create an object to store the key and value for 'ADD'
    let obj = {
      key: "app_activity",
      value: { entitytype: this.entitytype,entityid: this.entityid ,name:this.name},
    };
  
    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('activity_storage_data_id', response.storage_data_id);
        this.router.navigate(['activity/add-edit-activity']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  public editRecord(element: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_activity",
      value: { activityid: element.activityid,name:this.name},
    };
  
    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('activity_storage_data_id', response.storage_data_id);
        this.router.navigate(['activity/add-edit-activity']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }
  
  goback(){
    this.dataService.clearData('storage_data_id');
    history.back();
  }


  getStatusClass(activityStatus: string): string {debugger
    switch (activityStatus) {
        case 'Cancelled':
            return 'cancelled';
        case 'Completed':
            return 'completed';
        case 'In Progress':
            return 'in-progress';
        case 'Missed':
            return 'missed';
        case 'Not Started':
            return 'not-started';
        default:
            return ''; // Default class if no match
    }
}


ngOnDestroy() {
  // this.dataService.clearData('storage_data_id');
  // this.dataService.deleteById(this.storage_data_id).subscribe({
  //   next: (response: any) => {
  //     console.log("deleteById data:", response);
  //   },
  //   error: (err) => {
  //     console.error("Error retrieving data:", err);
  //   }
  // });
}

}


