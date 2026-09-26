import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { TermsandconditionsService } from '../termsandconditions.service';
import { AddTermsandconditionsComponent } from "./add-termsandconditions/add-termsandconditions.component";
import { EditTermsandconditionsComponent } from "./edit-termsandconditions/edit-termsandconditions.component";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { CookieService } from "src/app/service/cookie.service";



@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.component.html',
  styleUrls: ['./termsandconditions.component.scss']
})
export class TermsandconditionsComponent implements OnInit {
  
  dropEvent!: CdkDragDrop<string[], string[]>;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  loading: boolean = false;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  getTcList: any;
  dynamicTableData!: any[];
  user: any;
  code: any;
  currentUser: any;
  user_type_name: any;
  rolename:any;
  adminUserType: any;
  userPrivilegeObj:any = {};

  constructor(private customerService:CustomerService,private termsService: TermsandconditionsService,private cookieService: CookieService,
    public dialog: MatDialog,) {
      this.getCurrentUserPrivilege();
     }
     public displayedColumns: string[] = ['actions','tc_title','contract_type_name','tc_effective_date','tc_pdf_url','pdf_page_count','status','created_by', 'created_at', 'modified_by', 'modified_at',];

     dataSource!: MatTableDataSource<any>;
   
     displayedFilterColumns = this.displayedColumns.map(x => x + 'Filter');
   
     
  ngOnInit(): void {

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const tempUser = this.currentUser ? JSON.parse(this.currentUser) : "";
    var user_id = tempUser && tempUser[0] ? tempUser[0].user_id : "";
    this.user_type_name = this.currentUser ? JSON.parse(this.currentUser)?.user_type_name : "";
    this.rolename = this.currentUser ? JSON.parse(this.currentUser)?.rolename : "";
    // this.adminUserType = UserType.Admin;
    this.getAllTermsandConditions();

  }

  drop(event: CdkDragDrop<string[]>) {
    this.dropEvent = event;
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(
      this.displayedFilterColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  activeChange(event: any) {
    if (event.value == "None") {
      this.clearFilter();
    } else {
      const filterValue = event.value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  addFilter(event: Event) {
   debugger
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }
 clearFilter() {
   this.dataSource.filter = '';
 }



  getAllTermsandConditions() {
    this.loading = true;
    this.termsService.getTermsandConditions().pipe()
      .subscribe((data: any) => {
        console.log("getTermsandConditions ", data);
        this.getTcList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }
  loadRecord() {
    debugger
    this.dynamicTableData = [];
    this.getTcList.forEach((element: any) => {
      let row: any = {
        contract_type_name: element && element.contract_type_name ? element.contract_type_name : "",
        tc_id: element && element.tc_id ? element.tc_id : "",
        tc_type: element && element.tc_type ,
        application_id: element && element.application_id ? element.application_id : "",
        tc_title: element && element.tc_title ? element.tc_title : "",
        tc_effective_date: element && element.tc_effective_date ? element.tc_effective_date : "",
        tc_pdf_url: element && element.tc_pdf_url ? element.tc_pdf_url : "",
        pdf_page_count: element && element.pdf_page_count ? element.pdf_page_count : "",
        status: element.status=='1' ? "Active" : "Inactive",
        created_at: element.created_at ? element.created_at: "-",
        created_by: element && element.createdbyname ? element.createdbyname : "-",
        modified_by: element && element.updatedbyname ? element.updatedbyname : "-",
        modified_at: element.modified_at ? element.modified_at : ""

      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddTermsandconditionsComponent, {
      width: '900px',
      // height: '50vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllTermsandConditions();
      }
    });
  }

  public editRecord(items: any) {debugger
  //  items.status == 'Active' ? 1 :0;
    this.termsService.updateStatusChangeById(items).pipe()
    .subscribe((data: any) => {
      console.log("updateStatusChangeById ", data);
      this.getAllTermsandConditions();
    })
    // debugger
    // const dialogRef = this.dialog.open(EditTermsandconditionsComponent, {
    //   width: '900px',
    //   // height: '50vh',
    //   disableClose: true,
    //   data: items
    // });
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (result == 'Success') {
    //     this.getAllTermsandConditions();
    //   }
    // });
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.SpecialOffers)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }
}
