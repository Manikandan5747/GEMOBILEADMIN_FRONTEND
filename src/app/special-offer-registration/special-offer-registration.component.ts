import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
const moment = require('moment');
import {MatDialog} from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import {ToastrService} from 'ngx-toastr';
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { CorporatePartnersService } from "src/app/service/corporate-partners/corporate-partners.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-special-offer-registration',
  templateUrl: './special-offer-registration.component.html',
  styleUrls: ['./special-offer-registration.component.css']
})
export class SpecialOfferRegistrationComponent implements OnInit {

 
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  corporateSpacialofferUserList:any;
  userPrivilegeObj: any;
  public displayedColumns: string[] = ['specialofferempname','specialofferemail','specialofferphoneno','specialofferempid','corporatepromocode','corporatespecialofferdesc','status','created_by', 'created_at',];
  partnerid: any;
 
  constructor( private route: ActivatedRoute,  private customerService:CustomerService, public toastr: ToastrService,
    private corporatePartnersService:CorporatePartnersService,private cookieService: CookieService,public dialog: MatDialog){ 
      this.getCurrentUserPrivilege();
      // this.route.queryParams.subscribe(params => {
      //   this.partnerid = params['partnerid'];
      // });
    }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {  debugger
   this.toastr.clear();
   this.getAllSpecialOfferUserList();
  }

  async getAllSpecialOfferUserList(){
   await this.corporatePartnersService.specialofferregistration().pipe()
    .subscribe( (data:any) => {
       console.log("specialofferregistration ",data); 
        this.corporateSpacialofferUserList = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    debugger
    var dynamicTableData:any = [];
    this.corporateSpacialofferUserList.forEach((element:any) => {
      let row: any = {
        "specialofferempid": element && element.specialofferempid ? element.specialofferempid : "",
        "corporatespecialofferid": element && element.corporatespecialofferid ? element.corporatespecialofferid : "",
        "corporatespecialofferdesc": element && element.corporatespecialofferdesc ? element.corporatespecialofferdesc : "",
        "specialofferempname": element && element.specialofferempname ? element.specialofferempname : "",
        "corporatepromocode": element && element.corporatepromocode ? element.corporatepromocode : "",
       "specialofferphoneno": element && element.specialofferphoneno ? element.specialofferphoneno : "",
        "specialofferemail": element && element.specialofferemail ? element.specialofferemail : "",
        "status": element && element.status == 1 ? "Active" : "InActive",
        "created_by": element && element.createdbyname ? element.createdbyname : "",
        "created_at": element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        "corporatepartnername": element && element.corporatepartnername ? element.corporatepartnername : "",
      }
      dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(dynamicTableData);
    this.dataSource.paginator = this.paginator;
    setTimeout(() => this.dataSource.sort = this.sort )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  

  // public addRecord() {
  //   const dialogRef = this.dialog.open(AddCorporateSpecialOfferComponent, {
  //     width: '850px',
  //     height: 'fit-content',
  //     disableClose: true,
  //     data:{partnerid:this.partnerid}
    
  //   });
  //   dialogRef.afterClosed().subscribe((result:any) => {
  //     if (result == 'Success') {
  //       this.getAllSpecialOfferUserList();
  //     }
  //   });
  // }


  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.SpecialOffers)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }

}


