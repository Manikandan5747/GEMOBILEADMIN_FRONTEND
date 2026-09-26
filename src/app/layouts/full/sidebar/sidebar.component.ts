import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { CookieService } from 'src/app/service/cookie.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { ModuleIdList } from 'src/app/common/enum';
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';
import { DataService } from 'src/app/service/encryption/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  menuItems: any = [];
  currentUser: any;
  tempPrivilege: any = [];
  // filteredMenuList: any = [];
  moduleList: any;
  filterValue: Array<any> = [];
  constructor(private cookieService: CookieService, private manageModuleService: ManageModuleService,
    changeDetectorRef: ChangeDetectorRef, public customerService: CustomerService, private dataService: DataService,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.tempPrivilege = this.customerService.getCurrentUserPrivilegeArr();
    this.getAllModels();
  }

  ngOnInit() {
    localStorage.removeItem('search');
  }

  filterByText(initial: string) {
    this.menuItems = this.filterValue;
    this.menuItems = this.menuItems.filter((i: any) => i.name.toLowerCase().indexOf(initial.toLocaleLowerCase()) !== -1);
    console.log(this.menuItems);
  }

  getAllModels() {
    this.manageModuleService.getModule("false").pipe()
      .subscribe((data: any) => {
        console.log("moduleList", data)
        this.moduleList = data.filter((ele: any) => ele.status == 1);
        this.initialize();
      });
  }


initialize(): void {
  if (!this.moduleList?.length || !this.tempPrivilege?.length) return;

  const accessKeys = [
    'cloneaccess',
    'viewaccess',
    'createaccess',
    'deleteaccess',
    'editaccess',
    'fullgrantaccess',
    'listaccess','printaccess'
  ];

  this.menuItems = [];

  for (const module of this.moduleList) {
    const privilege = this.tempPrivilege.find(
      (priv) => priv.module_id === module.module_id
    );

    if (privilege) {
      const hasAccess = accessKeys.some((key) => privilege[key] === 1);

      if (hasAccess) {
        this.menuItems.push({
          state: module.routename,
          type: 'link',
          name: module.modulename,
          icon: 'view_list'
        });
      }
    }
  }

   // Move "dashboard" module to the top (case-insensitive match)
  this.menuItems.sort((a, b) => {
    const aIsDashboard = a.name.toLowerCase().includes('dashboard') ? -1 : 0;
    const bIsDashboard = b.name.toLowerCase().includes('dashboard') ? -1 : 0;
    return aIsDashboard - bIsDashboard;
  });
  
  this.filterValue = this.menuItems;
}


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  menuclick() {
    this.dataService.clearAllData();
  }
}
