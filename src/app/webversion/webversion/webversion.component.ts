import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DateFormat, MatTableAttributes, } from 'src/app/common/ui.constant';
import { WebversionService } from '../service/webversion.service';
import { AddWebversionComponent } from './add-webversion/add-webversion.component';
import { CookieService } from 'src/app/service/cookie.service';



@Component({
  selector: 'app-webversion',
  templateUrl: './webversion.component.html',
  styleUrls: ['./webversion.component.css']
})
export class WebversionComponent implements OnInit {

  PageTitel: any = "Web Version";
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  loading:boolean=false;
  dropEvent!: CdkDragDrop<string[], string[]>;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  webversionList: any;
  dynamicTableData!: any[];
  user: any;
  code: any;
  currentUser: any;
  adminUserType: any;
  userPrivilegeObj:any= {};




  constructor(private webversionService: WebversionService, private cookieService: CookieService,
   
    public dialog: MatDialog) 
  { 
    this.getCurrentUserPrivilege();

  }
  public displayedColumns: string[] = ['webcategory','webversion','weburl','webversioncreated_at','status','powered_by', 'company_name', 'created_at'];
  displayedFilterColumns = this.displayedColumns.map(x => x + 'Filter');
  dataSource!: MatTableDataSource<any>;

  
async getCurrentUserPrivilege(){
  // this.userPrivilegeObj = {};
  // var tempPrivilege =await this.usersService.getCurrentUserPrivilegeArr();
  // console.log("this.tempPrivilege",tempPrivilege);
  // this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.WebVersion)
  // console.log("this.userPrivilegeObj",this.userPrivilegeObj);
}

   



  ngOnInit(): void {

    this.getwebversionList();
  }

  getwebversionList() {
    this.loading = true;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const tempUser = this.currentUser ? JSON.parse(this.currentUser) : "";
    var user_id = tempUser && tempUser[0] ? tempUser[0].user_id : "";
    this.webversionService.getwebversionList().pipe()
      .subscribe((data: any) => {
        console.log("getwebversionList ", data);
        this.webversionList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }


  addFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  clearFilter() {
    this.dataSource.filter = '';
  }
  
  changeActive(event: any) {
    if (event.value == "None") {
      this.clearFilter();
    } else {
      const filterValue = event.value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  
  drop(event: CdkDragDrop<string[]>) {
    this.dropEvent = event;
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
   
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddWebversionComponent, {
      width: '800px',
      height: 'fit-content',
      disableClose: true,
      data: {
        code: this.code
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        // this.webversionList();

        this.getwebversionList();      }
       this.loading = false;
    });
  }
    

  loadRecord() {
    debugger
    this.dynamicTableData = [];
    this.webversionList.forEach((element: any) => {
      let row: any = {
  
        webid: element.webid ? element.webid : "",
        webcategory: element.webcategory ? element.webcategory : "",
        webversion: element.webversion ? element.webversion : "",
        weburl: element.weburl ? element.weburl : "",
        webversioncreated_at: element.webversioncreated_at ? element.webversioncreated_at : "-",
        status: element.status=='1' ? "Active" : "Inactive",
        powered_by: element.powered_by ? element.powered_by : "",
        company_name: element.company_name ? element.company_name : "",
        created_at: element.created_at ? element.created_at : "-",
        created_by: element && element.createdbyname ? element.createdbyname : "-",
        modified_at: element.modified_at ? element.modified_at : "",
        modified_by: element && element.updatedbyname ? element.updatedbyname : "-"
  
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
  

}
