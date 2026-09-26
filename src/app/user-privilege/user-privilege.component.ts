import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { ManageModuleService } from "../service/manage-module/manage-module.service";
import { UserRoleService } from "../service/user-role/user-role.service";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { PushNotificationsService } from "../service/push.notification.service";
import { MatTabGroup } from "@angular/material/tabs";
import { RelatedModulePrivilegeComponent } from "./related-module-privilege/related-module-privilege.component";
import { MiscelleneosRulesComponent } from "./miscelleneos-rules/miscelleneos-rules.component";



@Component({
  selector: 'app-user-privilege',
  templateUrl: './user-privilege.component.html',
  styleUrls: ['./user-privilege.component.css']
})
export class UserPrivilegeComponent implements OnInit {
  displayedColumns1: string[] = ['modulename', 'read', 'printaccess'];
  dataSource1: any = [];
  search: string = '';
  loading: boolean = false;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  role_id: any;
  appModuleList: any = [];
  selection = new SelectionModel<any>(true, []);
  userRoleList: any;
  userPrivilegeList: any = [];
  redirectRole_id: any;
  rolename: any;
  role_idObj: any;
  selectedRoleisAdmin: boolean = false;
  allViewSelected: boolean = false;
  allPrintSelected: any;
  selected_tab_value: any = 'USER PRIVILEGES';
  currentUser: any;

  constructor(private pushNotificationService: PushNotificationsService, public toastr: ToastrService, private router: Router, public userRoleService: UserRoleService,
    private route: ActivatedRoute, private elementRef: ElementRef, private cookieService: CookieService, public dialog: MatDialog, private manageModuleService: ManageModuleService) {
    this.pushNotificationService.requestPermission();
    this.route.queryParams.subscribe(params => {
      this.redirectRole_id = params['role_id'];
      this.rolename = params['rolename'];
      if (this.redirectRole_id) {
        this.roleChange({ redirectRole_id: this.redirectRole_id, rolename: this.rolename })
      }
    });
  }

  public displayedColumns: string[] = ['modulename', 'full', 'read', 'write', 'modify', 'delete', 'printaccess', 'actions', 'miscRights'];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    this.getAllUserModel();
  }


  getAllUserModel() {
    this.userRoleService.getUserRole().pipe()
      .subscribe((data: any) => {
        console.log("getUserRole", data);
        this.userRoleList = data;
      });
  }

  getAllUserPrivilege(role_id: any, test: any) {
    this.manageModuleService.getAllUserPrivilege(role_id, test).pipe()
      .subscribe((data: any) => {
        console.log("getAllUserPrivilege", data);
        this.userPrivilegeList = [];
        if (this.selectedRoleisAdmin) {
          this.getModuleList("false");
        } else {
          this.getModuleList("true");
        }

        this.userPrivilegeList = data.filter(ele => ele.isreport === false);
      });
  }

  getModuleList(selectedRoleisAdmin: string) {
    this.loading = true;
    this.manageModuleService.getModule(selectedRoleisAdmin).pipe()
      .subscribe((data: any) => {
        console.log("getModule", data);
        this.appModuleList = [];
        this.appModuleList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
    this.loading = false;
  }


  loadRecord() {
    var ids = new Set(this.userPrivilegeList && this.userPrivilegeList.map((d: any) => d.module_id));
    var merged = [...this.userPrivilegeList, ...this.appModuleList.filter((d: any) => !ids.has(d.module_id))];
    console.log("merged", merged)
    var dynamicTableData: any = [];
    // console.log("merged",merged)
    merged && merged.forEach((element: any) => {
      const appModule = this.appModuleList.find(m => m.module_id === element.module_id);
      let row = {
        privilege_id: element.privilege_id ? element.privilege_id : null,
        modulename: element.modulename,
        module_id: element.module_id,
        full: element.fullgrantaccess ? true : false,
        read: element.viewaccess ? true : false,
        write: element.createaccess ? true : false,
        modify: element.editaccess ? true : false,
        delete: element.deleteaccess ? true : false,
        app_miscellaneousmappingtb_count
          : element.app_miscellaneousmappingtb_count || 0,
        miscellaneous_privileges_count: element.miscellaneous_privileges_count || 0,
        isparent: appModule ? appModule.isparent : false,
        ismisc: appModule && appModule.ismisc ? appModule.ismisc : false,
        privilegekey: appModule && appModule.privilegekey ? appModule.privilegekey : null,
        printaccess: element.printaccess ? true : false,
      }
      dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(dynamicTableData);
    this.loading = false;
  }



  checkAllActive(event: any, row: any) {
    if (!row.full && row.delete && row.modify && row.read && row.write) {
      row.full = true;
    } else {
      row.full = false;
    }

  }

  selectedDashboards(): boolean {
    const tempData = this.dataSource?.data || [];

    const selectedDashboards = tempData.filter(
      ele => ele.modulename === 'Dashboard' && ele.write
    );

    if (selectedDashboards.length > 1) {
      this.handleError('Only one Dashboard module can have access.');
      return false;
    }

    // 🛑 No Dashboard access given
    if (selectedDashboards.length === 0) {
      this.handleError('Give any Dashboard module access.');
      return false;
    }

    return true;
  }



  SelectHorizontalFullAccess(event: any, row: any) {
    if (event.checked) {
      row.read = true;
      row.full = true;
      row.read = true;
      row.write = true;
      row.modify = true;
      row.delete = true;
      row.printaccess = true;
    } else {
      row.read = false;
      row.full = false;
      row.read = false;
      row.write = false;
      row.modify = false;
      row.delete = false;
      row.printaccess = false;
    }
  }

  //Full access
  isAllFullAccessSelected(event: any): any {
    if (event.checked) {
      this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
        if (ele) {
          ele.read = true;
          ele.full = true;
          ele.read = true;
          ele.write = true;
          ele.modify = true;
          ele.delete = true;
          ele.printaccess = true;
        }
      });
    } else {
      this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
        if (ele) {
          ele.read = false;
          ele.full = false;
          ele.read = false;
          ele.write = false;
          ele.modify = false;
          ele.delete = false;
          ele.printaccess = false
        }
      });
    }

  }

  SelectAllFullAccess(event: MatCheckboxChange) {
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      ele.full = event.checked;
    });
  }

  //Read
  isAllReadSelected(): boolean {
    const numRows = this.dataSource && this.dataSource.data && this.dataSource.data.length;
    let selectedcount: number;
    selectedcount = 0;
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      if (ele.read === true) {
        selectedcount += 1;
      }
    });
    if (numRows === selectedcount) {
      return true;
    }
    return false;
  }

  SelectAllRead(event: MatCheckboxChange) {
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      ele.read = event.checked;
    });
  }


  //Delete
  isAllDeleteSelected(): boolean {
    const numRows = this.dataSource && this.dataSource.data && this.dataSource.data.length;
    let selectedcount: number;
    selectedcount = 0;
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      if (ele.delete === true) {
        selectedcount += 1;
      }
    });
    if (numRows === selectedcount) {
      return true;
    }
    return false;
  }

  SelectAllDelete(event: MatCheckboxChange) {
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      ele.delete = event.checked;
    });
  }

  //Write
  isAllWriteSelected(): boolean {
    const numRows = this.dataSource && this.dataSource.data && this.dataSource.data.length;
    let selectedcount: number;
    selectedcount = 0;
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      if (ele.write === true) {
        selectedcount += 1;
      }
    });
    if (numRows === selectedcount) {
      return true;
    }
    return false;
  }

  SelectAllWrite(event: MatCheckboxChange) {
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      ele.write = event.checked;
    });
  }

  //Modify
  isAllModifySelected(): boolean {
    const numRows = this.dataSource && this.dataSource.data && this.dataSource.data.length;
    let selectedcount: number;
    selectedcount = 0;
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      if (ele.modify === true) {
        selectedcount += 1;
      }
    });
    if (numRows === selectedcount) {
      return true;
    }
    return false;
  }

  //Print
  isAllPrintSelected(): boolean {
    const numRows = this.dataSource && this.dataSource.data && this.dataSource.data.length;
    let selectedcount: number;
    selectedcount = 0;
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      if (ele.printaccess === true) {
        selectedcount += 1;
      }
    });
    if (numRows === selectedcount) {
      return true;
    }
    return false;
  }

  SelectAllModify(event: MatCheckboxChange) {
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      ele.modify = event.checked;
    });
  }


  SelectAllPrint(event: MatCheckboxChange) {
    this.dataSource && this.dataSource.data && this.dataSource.data.forEach((ele) => {
      ele.printaccess = event.checked;
    });
  }

  save() {
    if (!this.selectedDashboards()) {
      return; // Stop execution if dashboard check fails
    }
    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    this.loading = true;
    var enteredData = this.dataSource.data;
    // const reportAccessData = this.dataSource1.map((row: any) => ({
    //   module_id: row.module_id,
    //   privilege_id:row.privilege_id,
    //   read: row.read ? true : false,
    //   printaccess: row.printaccess ? true : false
    // }));

    // Merge both arrays
    // const enteredData = [...moduleAccessData, ...reportAccessData];

    var obj = {
      enteredData: enteredData,
      role_id: this.role_id
    }
    this.manageModuleService.createUserPrivilege(obj).subscribe(
      (response: any) => {
        this.getAllUserPrivilege(this.role_id, '');
        this.loading = false;
        this.success("Save Successfully");

      })
  }

  reportsave() {

    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    this.loading = true;
    // var moduleAccessData = this.dataSource.data;    
    const enteredData = this.dataSource1.data.map((row: any) => ({
      module_id: row.module_id,
      privilege_id: row.privilege_id,
      read: row.read ? true : false,
      printaccess: row.printaccess ? true : false
    }));

    // Merge both arrays
    // const enteredData = [...moduleAccessData, ...reportAccessData];

    var obj = {
      enteredData: enteredData,
      role_id: this.role_id
    }
    this.manageModuleService.createUserPrivilege(obj).subscribe(
      (response: any) => {
        this.getAllUserPrivilege(this.role_id, '');
        this.loading = false;
        this.success("Save Successfully");
      })
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    // this.loading = false;
  }


  roleChange(event: any) {
    if (this.tabGroup) { this.tabGroup.selectedIndex = 0; }

    this.role_id = event && event.redirectRole_id ? event.redirectRole_id : event.value.role_id;
    var rolename = event && event.rolename ? event.rolename : event.value.rolename;

    if (rolename == "Administrator") {
      this.selectedRoleisAdmin = true;

      this.getAllUserPrivilege(this.role_id, 'false');
    } else {
      this.selectedRoleisAdmin = false;
      this.getAllUserPrivilege(this.role_id, "true");
    }
  }



  selectedTabChange(event: any) {
    this.selected_tab_value = event.tab.textLabel;
    this.search = '';
    this.dataSource.filter = '';

    console.log("event", event.tab.textLabel);

    if (event.tab.textLabel === 'REPORT PRIVILEGES') {
      this.manageModuleService.getAllReportListModule().subscribe((modules: any[]) => {
        this.manageModuleService.getAllReportUserPrivilege(this.role_id).subscribe((privileges: any[]) => {
          // Merge privileges into modules based on module_id
          const mergedModules = modules.map(module => {
            const privilege = privileges.find(p => p.module_id === module.module_id);

            return {
              ...module,
              privilege_id: privilege && privilege.privilege_id ? privilege.privilege_id : null,
              read: privilege ? privilege.viewaccess === 1 : false,
              printaccess: privilege ? privilege.printaccess === 1 : false
            };
          });

          //this.dataSource1 = mergedModules;

          this.dataSource1 = new MatTableDataSource(mergedModules);

          this.allViewSelected = this.dataSource1.data.every(row => row.read);

          this.allPrintSelected = this.dataSource1.data.every(row => row.printaccess);


        });
      });
    }
  }



  toggleAllAccess(type: 'view' | 'print', event: any) {
    const checked = event.checked;
    this.dataSource1.data.forEach(row => {
      if (type === 'view') row.read = checked;
      if (type === 'print') row.printaccess = checked;
    });
  }

  checkIfAllSelected(type: 'read' | 'printaccess') {
    console.log(`checkIfAllSelected called for: ${type}`);
    if (type === 'read') {
      this.allViewSelected = this.dataSource1.data.every(row => row.read);
    } else if (type === 'printaccess') {
      this.allPrintSelected = this.dataSource1.data.every(row => row.printaccess);
    }
  }


  miscRights(element: any) {
    const obj1 = this.currentUser ? JSON.parse(this.currentUser) : "";
    element.role_id = this.role_id;
    element.login_id = obj1[0]?.login_id;

    const dialogRef = this.dialog.open(MiscelleneosRulesComponent, {
      width: '650px',
      height: 'fit-content',
      disableClose: true,
      data: element

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        if (this.role_id == 1) {
          this.selectedRoleisAdmin = true;

          this.getAllUserPrivilege(this.role_id, 'false');
        } else {
          this.selectedRoleisAdmin = false;
          this.getAllUserPrivilege(this.role_id, "true");
        }
      }
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filterMap: { [key: string]: any } = {
      'USER PRIVILEGES': this.dataSource,
      'REPORT PRIVILEGES': this.dataSource1
    };

    const selectedDataSource = filterMap[this.selected_tab_value];
    if (selectedDataSource) {
      selectedDataSource.filter = filterValue;
    }
  }



  relatedModule(items: any) {
    items.role_id = this.role_id
    const dialogRef = this.dialog.open(RelatedModulePrivilegeComponent, {
      width: '950px',
      height: 'fit-content',
      disableClose: true,
      data: items

    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        if (this.role_id == 1) {
          this.selectedRoleisAdmin = true;

          this.getAllUserPrivilege(this.role_id, 'false');
        } else {
          this.selectedRoleisAdmin = false;
          this.getAllUserPrivilege(this.role_id, "true");
        }
      }
    });
  }

}


