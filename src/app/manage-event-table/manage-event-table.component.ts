
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ModuleIdList } from "src/app/common/enum";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { EventService } from "src/app/service/event/event.service";
import { AddEventTableFormComponent } from "./add-event-table-form/add-event-table-form.component";
import { EditEventTableFormComponent } from "./edit-event-table-form/edit-event-table-form.component";
const moment = require('moment');


@Component({
  selector: 'app-manage-event-table',
  templateUrl: './manage-event-table.component.html',
  styleUrls: ['./manage-event-table.component.css']
})
export class ManageEventTableComponent implements OnInit {
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  search: any;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List: any;
  userPrivilegeObj: any;

  constructor(public toastr: ToastrService, private EventService: EventService, public dialog: MatDialog,) {
    this.getCurrentUserPrivilege()
   }

  public displayedColumns: string[] = ['actions','table_name', 'status',  'created_by','created_at','modified_by','modified_at'];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
      console.log("ManageEventComponent initialized");
    //  var obj: any = {
    //   "search": this.search,
    //   "page": 1,
    //   "limit": this.PAGE_SIZE
    // }
    this.getActiveEventTable();
     
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.EventService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.EventModule)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }

  getActiveEventTable() {
    this.EventService.getActiveEventTableList().pipe()
      .subscribe((data: any) => {
        console.log("geteventList ", data);
        this.List = data;
        console.log("data",data)
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);

    setTimeout(() => this.dataSource.sort = this.sort)
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

public addRecord() {
  const dialogRef = this.dialog.open(AddEventTableFormComponent, {
    width: '750px',
    height: 'fit-content',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result?.data?.table_id) {
      this.getActiveEventTable();  
    }
  });
}

  public editRecord(items: any) {
    debugger
  
    const dialogRef = this.dialog.open(EditEventTableFormComponent, {
      width: '750px',
      height: 'fit-content',
      disableClose: true,
      data: items,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
        console.log(items.table_id)
      if (result == 'Success') {
        this.getActiveEventTable();
      }
    });
  }

  clearSearch() {
    this.search = "";
    //  localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


