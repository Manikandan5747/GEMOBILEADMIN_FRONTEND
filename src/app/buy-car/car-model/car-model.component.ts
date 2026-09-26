import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ModuleIdList } from "src/app/common/enum";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { ErrorlogService } from "src/app/errorlog.service";
import { CookieService } from "src/app/service/cookie.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModelService } from "src/app/service/model/model.service";
import Swal from 'sweetalert2';
import { AddCarModelComponent } from "./add-car-model/add-car-model.component";
import { EditCarModelComponent } from "./edit-car-model/edit-car-model.component";
const moment = require('moment');
@Component({
  selector: 'app-car-model',
  templateUrl: './car-model.component.html',
  styleUrls: ['./car-model.component.css']
})
export class CarModelComponent implements OnInit {
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  modelList: any;
  dynamicTableData!: any[];
  userPrivilegeObj: any;

  constructor( private customerService:CustomerService,public toastr: ToastrService, private modelService: ModelService,private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
      this.getCurrentUserPrivilege()
     }

  public displayedColumns: string[] = ['actions','modelname','modelcode','brandname', 'status', 'created_by', 'created_at', 'modified_by', 'modified_at', ];
  // public displayedLabelColumns: string[] = ['brand name','modelname', 'modelcode', 'status', 'created By', 'created Date', 'updated By', 'updated Date', 'Action'];
  dataSource!: MatTableDataSource<any>;

  async ngOnInit() {
    this.toastr.clear();
    await this.getAllModels();
  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.Model)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);
  }


  getAllModels() {
    this.loading = true;
    this.modelService.getCarModel().pipe()
      .subscribe((data: any) => {
        console.log("getCarModel", data);
        this.modelList = data;
        this.loadRecord();
      }, error => {
        this.error = error;
      });
  }

  loadRecord(){
    this.dataSource = new MatTableDataSource(this.modelList);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  // loadRecord() {
  //   this.dynamicTableData = [];
  //   this.modelList.forEach((element: any) => {
  //     let row = {
  //       brandname:element.brandname,
  //       modelid:element.modelid,
  //       brandid: element.brandid,
  //       modelname: element.modelname,
  //       modelcode: element.modelcode,
  //       status: element && element.status == 1 ? "Active" : "InActive",
  //       created_by: "Mobile Admin",
  //       created_at: element.created_at ? moment(element.created_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //       modified_by: element && element.modified_by ? "Mobile Admin" : "-",
  //       modified_at: element.modified_at ? moment(element.modified_at).format('DD-MMM-YYYY hh:mm:ss A') : "-",
  //     }
  //     this.dynamicTableData.push(row);
  //   })
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    const dialogRef = this.dialog.open(AddCarModelComponent, {
      width: '450px',
      height: 'fit-content',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllModels();
      }
    });
  }

  public editRecord(items: any) {
    debugger

    this.modelService.modelIsAlreadyMapped(items.modelid).subscribe(
      (response:any) => {
        console.log("response",response);
        if(response.length > 0){
          // Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 8000, title: "Contact Already Mapped with Car.", icon: 'error', });
          this.errorlogService.logManualValidationError(`car-model component|editRecord()|Do you want to edit Record? Model Already Mapped with Car!.`);
          Swal.fire({
            title: 'Do you want to edit Record?',
            text: "Model Already Mapped with Car!",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              items.alreadyMapped = 'true';
              this.editpopup(items);
            }
          }); 
        }else{
          items.alreadyMapped = 'false';
          this.editpopup(items);
        }
      })
   
  }

  editpopup(items:any){
    const dialogRef = this.dialog.open(EditCarModelComponent, {
      width: '450px',
      height: 'fit-content',
      disableClose: true,
      data: {
        modelid:items.modelid,
        brandid: items.brandid,
        modelname: items.modelname,
        modelcode: items.modelcode,
        status: items.status,
        alreadyMapped:items.alreadyMapped
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getAllModels();
      }
    });
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

  goImportPage() {
		var navigationExtras = {
			queryParams: { isModelPage: "true" },
		};
    this.router.navigate(['/brand/import-brand'], navigationExtras);
	}

   async onDeleteStatusChange(modelid: any) {
    let checkProduct = await this.modelService.checkModelAvailability(modelid).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`car-model component|onDeleteStatusChange()|This Model cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
      Swal.fire({
        title: "This Model cannot be deleted because it is associated with Other Module. Please review the related pages below.",
        // toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        text: checkProduct.tables,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Do you want to delete the Model? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.modelService.deleteModelById(modelid).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });
          await this.getAllModels();

        }
      })
    }
  }

  
}


