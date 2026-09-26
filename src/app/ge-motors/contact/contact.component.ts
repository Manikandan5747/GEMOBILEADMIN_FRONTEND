import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { ContactService } from "./contact.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ModuleIdList } from "src/app/common/enum";
import { DataService } from "src/app/service/encryption/data.service";
import { ErrorlogService } from "src/app/errorlog.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit,OnDestroy {

  userPrivilegeObj: any;
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
  accountid: any;
  storage_data_id: any;

  constructor(public toastr: ToastrService, private contactService: ContactService,private router: Router,private dataService: DataService,
    private customerService:CustomerService, private route: ActivatedRoute, private cookieService: CookieService, public dialog: MatDialog,private errorlogService: ErrorlogService) {
      this.getCurrentUserPrivilege();

      this.storage_data_id = this.dataService.getData('parent_storage_data_id');
      if(this.storage_data_id){
        this.getRecord(this.storage_data_id);
      }else{
        this.getContact()
      }
    }

  public displayedColumns: string[] = ['actions','salutation','firstname','lastname','contactname','accountname','mobile','email','emiratesid', 'createdby', 'createdat', 'modifiedby', 'modifiedat', ];

  dataSource!: MatTableDataSource<any>;



  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);
        this.accountid = response?.data['accountid'];
        this.getContact()
      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }
  ngOnInit() { 

  }

  async getCurrentUserPrivilege(){
    this.userPrivilegeObj = {};
    var tempPrivilege =await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege",tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele:any) => ele.module_id == ModuleIdList.Gecontact)
    console.log("this.userPrivilegeObj",this.userPrivilegeObj);

     // Check if user has at least one action privilege
    const hasActionAccess = this.userPrivilegeObj.editaccess === 1
      || this.userPrivilegeObj.deleteaccess === 1;

    if (!hasActionAccess) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    }
  }

  getContact() {
    this.loading = true;
    this.contactService.getContact().pipe()
      .subscribe((data: any) => {
        console.log("getContact", data);
        this.List = data;
        if (this.accountid) {
          this.List = data && data.filter((ele: any) => ele.accountid === parseInt(this.accountid));
        }
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

  public addRecord() {
    this.router.navigate(['/contact/create-contact']);
  }


  public editRecord(items: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_contact",
      value: { contactid: items.contactid,  }
    };
  
    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['contact/create-contact']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }



  clearSearch(){
    this.search ="";
    // localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  public gotoactivity(ele: any) {
    // Create an object to store the key and value
    let obj = {
      key: "app_activity",
      value:  {entitytype: 'CONTACT',
        entityid: ele.contactid,name:ele.firstname       },
    };
  
    // Call the service method to save the data
    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('storage_data_id', response.storage_data_id);
        this.router.navigate(['activity']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  ngOnDestroy() {
    this.dataService.clearData('parent_storage_data_id');
  }

    async onDeleteStatusChange(contactid: any) {
    let checkProduct = await this.contactService.checkContactAvailability(contactid).toPromise();
    console.log('Delete status check result:', checkProduct);
    if (checkProduct.status) {
      this.errorlogService.logManualValidationError(`contact component|onDeleteStatusChange()|This Contact cannot be deleted because it is associated with Other Module. Please review the related pages below. ${checkProduct.tables}`);
      Swal.fire({
        title: "This Contact cannot be deleted because it is associated with Other Module. Please review the related pages below.",
        // toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        text: checkProduct.tables,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Do you want to delete the Contact? Once deleted, it cannot be Re-activated. Proceed?',
        icon: 'question',
        //text:checkProduct.tables,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await this.contactService.deleteContactById(contactid).toPromise();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: result.message,
            icon: 'success',
          });
         this.getContact()

        }
      })


    }
  }

  
}


