import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DateFormat, MatTableAttributes } from 'src/app/common/ui.constant';
import { CookieService } from 'src/app/service/cookie.service';
import { ActivityService } from '../activity.service';
// import { AccountService } from '../../account/account.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { DataService } from 'src/app/service/encryption/data.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-activity',
  templateUrl: './add-edit-activity.component.html',
  styleUrls: ['./add-edit-activity.component.css']
})
export class AddEditActivityComponent implements OnInit,OnDestroy {
  
  userPrivilegeObj: any;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  title: string = "Activity";
  currentUser: any;
  isEdit: any;
  entitytype: any;
  entityid: any;
  minFromDate:any=new Date();
  name: any;activityid:any;
  userList: any;
  userFilteredList: any;
  storage_data_id: any;
  constructor(private cookieService: CookieService,public dialog: MatDialog, 
    private router: Router, private route: ActivatedRoute,private activityService:ActivityService, private fb: FormBuilder,public customerService:CustomerService, private dataService: DataService,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {debugger

      this.storage_data_id = this.dataService.getData('activity_storage_data_id');
        if(this.storage_data_id){
        this.getRecord(this.storage_data_id);
      }
  }

 
  public async getRecord(storage_data_id: any) {
    this.dataService.findById(storage_data_id).subscribe({
      next: (response: any) => {
        console.log("Retrieved data:", response);

        this.entitytype = response?.data?.entitytype;
        this.isEdit = response?.data['isEdit'];
        this.entityid = response?.data['entityid'];
        this.name = response?.data['name'];
        this.activityid = response?.data['activityid'];


        this.addEditForm.patchValue({
          entitytype: this.entitytype,name:this.name,entityid:this.entityid
        })

      },
      error: (err) => {
        console.error("Error retrieving data:", err);
      }
    });
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }
  
  public userFiltered(item: any) {
    return this.userFilteredList.find((ele: any) => ele.username == item.username);
  }

  async ngOnInit() {
   
    this.addEditForm = this.fb.group({
      activitytype:['New Task'],
      subject: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      activitystatus: ['', Validators.required],
      entitytype: [this.entitytype, Validators.required],
      name: [this.name],
      entityid: [this.entityid, Validators.required],
      duedate: ['',Validators.required],
      priority: ['', Validators.required],
      description: [''],
      phone: [''],
      email: [''],
      location: [''],
      status: [true],
      contactname:[''],
      assignedto:['', Validators.required],
    });
    
    this.userList = await this.customerService.getList().toPromise();
    this.userList =  this.userList.filter((ele:any)=> ele.status === 1)
    this.userFilteredList = this.userList;

    if (this.activityid) {
      this.activityService.getByIdActivity(this.activityid).pipe()
        .subscribe(async (data: any) => {
          console.log("getByIdActivity", data);
          setTimeout(() => {
            this.fillForm(data[0]);
          }, 1000);
         
        });
        this.minFromDate = this.addEditForm.controls['duedate'].value;
    }else{
      this.addEditForm.patchValue({
        duedate: new Date()
      })
    }
    
    if(this.isEdit == 'VIEW'){
      this.addEditForm.disable();
    }
  }

  private async fillForm(parsedData: any) {
    this.addEditForm.patchValue({
      activitytype: parsedData.activitytype,
      subject: parsedData.subject,
      activitystatus: parsedData.activitystatus,
      entitytype: parsedData.entitytype,
      contactname: parsedData.contactname,
      entityid: parsedData.entityid,
      duedate: parsedData.duedate,
      priority: parsedData.priority,
      description: parsedData.description,
      phone: parsedData.phone,
      email: parsedData.email,
      location: parsedData.location,
      assignedto: parsedData.assignedto,
      status: parsedData.status && parsedData.status.toString(),
    });
    
  }

  public save() {
    debugger;
    
    this.isShowErrors = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      return
    }
    var enteredData = this.addEditForm.value;
    
    // enteredData.entityid = this.entityid;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;

    if (this.activityid) {
      enteredData.activityid = this.activityid;
      // enteredData.entityid = this.entityid;
      this.activityService.updateActivity(enteredData,this.activityid).subscribe(
        async (response: any) => {
          this.success(response.message);
          history.back();
        });
    } else {debugger
      this.activityService.createActivity(enteredData).subscribe(
        async (response: any) => {
          if (response.success) {
            this.success(response.message);
            history.back();
          } else {
            this.errorlogService.logFormErrors(this.addEditForm, `addForm ${response.message}`);
            this.handleError(response.message);
            // this.router.navigate(['leads']);
          }
        });
    }
  }

  private success(message: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: message, icon: 'success', });
  }

  private handleError(error: any) {
  Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  this.loading = false;
}

  goback(){
    history.back();
  }


  ngOnDestroy() {
    this.dataService.clearData('activity_storage_data_id');
  }

}


