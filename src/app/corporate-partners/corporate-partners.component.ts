import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
const moment = require('moment');
import {MatDialog} from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import {ToastrService} from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "../common/ui.constant";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { ViewImgComponent } from "../special-offer/view-img/view-img.component";
import { AddCorporatePartnersComponent } from "./add-corporate-partners/add-corporate-partners.component";
import { CorporatePartnersService } from "../service/corporate-partners/corporate-partners.service";
import { ViewCorporateIconComponent } from "./view-corporate-icon/view-corporate-icon.component";
import { Router } from "@angular/router";
import { EditCorporatePartnersComponent } from "./edit-corporate-partners/edit-corporate-partners.component";
import { ErrorlogService } from "../errorlog.service";


@Component({
  selector: 'app-corporate-partners',
  templateUrl: './corporate-partners.component.html',
  styleUrls: ['./corporate-partners.component.css']
})
export class CorporatePartnersComponent implements OnInit {

 
 
  
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  corporatepartnersList:any;
  userPrivilegeObj: any;
  public displayedColumns: string[] = ['actions','corporatepartnername','corporatepartnercode','corporatepartnericonpath','status','created_by', 'created_at',];
 
  constructor(private router: Router, private customerService:CustomerService, public toastr: ToastrService,
    private corporatePartnersService:CorporatePartnersService,private cookieService: CookieService,public dialog: MatDialog,private errorlogService: ErrorlogService){ 
      this.getCurrentUserPrivilege()
    }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {  
   this.toastr.clear();
   this.getAllSpecialOffer();
  }

  getAllSpecialOffer(){
    this.corporatePartnersService.getCorporatepartners().pipe()
    .subscribe( (data:any) => {
       console.log("getCorporatepartners ",data); 
        this.corporatepartnersList = data;
        this.loadRecord();
      });
  }

  goToShowroomCon(item:any){
    var navigationExtras = { queryParams: { partnerid: item.partnerid, } };
    this.router.navigate(['corporate-partner/special-offer'],navigationExtras);
  }


  loadRecord() {
    debugger
    var dynamicTableData:any = [];
    this.corporatepartnersList.forEach((element:any) => {
      let row: any = {
        "partnerid": element && element.partnerid ?element.partnerid :"" ,
        "corporatepartnername":  element && element.corporatepartnername ?element.corporatepartnername :"" ,
        "corporatepartnercode":  element && element.corporatepartnercode ?element.corporatepartnercode :"" ,
        "corporatepartnericonpath":  element && element.corporatepartnericonpath ?element.corporatepartnericonpath :"" ,
        "status": element&& element.status == 1 ? "Active":"InActive",
        "created_by":  element && element.createdbyname ?element.createdbyname :"" ,
        "created_at": element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
       
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


  public async addRecord() {debugger
    const dialogRef = this.dialog.open(AddCorporatePartnersComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      // data:count
    
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllSpecialOffer();
      }
    });
  }

  editRecord(items:any){
    const dialogRef = this.dialog.open(EditCorporatePartnersComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data:items
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllSpecialOffer();
      }
    });
  }

  async deleteRecord(items:any){
    debugger;
    var test:any=null;
   await  this.corporatePartnersService.getAllCorporatespecialoffer(items.partnerid).pipe()
    .subscribe( (data:any) => {
        data && data.forEach((element:any) => {
        if(element.status == 1){
          test = test ? test +" , "+ element.corporatepromocode : element.corporatepromocode;
        }
      });

   if(test == null){
    Swal.fire({
      title: 'Do you want to delete the Corporate Partner ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.corporatePartnersService.deleteRecord(items.partnerid).pipe()
        .subscribe( (data:any) => {
            // console.log("registration ",data); 
            this.success(data.message);
            this.getAllSpecialOffer();
          });
      }
    })
   }else{
    this.errorlogService.logManualValidationError(`corporate-partners component|deleteRecord()|${test} +" are active!!! So please make it Inactive first`);
    Swal.fire({
      title: 'Corporate Special Offer',
      text: test +" are active!!! So please make it Inactive first ",
      icon: 'question',
      showCancelButton: false,
      confirmButtonColor:'#d33',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cancel'
    }).then((result) => {
     
    })
   }
     
       
      });

  

  
  }


  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }


  viewImg(items:any){
    const dialogRef = this.dialog.open(ViewCorporateIconComponent, {
      width: '600px',
      height: 'fit-content',
      disableClose: true,
      data:items
    
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllSpecialOffer();
      }
    });
  }
  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.SpecialOffers)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }


}


