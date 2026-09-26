import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MobileotpService } from "src/app/service/mobileotp/mobileotp.service";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import Swal from 'sweetalert2';
import { MatDialog } from "@angular/material/dialog";
import { AccessListComponent } from "./access-list/access-list.component";

@Component({
  selector: 'app-short-links',
  templateUrl: './short-links.component.html',
  styleUrls: ['./short-links.component.css']
})
export class ShortLinksComponent implements OnInit {
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

  constructor( private otpService: MobileotpService,public dialog: MatDialog) { }

  public displayedColumns: string[] = ['short_url','access_count', 'original_url',  'custcode','platform','module_name',  'created_at',];
  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAllURL();
  }

  getAllURL() {
    this.loading = true;
    this.otpService.getShortURL().pipe()
      .subscribe((data: any) => {
        console.log("getShortURL ", data);
        this.List = data;
        this.loadRecord();
      });
  }

  copyToClipboard(url: string) {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Copied to clipboard", icon: 'success', });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
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


  
  // public openPopup(items: any) {
  //   debugger
  //   const dialogRef = this.dialog.open(AccessListComponent, {
  //     width: '850px',
  //     height: 'fit-content',
  //     disableClose: true,
  //     data: items
  //   });
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result == 'Success') {
       
  //     }
  //   });
  // }
}
