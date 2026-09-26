import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "src/app/service/cookie.service";
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ConsignmentService } from "./consignment.service";
import { AddConsignmentComponent } from "./add-consignment/add-consignment.component";
import { EditConsignmentComponent } from "./edit-consignment/edit-consignment.component";
import * as moment from "moment";
import { ModuleIdList, RoleIdList } from "src/app/common/enum";
import { DataService } from "src/app/service/encryption/data.service";
import { SignLinkComponent } from "./sign-link/sign-link.component";
import { stat } from "fs";
import { CarDetailsService } from "src/app/service/car-details/car-details.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ErrorlogService } from "src/app/errorlog.service";


@Component({
  selector: 'app-consignment',
  templateUrl: './consignment.component.html',
  styleUrls: ['./consignment.component.css']
})

export class ConsignmentComponent implements OnInit, OnDestroy {
  @Input('accountid') accountid!: any;
  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  consignmentList: any;
  public addEditForm!: FormGroup;
  currentuser: any;
  search: string = '';
  role_id: any;
  editmenu: boolean = true;
  carshowroom_id: any;
  showroomname: any;
  brandname: any;
  modelname: any;
  carshowroomrefno: any;
  soldstatus: any;
  status: any;
  carprice: any;
  storage_data_id: any;
  privilege: any;
  privilegesMap = {
    addInactive: false,
    editInactive: false,
    deleteInactive: false,
    allowSignLink: false,
    allowSendEmail: false, allowCopyLink: false,
    allowStatusFieldActive: false,
    consignment_signed_contract_edit_allow: false,
    consignment_soldcar_create_contract_allow: false
  };

  userPrivilegeObj: any;
  isrelated_module: boolean = false;
  miscPrivileges: any;
  constructor(private router: Router, public consignmentService: ConsignmentService, private fb: FormBuilder, private customerService: CustomerService, private manageModuleService: ManageModuleService,
    private cookieService: CookieService, private carDetailsService: CarDetailsService,
    private dataService: DataService, public dialog: MatDialog, private errorlogService: ErrorlogService) {

    this.loading = true;
    this.storage_data_id = this.dataService.getData('storage_data_id');
    if (this.storage_data_id) {
      this.isrelated_module = true;
      this.getRecord(this.storage_data_id);
    } else {
      this.getCurrentUserPrivilege();
      this.displayedColumns = ['actions', 'carshowroomrefno', 'consignmentrefno', 'accountname', 'contactname', 'consignmentstartdate', 'consignmentexpirydate', 'consignmentamount', 'consignmentdoc', 'signature_status', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];
      // this.privilegesMap = {
      //   addInactive: true,
      //   editInactive: true,
      //   deleteInactive: true,
      //   allowSignLink: true,
      //   allowSendEmail: true, allowCopyLink: true,
      //   allowStatusFieldActive: true
      // };
      this.getConsignment();
    }
  }

  public displayedColumns: string[] = ['actions', 'consignmentrefno', 'accountname', 'contactname', 'consignmentstartdate', 'consignmentexpirydate', 'consignmentamount', 'consignmentdoc', 'signature_status', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];
  dataSource!: MatTableDataSource<any>;

  get formControl(): any { return this.addEditForm.controls; }


  public getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        console.log("Retrieved data:", response);
        this.carshowroom_id = response?.data['carshowroom_id'];
        this.showroomname = response?.data['showroomname'];
        this.brandname = response?.data['brandname'];
        this.modelname = response?.data['modelname'];
        this.carshowroomrefno = response?.data['carshowroomrefno'];
        this.soldstatus = response?.data['soldstatus'];
        this.status = response?.data['status'];

        this.carprice = response?.data['carprice'];
        this.accountid = response?.data['carowner'];
        this.addEditForm = this.fb.group({
          carshowroomrefno: [''],
          showroomname: [''],
          brandname: [''],
          modelname: [''],
          totalamount: [''],
          description: [''],
          status: ['1'],
        });

        this.getConsignment();
        this.fillForm();
        this.getSubPrivilege();
      },
    });
  }


  async ngOnInit() {



  }


  getSubPrivilege() {
    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;

    if (!this.carshowroom_id) {
      this.displayedColumns = ['actions', 'carshowroomrefno', 'consignmentrefno', 'accountname', 'contactname', 'consignmentstartdate', 'consignmentexpirydate', 'consignmentamount', 'consignmentdoc', 'signature_status', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat',];

      this.getCurrentUserPrivilege();
    } else {
      this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ShowroomCars, this.role_id).subscribe((Result2: any) => {
        console.log("Privilege Result2", Result2);

        this.privilege = Result2.data.find(
          ele => ele.child_module_id === ModuleIdList.Consignment
        );
        this.miscPrivileges = Result2.miscPrivileges || [];

        if (this.status === "InActive") {
          this.privilegesMap = {
            addInactive: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ADD_INACTIVE' && p.access && p.mapping_field_status),
            editInactive: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_EDIT_INACTIVE' && p.access && p.mapping_field_status),
            deleteInactive: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_DELETE_INACTIVE' && p.access && p.mapping_field_status),
            allowSignLink: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_SIGN_LINK' && p.access && p.mapping_field_status),
            allowSendEmail: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_SEND_EMAIL' && p.access && p.mapping_field_status),
            allowCopyLink: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_COPY_LINK' && p.access && p.mapping_field_status),
            allowStatusFieldActive: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_STATUS_FIELD_ACTIVE' && p.access && p.mapping_field_status),
            consignment_signed_contract_edit_allow: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_SIGNED_CONTRACT_EDIT_ALLOW' && p.access && p.mapping_field_status),
            consignment_soldcar_create_contract_allow: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_SOLDCAR_CREATE_CONTRACT_ALLOW' && p.access && p.mapping_field_status),

          };

        } else {
          this.privilegesMap = {
            addInactive: true,
            editInactive: true,
            deleteInactive: true,
            allowSignLink: true,
            allowSendEmail: true, allowCopyLink: true,
            allowStatusFieldActive: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_STATUS_FIELD_ACTIVE' && p.access && p.mapping_field_status),
            consignment_signed_contract_edit_allow: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_SIGNED_CONTRACT_EDIT_ALLOW' && p.access && p.mapping_field_status),
            consignment_soldcar_create_contract_allow: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_SOLDCAR_CREATE_CONTRACT_ALLOW' && p.access && p.mapping_field_status),
          };
          this.privilege = Result2.data.find(
            ele => ele.child_module_id === ModuleIdList.Consignment
          );
        }
        console.log("Privilege  this.privilege", this.privilege);
      });
    }
  }


  async getCurrentUserPrivilege() {
    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.ConsignmentMainMenu)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ConsignmentMainMenu, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);

      const miscPrivileges = Result2.miscPrivileges || [];
      console.log("Privilege miscPrivileges", miscPrivileges);
      this.privilegesMap = {
        addInactive: true,
        editInactive: true,
        deleteInactive: true,
        allowSignLink: miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_SIGN_LINK' && p.access && p.mapping_field_status),
        allowSendEmail: miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_SEND_EMAIL' && p.access && p.mapping_field_status),
        allowCopyLink: miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_COPY_LINK' && p.access && p.mapping_field_status),
        allowStatusFieldActive: miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_ALLOW_STATUS_FIELD_ACTIVE' && p.access && p.mapping_field_status),
        consignment_signed_contract_edit_allow: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_SIGNED_CONTRACT_EDIT_ALLOW' && p.access && p.mapping_field_status),
        consignment_soldcar_create_contract_allow: this.miscPrivileges.some(p => p.misc_name === 'CONSIGNMENT_SOLDCAR_CREATE_CONTRACT_ALLOW' && p.access && p.mapping_field_status),
      };


      console.log("privilegesMap  this.priviprivilegesMaplege", this.privilegesMap);
    });
  }


  private async fillForm() {
    this.addEditForm.patchValue({
      carshowroomrefno: this.carshowroomrefno,
      showroomname: this.showroomname,
      brandname: this.brandname,
      modelname: this.modelname,
      totalamount: '',
    });
  }

  async getConsignment() {
    this.loading = true;
    this.consignmentService.getConsignment(this.carshowroom_id).pipe()
      .subscribe((data: any) => {
        console.log("getConsignment ", data);
        this.consignmentList = data;
        this.loadRecord();
      });
    if (this.carshowroom_id) {
      await this.carDetailsService.getCarDetailsByID(this.carshowroom_id).pipe()
        .subscribe(async (data: any) => {
          console.log("data", data);
          this.status = data && data[0].status == 1 ? "Open" : "InActive"
        })
    }
  }

  calculateTotalExpenseValue(expenses: any[]): string {
    let totalExpenseValue = 0;
    for (const expense of expenses) {
      totalExpenseValue += parseFloat(expense.consignmentamount);
    }
    return totalExpenseValue.toFixed(2);
  }


  loadRecord() {
    var dynamicTableData: any = [];
    this.consignmentList && this.consignmentList.forEach((element: any) => {
      let row = {
        ...element,
        signature_status: element.signature_status ? element.signature_status : "PENDING",
        status: element.status == 1 ? "Active" : "In-Active",
        modifiedat: element.modifiedat ? moment(element.modifiedat).format('DD-MMM-YYYY hh:mm:ss A') : "",
        createdat: element.createdat ? moment(element.createdat).format('DD-MMM-YYYY hh:mm:ss A') : "",
      }
      dynamicTableData.push(row);
    });

    console.log("dynamicTableData", dynamicTableData);

    this.dataSource = new MatTableDataSource(dynamicTableData);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
    this.loading = false;
    let arr = this.consignmentList && this.consignmentList.filter((ele: any) => ele.status == 1);

    if (this.carshowroom_id) {
      this.addEditForm.patchValue({
        totalamount: this.calculateTotalExpenseValue(arr)
      });
    }

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRecord() {
    debugger
    if (this.soldstatus == "Sold") {
      if (this.privilegesMap.consignment_soldcar_create_contract_allow) {
        this.errorlogService.logManualValidationError(`consignment component|addRecord()|Car Already Sold`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Car Already Sold", icon: 'info', });
      } else {
        this.errorlogService.logManualValidationError(`consignment component|addRecord()|Car Already Sold`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Car Already Sold", icon: 'info', });
        return
      }

    }
    const dialogRef = this.dialog.open(AddConsignmentComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: {
        "carshowroom_id": this.carshowroom_id, "accountid": this.accountid, "isrelated_module": this.isrelated_module,
        "allowStatusFieldActive": this.privilegesMap.allowStatusFieldActive
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getConsignment();
      }
    });
  }


  editRecord(items: any) {
    items.allowStatusFieldActive = this.privilegesMap.allowStatusFieldActive;
    items.isrelated_module = this.isrelated_module;
    if (items.signature_status == "SIGNED") {
      if (this.privilegesMap.consignment_signed_contract_edit_allow) {
        this.errorlogService.logManualValidationError(`consignment component|editRecord()|Contract already signed`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Contract already signed", icon: 'info', });
      } else {
        this.errorlogService.logManualValidationError(`consignment component|editRecord()|Contract already signed`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Contract already signed", icon: 'info', });
        return
      }
    }
    const dialogRef = this.dialog.open(EditConsignmentComponent, {
      width: '1200px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Success') {
        this.getConsignment();
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

  inActiveRecord(ele: any) {
    Swal.fire({
      // toast: true,
      position: 'center',
      showConfirmButton: true,
      timer: 6000,
      title: `Please update the status of the consignment car to Inactive in the showroom car with Ref no: ` + ele.carshowroomrefno,
      icon: 'info',
    }).then((result) => {
      this.consignmentService.consignmentupdatestatustoinactive(ele.consignmentid).pipe()
        .subscribe((data: any) => {
          this.success(data.message);
          this.getConsignment();
        })
    });

  }

  deleteRecord(element: any) {
    Swal.fire({
      title: 'Are You Sure You Want to Delete This Consignment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.consignmentService.deleteConsignmentrecords(element).pipe()
          .subscribe((data: any) => {
            this.getConsignment();
          })
      }
    })
  }


  public async downloadConsignmentpdf(ele: any) {
    let obj = {
      key: "app_consignmentdettb",
      value: { consignmentid: ele.consignmentid },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('pdf_storage_data_id', response.storage_data_id);
        this.router.navigate(['consignmentpdf']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }

  goback() {
    this.dataService.clearAllData(); history.back();
  }

  clearSearch() {
    this.search = "";
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
  }

  public openPopup(items: any) {
    items.privilegesMap = this.privilegesMap
    const dialogRef = this.dialog.open(SignLinkComponent, {
      width: '850px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.storage_data_id) {
        this.getRecord(this.storage_data_id);
      }
    });
  }


}


