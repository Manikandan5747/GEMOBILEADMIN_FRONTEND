import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { HttpClient } from '@angular/common/http'; // Import HttpClient module
import { ReportsService } from "src/app/service/reports/reports.service";
import { Router } from '@angular/router';
import { CookieService } from 'src/app/service/cookie.service';
import { RoleIdList } from 'src/app/common/enum';
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';

@Component({
  selector: 'app-report-pagination',
  templateUrl: './report-pagination.component.html',
  styleUrls: ['./report-pagination.component.css']
})
export class ReportPaginationComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  search: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentUser!: any;
  role_id: any;
  
  carreport: any;
  // Inject HttpClient in the constructor
  constructor(private httpClient: HttpClient, private reportsService: ReportsService, private manageModuleService: ManageModuleService, private router: Router, private cookieService: CookieService,) {
    this.dataSource = new MatTableDataSource<any>([]);

  }

  // Use ngOnInit to initialize data
  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.role_id = obj[0]?.role_id;

    this.loadData();
  }

  loadData() {

    this.manageModuleService.getAllReportListModule().subscribe((modules: any[]) => {
      console.log("modules", modules);

      this.manageModuleService.getAllReportUserPrivilege(this.role_id).subscribe((privileges: any[]) => {
        // Merge privileges into modules based on module_id
        let mergedModules: any = modules.map(module => {
          const privilege = privileges.find(p => p.module_id === module.module_id);

          return {
            ...module,
            // privilege_id: privilege.privilege_id ? privilege.privilege_id : null,
            read: privilege ? privilege.viewaccess === 1 : false,
            printaccess: privilege ? privilege.printaccess === 1 : false
          };
        });


        console.log("Merged Module + Privileges:", mergedModules);

        const carReportItem = mergedModules?.find((ele: any) => ele.modulename === 'Car Report');
        this.carreport = carReportItem?.read || false;
        
        // Filter for items with read == true, then transform the array
        const transformed = mergedModules
        .filter(item => item.read === true && item.modulename !== 'Car Report')
        .map(item => ({
          id: item.module_id,
          read: item.read,
          name: item.modulename,
          fieldName: item.routename,
          printaccess: item.printaccess
        }));
      

       

        // Assign to table data source
        this.dataSource = new MatTableDataSource<any>(transformed);
        setTimeout(() => {
          // Set up pagination
          this.dataSource.paginator = this.paginator;
        }, 0);

      });


    })
    // if (this.role_id == RoleIdList.ShowroomManager || this.role_id == RoleIdList.Admin) {
    //   this.dataSource = new MatTableDataSource<any>(geMotorRreports);
    // } else if (this.role_id == RoleIdList.Accountant) {
    //   this.reportbuttonhide = false;
    //   this.dataSource = new MatTableDataSource<any>(GEGIFTREPORTS);
    // } else if (this.role_id == RoleIdList.FinanceManager) {
    //   this.dataSource = new MatTableDataSource<any>(geMotorRreports);
    // } else {
    //   this.dataSource = new MatTableDataSource<any>(gemobileAdminReport);
    // }
    // Assign the fetched reports to the dataSource

  
    // Set up filter predicate
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchData = `${data.id} ${data.name}`.toLowerCase();
      return searchData.indexOf(filter.toLowerCase()) !== -1;
    };

  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
  }

  applyFilter(filterValue: string) {
    this.search = filterValue;
    this.dataSource.filter = this.search.trim().toLowerCase();
  }

  clearSearch() {
    this.search = '';
    this.applyFilter('');
  }

  redirectToDetail(report: any) {
    localStorage.setItem('reportHeader', report.name);
    localStorage.setItem('NHPmhskvw2by/7HORiT8ww==', report.printaccess);
    this.router.navigate(['/report', report.fieldName]);
  }
  reportList() {
    this.router.navigate(['/report/carreport']);
  }


}
