import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from "@angular/router";
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CustomerService } from "src/app/service/customer/customer.service";
import { ConsignmentService } from "../consignment/consignment.service";
import { OpportunityService } from "../opportunity/opportunity.service";
import { DataService } from "src/app/service/encryption/data.service";
import { SignLinkComponent } from "./sign-link/sign-link.component";
import { CookieService } from "src/app/service/cookie.service";
import { ManageModuleService } from "src/app/service/manage-module/manage-module.service";
import { ModuleIdList } from "src/app/common/enum";


@Component({
  selector: 'app-purchase-agreement-details',
  templateUrl: './purchase-agreement-details.component.html',
  styleUrls: ['./purchase-agreement-details.component.css']
})
export class PurchaseAgreementDetailsComponent implements OnInit, OnDestroy {

  carshowroom_id!: any;
  brandname!: any;
  modelname!: any;
  carshowroomrefno!: any;

  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List: any;
  public addEditForm!: FormGroup;
  currentuser: any;
  search: string = '';
  purchaseagreementrefno: any;
  storage_data_id: any;
  role_id: any;
  privilege: any;
  privilegesMap = {
    allowSignLink: false,
    allowSendEmail: false,
    allowCopyLink: false,
  };
  userPrivilegeObj: any;

  constructor(private router: Router, private opportunityService: OpportunityService, public consignmentService: ConsignmentService, private fb: FormBuilder, private manageModuleService: ManageModuleService, private cookieService: CookieService, private route: ActivatedRoute, private customerService: CustomerService, public dialog: MatDialog, private dataService: DataService,) {



    this.addEditForm = this.fb.group({
      carshowroomrefno: [''],
      showroomname: [''],
      brandname: [''],
      modelname: [''],
      totalamount: [''],
      description: [''],
      status: ['1'],
    });

    this.storage_data_id = this.dataService.getData('storage_data_id');
    if (this.storage_data_id) {
      this.getRecord(this.storage_data_id);
    } else {
      this.getPurchaseAgreement();
      this.displayedColumns = ['actions', 'purchaseagreementrefno', 'carshowroomrefno', 'signature_status', 'createdby', 'createdat',];

      this.getCurrentUserPrivilege();

    }

  }

  public displayedColumns: string[] = ['actions', 'purchaseagreementrefno', 'carshowroomrefno', 'signature_status', 'createdby', 'createdat',];
  dataSource!: MatTableDataSource<any>;

  get formControl(): any { return this.addEditForm.controls; }

  public async getRecord(storage_data_id: any) {
    await this.dataService.findById(storage_data_id).subscribe({
      next: async (response: any) => {
        debugger
        console.log("Retrieved data:", response);
        this.carshowroom_id = response?.data['carshowroom_id'];
        this.carshowroomrefno = response?.data['carshowroomrefno'];
        this.brandname = response?.data['brandname'];
        this.modelname = response?.data['modelname'];


        this.fillForm();

        this.currentuser = await this.customerService.getCurrentUser();
        let findnextRefno = await this.opportunityService.getfindnextRefno('PURCHASEAGREEMENT').toPromise();
        console.log("purchaseagreementrefno", findnextRefno.purchaseagreementrefno);
        let userid = this.currentuser && this.currentuser[0].login_id;

        this.purchaseagreementrefno = findnextRefno.purchaseagreementrefno;
        let obj = {
          "carshowroom_id": this.carshowroom_id,
          "purchaseagreementrefno": this.purchaseagreementrefno,
          "userid": userid
        }

        this.consignmentService.createPurchaseAgreement(obj).subscribe(
          async (response: any) => {
            console.log("response", response);


            this.getPurchaseAgreement();
          });

        this.getSubPrivilege();

      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });


  }

  async getCurrentUserPrivilege() {
    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;
    this.userPrivilegeObj = {};
    var tempPrivilege = await this.customerService.getCurrentUserPrivilegeArr();
    console.log("this.tempPrivilege", tempPrivilege);
    this.userPrivilegeObj = tempPrivilege.find((ele: any) => ele.module_id == ModuleIdList.PurchaseAgreementainMenu)
    console.log("this.userPrivilegeObj", this.userPrivilegeObj);

    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.PurchaseAgreementainMenu, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);

      const miscPrivileges = Result2.miscPrivileges || [];

      this.privilegesMap = {
        allowSignLink: miscPrivileges.some(p => p.misc_name === 'PURCHASE_AGGREEMENT_ALLOW_SIGN_LINK' && p.access && p.mapping_field_status),
        allowSendEmail: miscPrivileges.some(p => p.misc_name === 'PURCHASE_AGGREEMENT_ALLOW_SEND_EMAIL' && p.access && p.mapping_field_status),
        allowCopyLink: miscPrivileges.some(p => p.misc_name === 'PURCHASE_AGGREEMENT_ALLOW_COPY_LINK' && p.access && p.mapping_field_status),
      };


      console.log("privilegesMap  this.priviprivilegesMaplege", this.privilegesMap);
    });
  }


  getSubPrivilege() {

    this.currentuser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentuser ? JSON.parse(this.currentuser) : "";
    this.role_id = obj[0]?.role_id;


    this.manageModuleService.getModuleFieldWithprivilege(ModuleIdList.ShowroomCars, this.role_id).subscribe((Result2: any) => {
      console.log("Privilege Result2", Result2);


      this.privilege = Result2.data.find(
        ele => ele.child_module_id === ModuleIdList.PurchaseAgreement
      );
      const miscPrivileges = Result2.miscPrivileges || [];

      this.privilegesMap = {
        allowSignLink: miscPrivileges.some(p => p.misc_name === 'PURCHASE_AGGREEMENT_ALLOW_SIGN_LINK' && p.access && p.mapping_field_status),
        allowSendEmail: miscPrivileges.some(p => p.misc_name === 'PURCHASE_AGGREEMENT_ALLOW_SEND_EMAIL' && p.access && p.mapping_field_status),
        allowCopyLink: miscPrivileges.some(p => p.misc_name === 'PURCHASE_AGGREEMENT_ALLOW_COPY_LINK' && p.access && p.mapping_field_status),
      };



    });


  }

  async ngOnInit() { }

  private async fillForm() {
    this.addEditForm.patchValue({
      carshowroomrefno: this.carshowroomrefno,
      brandname: this.brandname,
      modelname: this.modelname,
      totalamount: '',
    });
  }

  getPurchaseAgreement() {
    this.loading = true;
    this.consignmentService.getPurchaseAgreement(this.carshowroom_id).pipe()
      .subscribe((data: any) => {
        console.log("getPurchaseAgreement ", data);
        this.List = data.map(element => ({
          ...element,
          signature_status: element.buyer_sign_path && element.seller_sign_path ? 'SIGNED' : 'PENDING'
        }));

        // this.List = data;

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
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'info', });
    this.loading = false;
  }



  public async downloadConsignmentpdf(ele: any) {
    let obj = {
      key: "app_purchaseagreement",
      value: { carshowroom_id: ele.carshowroom_id, purchaseagreementrefno: this.purchaseagreementrefno, parent_storage_data_id: this.storage_data_id },
    };

    this.dataService.createData(obj).subscribe({
      next: (response) => {
        console.log("Data saved successfully:", response);
        this.dataService.setData('pdf_storage_data_id', response.storage_data_id);
        this.router.navigate(['purchase-agreement/contract']);
      },
      error: (err) => {
        console.error("Error saving data:", err);
      }
    });
  }


  goback() {
    this.dataService.clearData('storage_data_id');
    history.back();
  }

  clearSearch() {
    this.search = "";
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.dataService.clearData('storage_data_id');

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

  async onDeleteStatusChange(purchaseagreementid: any) {

    Swal.fire({
      title: 'Do you want to delete the Purchase Agreement? Once deleted, it cannot be Re-activated. Proceed?',
      icon: 'question',
      //text:checkProduct.tables,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let result = await this.consignmentService.deletePurchaseAgreementById(purchaseagreementid).toPromise();
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: result.message,
          icon: 'success',
        });
        this.getPurchaseAgreement();


      }
    })


  }



}






