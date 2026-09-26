import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ModuleIdList } from "src/app/common/enum";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { CookieService } from 'src/app/service/cookie.service';
import { EventService } from "src/app/service/event/event.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-event-customer',
  templateUrl: './manage-event-customer.component.html',
  styleUrls: ['./manage-event-customer.component.css']
})
export class ManageEventCustomerComponent implements OnInit {

  @ViewChild('test1', { static: false }) content!: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  // Filter fields
  customerCodeFilter: string = '';
  createdDateFilter: string = '';
  pushStatusFilter: string = '';
  whatsappStatusFilter: string = '';

  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  List: any[] = [];
  dataSource!: MatTableDataSource<any>;
  userPrivilegeObj: any;
  currentUser: any;
  
  isPageLoading: boolean = false;

  displayedColumns: string[] = [
    'actions',
    'event_planner_title',
    'customername',
    'customercode',
    'mobilenumber',
    'emailid',
    'customertypes',
    'notificationtitle',
    'notificationcontent',
    'app_type_name',
    'whatsapp_status',
    'push_status',
    'mobileappregstatus',
    'status',
    'createdbyname',
    'createddate',
    'modifiedbyname',
    'modifieddate',
    
  ];

  constructor(
    public toastr: ToastrService,
    private EventService: EventService,
    private cookieService: CookieService,
    public dialog: MatDialog
  ) {
    this.getCurrentUserPrivilege();
  }
filters = {
  customercode: '',
  push_status: '',
  whatsapp_status: '',
  created_at: '',
  app_type_name:''
};

  ngOnInit() {
    
    this.isPageLoading = true;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.getActiveCustomerEvents();
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    const tempPrivilege = await this.EventService.getCurrentUserPrivilegeArr();
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Module);
  }

  getActiveCustomerEvents() {
    this.EventService.getEventCustomers().subscribe({
      next: (data: any) => {
        
    this.isPageLoading = false;
        this.List = data;
        this.loadRecord();
      },
      error: (err) => {
        this.toastr.error("Failed to load customer events");
        console.error("getEventCustomers error:", err);
      }
    });
  }

  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setupFilter();
  }

  // ✅ Multi-filter logic
  setupFilter() {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const filters = JSON.parse(filter);

      const codeMatch = !filters.customercode || data.customercode?.toLowerCase().includes(filters.customercode.toLowerCase());
      const dateMatch = !filters.created_at || (data.created_at && new Date(data.created_at).toLocaleDateString().includes(filters.created_at));
      const pushMatch = !filters.push_status || data.push_status?.toLowerCase() === filters.push_status.toLowerCase();
      const whatsappMatch = !filters.whatsapp_status || data.whatsapp_status?.toLowerCase() === filters.whatsapp_status.toLowerCase();

      return codeMatch && dateMatch && pushMatch && whatsappMatch;
    };
  }

 applyFilters() {
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    const filters = JSON.parse(filter);
    return (
      
      (filters.customercode ? data.customercode?.toLowerCase().includes(filters.customercode.toLowerCase()) : true) &&
      (filters.app_type_name ? data.app_type_name?.toLowerCase().includes(filters.app_type_name.toLowerCase()) : true) &&
      (filters.push_status ? data.push_status?.toLowerCase() === filters.push_status.toLowerCase() : true) &&
      (filters.whatsapp_status ? data.whatsapp_status?.toLowerCase() === filters.whatsapp_status.toLowerCase() : true) &&
      (filters.created_at ? (data.created_at?.toLowerCase?.().includes(filters.created_at.toLowerCase())) : true)
    );
  };
  this.dataSource.filter = JSON.stringify(this.filters);
}



clearFilters() {
  this.filters = {
    customercode: '',
    created_at: '',
    push_status: '',
    whatsapp_status: '',
    app_type_name:''
  };

  this.applyFilters(); 
}






  deleteFilter(eventcustid: number) {
    const obj = this.currentUser ? JSON.parse(this.currentUser) : null;
    const userid = obj?.[0]?.login_id;
    if (!userid) {
      this.toastr.error('User not authenticated');
      return;
    }

    Swal.fire({
      text: 'Do you want to delete this Customer Event?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.EventService.deleteEventCustomer(eventcustid, userid).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Event deleted successfully.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
            });
            this.List = this.List.filter(f => f.eventcustid !== eventcustid);
            this.loadRecord();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete Event.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
            });
          }
        });
      }
    });
  }
}
