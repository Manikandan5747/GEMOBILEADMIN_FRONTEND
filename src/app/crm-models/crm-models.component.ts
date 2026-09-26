import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ModuleIdList } from "src/app/common/enum";
import { CookieService } from "src/app/service/cookie.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import Swal from 'sweetalert2';
import { DateFormat, MatTableAttributes } from "../common/ui.constant";
import { ErrorlogService } from "../errorlog.service";
import { CrmModelsService } from "./crm-models.service";
import { EditCrmModelsComponent } from "./edit-crm-models/edit-crm-models.component";


@Component({
  selector: 'app-crm-models',
  templateUrl: './crm-models.component.html',
  styleUrls: ['./crm-models.component.css']
})
export class CrmModelsComponent implements OnInit {
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  corporatepartnersList: any;
  userPrivilegeObj: any;
  currentUserRole: string = '';
  public displayedColumns: string[] = ['actions','crm_makename', 'crm_modelname', 'imagepath','status','createdname' ,'created_at','modifiedname','modified_at'];

  access_token!: any;
  crm_refreshtoken!: any;
  loading:any=false;

  constructor(private router: Router, private customerService: CustomerService, public toastr: ToastrService,
    private CrmModelsService: CrmModelsService, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege()
  }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {
  const currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  const parsed = currentUser ? JSON.parse(currentUser)[0] : null;
  this.currentUserRole = parsed?.userrole || ''; 

  console.log("userole",  this.currentUserRole)
    this.getcrmmodellist();
  }

async getcrmmodellist() {
  console.log("calledmodellist")
  this.CrmModelsService.getcrmmodellist()
    .pipe()
    .subscribe((data: any) => {
      console.log("getcrmmodellist ", data);
      this.corporatepartnersList = data;
      this.dataSource = new MatTableDataSource(this.corporatepartnersList);
      this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.sort = this.sort);
    });
}

  


 
  goToShowroomCon(item: any) {
    var navigationExtras = { queryParams: { specialofferid: item.specialofferid, } };
    this.router.navigate(['corporate-partner/special-offer'], navigationExtras);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editRecord(items: any) {
  const dialogRef = this.dialog.open(EditCrmModelsComponent, {
    width: '800px', height: '78vh', disableClose: true, data: items
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) this.getcrmmodellist();
  });
}
 

  async getAccessToken() {
    try {
      this.loading = true;
      const token: any = await this.CrmModelsService.getAccessToken().toPromise();
      console.log("getToken ", token);
      var firstToken: any = token[0] && token[0].crm_accesstoken;
      this.syncCrmModelList(firstToken)
    } catch (error) {
      console.error("Error:", error);
    }
  }



async syncCrmModelList(token: any) {
  try {
    const currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const parsed = currentUser ? JSON.parse(currentUser)[0] : null;
    const userid = parsed?.userid;

    const syncData: any = await this.CrmModelsService
      .syncCrmModel(token, userid ? { userid } : {})
      .toPromise();

    console.log("syncCrmModel ", syncData);

    if (syncData?.success) {
      const { crmRecords, inserted, updated, skipped } = syncData.data;

      if (inserted === 0) {
        this.handleError('No records inserted');
      } else {
        this.success(`${inserted} new record(s) inserted`);
      }

      
      this.getcrmmodellist();
      this.loading = false;
      return;
    }

    const tokenExpired = syncData?.data?.errors?.some((e: any) => e.errorCode === 8010 || e.message === 'Token Expired');

    if (tokenExpired) {
      try {
        const currentAccessToken: any = await this.CrmModelsService.getNewAccessToken().toPromise();
        if (currentAccessToken?.Data?.accessToken) {
          this.access_token = currentAccessToken.Data.accessToken;
          this.crm_refreshtoken = currentAccessToken.Data.refreshToken;
          await this.updateAccessToken();
          await this.deactivateOldAccessToken();
          this.loading = true;
          await this.syncCrmModelList(this.access_token); 
          return;
        }
      } catch (refreshErr) {
        console.error('Token refresh failed', refreshErr);
      }
      this.loading = false;
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: 'Could not refresh CRM token', icon: 'error' });
      return;
    }

    this.errorlogService.logManualValidationError(`crm-models component|syncCrmModelList()|Error: ${syncData?.message}`);
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: 'CRM Model sync failed', icon: 'error' });
    this.loading = false;


  } catch (error: any) {
    console.error("syncCrmModelList error", error);
    this.loading = false;
    this.errorlogService.logManualValidationError(`crm-models component|syncCrmModelList()|Error: ${error?.error?.message || error?.message}`);
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: 'CRM Model sync failed', icon: 'error' });
  }
}

  async updateAccessToken() {
    const obj = {
      'app_id': "1",
      'crm_accesstoken': this.access_token,
      'crm_refreshtoken': this.crm_refreshtoken,
      'status': '1'
    };
    try{
    await this.CrmModelsService.crmserviceaccesstoken(obj).toPromise();
  }
catch(err){
  console.log("error",err)
}}

  async deactivateOldAccessToken() {
    const body = { 'status': '0' };
    await this.CrmModelsService.crmserviceaccesstokenInactive(body).toPromise();
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

  async getCurrentUserPrivilege() {
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.CRMModel)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

}



