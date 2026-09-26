import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from 'src/app/service/brand/brand.service';
import { CookieService } from 'src/app/service/cookie.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-brand',
  templateUrl: './import-brand.component.html',
  styleUrls: ['./import-brand.component.css']
})
export class ImportBrandComponent implements OnInit {

  lableName: any;
  loading:boolean=false;
  formData = new FormData();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  isModelPage: any;
  backlinkName: string ="";

  constructor(private brandService: BrandService,private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.isModelPage = params['isModelPage'];
      });
   }

  public displayedColumns: string[] = [];
  public displayedLabelColumns: string[] = [];

    dataSource!: MatTableDataSource<any>;
  ngOnInit(): void {
    debugger;
    // console.log("this.isModelPage",this.isModelPage);

    if(this.isModelPage == "true"){
      this.backlinkName = "Return to Manage Model";
      this.displayedColumns = ['brandname', 'status', 'created_by', 'created_at','imported'];
      this.displayedLabelColumns = ['Model Name', 'status', 'created By', 'created Date','imported'];
    }else{
      this.backlinkName = "Return to Manage Brand"
      this.displayedColumns = ['brandname', 'status', 'created_by', 'created_at','imported'];
      this.displayedLabelColumns = ['brand name', 'status', 'created By', 'created Date','imported'];
    }
  }

  fileChange(element:any) {
  this.loading = true;
    this.formData = new FormData();
    var uploadedFiles = element.target.files;
    this.lableName = element.target.files[0].name.toUpperCase();

    for (let file of uploadedFiles) {
      this.formData.append("uploads[]", file, file.name);
    }

    if(this.isModelPage=="true"){
      this.brandService.bulkUploadModels(this.formData).pipe().subscribe((data: any) => {
        console.log("bulkUploadModels ", data);
        this.loadRecord(data);
      });
    }else{
      this.brandService.uploadCSVBrandFile(this.formData).pipe().subscribe((data: any) => {
        console.log("uploadCSVBrandFile ", data);
        this.loadRecord(data);
      });
    }
   
  }

  loadRecord(list:any) {debugger
    var dynamicTableData:any = [];
    list && list.result.forEach((element: any) => {
      if(element && element.B != "name"){
        let row = {
          brandname: element.Model,
          brandcode: element && element.brandcode ? element.brandcode :"",
          status: element && element.status == 1 ? "Active" : "InActive",
          created_by: "Mobile Admin",
          created_at: element.created_at,
          imported:element.isImport && element.isImport == true ? "Imported" :"Already Exists"
        }
        dynamicTableData.push(row);
      }
      
    })
    this.dataSource = new MatTableDataSource(dynamicTableData);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.loading = false;
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: list.message, icon: 'success', });
  }

  back(){
    if(this.isModelPage =="true"){
      this.router.navigate(['/model']);
    }else{
      this.router.navigate(['/brand']);
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
