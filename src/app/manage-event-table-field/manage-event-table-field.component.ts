import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ModuleIdList } from "src/app/common/enum";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { EventService } from "src/app/service/event/event.service";
import { AddEventTableFieldFormComponent } from "./add-event-table-field-form/add-event-table-field-form.component";
import { EditEventTableFieldFormComponent } from "./edit-event-table-field-form/edit-event-table-field-form.component";
import Swal from "sweetalert2";


@Component({
  selector: 'app-manage-event-table-field',
  templateUrl: './manage-event-table-field.component.html',
  styleUrls: ['./manage-event-table-field.component.css']
})
export class ManageEventTableFieldComponent implements OnInit {

  @ViewChild('test1', { static: false }) content!: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  testAttributesMap = new Map();
  search: any;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  error = '';
  List: any;
  userPrivilegeObj: any;
  
  // Filter variables
  fieldSearch: string = '';
  tableSearch: string = '';
  selectedModule: string = '';
  selectedField: string = '';
  selectedFieldType: string = '';
  
  // Data lists
  mainTableList: any[] = [];
  mainFieldList: any[] = [];
  filteredFields: any[] = [];
  fieldTypeList: string[] = [];
  originalData: any[] = [];

  public displayedColumns: string[] = ['actions','field_name','data_type', 'table_name','status',  'created_by','created_at'];
  dataSource!: MatTableDataSource<any>;

  constructor(
    public toastr: ToastrService, 
    private EventService: EventService, 
    public dialog: MatDialog
  ) {
    this.getCurrentUserPrivilege();
  }

  ngOnInit() {
    console.log("ManageEventComponent initialized");
    
    this.EventService.getEventsTable().subscribe(res => {
      this.mainTableList = res;
    });
    
    this.getActiveEventsFieldList();
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.EventService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.EventModuleField);
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  getActiveEventsFieldList() {
    this.EventService.getActiveEventFieldList().pipe()
      .subscribe((data: any) => {
        console.log("geteventList ", data);
        this.List = data;
        this.originalData = data; 
        console.log("data", data);
        
        this.fieldTypeList = [...new Set(data.map((item: any) => item.data_type).filter((dt: any) => !!dt))] as string[];

        
        this.loadRecord();
      });
  }

  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => this.dataSource.sort = this.sort);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event?: any): void {
    let filteredData = [...this.originalData];

    // Apply search filter
    if (this.search && this.search.trim() !== '') {
      const searchLower = this.search.toLowerCase().trim();
      filteredData = filteredData.filter(item =>
        (item.field_name?.toLowerCase().includes(searchLower)) ||
        (item.data_type?.toLowerCase().includes(searchLower)) ||
        (item.table_name?.toLowerCase().includes(searchLower)) ||
        (item.createdbyname?.toLowerCase().includes(searchLower)) ||
        (item.updatedbyname?.toLowerCase().includes(searchLower))
      );
    }

    // Apply module filter
    if (this.selectedModule) {
      filteredData = filteredData.filter(item => item.table_name === this.selectedModule);
    }

    // Apply field type filter
    if (this.selectedFieldType) {
      filteredData = filteredData.filter(item => item.data_type === this.selectedFieldType);
    }

    this.dataSource.data = filteredData;
    
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.search = '';
    this.applyFilter();
  }
clearAllFilters() {
    this.search = '';
    this.selectedModule = '';
    this.selectedFieldType = '';
    this.applyFilter();
}

  onModuleChange(moduleName: string) {
    this.selectedModule = moduleName;
    this.EventService.getEventsTableFields(moduleName).subscribe(res => {
      this.mainFieldList = res;
      this.filteredFields = [...this.mainFieldList];
    });
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddEventTableFieldFormComponent, {
      width: '750px',
      height: 'fit-content',
      disableClose: true,
      data: {
        // code: this.code,
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.getActiveEventsFieldList();
      }
    });
  }

  public deleteRecord(field: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete field "${field.field_name}" in ${field.table_name} Module?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.EventService.deleteEventTableField(field.field_id).subscribe({
          next: (res) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Field deleted successfully',
              showConfirmButton: false,
              timer: 2500
            });
            this.getActiveEventsFieldList(); 
          },
          error: (err) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Error deleting field',
              showConfirmButton: false,
              timer: 2500
            });
          }
        });
      }
    });
  }
}