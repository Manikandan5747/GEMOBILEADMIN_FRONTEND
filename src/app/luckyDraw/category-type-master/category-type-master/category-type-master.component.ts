import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { LuckDrawService } from "../../lucky-draw/luck-draw.service";

@Component({
  selector: 'app-category-type-master',
  templateUrl: './category-type-master.component.html',
  styleUrls: ['./category-type-master.component.css']
})
export class CategoryTypeMasterComponent implements OnInit {


  search:any;
  PAGE_SIZE =MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List:any;


  constructor(private luckydrawService: LuckDrawService,)
   { }

  public displayedColumns: string[] = ['category_name','category_type','no_of_items_weel','status','createdbyname', 'created_at', ];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {  
   this.getAllLoginLog();
  }


  getAllLoginLog(){
    this.luckydrawService.listAllCategoryType().pipe()
    .subscribe( (data:any) => {
        console.log("listAllCategoryType ",data); 
        this.List = data;
        this.loadRecord();
      });
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


