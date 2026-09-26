import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { BrandService } from "src/app/service/brand/brand.service";
import { ExportToExcelService } from "src/app/service/exportExcel/export-to-excel.service";

@Component({
  selector: 'app-catalogue-brand-model',
  templateUrl: './catalogue-brand-model.component.html',
  styleUrls: ['./catalogue-brand-model.component.css']
})
export class CatalogueBrandModelComponent implements OnInit {
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  brandList: any = [];
  modelList: any =[];
  
  dynamicTableData!: any[];
  dataForExcel: any =[];
  originalValuebrandList: any;
  catalogueid:string="";
  filteredList: any;
  constructor(public toastr: ToastrService, private brandService: BrandService,private exportToExcelService: ExportToExcelService,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog) { }

  public displayedColumns: string[] = ['id', 'name', ];
  public displayedLabelColumns: string[] = ['id', 'name',];
  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.toastr.clear();
   this.getAllTableBrand();
  }

  getAllTableBrand() {
    this.brandService.getBrand().pipe()
      .subscribe((data: any) => {
        console.log("getBrand ", data);
        this.originalValuebrandList = data;
        this.filteredList = this.originalValuebrandList.slice();
      });
  }

  getAllBrand() {debugger
    // this.loading = true;
    // this.loadRecord();
    this.brandService.findBrandsFromCatalogue().pipe()
      .subscribe((data: any) => {
        console.log("findBrandsFromCatalogue ", data);
        this.brandList = data.data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }

  getBrandsbasedModelsFromCatalogue(){
    // this.loadRecord();
    
     this.brandService.getBrandsbasedModelsFromCatalogue(this.catalogueid).pipe()
      .subscribe((data: any) => {
        console.log("getBrandsbasedModelsFromCatalogue ", data);
        this.brandList = data.data;
        this.loadRecord();
      });
  }

  loadRecord() {
    this.dynamicTableData = [];
    this.brandList && this.brandList.forEach((element: any) => {
      let row = {
        id: element.id,
        name: element.name,
      }
      this.dynamicTableData.push(row);
    })
    this.dataSource = new MatTableDataSource(this.dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.loading = false;
  }

  exportExcel() {
    this.dataSource.filteredData.forEach((row: any) => {
    this.dataForExcel.push(Object.values(row))
  })
  this.exportToExcelService.exportAsExcelFile(this.displayedLabelColumns, this.dataForExcel, "Report Excel","noHeader","Report Excel");
  this.dataForExcel =[];
}


public isFiltered(item:any) { 
  return this.filteredList.find((ele:any) => ele.brandid == item.brandid);
}
 

}


