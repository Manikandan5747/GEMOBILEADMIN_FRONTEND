import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { TermsandconditionsService } from "../termsandconditions/termsandconditions.service";

@Component({
  selector: 'app-contract-type',
  templateUrl: './contract-type.component.html',
  styleUrls: ['./contract-type.component.css']
})
export class ContractTypeComponent implements OnInit {

  loading: boolean = false;
  search:any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List:any=[];
  dynamicTableData!: any[];

  constructor(public toastr: ToastrService, private termsandconditionsService: TermsandconditionsService,private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) {
    }

  public displayedColumns: string[] = ['contract_type_id','contract_type_name','status', 'created_by', 'created_at',];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
    this.getContractType();
  }

  getContractType() {
    this.loading = true;
    this.termsandconditionsService.getContractType().pipe()
      .subscribe((data: any) => {
        console.log("getContractType", data);
        this.List = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }
  




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

  clearSearch(){
    this.search ="";
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


