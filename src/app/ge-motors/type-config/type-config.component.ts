import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { AddTypeFormComponent } from "./add-type-form/add-type-form.component";
import { EditTypeFormComponent } from "./edit-type-form/edit-type-form.component";
import { TypeConfigService } from "./type-config.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";

@Component({
  selector: 'app-type-config',
  templateUrl: './type-config.component.html',
  styleUrls: ['./type-config.component.css']
})
export class TypeConfigComponent implements OnInit {

  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  list:any=[];
  dynamicTableData!: any[];
 userPrivilegeObj: any;
  constructor(private typeConfigService: TypeConfigService,private router: Router,
    private route: ActivatedRoute,private customerService: CustomerService, private cookieService: CookieService, public dialog: MatDialog) { this.getCurrentUserPrivilege();
    }

  public displayedColumns: string[] = ['actions','typename','status', 'createdby', 'createdat', 'modifiedby', 'modifiedat', ];

  dataSource!: MatTableDataSource<any>;


    async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.CampaignsType)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

  ngOnInit() {debugger
    this.getTypeConfig();
  }

  getTypeConfig() {
    this.loading = true;
    this.typeConfigService.gettypeConfig().pipe()
      .subscribe((data: any) => {
        console.log("gettypeConfig", data);
        this.list = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.list);
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
    const dialogRef = this.dialog.open(AddTypeFormComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getTypeConfig();
      }
    });
  }

  public editRecord(items: any) {
    debugger
    const dialogRef = this.dialog.open(EditTypeFormComponent, {
      width: '500px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getTypeConfig();
      }
    });
  }



  clearSearch(){
    this.search ="";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getCategoryString(category: number): string {
    switch (category) {
        case 1:
            return 'Campaigns';
        case 2:
            return 'Opportunity';
        case 3:
            return 'Account';
        default:
            return '';
    }
}

}


