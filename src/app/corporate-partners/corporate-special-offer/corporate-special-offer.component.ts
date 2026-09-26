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
import { AddCorporateSpecialOfferComponent } from "../add-corporate-special-offer/add-corporate-special-offer.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-corporate-special-offer',
  templateUrl: './corporate-special-offer.component.html',
  styleUrls: ['./corporate-special-offer.component.css']
})
export class CorporateSpecialOfferComponent implements OnInit {

  
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  corporateSpacialofferList:any;
  userPrivilegeObj: any;
  public displayedColumns: string[] = ['corporatepartnername','corporatespecialofferdesc','corporatepromocode','offerexpirydate','status','created_by', 'created_at','actions'];
  partnerid: any;
 
  constructor( private route: ActivatedRoute,  private customerService:CustomerService, public toastr: ToastrService,
    private corporatePartnersService:CorporatePartnersService,private cookieService: CookieService,public dialog: MatDialog){ 
      this.getCurrentUserPrivilege();
      this.route.queryParams.subscribe(params => {
        this.partnerid = params['partnerid'];
      });
    }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {  
   this.toastr.clear();
   this.getAllSpecialOffer();
  }

  getAllSpecialOffer(){
    this.corporatePartnersService.getAllCorporatespecialoffer(this.partnerid).pipe()
    .subscribe( (data:any) => {
       console.log("getAllCorporatespecialoffer ",data); 
        this.corporateSpacialofferList = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    debugger
    var dynamicTableData:any = [];
    this.corporateSpacialofferList.forEach((element:any) => {
      let row: any = {
        "offerexpirydate": element.offerexpirydate ? moment(element.offerexpirydate).format('MMMM Do YYYY') : "-",

        "partnerid": element && element.partnerid ?element.partnerid :"" ,
        "corporatespecialofferid":element && element.corporatespecialofferid ?element.corporatespecialofferid :"" ,
        "corporatespecialofferdesc": element && element.corporatespecialofferdesc ?element.corporatespecialofferdesc :"" ,
        // "offerexpirydate": element && element.offerexpirydate ?element.offerexpirydate :"" ,
        "corporatepromocode": element && element.corporatepromocode ?element.corporatepromocode :"" ,
        "status": element&& element.status == 1 ? "Active":"InActive",
        "created_by":  element && element.createdbyname ?element.createdbyname :"" ,
        "created_at": element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
       "corporatepartnername": element && element.corporatepartnername ?element.corporatepartnername :"" ,
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

  public editRecord(ele:any){
    const dialogRef = this.dialog.open(AddCorporateSpecialOfferComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data:ele
    
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllSpecialOffer();
      }
    });
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddCorporateSpecialOfferComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data:{partnerid:this.partnerid}
    
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllSpecialOffer();
      }
    });
  }

  deleteRecord(items:any){
    debugger;

    Swal.fire({
      title: 'Do you want to delete the Corporate Partner?',
      // text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.corporatePartnersService.corporatespecialofferdel(items.corporatespecialofferid).pipe()
        .subscribe( (data:any) => {
            // console.log("registration ",data); 
            this.success(data.message);
            this.getAllSpecialOffer();
          });
      }
    })

  
  }


  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }



  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.SpecialOffers)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }


  

}


