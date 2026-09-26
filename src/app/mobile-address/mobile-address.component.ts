import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from "src/app/service/customer/customer.service";
import {MatDialog} from '@angular/material/dialog';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";

@Component({
  selector: 'app-mobile-address',
  templateUrl: './mobile-address.component.html',
  styleUrls: ['./mobile-address.component.css']
})
export class MobileAddressComponent implements OnInit {

 
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  search:any;
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List:any;


  constructor(private customerService:CustomerService,public dialog: MatDialog,)
   { }

  public displayedColumns: string[] = ['addresscustcode','addresstype','addresslocationlink','addressvillaflatno','addressbuildingname','addressareastreet',
  'addressnearbylandmark','addressothername','addressremark','status', 'created_at', ];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {  
   this.getAllAddress();
  }

 

  getAllAddress(){
    this.customerService.getAllAddress().pipe()
    .subscribe( (data:any) => {
      console.log("getAllAddress",data);
      
        this.List = data;
        this.loadRecord();
      });
  }

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Home';
      case 2:
        return 'Office';
      case 3:
        return 'Others';
      default:
        return 'Unknown';
    }
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => this.dataSource.sort = this.sort )
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(){
    this.search ="";
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}



