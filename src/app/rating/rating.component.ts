import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MobileotpService } from "src/app/service/mobileotp/mobileotp.service";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  loading: boolean = false;
   
   
    PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
    PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
    DATE_FORMAT = DateFormat.DATE_FORMAT;
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    error = '';
    List: any;
    dynamicTableData!: any[];
    search:any;
  
    constructor( private otpService: MobileotpService,) { }
  
    public displayedColumns: string[] = ['customercode', 'page_screen', 'rating_value','feedback_comments','device_info','status', 'createdbyname', 'created_at',];
    dataSource!: MatTableDataSource<any>;
  
    ngOnInit(): void {
      this.getAllRating();
    }
  
    getAllRating() {
      this.loading = true;
      this.otpService.getRating().pipe()
        .subscribe((data: any) => {
          console.log("getListofotp ", data);
          this.List = data;
          this.loadRecord();
        });
    }
  
  
    loadRecord() {
      debugger
      this.dataSource = new MatTableDataSource(this.List);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
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
  