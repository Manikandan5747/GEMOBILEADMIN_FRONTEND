import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { BrandService } from 'src/app/service/brand/brand.service';
import { ModelService } from 'src/app/service/model/model.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { CookieService } from 'src/app/service/cookie.service';
import { PushNotificationsService } from 'src/app/service/push.notification.service';
import { PortalUsersStatusService } from 'src/app/service/portalusers-status/portal-users-status.service';
import { CarCityService } from 'src/app/service/car-city/car-city.service';
import { DateFormat } from 'src/app/common/ui.constant';
import { CarownerTypeService } from 'src/app/ge-motors/carowner-type/carowner-type.service';
import { AddContactFormComponent as AddAccountFormComponent } from '../../../ge-motors/account/add-contact-form/add-contact-form.component';
import { AccountService } from 'src/app/ge-motors/account/account.service';
import { MatDialog } from '@angular/material/dialog';
import { RoleIdList } from 'src/app/common/enum';
import { EditContactFormComponent } from 'src/app/ge-motors/account/edit-contact-form/edit-contact-form.component';
import { DataService } from 'src/app/service/encryption/data.service';
import { CommonConstants } from 'src/app/common/common.constant';
import { CashRequestService } from 'src/app/ge-motors/cash-request/cash-request.service';
import { ModeOfPaymentService } from 'src/app/ge-motors/mode-of-payment/mode-of-payment.service';
import { SalesOrderService } from 'src/app/ge-motors/sales-order/sales-order.service';
import { ConsignmentService } from 'src/app/ge-motors/consignment/consignment.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-add-edit-car-details-form',
  templateUrl: './add-edit-car-details-form.component.html',
  styleUrls: ['./add-edit-car-details-form.component.css']
})
export class AddEditCarDetailsFormComponent implements OnInit, OnDestroy {

  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  ShowroomManagerRoleId = RoleIdList.ShowroomManager;
  AdminRoleId = RoleIdList.Admin;
  getBrandName: any;
  CommonConstants: any = CommonConstants.WEBAPI_URL + '/'

  updatemulkiyadocfront: any = null;
  updatemulkiyadocback: any = null;
  imageSrc: any;
  imageSrcback: any;


  yearList: any = [

    { "key": "1980 and above" },
    { "key": "2000" },
    { "key": "2001" },
    { "key": "2002" },
    { "key": "2003" },
    { "key": "2004" },
    { "key": "2005" },
    { "key": "2006" },
    { "key": "2007" },
    { "key": "2008" },
    { "key": "2009" },
    { "key": "2010" },
    { "key": "2011" },
    { "key": "2012" },
    { "key": "2013" },
    { "key": "2014" },
    { "key": "2015" },
    { "key": "2016" },
    { "key": "2017" },
    { "key": "2018" },
    { "key": "2019" },
    { "key": "2020" },
    { "key": "2021" },
    { "key": "2022" },
    { "key": "2023" },
    { "key": "2024" },
    { "key": "2025" },
    { "key": "2026" },
    { "key": "2027" },
  ];
  filteredYearList: any = [
    { "key": "1980 and above" },
    { "key": "2000" },
    { "key": "2001" },
    { "key": "2002" },
    { "key": "2003" },
    { "key": "2004" },
    { "key": "2005" },
    { "key": "2006" },
    { "key": "2007" },
    { "key": "2008" },
    { "key": "2009" },
    { "key": "2010" },
    { "key": "2011" },
    { "key": "2012" },
    { "key": "2013" },
    { "key": "2014" },
    { "key": "2015" },
    { "key": "2016" },
    { "key": "2017" },
    { "key": "2018" },
    { "key": "2019" },
    { "key": "2020" },
    { "key": "2021" },
    { "key": "2022" },
    { "key": "2023" },
    { "key": "2024" },
    { "key": "2025" },
    { "key": "2026" },
    { "key": "2027" },
  ];
  filteredDriveTypeList: any = [
    { "key": "All-wheel-drive (AWD)", "value": "AWD" },
    { "key": "Front wheel drive (FWD)", "value": "FWD" },
    { "key": "Rear wheel drive (RWD)", "value": "RWD" },
    { "key": "4 wheel drive (4WD)", "value": "4WD" },
  ];
  driveTypeList: any = [
    { "key": "All-wheel-drive (AWD)", "value": "AWD" },
    { "key": "Front wheel drive (FWD)", "value": "FWD" },
    { "key": "Rear wheel drive (RWD)", "value": "RWD" },
    { "key": "4 wheel drive (4WD)", "value": "4WD" },
  ];

  fuelTypeList: any = [
    { "key": "GasOline" },
    { "key": "Diesel" },
    { "key": "Hybrid" },
    { "key": "Electric" },

  ];
  filteredFuelTypeList: any = [
    { "key": "GasOline" },
    { "key": "Diesel" },
    { "key": "Hybrid" },
    { "key": "Electric" },
  ];

  regionalSpecsList: any = [
    { "key": "Gcc Specs" },
    { "key": "German Spec" },
    { "key": "American Specs" },
    { "key": "Canadian Specs" },
    { "key": "European Specs" },
    { "key": "Japanese Specs" },
    { "key": "Other" },
  ];
  filteredRegionalSpecsList: any = [
    { "key": "Gcc Specs" },
    { "key": "German Spec" },
    { "key": "American Specs" },
    { "key": "Canadian Specs" },
    { "key": "European Specs" },
    { "key": "Japanese Specs" },
    { "key": "Other" },
  ];

  bodyConditionsList: any = [
    { "key": "Perfect inside and out" },
    { "key": "No accidents, very few faults" },
    { "key": "A bit of wear & tear,all repaired" },
    { "key": "Normal wear & tear,a few issues" },
    { "key": "Lots  of wear & tear to the body" },
  ];
  filteredBodyConditionsList: any = [
    { "key": "Perfect inside and out" },
    { "key": "No accidents, very few faults" },
    { "key": "A bit of wear & tear,all repaired" },
    { "key": "Normal wear & tear,a few issues" },
    { "key": "Lots  of wear & tear to the body" },
  ];

  filteredCarColorList: any = [
    { "key": "Black" },
    { "key": "Blue" },
    { "key": "Brown" },
    { "key": "Burgundy" },
    { "key": "Gold" },
    { "key": "Grey" },
    { "key": "Orange" },
    { "key": "Green" },
    { "key": "Purple" },
    { "key": "Red" },
    { "key": "Silver" },
    { "key": "Beige" },
    { "key": "Tan" },
    { "key": "Teal" },
    { "key": "White" },
    { "key": "Yellow" },
  ];
  carColorList: any = [
    { "key": "Black" },
    { "key": "Blue" },
    { "key": "Brown" },
    { "key": "Burgundy" },
    { "key": "Gold" },
    { "key": "Grey" },
    { "key": "Orange" },
    { "key": "Green" },
    { "key": "Purple" },
    { "key": "Red" },
    { "key": "Silver" },
    { "key": "Beige" },
    { "key": "Tan" },
    { "key": "Teal" },
    { "key": "White" },
    { "key": "Yellow" },
  ];
  bodyTypeList: any = [
    { "key": "Coupe" },
    { "key": "Hatchback" },
    { "key": "Pick Up Truck" },
    { "key": "Sedan" },
    { "key": "Convertible" },
    { "key": "SUV" },
    { "key": "Van" },
    { "key": "Sports" },
    { "key": "Luxury" },
    { "key": "Economy" },
    { "key": "Family" },
    { "key": "Other" },

  ];
  filteredBodyTypeList: any = [
    { "key": "Coupe" },
    { "key": "Hatchback" },
    { "key": "Pick Up Truck" },
    { "key": "Sedan" },
    { "key": "Convertible" },
    { "key": "SUV" },
    { "key": "Van" },
    { "key": "Sports" },
    { "key": "Luxury" },
    { "key": "Economy" },
    { "key": "Family" },
    { "key": "Other" },
  ];

  horsepowerList: any = [
    { "key": "Less than 100 HP" },
    { "key": "100-200 HP" },
    { "key": "200-300 HP" },
    { "key": "300-400 HP" },
    { "key": "400-500 HP" },
    { "key": "500-600 HP" },
    { "key": "600-700 HP" },
    { "key": "700-800 HP" },
    { "key": "800-900 HP" },
    { "key": "900-1000 HP" },
    { "key": "1000+ HP" },
    { "key": "Unknown" },
  ];
  filteredHorsepowerList: any = [
    { "key": "Less than 100 HP" },
    { "key": "100-200 HP" },
    { "key": "200-300 HP" },
    { "key": "300-400 HP" },
    { "key": "400-500 HP" },
    { "key": "500-600 HP" },
    { "key": "600-700 HP" },
    { "key": "700-800 HP" },
    { "key": "800-900 HP" },
    { "key": "900-1000 HP" },
    { "key": "1000+ HP" },
    { "key": "Unknown" },
  ];

  mechanicalConditionList: any = [
    { "key": "Perfect inside and out" },
    { "key": "Minor faults,all fixed" },
    { "key": "Major faults,all fixed" },
    { "key": "Major faults fixed,small remain" },
    { "key": "Ongoing minor & major faults" },
  ];
  filteredMechanicalConditionList: any = [
    { "key": "Perfect inside and out" },
    { "key": "Minor faults,all fixed" },
    { "key": "Major faults,all fixed" },
    { "key": "Major faults fixed,small remain" },
    { "key": "Ongoing minor & major faults" },
  ];

  noofcylinderList: any = [
    { "key": "3" },
    { "key": "4" },
    { "key": "5" },
    { "key": "6" },
    { "key": "8" },
    { "key": "10" },
    { "key": "12" },
    { "key": "16" },
    { "key": "Electrical Motor" },
  ];
  filterednoofcylinderList: any = [
    { "key": "3" },
    { "key": "4" },
    { "key": "5" },
    { "key": "6" },
    { "key": "8" },
    { "key": "10" },
    { "key": "12" },
    { "key": "16" },
    { "key": "Electrical Motor" },
  ];
  DATE_FORMAT = DateFormat.DATE_FORMAT;

  loading: boolean = false;
  public addEditForm!: FormGroup;
  brandList: any = [];
  modelList: any;
  filteredList: any;
  filteredModelList: any;
  formData = new FormData();
  carshowroom_id: any;
  title: string = "Showroom Car";
  carimgpathList: any = [];
  inspectionReport: any;
  docpath: any;
  showroomCarDetailsList: any;
  showroomContactDetailsList: any;
  showroomContact: any;
  carshowroomreferenceno: any;
  choosedFileName: any;
  filteredShowroomContactDetailsList: any;
  filteredShowroomDetailsList: any;
  customerList: any = [];
  currentUser: any;
  carvideopath: any;
  choosedVideoFileName: any;
  videopath: any;
  portalUsersStatusList: any;
  CarCityList: any;
  cityDetailsList: any;
  images: any = "";
  carsolddate: any;
  tempIsapprovedstatus: any;
  carownertypeList: any = [];
  minEndDate: any = new Date();
  totalExpense!: any;
  totalAdvance!: any;
  totalConsignment!: any;
  totalsalesprice!: any;
  accountList: any = [];
  accountFilteredList: any = [];
  accountOrgList: any = [];
  role_id: any;
  hidePricediv: boolean = true;
  sellingprice: any = "";
  isEdit: any;
  purchaseaccountList: any = [];
  purchaseaccountFilteredList: any = [];
  tempcarsolddate: any;
  durationDays: any;
  showmobileappdate: any;
  storage_data_id: any;
  cashReqList: any;
  filteredCashreqDetailsList: any;
  modeofpaymentfilteredList: any;
  modeofpaymentList: any;
  settings: any;
  isSettingUser: any;
  sharewithaccountList: any;
  sharewithaccountFilterList: any;
  getDeatils: any;
  divhasAccess: boolean = false;
  constructor(private carCityService: CarCityService, private pushNotificationService: PushNotificationsService, private customerService: CustomerService, private router: Router, private salesOrderService: SalesOrderService, private fb: FormBuilder, private brandService: BrandService, private modelService: ModelService, public consignmentService: ConsignmentService,
    public dialog: MatDialog, private carDetailsService: CarDetailsService, private carownerTypeService: CarownerTypeService, public accountService: AccountService, private dataService: DataService, public cashRequestService: CashRequestService,
    private elementRef: ElementRef, private cookieService: CookieService,
    public modeOfPaymentService: ModeOfPaymentService,
    private formValidationService: FormValidationService, private portalUsersStatusService: PortalUsersStatusService, private errorlogService: ErrorlogService) {
    this.storage_data_id = this.dataService.getData('storage_data_id');
    this.getRecord(this.storage_data_id);
  }

  public getRecord(storage_data_id: any) {
    if (storage_data_id) {
      this.dataService.findById(storage_data_id).subscribe({
        next: (response: any) => {
          console.log("Retrieved data:", response);
          this.carshowroom_id = response?.data['carshowroom_id'];
          this.isEdit = response?.data['isEdit'];
          this.divhasAccess = response?.data['divhasAccess'];


          if (!this.carshowroom_id) {
            this.carDetailsService.getfindnextRefno().pipe()
              .subscribe((data: any) => {
                console.log("getnextRefno", data.carshowroomrefno);
                this.carshowroomreferenceno = data.carshowroomrefno;
              });
          }
        },
        error: (err) => {
          console.error("Error retrieving data:", err);
        }
      });
    } else {
      if (!this.carshowroom_id) {
        this.carDetailsService.getfindnextRefno().pipe()
          .subscribe((data: any) => {
            console.log("getnextRefno", data.carshowroomrefno);
            this.carshowroomreferenceno = data.carshowroomrefno;
          });
      }
    }

  }

  public sharewithaccountFiltered(item: any) {
    return this.sharewithaccountFilterList.find((ele: any) => ele.accountname == item.accountname);
  }

  public accountidFiltered(item: any) {
    return this.accountFilteredList.find((ele: any) => ele.accountname == item.accountname);
  }

  public purchaseaccountidFiltered(item: any) {
    return this.purchaseaccountFilteredList.find((ele: any) => ele.accountname == item.accountname);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addEditForm.controls;
  }

  ngAfterViewInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    // if (!this.carshowroom_id) {
    //   setTimeout(() => {
    //     this.addEditForm.patchValue({ carshowroomrefno: this.carshowroomreferenceno });
    //   }, 1000)
    // }
    this.getAllCustomer();
  }


  getAllCustomer() {
    this.customerService.getCustomer().pipe()
      .subscribe((data: any) => {
        console.log("registration ", data);
        this.customerList = data;
        // this.approvedCustomerList =  this.customerList.filter((ele:any)=> ele.customerstatus == "Approved"); 
      });
  }

  // Whitespace validator
  noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }


  async ngOnInit() {
    this.loading = true;
    await this.getShowroomDetails();

    this.addEditForm = this.fb.group({
      // customername: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      brandid: ['', Validators.required],
      modelid: ['', Validators.required],
      modelyear: ['', Validators.required],
      showroomdetid: ['', Validators.required],
      showroomcontactDetail: [null, Validators.required],
      carshowroomrefno: ['', Validators.required], enginecapacity: [''],
      mileage: ['', [Validators.pattern(/^[0-9]+$/)]],
      cityname: [''],
      carcityid: ['', Validators.required],
      drivetype: [''],
      noofcylinder: [''],
      noofseats: [''],
      priceavailablity: [true],
      specs: [''],
      fueltype: [''],
      transmissiontype: [''],
      bodycondition: [''],
      mechanicalcondition: [''],
      carcolor: [''],
      warranty: [''],
      door: [''],
      title: ['', Validators.required],
      bodytype: [''],
      horsepower: [''],
      description: ['', Validators.required],
      status: [true],
      soldstatus: [''],
      showmobileapp: [true],
      servicehistorystatus: [true],
      cardetailsurl: [''],
      carprice: ['', [Validators.required, this.formValidationService.decimalNumberValidator()]],

      remark: [''],
      videourl: [''], inspectionreporturl: [''],
      isapprovedstatus: ['', Validators.required],
      carownertypeid: ['', Validators.required],
      chasisno: ['', [Validators.required, Validators.pattern(/^[\w\d]{17}$/)]],
      purchaseprice: ['', [Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)]],
      purchasedate: [''],
      geshareval: ['', [this.formValidationService.noWhitespaceValidator, this.formValidationService.noZeroValidator()]],
      ownersharevalue: ['', [this.formValidationService.noWhitespaceValidator, this.formValidationService.noZeroValidator()]],
      salestype: [''],
      noofkeys: ['', [Validators.pattern(/^[0-9]+$/)]],
      platenumber: [''],
      carowner: [''],
      maxdiscount: [''],
      sellingprice: [''],
      modeofpaymentid: ['', Validators.required],
      warrantytype: [''],
      purchasedetails: ['', Validators.required],
      sharedcostvalue: [''],
      solddate: [''],
      specialoffer: [false],
      specialofferprice: ['', [Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)]],
      mulkiyadocfront: [''],
      mulkiyadocback: [''],
      cashrequestid: [],
      sharewithid: ['']
    });



    this.addEditForm.controls['warranty'].valueChanges.subscribe(value => {
      const warrantytypeControl = this.addEditForm.controls['warrantytype'];
      if (value == "Yes") {
        warrantytypeControl.setValidators([Validators.required]);
      } else {
        warrantytypeControl.clearValidators();
      }
      warrantytypeControl.updateValueAndValidity();
    });


    //specialoffer
    this.addEditForm.controls['specialoffer'].valueChanges.subscribe(value => {
      const specialofferpriceControl = this.addEditForm.controls['specialofferprice'];
      if (value) {
        specialofferpriceControl.setValidators([Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)]);
      } else {
        specialofferpriceControl.clearValidators();
      }
      specialofferpriceControl.updateValueAndValidity();
    });

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');

    //   this.getDeatils = await this.salesOrderService.findSettingsappsetcategory('SHOWROOMCARDETAILS').toPromise();
    //  console.log("getDeatils",this.getDeatils);


    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.role_id = obj[0]?.role_id;
    const purchasepriceControl = this.addEditForm.controls['purchaseprice'];
    const purchasedateControl = this.addEditForm.controls['purchasedate'];
    const maxdiscountControl = this.addEditForm.controls['maxdiscount'];
    const sharedcostvalueControl = this.addEditForm.controls['sharedcostvalue'];


    const modeofpaymentControl = this.addEditForm.controls['modeofpaymentid'];
    const purchasedetailsControl = this.addEditForm.controls['purchasedetails'];

    //     this.divhasAccess = this.getDeatils.some(
    //   (item:any) => item.appsetparametervalue === this.role_id.toString()
    // );

    if (this.divhasAccess) {
      this.hidePricediv = true;
      purchasepriceControl.setValidators([Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)]);
      purchasedateControl.setValidators([Validators.required]);
      maxdiscountControl.setValidators([Validators.required]);
      // sharedcostvalueControl.setValidators([Validators.required]);
    } else {
      this.hidePricediv = false;
      purchasepriceControl.clearValidators();
      purchasedateControl.clearValidators();
      maxdiscountControl.clearValidators();
      sharedcostvalueControl.clearValidators();
      modeofpaymentControl.clearValidators();
      purchasedetailsControl.clearValidators();
    }

    sharedcostvalueControl.updateValueAndValidity();


    this.addEditForm.controls['carownertypeid'].valueChanges.subscribe(value => {
      const ownersharevalueControl = this.addEditForm.controls['ownersharevalue'];
      const gesharevalControl = this.addEditForm.controls['geshareval'];
      const carownerControl = this.addEditForm.controls['carowner'];
      if (value == 3) {
        gesharevalControl.setValidators([Validators.required, this.formValidationService.noZeroValidator()]);
        ownersharevalueControl.setValidators([Validators.required, this.formValidationService.noZeroValidator()]);
        carownerControl.setValidators([Validators.required]);
        purchasepriceControl.clearValidators();
        purchasedateControl.clearValidators();
        maxdiscountControl.clearValidators();
        sharedcostvalueControl.clearValidators();
        modeofpaymentControl.clearValidators();
        purchasedetailsControl.clearValidators();
      } else if (value == 2) {
        carownerControl.setValidators([Validators.required]);
        purchasepriceControl.clearValidators();
        purchasedateControl.clearValidators();
        maxdiscountControl.clearValidators();
        sharedcostvalueControl.clearValidators();
        modeofpaymentControl.clearValidators();
        purchasedetailsControl.clearValidators();
      } else {
        gesharevalControl.clearValidators();
        ownersharevalueControl.clearValidators();
        carownerControl.clearValidators();

        if (this.divhasAccess) {
          this.hidePricediv = true;
          purchasepriceControl.setValidators([Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)]);
          purchasedateControl.setValidators([Validators.required]);
          maxdiscountControl.setValidators([Validators.required]);
          modeofpaymentControl.setValidators([Validators.required]);
          purchasedetailsControl.setValidators([Validators.required]);
        } else {
          this.hidePricediv = false;
          purchasepriceControl.clearValidators();
          purchasedateControl.clearValidators();
          maxdiscountControl.clearValidators();
          sharedcostvalueControl.clearValidators();

          purchasedetailsControl.clearValidators();
          modeofpaymentControl.clearValidators();
        }



      }
      ownersharevalueControl.updateValueAndValidity();
      gesharevalControl.updateValueAndValidity();
      carownerControl.updateValueAndValidity();
      purchasedetailsControl.updateValueAndValidity();
      modeofpaymentControl.updateValueAndValidity();
      purchasepriceControl.updateValueAndValidity();
      purchasedateControl.updateValueAndValidity();
      maxdiscountControl.updateValueAndValidity();
      sharedcostvalueControl.updateValueAndValidity();
    });

    this.accountOrgList = await this.accountService.get().toPromise();
    console.log("this.accountOrgList ", this.accountOrgList);
    let temtypeid = ["2"];
    this.accountList = this.accountOrgList && this.accountOrgList.filter((item: { typeid: any[]; }) => item.typeid.some((id: string) => temtypeid.includes(id)));
    this.accountFilteredList = this.accountList;


    // let temtypeid1 = ["1"];
    this.purchaseaccountList = this.accountOrgList && this.accountOrgList.filter((item: { typeid: any[]; }) => item.typeid.some((id: string) => temtypeid.includes(id)));
    this.purchaseaccountFilteredList = this.purchaseaccountList;

    await this.findSettingsappsetcategory();
    await this.cashRequestService.getCashRequest().pipe()
      .subscribe((data: any) => {
        console.log("CashRequest", data);
        this.cashReqList = data && data.filter((ele: any) => ele.cashrequesttype == "carpurchase");
        if (this.carshowroom_id) {
          this.filteredCashreqDetailsList = this.cashReqList;
        } else {
          this.filteredCashreqDetailsList = [];
        }

      });

    await this.getModeofpayment();
    await this.getAllBrand();
    await this.getCarCity();
    await this.getPortalUsersStatus();
    this.carownertypeList = await this.carownerTypeService.getCarownertype().toPromise();
    console.log("this.carownertypeList", this.carownertypeList);

    this.addEditForm.patchValue({
      carownertypeid: 1, carowner: 1
    })
    if (this.carshowroom_id) {
      // this.title = "Edit Showroom Car"
      await this.carDetailsService.getCarDetailsByID(this.carshowroom_id).pipe()
        .subscribe(async (data: any) => {

          console.log("datadata", data);
          let carimgpath = data && data[0].carimgpath ? data[0]?.carimgpath : null;
          // var text: any = carimgpath ? carimgpath.split(" ") :'';
          // const myArray = carimgpath.replace("{", "[");
          // this.carimgpathList = JSON.parse(myArray.replace("}", "]"));
          this.carimgpathList = carimgpath;
          // JSON.parse( myArray.replace("}", "]"))
          // console.log("myArray2",myArray2)
          //  var carimgpath = data[0].carimgpath;
          //  var carList = JSON.parse(carimgpath);

          this.showmobileappdate = data[0] && data[0].showmobileappdate;

          this.carsolddate = data[0] && data[0].solddate;
          this.tempcarsolddate = this.carsolddate;
          this.sellingprice = data[0] && data[0].sellingprice;

          this.docpath = data[0] && data[0].docuploadpath ? data[0].docuploadpath : null;
          this.videopath = data[0] && data[0].carvideopath ? data[0].carvideopath : null;
          await this.getModelList(data[0].brandid, 'Edit');
          await this.fillForm(data[0]);

        });

      const response = await this.carDetailsService.getTotalAmounts(this.carshowroom_id).toPromise();
      // this.totalExpense = response.totalExpense ? parseFloat(response.totalExpense):0.00;
      // this.totalAdvance = response.totalAdvance ? parseFloat(response.totalAdvance):0.00;
      // this.totalConsignment = response.totalConsignment ? parseFloat(response.totalConsignment):0.00;
      // this.totalsalesprice = parseFloat(this.totalExpense) + parseFloat(this.totalAdvance) + parseFloat(this.totalConsignment);
      // Convert the values, treating the string "0" as 0.00
      this.totalExpense = response.totalExpense === "0" ? 0.00 : parseFloat(response.totalExpense) || 0.00;
      this.totalAdvance = response.totalAdvance === "0" ? 0.00 : parseFloat(response.totalAdvance) || 0.00;
      this.totalConsignment = response.totalConsignment === "0" ? 0.00 : parseFloat(response.totalConsignment) || 0.00;

      // Calculate the total sales price
      this.totalsalesprice = this.totalExpense + this.totalAdvance + this.totalConsignment;


    }

    if (this.isEdit == "VIEW") {
      this.addEditForm.disable();
    }
    this.addEditForm.patchValue({ showroomdetid: 1 });
    await this.getShowroomContactList(1);
    setTimeout(() => {
      this.loading = false;
    }, 1000);







    if (!this.carshowroom_id) {
      this.addEditForm.patchValue({ carshowroomrefno: this.carshowroomreferenceno });
    }



  }



  getPortalUsersStatus() {
    this.portalUsersStatusService.getPortalUsersStatus().pipe()
      .subscribe((data: any) => {
        console.log("getPortalUsersStatus", data);
        this.portalUsersStatusList = data;
      });
  }

  private async fillForm(parsedData: any) {
    await this.getShowroomContactList(parsedData?.carshowroomname);


    let created_at = parsedData && parsedData.created_at ? parsedData?.created_at : null;
    const createdAt: any = new Date(created_at);
    const currentDate: any = new Date();

    // Calculate the duration in milliseconds
    const durationMs = currentDate - createdAt;


    // if(parsedData.status == 1  ){
    // Convert duration to days 
    let durationDays: any = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    this.durationDays = parseInt(durationDays)

    // }


    this.tempIsapprovedstatus = parsedData.isapprovedstatus ? parsedData.isapprovedstatus : null;

    this.updatemulkiyadocfront = parsedData.mulkiyadocfront ? parsedData.mulkiyadocfront : null;
    this.updatemulkiyadocback = parsedData.mulkiyadocback ? parsedData.mulkiyadocback : null;

    this.addEditForm.patchValue({
      carcityid: parsedData.carcityid,
      brandid: parsedData.brandid,
      modelid: parsedData.modelid,
      modelyear: parsedData.modelyear,
      carshowroomrefno: parsedData.carshowroomrefno,
      enginecapacity: parsedData.enginecapacity == "null" ? null : parsedData.enginecapacity,
      mileage: parsedData.mileage == "null" ? null : parsedData.mileage,
      cityname: parsedData.cityname == "null" ? null : parsedData.cityname,
      drivetype: parsedData.drivetype == "null" ? null : parsedData.drivetype,
      noofcylinder: parsedData.noofcylinder == "null" ? null : parsedData.noofcylinder,
      noofseats: parsedData.noofseats == "null" ? null : parsedData.noofseats,
      priceavailablity: parsedData && parsedData.priceavailablity == 1 ? true : false,
      specs: parsedData.specs == "null" ? null : parsedData.specs,
      fueltype: parsedData.fueltype == "null" ? null : parsedData.fueltype,
      transmissiontype: parsedData.transmissiontype == "null" ? null : parsedData.transmissiontype,
      description: parsedData.description == "null" ? null : parsedData.description,
      servicehistorystatus: parsedData && parsedData.servicehistorystatus == 1 ? true : false,
      cardetailsurl: parsedData.cardetailsurl == "null" ? null : parsedData.cardetailsurl,
      carprice: parsedData.carprice == "null" ? null : parsedData.carprice ? parsedData.carprice : 0,
      remark: parsedData.remark == "null" ? null : parsedData.remark,
      status: parsedData && parsedData.status == 1 ? true : false,
      showroomdetid: parsedData.carshowroomname,
      showroomcontactDetail: parsedData?.showroomdcon_id,
      bodycondition: parsedData.bodycondition == "null" ? null : parsedData.bodycondition,
      mechanicalcondition: parsedData.mechanicalcondition == "null" ? null : parsedData.mechanicalcondition,
      carcolor: parsedData.carcolor == "null" ? null : parsedData.carcolor,
      warranty: parsedData.warranty == "null" ? null : parsedData.warranty,
      door: parsedData.door == "null" ? null : parsedData.door,
      title: parsedData.title,
      bodytype: parsedData.bodytype == "null" ? null : parsedData.bodytype,
      horsepower: parsedData.horsepower == "null" ? null : parsedData.horsepower,
      soldstatus: parsedData && parsedData.soldstatus == 1 ? true : false,
      videourl: parsedData.videourl == "null" ? null : parsedData.videourl,
      inspectionreporturl: parsedData.inspectionreporturl == "null" ? null : parsedData.inspectionreporturl,
      isapprovedstatus: parsedData.isapprovedstatus ? parsedData.isapprovedstatus.toString() : null,
      carownertypeid: parsedData.carownertypeid,
      chasisno: parsedData.chasisno,
      purchaseprice: parsedData.purchaseprice,
      purchasedate: parsedData.purchasedate,
      geshareval: parsedData.geshareval,
      ownersharevalue: parsedData.ownersharevalue,
      salestype: parsedData.salestype,
      noofkeys: parsedData.noofkeys == "null" ? null : parsedData.noofkeys,
      platenumber: parsedData.platenumber == "null" ? null : parsedData.platenumber,
      carowner: parsedData.carowner == "null" ? null : parsedData.carowner,
      maxdiscount: parsedData.maxdiscount,
      showmobileapp: parsedData.showmobileapp,
      specialoffer: parsedData.specialoffer,
      specialofferprice: parsedData?.specialofferprice,
      sharedcostvalue: parsedData.sharedcostvalue,
      purchasedetails: parsedData.purchasedetails,
      warrantytype: parsedData.warrantytype,
      modeofpaymentid: parsedData.modeofpaymentid ? parsedData.modeofpaymentid.map(Number) : [],

      sellingprice: parsedData.sellingprice,
      solddate: parsedData.solddate,
      mulkiyadocfront: parsedData.mulkiyadocfront,
      mulkiyadocback: parsedData.mulkiyadocback,
      cashrequestid: parsedData.cashrequestid ? parsedData.cashrequestid.map(Number) : []
    });


    this.minEndDate = parsedData && parsedData.purchasedate ? parsedData.purchasedate : new Date();

    if (parsedData.carownertypeid == 2 || parsedData.carownertypeid == '2') {
      let temtypeid = ["5"];
      this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
        item.typeid.some((id: any) => temtypeid.includes(id))
      );
      this.accountFilteredList = this.accountList;
    }

    this.filteredCashreqDetailsList = [];
    let tempValue = parsedData.modeofpaymentid && parsedData.modeofpaymentid.map(Number);
    if (tempValue.length > 0) {
      this.filteredCashreqDetailsList = this.cashReqList.filter(item =>
        tempValue.includes(item.modeofpaymentid)
      );
    }
  }

  async getAllBrand() {
    this.brandList = await this.brandService.getBrand().toPromise();
    this.filteredList = this.brandList.slice();
  }

  getCarCity() {
    this.carCityService.getCarCity().pipe()
      .subscribe((data: any) => {
        this.CarCityList = data;
        this.cityDetailsList = data;
      });
  }

  public save() {
    //Scroll top
    const componentElement = this.elementRef.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    this.loading = true;
    this.isShowErrors = true;


    var enteredData = this.addEditForm.value;

    if (!enteredData.mulkiyadocfront) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Mulkiya Front Document is mandatory!');
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Mulkiya Front Document is mandatory!",
        icon: 'info'
      });
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return;
    }
    if (!enteredData.mulkiyadocback) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Mulkiya Back Document is mandatory!');
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Mulkiya Back Document is mandatory!",
        icon: 'info'
      });
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return;
    }

    if (enteredData.carownertypeid !== 2 && !this.carshowroom_id) {
      if (!this.files || this.files.length === 0) {
        this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Please upload an image. Images are mandatory!');
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: "Please upload an image. Images are mandatory!",
          icon: 'info'
        });
        this.formValidationService.markFormGroupTouched(this.addEditForm);
        this.loading = false;
        return;
      }
    }




    if (enteredData.carownertypeid == 2 && (enteredData.status && enteredData.showmobileapp)) {
      const purchasepriceControl = this.addEditForm.controls['purchaseprice'];
      const purchasedateControl = this.addEditForm.controls['purchasedate'];
      const maxdiscountControl = this.addEditForm.controls['maxdiscount'];
      const carpriceControl = this.addEditForm.controls['carprice'];

      if (this.role_id == RoleIdList.ShowroomSalesman) {
        purchasepriceControl.clearValidators()
        purchasedateControl.clearValidators();
        maxdiscountControl.clearValidators();
        carpriceControl.clearValidators();
      } else {
        purchasepriceControl.setValidators([Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d+)?$/)]);
        purchasedateControl.setValidators([Validators.required]);
        maxdiscountControl.setValidators([Validators.required]);
        carpriceControl.setValidators([Validators.required]);
      }

      if (this.addEditForm.value.carprice <= 0) {
        this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Price Should Not Be 0');
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Price Should Not Be 0", icon: 'info', });
        this.loading = false;
        return
      }

      purchasepriceControl.updateValueAndValidity();
      purchasedateControl.updateValueAndValidity();
      maxdiscountControl.updateValueAndValidity();
      carpriceControl.updateValueAndValidity();

      if (this.carimgpathList && this.carimgpathList.length == 0) {
        if (!this.files || this.files.length === 0) {
          this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Please upload an image. Images are mandatory!');
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: "Please upload an image. Images are mandatory!",
            icon: 'info'
          });
          this.formValidationService.markFormGroupTouched(this.addEditForm);
          this.loading = false;
          return;
        }
      }
    }


    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return
    }

    if (enteredData.carownertypeid == 3 || enteredData.carownertypeid == 2) {
      if (enteredData.carowner == null) {
        this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Car owner is mandatory');
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Car owner is mandatory", icon: 'info', });
        this.loading = false;
        return
      }
    }

    if (this.addEditForm.value.priceavailablity && (this.addEditForm.value.carprice <= 0)) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Price Should Not Be 0');
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Price Should Not Be 0", icon: 'info', });
      this.loading = false;
      return
    }

    this.formData = new FormData();
    for (let file of this.files) {
      this.formData.append("imgs[]", file);
    }
    var enteredData = this.addEditForm.value;
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;

    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }
    this.showroomContact && this.showroomContact.forEach((item: any) => {
      this.formData.append(`showroomcontact[]`, JSON.stringify(item));
    });

    enteredData.modeofpaymentid && enteredData.modeofpaymentid.forEach((item: any) => {
      this.formData.append(`modeofpaymentidarr[]`, JSON.stringify(item));
    });

    enteredData.cashrequestid && enteredData.cashrequestid.forEach((item: any) => {
      this.formData.append(`cashrequestarrlist[]`, JSON.stringify(item));
    });



    this.formData.append("carshowroomname", this.addEditForm.value.showroomdetid);
    this.formData.append("inspectionReport", this.inspectionReport);
    this.formData.append("carvideopath", this.carvideopath);
    this.formData.append("docpath", this.docpath ? this.docpath : "");
    this.formData.append("videopath", this.videopath ? this.videopath : "");

    if (this.carshowroom_id) {
      this.formData.append("updatemulkiyadocfront", this.updatemulkiyadocfront);
      this.formData.append("updatemulkiyadocback", this.updatemulkiyadocback);

      if (enteredData.carownertypeid !== 2 && this.carimgpathList && this.carimgpathList.length == 0) {
        if (!this.files || this.files.length === 0) {
          this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Please upload an image. Images are mandatory!');
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: "Please upload an image. Images are mandatory!",
            icon: 'info'
          });
          this.formValidationService.markFormGroupTouched(this.addEditForm);
          this.loading = false;
          return;
        }
      }

      if (this.carimgpathList && this.carimgpathList.length > 0) {
        for (let item of this.carimgpathList) {
          this.formData.append("carimgpath[]", item);
        }
      }
      this.carDetailsService.updateCarDetails(this.formData, this.carshowroom_id,).subscribe(
        async (updateResult) => {
          this.success("Showroom Car Updated Successfully");
          this.loading = false;
          this.router.navigate(['car-details']);
        });
    } else {
      this.carDetailsService.createCarDetails(this.formData).subscribe(
        async (response: any) => {
          this.success("Showroom Car Created Successfully");
          // if (PushNotification.MOBILE_NOTIFICATION == "true") {
          // console.log("response", response)
          // var pushObj = {
          //   'title': "New Car added",
          //   'alertContent': response.obj.brandname + "-" + response.obj.modelname + " created in " + response.obj.showroomname + "",
          // }
          // await this.notify(pushObj);
          this.loading = false;
          this.pushNotificationService.sendMessage(false);

          //   if (this.addEditForm.value.showmobileapp && response.obj.sentNotification && (this.addEditForm.value.isapprovedstatus == '2' || this.addEditForm.value.isapprovedstatus == 2)) {
          //     var registration_ids: any[] = [];
          //     var brandNameList = this.brandList.filter((ele: any) => ele.brandid == this.addEditForm.value.brandid);
          //     var modelNameList = this.modelList.filter((ele: any) => ele.modelid == this.addEditForm.value.modelid);
          //     // var obj = {
          //     //   "to": "/topics/gepublicnotification",
          //     //   "notification": {
          //     //     "title": "Buy A Car",
          //     //     "body": " A new " + brandNameList[0].brandname + "- " + modelNameList[0].modelname + " had been added to showroom car list . Kindly visit our app for more details",
          //     //   }
          //     // }
          //     var obj =  {
          //       "message": {
          //         "topic": "gepublicnotification",
          //         "notification": {
          //           "title": "Buy A Car",
          //           "body": " A new " + brandNameList[0].brandname + "- " + modelNameList[0].modelname + " had been added to showroom car list . Kindly visit our app for more details",
          //         },
          //         "data": {
          //           "Modulename":"BUYACAR",
          //           "carshowroom_id": response.obj.carshowroom_id,
          //           "carshowroomrefno": response.obj.carshowroomrefno
          //       }
          //       }
          //     }
          //     this.notificationService.publicPushNotification(obj, response.data).subscribe(
          //       (response: any) => {
          //         console.log("response", response);
          //       });
          //   }
          // }
          this.router.navigate(['car-details']);
        });
    }

  }

  files: File[] = [];
  onSelect(event: any) {
    debugger;
    const maxWidth = 1200; // Maximum width in pixels
    const maxHeight = 500; // Maximum height in pixels

    const maxWidth1 = 1600; // Maximum width in pixels
    const maxHeight1 = 1200; // Maximum height in pixels

    const files = event.addedFiles;
    const file = files[0];
    const loadImage = (file: File) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (event) => reject(event);
        img.src = URL.createObjectURL(file);
      });
    };

    loadImage(file).then((img: any) => {
      if ((img.width == maxWidth1 && img.height == maxHeight1) || (img.width == maxWidth && img.height == maxHeight)) {
        var tempSavedarCount = this.carimgpathList && this.carimgpathList.length ? this.carimgpathList.length : 0;
        var tempfilesCarCount = this.files && this.files.length ? this.files.length : 0;
        var currentFile = event.addedFiles && event.addedFiles.length ? event.addedFiles.length : 0;
        const tempCount = tempSavedarCount + tempfilesCarCount + currentFile;

        if (tempCount <= 12) {
          this.files.push(...event.addedFiles);
        } else {
          this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Only 12 Images Allowed.Please Remove and Add!');
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only 12 Images Allowed.Please Remove and Add!", icon: 'info', });
        }

      } else {
        this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Image dimensions must not be (width =1600 X height=1200) or (width =1200 X height=500) the allowed limit.');
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Image dimensions must not be (width =1600 X height=1200) or (width =1200 X height=500) the allowed limit.", icon: 'info', });

        // alert("Image dimensions must not be (width =1600 X height=1200) or (width =1200 X height=500) the allowed limit.");
        return;
      }
    })
  }

  onRemove(event: any) {
    // console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  removeImg(img: any) {
    this.carimgpathList = this.carimgpathList.filter((e: any) => e !== img);
    // console.log("this.carimgpathList",this.carimgpathList)
  }

  public isFiltered(item: any) {
    return this.filteredList.find((ele: any) => ele.brandid == item.brandid);
  }

  public isModelFiltered(item: any) {
    return this.filteredModelList.find((ele: any) => ele.modelid == item.modelid);
  }

  public isYearFiltered(item: any) {
    return this.filteredYearList.find((ele: any) => ele.key == item.key);
  }

  public isDriveTypeFiltered(item: any) {
    return this.filteredDriveTypeList.find((ele: any) => ele.key == item.key);
  }

  public isnoofcylinderFiltered(item: any) {
    return this.filterednoofcylinderList.find((ele: any) => ele.key == item.key);
  }

  public isFuelTypeFiltered(item: any) {
    return this.filteredFuelTypeList.find((ele: any) => ele.key == item.key);
  }

  public isRegionalSpecsFiltered(item: any) {
    return this.filteredRegionalSpecsList.find((ele: any) => ele.key == item.key);
  }

  public isBodyConditionsFiltered(item: any) {
    return this.filteredBodyConditionsList.find((ele: any) => ele.key == item.key);
  }

  public isCarColorFiltered(item: any) {
    return this.filteredCarColorList.find((ele: any) => ele.key == item.key);
  }

  public isBodyTypeFiltered(item: any) {
    return this.filteredBodyTypeList.find((ele: any) => ele.key == item.key);
  }

  public isHorsepowerFiltered(item: any) {
    return this.filteredHorsepowerList.find((ele: any) => ele.key == item.key);
  }

  public isShowroomDetailFiltered(item: any) {
    return this.filteredShowroomDetailsList.find((ele: any) => ele.showroomname == item.showroomname);
  }

  public cityFiltered(item: any) {
    return this.cityDetailsList.find((ele: any) => ele.carcityname == item.carcityname);
  }
  public isShowroomContactDetailFiltered(item: any) {
    return this.filteredShowroomContactDetailsList.find((ele: any) => ele.contactName == item.contactName);
  }

  public isMechanicalConditionFiltered(item: any) {
    return this.filteredMechanicalConditionList.find((ele: any) => ele.key == item.key);
  }


  async getModelList(item: any, isEdit: string) {
    debugger;

    if (isEdit != 'Edit') {
      this.addEditForm.patchValue({
        modelid: null,
      });
    }
    await this.modelService.buycarmodelbrandid(item).pipe()
      .subscribe((data: any) => {
        // console.log("buycarmodelbrandid", data);
        this.modelList = data;
        this.filteredModelList = this.modelList.slice();
      });
  }

  // On file Select
  onChange(event: any) {
    // this.file = event.target.files[0];
    this.inspectionReport = event.target.files[0];
    this.choosedFileName = event.target.files[0].name
  }

  onVideoChange(event: any) {
    const videoFile = event.target.files[0];
    // Check if a file is selected and if it's a video file
    if (videoFile && this.isValidVideoFile(videoFile)) {
      this.carvideopath = videoFile;
      this.choosedVideoFileName = videoFile.name;
    } else {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm Please select a valid video file.');
      this.handleError('Please select a valid video file.');
      // Handle case where file is not a valid video file
      console.error('Please select a valid video file.');
    }
  }

  isValidVideoFile(file: File): boolean {
    const videoTypes = ['video/mp4', 'video/webm', 'video/ogg']; // Add more video types as needed
    // Check if the file type is in the list of allowed video types
    return videoTypes.includes(file.type);
  }

  async getShowroomDetails() {
    this.showroomCarDetailsList = await this.carDetailsService.getShowroomCarDetails().toPromise();
    this.filteredShowroomDetailsList = this.showroomCarDetailsList;

  }


  async getShowroomContactList(event: any) {
    debugger
    console.log("getShowroomContactList", event);
    this.carDetailsService.getList(event).pipe().subscribe((data: any) => {
      this.showroomContactDetailsList = data.filter((ele: any) => ele.status == 1);
      this.filteredShowroomContactDetailsList = data.filter((ele: any) => ele.status == 1);
    });
  }

  async getContactList(event: any) {
    this.showroomContact = await this.showroomContactDetailsList && this.showroomContactDetailsList.filter((e: any) => e.contactName == event);
    console.log(" this.showroomContact", this.showroomContact);
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
    this.loading = false;
  }

  validateNoofcylinderWhite(event: number) {
    if (event >= 100) {
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|validateNoofcylinderWhite()|Only two digits are allowed`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only two digits are allowed", icon: 'error', });
      this.addEditForm.patchValue({ noofcylinder: '' });
    }
  }

  validateMileageWhite(event: number) {
    if (event >= 9999999) {
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|validateMileageWhite()|Only Seven digits are allowed`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only Seven digits are allowed", icon: 'error', });
      this.addEditForm.patchValue({ mileage: '' });
    }
  }

  validateSeatsWhite(event: number) {
    if (event >= 10) {
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|validateSeatsWhite()|Only One digits are allowed`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only One digits are allowed", icon: 'error', });
      this.addEditForm.patchValue({ noofseats: '' });
    }
  }


  //https://stackblitz.com/edit/angular-3h5tgg?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html
  drop(event: CdkDragDrop<any>) {
    this.carimgpathList[event.previousContainer.data.index] = event.container.data.item
    this.carimgpathList[event.container.data.index] = event.previousContainer.data.item
    event.currentIndex = 0;
    console.log(event.previousContainer.data, '-->', event.container.data)
  }

  customdrop(event: CdkDragDrop<any>) {
    this.files[event.previousContainer.data.index] = event.container.data.item
    this.files[event.container.data.index] = event.previousContainer.data.item
    event.currentIndex = 0;
    console.log(event.previousContainer.data, '-->', event.container.data)
  }


  async onToggleShowinMobileAppChange(event: any) {
    let carownertypeid = this.addEditForm.controls['carownertypeid'].value;
    console.log("carownertypeid", carownertypeid);
    if (event.checked && carownertypeid == 2 && this.carshowroom_id) {
      await this.consignmentService.getConsignment(this.carshowroom_id).pipe()
        .subscribe(async (data: any) => {
          console.log("getConsignment ", data);
          let consignmentList = data?.find((ele: any) => ele.status == 1 && ele.customer_sign_path);

          if (!consignmentList) {
            this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onToggleShowinMobileAppChange()|The Car Consignment Contract not Signed!`);
            await Swal.fire({
              title: 'The Car Consignment Contract not Signed!',
              icon: 'question',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            });
            this.addEditForm.patchValue({ showmobileapp: false, });
          }
        });
    }

    if (event.checked && carownertypeid == 2 && !this.carshowroom_id) {
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onToggleShowinMobileAppChange() 2|The Car Consignment Contract not Signed!`);
      await Swal.fire({
        title: 'The Car Consignment Contract not Signed!',
        icon: 'question',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      this.addEditForm.patchValue({ showmobileapp: false, });
    }


  }

  async onToggleStatusChange(event: any) {
    debugger
    var status = "";
    if (event.checked) {
      status = "Active"

      let carownertypeid = this.addEditForm.controls['carownertypeid'].value;
      console.log("carownertypeid", carownertypeid);

      if (carownertypeid == 2 && this.carshowroom_id) {
        await this.consignmentService.getConsignment(this.carshowroom_id).pipe()
          .subscribe(async (data: any) => {
            console.log("getConsignment ", data);

            let anyoneactiveconsignmentList = data?.find((ele: any) => ele.status == 1);
            if (!anyoneactiveconsignmentList) {
              this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onToggleStatusChange()|There Are Currently No Active Consignment Contract Available!`);
              await Swal.fire({
                title: 'There Are Currently No Active Consignment Contract Available!',
                icon: 'question',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              });
              this.addEditForm.patchValue({ status: false, });
              return
            }

            let consignmentList = data?.find((ele: any) => ele.status == 1 && ele.customer_sign_path);

            if (!consignmentList) {
              this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onToggleStatusChange()|The Active Car Consignment Contract Is Not Signed!`);
              await Swal.fire({
                title: 'The Active Car Consignment Contract Is Not Signed!',
                icon: 'question',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              });
              this.addEditForm.patchValue({ status: false, });
            }
          });
      } else if (carownertypeid == 2 && !this.carshowroom_id) {
        this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onToggleStatusChange()|There Are Currently No Active Consignment Contract Available!`);
        await Swal.fire({
          title: 'There Are Currently No Active Consignment Contract Available!',
          icon: 'question',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        this.addEditForm.patchValue({ status: false, });
      }
    } else {




      let carownertypeid = this.addEditForm.controls['carownertypeid'].value;
      console.log("carownertypeid", carownertypeid);

      if (carownertypeid == 2 && this.carshowroom_id) {
        this.consignmentService.getConsignment(this.carshowroom_id).pipe()
          .subscribe(async (data: any) => {
            console.log("getConsignment ", data);
            let consignmentList = data?.find((ele: any) => ele.status == 1 && ele.customer_sign_path);


            if (consignmentList) {
              let text = "Mandatory to set the consignment contract to inactive before deactivating the car!";
              if (this.role_id == RoleIdList.ShowroomSalesman) {
                text = "Mandatory to set the consignment contract to inactive before deactivating the car. Please contact the Sales Manager for assistance!";
              }
              this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onToggleStatusChange()|You cannot In-active this car. ${text}`);
              await Swal.fire({
                title: 'You cannot In-active this car.',
                text: text,
                icon: 'question',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              });

              if (!this.divhasAccess) {
                this.addEditForm.patchValue({ status: true, });
                return;
              }

            }
          });
      }

      status = "InActive";

      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onToggleStatusChange()|The Car will be ' + ${status} + ' in Mobile App!`);
      Swal.fire({
        title: 'The Car will be ' + status + ' in Mobile App!',
        // text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {

        }
      })
    }

  }


  onsoldstatusChange(event: any) {
    if (event.checked) {
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onsoldstatusChange()|The Car will be sold in Mobile App!`);
      Swal.fire({
        title: 'The Car will be sold in Mobile App!',
        icon: 'question',
        showCancelButton: true, // Allow user to cancel
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.carsolddate = this.tempcarsolddate;
          this.addEditForm.patchValue({ status: false, solddate: new Date() });

        } else {
          // User canceled, reset the soldstatus field
          this.addEditForm.patchValue({ soldstatus: 0, status: true, solddate: null });
          this.carsolddate = null;
        }
      });
    } else {
      this.addEditForm.patchValue({ soldstatus: 0, status: true, solddate: null });
      this.carsolddate = null;
    }
  }



  onTogglePriceAvailablityChange(event: any) {
    var status = "";
    if (event.checked) {
      status = "Active"
    } else {
      status = "InActive";
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onTogglePriceAvailablityChange()|The Car price will be ' + ${status} + ' in Mobile App!`);
      Swal.fire({
        title: 'The Car price will be ' + status + ' in Mobile App!',
        icon: 'question',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.addEditForm.patchValue({ carprice: 0 });
        }
      })
    }
  }

  viewVideo() {
    Swal.fire({
      title: 'Video',
      // icon: 'question',
      html: '<video width="320" height="240" controls><source src=' + this.videopath + ' type="video/mp4"></video>',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {

      }
    })
  }


  notify(obj: any) {
    let data: Array<any> = [];
    data.push({
      'title': obj.title,
      'alertContent': obj.alertContent,
    });
    this.pushNotificationService.generateNotification(data);
  }

  isapprovedstatusChange(event: any) {
    debugger
    if (event.value == "2") {
      let carownertypeid = this.addEditForm.controls['carownertypeid'].value;
      if (carownertypeid == 2 && !this.carshowroom_id) {
        this.addEditForm.patchValue({ status: false, });
      } else {
        this.addEditForm.patchValue({ status: 'true' });
      }
    } else {
      this.addEditForm.patchValue({ status: '' });
    }
  }

  addAccountRecord() {
    let carownertypeid = this.addEditForm.controls['carownertypeid'].value;
    const dialogRef = this.dialog.open(AddAccountFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
      data: { carownertypeid: carownertypeid.toString() }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.accountOrgList = await this.accountService.get().toPromise();

        if (carownertypeid == 1) {
          let temtypeid = ["2", "6"];
          this.accountList = this.accountOrgList && this.accountOrgList.filter((item: { typeid: any[]; }) =>
            item.typeid.some((id: any) => temtypeid.includes(id))
          );
          this.accountFilteredList = this.accountList;
          this.addEditForm.patchValue({
            carowner: result.data.accountid
          });
        } else if (carownertypeid == 2) {
          let temtypeid = ["5"];
          this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
            item.typeid.some((id: any) => temtypeid.includes(id))
          );
          this.accountFilteredList = this.accountList;
          this.addEditForm.patchValue({
            carowner: result.data.accountid
          });
        } else if (carownertypeid == 3) {
          let temtypeid = ["2", "6"];
          this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
            item.typeid.some((id: any) => temtypeid.includes(id))
          );
          this.accountFilteredList = this.accountList;
          this.accountFilteredList = this.accountList;
          this.addEditForm.patchValue({
            carowner: result.data.accountid
          });
        }

      }
    });
  }



  carownertypeChange(event: any) {
    this.addEditForm.patchValue({ carowner: null });
    if (typeof event.value === 'number' && event.value === 3) {
      if (this.divhasAccess) {
        this.hidePricediv = true;
      }
      let temtypeid = ["2", "6"];
      this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
        item.typeid.some((id: any) => temtypeid.includes(id))
      );
      this.accountFilteredList = this.accountList;


      let sharewith_temtypeid = ["2"];
      this.sharewithaccountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
        item.typeid.some((id: any) => sharewith_temtypeid.includes(id))
      );
      this.sharewithaccountFilterList = this.sharewithaccountList;

      this.addEditForm.patchValue({
        status: true, showmobileapp: true, priceavailablity: true,
        purchasedetails: '', modeofpaymentid: ''
      });

      const modeofpaymentControl = this.addEditForm.controls['modeofpaymentid'];
      modeofpaymentControl.setValidators([]);
      modeofpaymentControl.updateValueAndValidity();


      const sharewithControl = this.addEditForm.controls['sharewithid'];
      sharewithControl.setValidators([Validators.required]);
      sharewithControl.updateValueAndValidity();

      const purchasedetailsControl = this.addEditForm.controls['purchasedetails'];
      purchasedetailsControl.setValidators([]);
      purchasedetailsControl.updateValueAndValidity();

    } else if (typeof event.value === 'number' && event.value === 2) {
      this.hidePricediv = false;
      let temtypeid = ["5"];
      this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
        item.typeid.some((id: any) => temtypeid.includes(id))
      );
      this.accountFilteredList = this.accountList;

      this.addEditForm.patchValue({
        status: false, showmobileapp: false, priceavailablity: false,
        geshareval: '',
        ownersharevalue: '',
        sharedcostvalue: '',
        purchasedetails: '', modeofpaymentid: ''
      });

      const purchasepriceControl = this.addEditForm.controls['purchaseprice'];
      const purchasedateControl = this.addEditForm.controls['purchasedate'];
      const maxdiscountControl = this.addEditForm.controls['maxdiscount'];
      const carpriceControl = this.addEditForm.controls['carprice'];

      purchasepriceControl.setValidators([]);
      purchasedateControl.setValidators([]);
      maxdiscountControl.setValidators([]);
      carpriceControl.setValidators([]);

      purchasepriceControl.updateValueAndValidity();
      purchasedateControl.updateValueAndValidity();
      maxdiscountControl.updateValueAndValidity();
      carpriceControl.updateValueAndValidity();

      const modeofpaymentControl = this.addEditForm.controls['modeofpaymentid'];
      modeofpaymentControl.setValidators([]);
      modeofpaymentControl.updateValueAndValidity();

      const purchasedetailsControl = this.addEditForm.controls['purchasedetails'];
      purchasedetailsControl.setValidators([]);
      purchasedetailsControl.updateValueAndValidity();

      const sharewithControl = this.addEditForm.controls['sharewithid'];
      sharewithControl.setValidators([]);
      sharewithControl.updateValueAndValidity();

    } else if (typeof event.value === 'number' && event.value === 1) {
      if (this.divhasAccess) {
        this.hidePricediv = true;
      }
      let temtypeid = ["2"];
      this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
        item.typeid.some((id: any) => temtypeid.includes(id))
      );
      this.accountFilteredList = this.accountList;

      this.addEditForm.patchValue({
        status: true, showmobileapp: true, priceavailablity: true,
        geshareval: '',
        ownersharevalue: '',
        sharedcostvalue: '',
        modeofpaymentid: '',
        purchasedetails: '', carowner: 1
      });

      const modeofpaymentControl = this.addEditForm.controls['modeofpaymentid'];
      modeofpaymentControl.setValidators([Validators.required]);
      modeofpaymentControl.updateValueAndValidity();

      const purchasedetailsControl = this.addEditForm.controls['purchasedetails'];
      purchasedetailsControl.setValidators([Validators.required]);
      purchasedetailsControl.updateValueAndValidity();

      if (this.role_id == RoleIdList.ShowroomSalesman) {
        const modeofpaymentControl = this.addEditForm.controls['modeofpaymentid'];
        modeofpaymentControl.clearValidators();
        modeofpaymentControl.updateValueAndValidity();


        const purchasedetailsControl = this.addEditForm.controls['purchasedetails'];
        purchasedetailsControl.clearValidators();
        purchasedetailsControl.updateValueAndValidity();
      }

      const sharewithControl = this.addEditForm.controls['sharewithid'];
      sharewithControl.setValidators([]);
      sharewithControl.updateValueAndValidity();
    }
  }


  selectionFilterChange(event: any) {
    const filterValue = event.value;
    console.log("filterValue", filterValue);
    // this.accountService.getByID(filterValue).pipe().subscribe((data: any) => {
    //   console.log("getByID", data);
    //   if (data === undefined || data.vehicleregistrationcard === undefined || data.vehicleregistrationcard === null
    //     || data.vehicleregistrationcard === "") {
    //     Swal.fire({
    //       toast: true,
    //       position: 'top-end',
    //       showConfirmButton: false,
    //       timer: 5000,
    //       title: "Check Your Account details Vehicle Registration Card Attachment are missing.",
    //       icon: 'info'
    //     });
    //     // data.passport = "true";
    //     this.editAccountRecord(data);
    //   }
    // });
  }


  public editAccountRecord(items: any) {
    let carownertypeid = this.addEditForm.controls['carownertypeid'].value;
    items.carownertypeid = carownertypeid;
    const dialogRef = this.dialog.open(EditContactFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      // console.log("result",result);
      if (result) {
        this.accountOrgList = await this.accountService.get().toPromise();

        if (carownertypeid == 1) {
          let temtypeid = ["2", "6"];
          this.accountList = this.accountOrgList && this.accountOrgList.filter((item: { typeid: any[]; }) =>
            item.typeid.some((id: any) => temtypeid.includes(id))
          );
          this.accountFilteredList = this.accountList;
          this.addEditForm.patchValue({
            carowner: result.data.accountid
          });
        } else if (carownertypeid == 2) {
          let temtypeid = ["5"];
          this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
            item.typeid.some((id: any) => temtypeid.includes(id))
          );
          this.accountFilteredList = this.accountList;
          this.addEditForm.patchValue({
            carowner: result.data.accountid
          });
        } else if (carownertypeid == 3) {
          let temtypeid = ["2", "6"];
          this.accountList = this.accountOrgList && this.accountOrgList.filter((item: any) =>
            item.typeid.some((id: any) => temtypeid.includes(id))
          );
          this.accountFilteredList = this.accountList;
          this.accountFilteredList = this.accountList;
          this.addEditForm.patchValue({
            carowner: result.data.accountid
          });
        }
      } else {
        this.addEditForm.patchValue({ carowner: null });
      }
    });
  }
  // 
  selectionPurchasedetailsFilterChange(event: any) {
    const filterValue = event.value;
    console.log("filterValue", filterValue);
    this.accountService.getByID(filterValue).pipe().subscribe((data: any) => {
      console.log("getByID", data);

      if (data.leadtype === "company") {
        if (data.tradelicenno === undefined || data.tradelicenno === null || data.trnnumber === undefined || data.trnnumber === null) {
          this.errorlogService.logManualValidationError(`add-edit-car-details-form component|selectionPurchasedetailsFilterChange()|Check Your Account details Some details are missing.`);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            title: "Check Your Account details Some details are missing.",
            icon: 'info'
          });
          this.editAccountRecord1(data);
        }
      } else {
        if (data === undefined || data.emiratesid === undefined || data.emiratesid === null
          || data.emiratesid === "") {
          this.errorlogService.logManualValidationError(`add-edit-car-details-form component|selectionPurchasedetailsFilterChange() 2|Check Your Account details Some details are missing.`);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            title: "Check Your Account details Some details are missing.",
            icon: 'info'
          });
          this.editAccountRecord1(data);
        }
      }


    });
  }


  public editAccountRecord1(items: any) {
    items.purchasedetails = true;
    const dialogRef = this.dialog.open(EditContactFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
      data: items
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.accountOrgList = await this.accountService.get().toPromise();
        let temtypeid = ["2"];
        this.purchaseaccountList = this.accountOrgList && this.accountOrgList.filter((item: { typeid: any[]; }) => item.typeid.some((id: string) => temtypeid.includes(id)));
        this.purchaseaccountFilteredList = this.purchaseaccountList;
      } else {
        this.addEditForm.patchValue({ purchasedetails: null });
      }
    });
  }


  addAccountPurchaseDetailsRecord() {
    const dialogRef = this.dialog.open(AddAccountFormComponent, {
      width: '1400px',
      height: 'fit-content',
      disableClose: true,
      data: { purchasedetails: true, typeid: 2 }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.accountOrgList = await this.accountService.get().toPromise();
        let temtypeid = ["2"];
        this.purchaseaccountList = this.accountOrgList && this.accountOrgList.filter((item: { typeid: any[]; }) => item.typeid.some((id: string) => temtypeid.includes(id)));
        this.purchaseaccountFilteredList = this.purchaseaccountList;

        this.addEditForm.patchValue({
          purchasedetails: result.data.accountid
        })
      }
    });
  }


  onDateChange(event: any) {
    const selectedDate = event.value;
    console.log('Selected Car Sold Date:', selectedDate);
    this.carsolddate = selectedDate;
  }

  ngOnDestroy() {
    this.dataService.clearData('storage_data_id');
  }



  isPDF(fileName: string): boolean {
    return fileName ? fileName.toLowerCase().endsWith('.pdf') : false;
  }

  isIMG(fileName: string): boolean {
    const imgExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jfif'];
    return fileName ? imgExtensions.some(ext => fileName.toLowerCase().endsWith(ext)) : false;
  }

  async onFileChanged(event: any) {
    let temp_files = event.target.files;
    if (temp_files.length === 0) {
      return;
    }

    const selectedFile = temp_files[0];

    if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        mulkiyadocfront: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onFileChanged()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = '';
      this.addEditForm.patchValue({
        mulkiyadocfront: null
      });
    }
  }

  async onFileChanged2(event: any) {
    let temp_files2 = event.target.files;
    if (temp_files2.length === 0) {
      return;
    }

    const selectedFile = temp_files2[0];

    if (this.isPDF(selectedFile.name) || this.isIMG(selectedFile.name)) {
      this.addEditForm.patchValue({
        mulkiyadocback: selectedFile
      });

      if (this.isIMG(selectedFile.name)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrcback = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      this.errorlogService.logManualValidationError(`add-edit-car-details-form component|onFileChanged2()|Unsupported file type selected. Please select a PDF or image file.`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Unsupported file type selected. Please select a PDF or image file.", icon: 'error', });
      event.target.value = '';
      this.addEditForm.patchValue({
        mulkiyadocback: null
      });
    }
  }


  public isCashreqDetailFiltered(item: any) {
    return this.filteredCashreqDetailsList.find((ele: any) => ele.cashrequesrefno == item.cashrequesrefno);
  }

  public isModeFiltered(item: any) {
    return this.modeofpaymentfilteredList.find((ele: any) => ele.modeofpaymentid == item.modeofpaymentid);
  }

  getModeofpayment() {
    this.loading = true;
    this.modeOfPaymentService.getModeofpayment().pipe()
      .subscribe((data: any) => {
        console.log("getModeofpayment", data);
        this.modeofpaymentList = data;
        this.modeofpaymentfilteredList = data;
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      });
  }

  shouldDisableOption(item: any): boolean {
    if (item.is_mapped === 0) {
      return false; // Can select
    }

    if (item.is_mapped) {
      // Check if showroomid matches the current car's showroomid
      // return item.is_mapped !== this.carshowroom_id;
      return true
    }

    return true; // Default (shouldn't happen but as a safety net)
  }

  ownerTypeshouldDisableOption(item: any): boolean {
    debugger
    let tempisSettingUser = this.isSettingUser = this.settings.some((setting: any) =>
      setting.appsetparametervalue === item.carownertypeid.toString() && setting.status === 1
    );
    return !tempisSettingUser; // Disable if no matching setting
  }




  async findSettingsappsetcategory() {
    this.settings = await this.salesOrderService.findSettingsappsetcategory('CAROWNERTYPE').toPromise();

  }

  selectionModePaymentFilterChange(ele: any) {
    this.filteredCashreqDetailsList = [];
    let tempValue = ele.value;
    if (tempValue.length > 0) {
      this.filteredCashreqDetailsList = this.cashReqList.filter(item =>
        tempValue.includes(item.modeofpaymentid)
      );
    }
  }

}
