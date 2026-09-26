import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
const moment = require('moment');
import {MatDialog} from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { SpecialOfferService } from "../service/special-offer/special-offer.service";
import { AddEditSpecialOfferFormComponent } from "./add-edit-special-offer-form/add-edit-special-offer-form.component";
import { ViewImgComponent } from "./view-img/view-img.component";
import {ToastrService} from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "../common/ui.constant";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { ErrorlogService } from "../errorlog.service";

@Component({
  selector: 'app-special-offer',
  templateUrl: './special-offer.component.html',
  styleUrls: ['./special-offer.component.css']
})
export class SpecialOfferComponent implements OnInit {

  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  personList:any;
  dynamicTableData!: any[];
  userPrivilegeObj: any;
  public displayedColumns: string[] = ['actions','cmp_name','spclofferurl','spclofferpath','status','created_by', 'created_at',];
  constructor( private customerService:CustomerService, public toastr: ToastrService,
    private specialOfferService:SpecialOfferService,private cookieService: CookieService,public dialog: MatDialog,private errorlogService: ErrorlogService){ 
      this.getCurrentUserPrivilege()
    }

  dataSource!: MatTableDataSource<any>;
  ngOnInit() {  
   this.toastr.clear();
   this.getAllSpecialOffer();
  }

  getAllSpecialOffer(){
    this.specialOfferService.getSpecialoffer().pipe()
    .subscribe( (data:any) => {
       console.log("getSpecialoffer ",data); 
        this.personList = data;
        this.loadRecord();
      },error => {
        this.error = error;
      });
  }


  loadRecord() {
    debugger
    this.dynamicTableData = [];
    this.personList.forEach((element:any) => {
      let row: any = {
        spf_id: element.spf_id ? element.spf_id : "-",
        spclofferpath: element.spclofferpath ? element.spclofferpath : "-",
        spcloffertext: element.spcloffertext ? element.spcloffertext : "-", 
        spclofferurl: element.spclofferurl ? element.spclofferurl :" -",
        status: element&& element.status == 1 ? "Active":"InActive",
        created_by:  element && element.createdbyname ?element.createdbyname :"" ,
        created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
        cmp_name: element.cmp_name ? element.cmp_name : "-",
        cmp_id: element.cmp_id ? element.cmp_id : "-",
      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    this.dataSource.paginator = this.paginator;
    setTimeout(() => this.dataSource.sort = this.sort )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  public addRecord() {
    const dialogRef = this.dialog.open(AddEditSpecialOfferFormComponent, {
      width: '450px',
      height: 'fit-content',
      disableClose: true,
    
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result == 'Success') {
        this.getAllSpecialOffer();
      }
    });
  }

  deleteRecord(items:any){
    debugger;
    this.specialOfferService.deleteRecord(items.spf_id,"").pipe()
    .subscribe( (data:any) => {
        // console.log("registration ",data); 
        this.success(data.message);
        this.getAllSpecialOffer();
      },error => {
        this.error = error;
        this.errorlogService.logManualValidationError(`special offer delete record error:${error}`);
        this.handleError(error);
      });
  }


  private success(message:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }


  viewImg(items:any){
    const dialogRef = this.dialog.open(ViewImgComponent, {
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


