import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModuleIdList } from "src/app/common/enum";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { EventService } from "src/app/service/event/event.service";
import Swal from "sweetalert2";
import { ManageEventPlannerFilterComponent } from "../manage-event-planner-filter/manage-event-planner-filter.component";

import { Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
@Component({
  selector: 'app-manage-event-planner',
  templateUrl: './manage-event-planner.component.html',
  styleUrls: ['./manage-event-planner.component.css']
})
export class ManageEventPlannerComponent implements OnInit {

  @ViewChild('test1', { static: false }) content!: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  search: string = '';
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  error = '';
  List: any[] = [];
  userPrivilegeObj: any;
  uploading = false;
  isPageLoading: boolean = false;

  calendarDayFilter: string = '';
  countryFilter: string = '';
  createdDateFilter: any;
  filteredCountries: any[] = [];
  allCountries: any[] = [];
  public displayedColumns: string[] = [
    'actions',
    'event_name',
    'event_planner_title',
    'calendar_day',
    'event_start_date',
    'event_end_date',
    'iseventyearly',
    'event_planner_expiry_days',
    'event_planner_image',
    'banner_image',
    'schedule_type',
    'mode_of_message',
    'template_name',
    'event_planner_status',
    'created_by',
    'created_at',
    'modified_by',
    'modified_at'
  ];
  dataSource!: MatTableDataSource<any>;
  filters: any;
  eventPlannerId: any;


  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private eventService: EventService,
    private router: Router,
    private eventPlannerService: EventService,
    private snackBar: MatSnackBar
    
  ) {
    this.getCurrentUserPrivilege();
  }

  ngOnInit() {
    this.isPageLoading = true;
      
  this.eventPlannerId = this.eventService.getPlannerId();

  
    if (this.eventPlannerId) {
      console.log('Event Planner ID:', this.eventPlannerId);

      this.eventService.getEventPlannerFiltersById(this.eventPlannerId)
        .subscribe({
          next: (res) => {
            
    this.isPageLoading = false;
            this.filters = res.data || [];
            console.log('Filters:', this.filters);
          },
          error: (err) => {
            
    this.isPageLoading = false;
            console.error('Error fetching filters:', err);
          }
        });
    } else {
      
      this.isPageLoading = false;
      console.warn('Event Planner ID not found!');
     
    }
    
    this.getActiveEventsPlannerList();
    this.loadCountries();
  }

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    const tempPrivilege = await this.eventService.getCurrentUserPrivilegeArr();
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.Module);
  }
loadCountries() {
  this.eventService.getCountry().subscribe({
    next: (res: any) => {
      this.allCountries = res?.data || []; 
      this.filteredCountries = []; 
    },
    error: (err) => {
      console.error('Error fetching countries', err);
      this.allCountries = [];
      this.filteredCountries = [];
    },
  });
}


onCountryInput() {
  if (!this.countryFilter || this.countryFilter.trim() === '') {
    this.filteredCountries = [];
    this.applyFilters();
    return;
  }

  this.filteredCountries = this.allCountries.filter(c =>
    c.country_name.toLowerCase().includes(this.countryFilter.toLowerCase())
  );
}
  getActiveEventsPlannerList() {
    this.eventService.getActiveEventPlanner().subscribe((data: any) => {
      this.List = data;
      this.loadRecord();
    });
  }
applyFilters() {
  let filteredData = this.List;

  if (this.calendarDayFilter) {
    filteredData = filteredData.filter((item: any) =>
      item.calendar_day?.toLowerCase().includes(this.calendarDayFilter.toLowerCase())
    );
  }

  if (this.countryFilter) {
    filteredData = filteredData.filter((item: any) =>
      item.country_name?.toLowerCase().includes(this.countryFilter.toLowerCase())
    );
  }

  if (this.createdDateFilter) {
    const selectedDate = new Date(this.createdDateFilter).toDateString();
    filteredData = filteredData.filter((item: any) => {
      const itemDate = new Date(item.created_at).toDateString();
      return itemDate === selectedDate;
    });
  }

  this.dataSource = new MatTableDataSource(filteredData);
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}

clearAllFilters() {
  this.search = '';
  this.calendarDayFilter = '';
  this.countryFilter = '';
  this.createdDateFilter = null;

  this.dataSource = new MatTableDataSource(this.List);
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}



  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch() {
    this.search = "";
    this.dataSource.filter = "";
  }
  onExcelFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('excelFile', file);
      formData.append('userid', '18');
      this.uploading = true;

      this.eventService.uploadEventPlannerExcel(formData).subscribe({
        next: (res: any) => {
          this.uploading = false;


          if (res.message == 'Excel Error') {
            if (Array.isArray(res.errors)) {
              const detailedErrors = res.errors
                .map(
                  (e: any) => `
        <tr>
          <td style="padding: 10px 15px; border-bottom: 1px solid #eee;">
            <strong>${e.rowNumber}</strong>
          </td>
          <td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #FA5738;">
            ${e.errors.join(', ')}
          </td>
        </tr>
      `
                )
                .join('');

              Swal.fire({
                icon: 'warning',
                title: `
      <div style="font-size: 20px; font-weight: 600; color: black; margin-bottom: 5px;">
        Excel Validation Report
      </div>
      <div style="font-size: 13px; color: #555;">
        Some rows in Excel file contain errors. Please review and correct them.
      </div>
    `,
                html: `
      <div style="
        text-align: left;
        font-size: 14px;
        width: 100%;
        max-height: 40vh;
        overflow-y: auto;
        background: #fff;
        border-radius: 8px;
        border: 1px solid #ddd;
        padding: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        margin-top: 15px;
      ">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background: #f5f5f5; font-weight: 600;">
            <tr>
              <th style="padding: 10px 15px; text-align: left; width: 120px;">Row</th>
              <th style="padding: 10px 15px; text-align: left;">Error Details</th>
            </tr>
          </thead>
          <tbody>${detailedErrors}</tbody>
        </table>
      </div>
    `,
                width: '60%',
                showConfirmButton: true,
                confirmButtonText: 'Close',
                confirmButtonColor: '#FA5738',
                customClass: {
                  container: 'excel-report-popup-container',
                  popup: 'excel-report-popup'
                },
                allowOutsideClick: false,
                allowEscapeKey: true
              })
                .then(() => { window.location.reload(); });
            }
          } else {
            this.toastr.success(res.message || 'Excel uploaded successfully');
            this.getActiveEventsPlannerList();
          }
        },
        error: (err) => {
          this.uploading = false;
          const actualError = typeof err === 'function' ? err() : err;
          const rawError = actualError?.error;
          let errorMessage = 'Upload failed';

          if (rawError?.message) {
            errorMessage = rawError.message;
          }

          else {
            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: errorMessage
            });
          }
        }
      });
    }
  }
showExcelInstructions(): void {
  this.snackBar.openFromComponent(ExcelGuidelinesSnackbarComponent, {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['white-snackbar'],
    duration: 15000
  });
}




  public addRecord() {
   
    this.router.navigate(['/create_event_planner']);

  }




openFilterListDialog(eventPlanner: any) {
    const dialogRef = this.dialog.open(ManageEventPlannerFilterComponent, {
      width: '850px',
      data: { eventPlannerId: eventPlanner.event_planner_id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.getActiveEventsPlannerList();
      }
    });
  }

  // openFilterDialog(eventPlanner: any) {
  //   const dialogRef = this.dialog.open(ManageEventPlannerFilterComponent, {
  //     width: '850px',
  //     data: { eventPlannerId: eventPlanner.event_planner_id }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'refresh') {
  //       this.getActiveEventsPlannerList();
  //     }
  //   });
  // }
 openFilterPage(eventPlanner: any) {
  if (!eventPlanner?.event_planner_id) {
    console.error('Invalid event planner ID');
    return;
  }

  this.eventPlannerService.setPlannerId(eventPlanner.event_planner_id);

  this.router.navigate(['/event-planner-filters']); 
}

 updaterecord(eventPlanner: any) {
  if (!eventPlanner?.event_planner_id) {
    console.error('Invalid event planner ID');
    return;
  }

  this.eventPlannerService.setPlannerId(eventPlanner.event_planner_id);

  this.router.navigate(['/edit_event_planner']);
}


}
@Component({
  selector: 'app-excel-guidelines-snackbar',
  template: `
    <div style="position: relative; padding: 20px; max-width: 700px; color: #333;">
   
       <button
        mat-icon-button
        style="position: absolute; top: 10px; right: 10px;"
        (click)="close()"
      >
        <mat-icon>close</mat-icon>
      </button> 
      <div style="font-weight: 600; font-size: 18px; margin-bottom: 15px;">
        Excel File Upload Guidelines
      </div>

      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; max-height: 300px; overflow-y: auto;">
        <p><strong>Step 1:</strong> Click "Download Sample" to get the template.</p>
        <p><strong>Step 2:</strong> Do not change the header of the downloaded file.</p>
        <p><strong>Step 3:</strong> Enter valid data in all required columns.</p>
        <p><strong>Step 4:</strong> Avoid duplicate entries.</p>
        <p><strong>Step 5:</strong> Review the Error Details column for errors.</p>
      </div>

      <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
        <button mat-stroked-button color="primary" (click)="downloadSample()">Download Sample</button>
        <button mat-stroked-button (click)="chooseFile()">Choose File</button>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .white-snackbar.mat-snack-bar-container {
      background-color: #fff !important;
      color: #000;
      border-radius: 8px;
      box-shadow: 0 2px 15px rgba(0,0,0,0.2);
      padding: 0 !important;
      width: 720px !important; 
      max-width: 95vw !important;
    }
  `]
})
export class ExcelGuidelinesSnackbarComponent {
  constructor(
    private snackBarRef: MatSnackBarRef<ExcelGuidelinesSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  close() {
    this.snackBarRef.dismiss();
  }
  downloadSample() {
    window.open('/assets/NationalDayEXCELUpload.xlsx', '_blank');
  }

  chooseFile() {
    const input: HTMLElement | null = document.querySelector('#excelInput');
    if (input) input.click();
    this.snackBarRef.dismiss();
  }
}