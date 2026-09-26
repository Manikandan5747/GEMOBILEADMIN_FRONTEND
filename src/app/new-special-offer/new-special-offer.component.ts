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
import { Router } from "@angular/router";
import { AddNewSpecialOfferComponent } from "./add-new-special-offer/add-new-special-offer.component";
import { EditNewSpecialOfferComponent } from "./edit-new-special-offer/edit-new-special-offer.component";
import { NewSpecialOfferService } from "./service/new-special-offer.service";

@Component({
  selector: 'app-new-special-offer',
  templateUrl: './new-special-offer.component.html',
  styleUrls: ['./new-special-offer.component.css']
})
export class NewSpecialOfferComponent implements OnInit {

 
  
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  corporatepartnersList:any;
  userPrivilegeObj: any;
  public displayedColumns: string[] = ['actions','cmp_name','usagetype','specialoffer_title','specialofferdesc','specialofferimg','offer_valid_from','offer_valid_to','specialoffercategoryid','showroomname','status','created_by', 'created_at','modified_by','modified_at',];
 
  constructor(private router: Router, private customerService:CustomerService, public toastr: ToastrService,
    private newSpecialOfferService:NewSpecialOfferService,private cookieService: CookieService,public dialog: MatDialog){ 
      this.getCurrentUserPrivilege()
    }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {  
   this.toastr.clear();
   this.getAllSpecialOffer();
  }

  getAllSpecialOffer(){
    this.newSpecialOfferService.getAllspecialoffer().pipe()
    .subscribe( (data:any) => {
       console.log("getAllspecialoffer ",data); 
        this.corporatepartnersList = data;
        this.loadRecord();
      });
  }

  goToShowroomCon(item:any){
    var navigationExtras = { queryParams: { specialofferid: item.specialofferid, } };
    this.router.navigate(['corporate-partner/special-offer'],navigationExtras);
  }


  loadRecord() {
    debugger
    var dynamicTableData:any = [];
    this.corporatepartnersList.forEach((element:any) => {
      let row: any = {
        "showroomdetid":element && element.showroomdetid ?element.showroomdetid :null ,
        "showroomname":element && element.showroomname ?element.showroomname :null ,
        "specialoffercategoryid": element && element.specialoffercategoryid ?element.specialoffercategoryid :0 ,
        "specialofferid": element && element.specialofferid ?element.specialofferid :"" ,
        "specialoffer_title":  element && element.specialoffer_title ?element.specialoffer_title :"" ,
        "specialofferdesc":  element && element.specialofferdesc ?element.specialofferdesc :"" ,
        "specialofferimg":  element && element.specialofferimg ?element.specialofferimg :"" ,
        "status": element&& element.status == 1 ? "Active":"InActive",
        "created_by":  element && element.createdbyname ?element.createdbyname :"" ,
        "created_at": element.created_at ? element.created_at:null,
        "offer_valid_to": element.offer_valid_to ? element.offer_valid_to:null,
        "promocode":element && element.promocode ?element.promocode :"" ,
        "offer_valid_from": element.offer_valid_from ?  element.offer_valid_from:null, 
        "modified_by": element && element.updatedbyname ? element.updatedbyname : "",
        "modified_at": element.modified_at ? element.modified_at :"",
        "cmp_name": element.cmp_name ? element.cmp_name :"",
        
        "cmp_id": element.cmp_id ? element.cmp_id :"",
       "usagetype": element.usagetype == 1 ? "Single" : "Multiple"

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
    const dialogRef = this.dialog.open(AddNewSpecialOfferComponent, {
      width: '950px',
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
    const dialogRef = this.dialog.open(EditNewSpecialOfferComponent, {
      width: '950px',
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

  // async deleteRecord(items:any){
  //   debugger;
  //   var test:any=null;
  //  await  this.newSpecialOfferService.getAllCorporatespecialoffer(items.specialofferid).pipe()
  //   .subscribe( (data:any) => {
  //       data && data.forEach((element:any) => {
  //       if(element.status == 1){
  //         test = test ? test +" , "+ element.corporatepromocode : element.corporatepromocode;
  //       }
  //     });

  //  if(test == null){
  //   Swal.fire({
  //     title: 'Do you want to delete the Corporate Partner ?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'OK'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.newSpecialOfferService.deleteRecord(items.specialofferid).pipe()
  //       .subscribe( (data:any) => {
  //           // console.log("registration ",data); 
  //           this.success(data.message);
  //           this.getAllSpecialOffer();
  //         });
  //     }
  //   })
  //  }else{
  //   Swal.fire({
  //     title: 'Corporate Special Offer',
  //     text: test +" are active!!! So please make it Inactive first ",
  //     icon: 'question',
  //     showCancelButton: false,
  //     confirmButtonColor:'#d33',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Cancel'
  //   }).then((result) => {
     
  //   })
  //  }
     
       
  //     });

  

  
  // }


  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }


  // viewImg(items:any){
  //   const dialogRef = this.dialog.open(NewSpecialOfferFormComponent, {
  //     width: '600px',
  //     height: 'fit-content',
  //     disableClose: true,
  //     data:items
    
  //   });
  //   dialogRef.afterClosed().subscribe((result:any) => {
  //     if (result == 'Success') {
  //       this.getAllSpecialOffer();
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


