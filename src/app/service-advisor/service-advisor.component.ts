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
import { AnnualLeaveComponent } from "./annual-leave/annual-leave.component";
import { EditServiseAdvisorComponent } from "./edit-servise-advisor/edit-servise-advisor.component";
import { ServiceAdvisorService } from "./service-advisor.service";
const moment = require('moment');

@Component({
  selector: 'app-service-advisor',
  templateUrl: './service-advisor.component.html',
  styleUrls: ['./service-advisor.component.css']
})
export class ServiceAdvisorComponent implements OnInit {
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  corporatepartnersList: any;
  userPrivilegeObj: any;
  currentUserRole: string = '';
  public displayedColumns: string[] = ['actions','name', 'phone','crmrole__name', 'location__name', 'imgpath', 'email', 'type','leavestartdate','leaveenddate','leavestatus','status', 'createdbyname', 'created_at', 'username', 'modified_at', ];
  access_token!: any;
  crm_refreshtoken!: any;
  loading:any=false;

  constructor(private router: Router, private customerService: CustomerService, public toastr: ToastrService,
    private serviceAdvisorService: ServiceAdvisorService, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
    this.getCurrentUserPrivilege()
  }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {
  const currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
  const parsed = currentUser ? JSON.parse(currentUser)[0] : null;
  this.currentUserRole = parsed?.userrole || ''; 

  console.log("userole",  this.currentUserRole)
    this.getServiceadvisorlist();
  }

  // async getServiceadvisorlist() {
  //   await this.serviceAdvisorService.getServiceadvisorlist().pipe()
  //     .subscribe((data: any) => {
  //       console.log("getServiceadvisorlist ", data);
  //       this.corporatepartnersList = data;
  //       this.dataSource = new MatTableDataSource(this.corporatepartnersList);
  //       this.dataSource.paginator = this.paginator;
  //       setTimeout(() => this.dataSource.sort = this.sort)
  //     });
  // }

   async getServiceadvisorlist() {
    const isReceptionist = this.currentUserRole === 'Receptionist';


  await (isReceptionist
    ? this.serviceAdvisorService.getServiceadvisorlistbyreceptionist()
    : this.serviceAdvisorService.getServiceadvisorlist()
  ).pipe().subscribe((data: any) => {
    console.log("getServiceadvisorlist ", data);
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
    const dialogRef = this.dialog.open(EditServiseAdvisorComponent, {
      width: '1000px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getServiceadvisorlist();
      }
    });
  }

  annualLeave(items: any) {
    const dialogRef = this.dialog.open(AnnualLeaveComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getServiceadvisorlist();
      }
    });
  }

  async getAccessToken() {
    try {
      // alert('hi')
      this.loading = true;
      // return
      const token: any = await this.serviceAdvisorService.getAccessToken().toPromise();
      console.log("getToken ", token);
      var firstToken: any = token[0] && token[0].crm_accesstoken;
      this.syncServiceAdvisor(firstToken)
    } catch (error) {
      console.error("Error:", error);
    }
  }



  async syncServiceAdvisor(token: any) {
    const syncData: any = await this.serviceAdvisorService.syncServiceAdvisor({ "access_token": token }).toPromise();
    console.log("syncServiceAdvisor ", syncData);

    if (syncData && syncData.message === "Token Expired") {
      const currentAccessToken: any = await this.serviceAdvisorService.getNewAccessToken().toPromise();
      console.log("currentAccessToken", currentAccessToken);
      
      if (currentAccessToken && currentAccessToken.Data && currentAccessToken.Data.accessToken) {
        this.access_token = currentAccessToken.Data && currentAccessToken.Data.accessToken;
        this.crm_refreshtoken = currentAccessToken.Data && currentAccessToken.Data.refreshToken;
        await this.updateAccessToken();
        await this.deactivateOldAccessToken();
        await this.syncServiceAdvisor(this.access_token);
      }else {
        console.error('Missing access token or refresh token in the response');
      }
     

    } else {
      if(syncData.code =='201'){
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: syncData.message, icon: 'success' });
      }else{
        this.errorlogService.logManualValidationError(`service-advisor component|syncServiceAdvisor()|Error: ${syncData.message}`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: syncData.message, icon: 'error' });
      }
      this.loading = false;
      this.getServiceadvisorlist();
   
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
    await this.serviceAdvisorService.crmserviceaccesstoken(obj).toPromise();
  }
catch(err){
  console.log("error",err)
}}

  async deactivateOldAccessToken() {
    const body = { 'status': '0' };
    await this.serviceAdvisorService.crmserviceaccesstokenInactive(body).toPromise();
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
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.CRMUSER)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);
  }

}


