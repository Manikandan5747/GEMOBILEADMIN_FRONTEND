import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { BrandService } from 'src/app/service/brand/brand.service';
import { ModelService } from 'src/app/service/model/model.service';
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
import { RentShowroomCarService } from 'src/app/rent-car/service/rent-showroom-car.service';
import { ErrorlogService } from 'src/app/errorlog.service';


@Component({
  selector: 'app-rent-car-form',
  templateUrl: './rent-car-form.component.html',
  styleUrls: ['./rent-car-form.component.css']
})
export class RentCarFormComponent implements OnInit {

  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();

  getBrandName: any;

  yearList: any = [
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
  ];
  filteredYearList: any = [
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
    { "key": "Less than 150 HP" },
    { "key": "150 - 200 HP" },
    { "key": "200 -300 HP" },
    { "key": "400- 500 HP" },
    { "key": "600 - 700 HP" },
    { "key": "800 - 900 HP" },
    { "key": "900+ HP" },
    { "key": "Unknown" },
  ];
  filteredHorsepowerList: any = [
    { "key": "Less than 150 HP" },
    { "key": "150 - 200 HP" },
    { "key": "200 -300 HP" },
    { "key": "400- 500 HP" },
    { "key": "600 - 700 HP" },
    { "key": "800 - 900 HP" },
    { "key": "900+ HP" },
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

  noofcylinderList:any=[
    { "key": "4" },
    { "key": "5" },
    { "key": "6" },
    { "key": "8" },
    { "key": "10" },
    { "key": "12" },
    { "key": "16" },
    { "key": "Electrical Motor" },
  ];
  filterednoofcylinderList:any=[ 
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
  rentcarshowroom_id: any;
  title: string = "Rent Car";
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
  images: any ="";
  carsolddate: any;
  tempIsapprovedstatus: any;
  // 
  constructor(private notificationService:NotificationService,private carCityService:CarCityService,private pushNotificationService:PushNotificationsService, private customerService: CustomerService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private brandService: BrandService, private modelService: ModelService,
    private carDetailsService: RentShowroomCarService,private cookieService: CookieService,
    private el: ElementRef,private formValidationService: FormValidationService,private portalUsersStatusService:PortalUsersStatusService,private errorlogService: ErrorlogService) {
      this.pushNotificationService.requestPermission();
    this.route.queryParams.subscribe(params => {
      this.rentcarshowroom_id = params['rentcarshowroom_id'];
    });


    if(!this.rentcarshowroom_id){
      this.carDetailsService.getfindnextRefno().pipe()
      .subscribe((data: any) => {
        console.log("getnextRefno", data.carshowroomrefno);
        this.carshowroomreferenceno = data.rentcarshowroomrefno;
      });
    }
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.addEditForm.controls;
  }

  ngAfterViewInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    if (!this.rentcarshowroom_id) {
      setTimeout(() => {
        // this.addEditForm.patchValue({ carshowroomrefno: this.carshowroomreferenceno });
      }, 1000)
    }
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

  async ngOnInit() {
    await this.getShowroomDetails();

    this.addEditForm = this.fb.group({
      // customername: ['', [, this.formValidationService.noWhitespaceValidator]],
   
      showroomcontactDetail: [null,Validators.required ],
      carshowroomrefno: [this.carshowroomreferenceno, ], 
      mileage: [''],
      cityname: [''],
      carcityid: ['', ],
      drivetype: [''],
      noofcylinder: [''],
      noofseats: ['',Validators.required],
      renttype: ['',Validators.required],
      bodycondition: [''],
      carcolor: [''],
      door: ['',Validators.required],
      title: ['', ],
      bodytype: ['',Validators.required],
      description: [''],
      status: [true],
      remark: [''],
      isapprovedstatus:['', ],
      securitydeposit:[''],
      extrachargeperkm:[''],
      perdaykmlimit:[''],
      perdayrate:['',Validators.required],
      actualrate:[''],
      perhourrate:[''],
      exteriorcolor:['',Validators.required],
      notincludeddescription:[''],
      interiorcolor:['',Validators.required],
      phonenumber:[''],
      carprice:  [0, [, this.formValidationService.decimalNumberValidator()]],
      brandid: ['',Validators.required ],
      modelid: ['',Validators.required ],
      modelyear: ['',Validators.required ],
      showroomdetid: ['',Validators.required ],

    });
    await this.getAllBrand();
    await this.getCarCity();
    await this.getPortalUsersStatus();
    

    if (this.rentcarshowroom_id) {
      // this.title = "Edit Showroom Car"
      await this.carDetailsService.getCarDetailsByID(this.rentcarshowroom_id).pipe()
        .subscribe(async (data: any) => {
          console.log("datadata getByid", data);
          let carimgpath = data && data[0].carimgpath ? data[0]?.carimgpath : null;
          // var text: any = carimgpath ? carimgpath.split(" ") :'';
          // const myArray = carimgpath.replace("{", "[");
          // this.carimgpathList = JSON.parse(myArray.replace("}", "]"));
          this.carimgpathList = carimgpath;
        
       
          await this.getModelList(data[0].brandid, 'Edit');
          await this.fillForm(data[0]);

        });
    }
  }


  getPortalUsersStatus(){
    this.portalUsersStatusService.getPortalUsersStatus().pipe()
    .subscribe((data: any) => {
      console.log("getPortalUsersStatus", data);
      this.portalUsersStatusList = data;
    });
  }

  private async fillForm(parsedData: any) {
    await this.getShowroomContactList(parsedData?.carshowroomname);
    // if (parsedData.showroomcontact && parsedData?.showroomcontact[0]?.contactName) {
    //   await this.getContactList(parsedData.showroomcontact[0].contactName);
    //   this.addEditForm.patchValue({
    //     showroomcontactDetail: parsedData.showroomcontact[0].contactName,
    //   })
    // }else{
    //   this.addEditForm.patchValue({
    //     showroomcontactDetail: parsedData.showroomdcon_id,
    //   })
    // }
    this.addEditForm.patchValue({
      description: parsedData.description == "null" ? null : parsedData.description,
      carcityid: parsedData.carcityid,
      brandid: parsedData.brandid,
      modelid: parsedData.modelid,
      modelyear: parsedData.modelyear,
      carshowroomrefno: parsedData.rentcarshowroomrefno,
      carprice: parsedData.carprice == "null" ? null : parsedData.carprice ? parsedData.carprice : 0,
      renttype: parsedData.renttype == "null" ? null : parsedData.renttype,
      noofseats: parsedData.noofseats == "null" ? null : parsedData.noofseats,
      securitydeposit: parsedData.securitydeposit == "null" ? null : parsedData.securitydeposit,
      bodytype: parsedData.bodytype == "null" ? null : parsedData.bodytype,
      extrachargeperkm: parsedData.extrachargeperkm == "null" ? null : parsedData.extrachargeperkm,
      door: parsedData.door == "null" ? null : parsedData.door,
      perdaykmlimit: parsedData.perdaykmlimit == "null" ? null : parsedData.perdaykmlimit,
      perdayrate: parsedData.perdayrate == "null" ? null : parsedData.perdayrate,
      actualrate: parsedData.actualrate == "null" ? null : parsedData.actualrate,
      perhourrate: parsedData.perhourrate == "null" ? null : parsedData.perhourrate,
      exteriorcolor: parsedData.exteriorcolor == "null" ? null : parsedData.exteriorcolor,
      notincludeddescription: parsedData.notincludeddescription == "null" ? null : parsedData.notincludeddescription,
      interiorcolor: parsedData.interiorcolor == "null" ? null : parsedData.interiorcolor,
      title: parsedData.title,
      remark: parsedData.remark == "null" ? null : parsedData.remark,
      status: parsedData && parsedData.status == 1 ? true : false,
      phonenumber: parsedData.phonenumber == "null" ? null : parsedData.phonenumber,
      showroomdetid: parsedData.carshowroomname,
      showroomcontactDetail: parsedData?.showroomdcon_id,

    });
  }

  async getAllBrand() {
    this.brandList = await this.brandService.getBrand().toPromise();
    this.filteredList = this.brandList.slice();
  }

  getCarCity() {
    this.carCityService.getCarCity().pipe()
      .subscribe((data: any) => {
        this.CarCityList = data;
        this.cityDetailsList= data;
      });
  }

  public save() {
    debugger;
        // this.addEditForm.value.carprice?.setValidators(Validators.min(0));

        const componentElement = this.el.nativeElement;
        componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

    this.loading = true;
   
    this.isShowErrors = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      this.loading = false;
      return
    }
   

    if(this.addEditForm.value.priceavailablity && (this.addEditForm.value.carprice <= 0)){
      this.errorlogService.logManualValidationError(`rent-car-form component|save()|Price Cannot be less than Zero`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Price Cannot be less than Zero", icon: 'info', });
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
    // console.log("enteredData",enteredData);
    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }

    this.showroomContact && this.showroomContact.forEach((item: any) => {
      this.formData.append(`showroomcontact[]`, JSON.stringify(item));
    });
    // console.log(this.formData.getAll('showroomcontact[]'));

    this.formData.append("carshowroomname", this.addEditForm.value.showroomdetid);
   
    
   

    if (this.rentcarshowroom_id) {
      if (this.carimgpathList && this.carimgpathList.length > 0) {
        for (let item of this.carimgpathList) {
          this.formData.append("carimgpath[]", item);
        }
      }
      this.carDetailsService.updateCarDetails(this.formData, this.rentcarshowroom_id,).subscribe(
        async (updateResult) => {
          this.success("Rent Showroom cars update successfully");
          // var pushObj ={
          //   'title': "Rent a Car Updated",
          //   'alertContent': updateResult.obj.brandname+"-"+updateResult.obj.modelname+" updated in "+updateResult.obj.showroomname+"",
          // }
          // await this.notify(pushObj);
          this.loading = false;
          this.pushNotificationService.sendMessage(false);
          this.router.navigate(['rent-car']);
          // console.log("updatedapproveddate",updateResult.obj.updatedapproveddate);
          //   if(updateResult.obj.updatedapproveddate == null){
            //   var brandNameList = this.brandList.filter((ele: any) => ele.brandid == this.addEditForm.value.brandid);
            //   var modelNameList = this.modelList.filter((ele: any) => ele.modelid == this.addEditForm.value.modelid);
            
            //       var obj= {
            //         "to" : "/topics/gepublicnotification",
            //          "notification" : {
            //           "title": "Rent A Car",
            //           "body": " A new " + brandNameList[0].brandname + "- " + modelNameList[0].modelname + " had been added to showroom car list . Kindly visit our app for more details",
            //         }
            //      }
            //       this.notificationService.publicPushNotification(obj,updateResult.data).subscribe(
            //         (response:any) => {
            //           console.log("response",response);
            //           // this.success("Notification Sent");
            //         });
            // //  }
        });
    } else {

      if( this.files &&  this.files.length == 0){
        this.errorlogService.logManualValidationError(`rent-car-form component|save()|Car Images Required`);
        Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Car Images Required", icon: 'info', });    
        this.loading = false;
          return
      }
      this.carDetailsService.createCarDetails(this.formData).subscribe(
        async (response: any) => {
          this.success("Rent Showroom cars saved successfully");
          console.log("response",response)
          // var pushObj ={
          //   'title': "New Rent Car added",
          //   'alertContent': response.obj.brandname+"-"+response.obj.modelname+" created in "+response.obj.showroomname+"",
          // }
          // await this.notify(pushObj);
          this.loading = false;
          this.pushNotificationService.sendMessage(false);
          this.router.navigate(['rent-car']);
          // // if(response.obj.sentNotification){
          //   var registration_ids: any[] = [];
          //   var brandNameList = this.brandList.filter((ele: any) => ele.brandid == this.addEditForm.value.brandid);
          //   var modelNameList = this.modelList.filter((ele: any) => ele.modelid == this.addEditForm.value.modelid);
          //       var obj= {
          //         "to" : "/topics/gepublicnotification",
          //          "notification" : {
          //           "title": "Rent A Car",
          //           "body": " A new " + brandNameList[0].brandname + "- " + modelNameList[0].modelname + " had been added to Rent showroom car list . Kindly visit our app for more details",
          //         }
          //      }
          //       this.notificationService.publicPushNotification(obj,response.data).subscribe(
          //         (response:any) => {
          //           console.log("response",response);
          //           // this.success("Notification Sent");
          //         });
          // // }
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

        if (tempCount <= 10) {
          this.files.push(...event.addedFiles);
        } else {
          this.errorlogService.logManualValidationError(`rent-car-form component|loadImage()|Only 10 Images Allowed.Please Remove and Add!`);
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only 10 Images Allowed.Please Remove and Add!", icon: 'info', });
        }

      } else {
        // Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Image dimensions must not be (width =1600 X height=1200) or (width =1200 X height=500) the allowed limit.", icon: 'info', });
        // return;
        // Assuming 'event' and 'this.files' are correctly defined in your context.
        const temPCurrentFile = event.addedFiles && event.addedFiles[0];

        if (temPCurrentFile) {
          const maxWidth = 1600;
          const maxHeight = 1200;   //

          const canvas = document.createElement('canvas');
          const context: any = canvas.getContext('2d');

          const reader = new FileReader();

          reader.onload = (e: any) => {
            const img = new Image();
            img.src = e.target.result as string;
            img.onload = () => {
              // Calculate new dimensions while preserving the aspect ratio
              // let newWidth, newHeight;
              // if (img.width > img.height) {
              //   newWidth = maxWidth;
              //   newHeight = (img.height / img.width) * maxWidth;
              // } else {
              //   newHeight = maxHeight;
              //   newWidth = (img.width / img.height) * maxHeight;
              // }

              // Resize the image using the canvas
              canvas.width = maxWidth;
              canvas.height = maxHeight;
              context.drawImage(img, 0, 0, maxWidth, maxHeight);

              // Convert the canvas to a Blob
              canvas.toBlob((blob: any) => {
                const resizedFile = new File([blob], temPCurrentFile.name, { type: temPCurrentFile.type });
                this.files.push(resizedFile);
              }, temPCurrentFile.type);
            };
          };

          reader.readAsDataURL(temPCurrentFile);
        }




      }
    })
  }
 

  // onSelect(event: any) {debugger;
  //   const maxWidth = 1200; // Maximum width in pixels
  //   const maxHeight = 500; // Maximum height in pixels
  
  //   const maxWidth1 = 1600; // Maximum width in pixels
  //   const maxHeight1 = 1200; // Maximum height in pixels
  
  //   const files = event.addedFiles;
  //   const file = files[0];
  //   const loadImage = (file: File) => {
  //     return new Promise((resolve, reject) => {
  //       const img = new Image();
  //       img.onload = () => resolve(img);
  //       img.onerror = (event) => reject(event);
  //       img.src = URL.createObjectURL(file);
  //     });
  //   };
  
  //   loadImage(file).then((img: any) => {
  //     if ((img.width == maxWidth1 && img.height == maxHeight1) || (img.width == maxWidth && img.height == maxHeight)) {
  //       var tempSavedarCount = this.carimgpathList && this.carimgpathList.length ? this.carimgpathList.length : 0;
  //       var tempfilesCarCount = this.files && this.files.length ? this.files.length : 0;
  //       var currentFile = event.addedFiles && event.addedFiles.length ? event.addedFiles.length : 0; 
  //       const tempCount = tempSavedarCount +tempfilesCarCount + currentFile;
  
  //       if(tempCount <= 10){
  //         this.files.push(...event.addedFiles);
  //       }else{
  //         Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only 10 Images Allowed.Please Remove and Add!", icon: 'info', });
  //       }
  
  //     }else{
  //       Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Image dimensions must not be (width =1600 X height=1200) or (width =1200 X height=500) the allowed limit.", icon: 'info', });
  //       return;
  //     }
  //   })
  // }

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

  onVideoChange(event: any) {debugger
    // this.file = event.target.files[0];
    this.carvideopath = event.target.files[0];
    this.choosedVideoFileName = event.target.files[0].name
  }


  async getShowroomDetails() {
    this.showroomCarDetailsList = await this.carDetailsService.getShowroomCarDetails().toPromise();
    this.filteredShowroomDetailsList = this.showroomCarDetailsList
  }

 
  async getShowroomContactList(event: any) {debugger
    console.log("getShowroomContactList", event);
    // var List = await this.showroomCarDetailsList.filter((e: any) => e.showroomdetid == event);
    // if (List && List.length > 0) {
    //   this.showroomContactDetailsList = List[0].showroomcontactdet;
    //   this.filteredShowroomContactDetailsList = List[0].showroomcontactdet;
    //   if(List[0].showroomcontactdet == null){
    //       this.carDetailsService.getList(event).pipe()
    //       .subscribe((data: any) => {
    //         this.showroomContactDetailsList = data;
    //         this.filteredShowroomContactDetailsList = data;
    //       });
    //   }
    // }

    this.carDetailsService.getList(event).pipe().subscribe((data: any) => {
      this.showroomContactDetailsList = data.filter((ele:any) => ele.status == 1);
      this.filteredShowroomContactDetailsList = data.filter((ele:any) => ele.status == 1);

      // this.showroomContactDetailsList = this.showroomContactDetailsList.filter((ele:any) => ele.status == 1)
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
      this.errorlogService.logManualValidationError(`rent-car-form component|validateNoofcylinderWhite()|Only two digits are allowed`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only two digits are allowed", icon: 'error', });
      this.addEditForm.patchValue({ noofcylinder: '' });
    }
  }

  validateMileageWhite(event: number) {
    if (event >= 9999999) {
      this.errorlogService.logManualValidationError(`rent-car-form component|validateMileageWhite()|Only Seven digits are allowed`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only Seven digits are allowed", icon: 'error', });
      this.addEditForm.patchValue({ mileage: '' });
    }
  }

  validateSeatsWhite(event: number) {
    if (event >= 10) {
      this.errorlogService.logManualValidationError(`rent-car-form component|validateSeatsWhite()|Only One digits are allowed`);
      Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: "Only One digits are allowed", icon: 'error', });
      this.addEditForm.patchValue({ noofseats: '' });
    }
  }


  //https://stackblitz.com/edit/angular-3h5tgg?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html
  drop(event: CdkDragDrop<any>) {
    this.carimgpathList[event.previousContainer.data.index]=event.container.data.item
    this.carimgpathList[event.container.data.index]=event.previousContainer.data.item
    event.currentIndex=0;
    console.log(event.previousContainer.data,'-->',event.container.data)
  }

  customdrop(event: CdkDragDrop<any>) {
    this.files[event.previousContainer.data.index]=event.container.data.item
    this.files[event.container.data.index]=event.previousContainer.data.item
    event.currentIndex=0;
    console.log(event.previousContainer.data,'-->',event.container.data)
  }


  onToggleStatusChange(event: any) {
    var status = "";
    if (event.checked) {
      status = "Active"
    } else {
      status = "InActive";

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


  onTogglePriceAvailablityChange(event: any) {
    var status = "";
    if (event.checked) {
      status = "Active"
    } else {
      status = "InActive";
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

  viewVideo(){
    Swal.fire({
      title: 'Video' ,
      // icon: 'question',
      html:'<video width="320" height="240" controls><source src='+this.videopath+' type="video/mp4"></video>',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {

      }
    })
  }


  notify(obj:any) {
    let data: Array < any >= [];
    data.push({
      'title': obj.title,
      'alertContent': obj.alertContent,
    });
    this.pushNotificationService.generateNotification(data);
  }

  isapprovedstatusChange(event:any){
    debugger
  if(event.value == "2"){
    this.addEditForm.patchValue({ status: 'true' });
  }else{
    this.addEditForm.patchValue({ status: '' });
  }
  }

  scrollToTop() {
    const componentElement = this.el.nativeElement;
    componentElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }


}
