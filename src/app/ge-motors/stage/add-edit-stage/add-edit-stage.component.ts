import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMatcherService } from 'src/app/service/form-validation/form-validators.service';
import { FormValidationService } from 'src/app/service/form-validation/form-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DateFormat, MatTableAttributes } from 'src/app/common/ui.constant';
import { CookieService } from 'src/app/service/cookie.service';
import { ShowroomCategoryService } from 'src/app/service/showroom-category/showroom-category.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ContactService } from '../../contact/contact.service';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { TypeConfigService } from '../../type-config/type-config.service';
import { LeadsService } from '../../leads/leads.service';
import { StageService } from '../stage.service';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-stage',
  templateUrl: './add-edit-stage.component.html',
  styleUrls: ['./add-edit-stage.component.css']
})
export class AddEditStageComponent implements OnInit {

 
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @Input('isShowErrors')
  isShowErrors: boolean = true;
  public matcher = new ErrorMatcherService();
  loading: boolean = false;
  public addEditForm!: FormGroup;
  stageid: any;
  title: string = "Stage";
  formData = new FormData();
  currentUser: any;
 

 

  constructor(private cookieService: CookieService, private typeConfigService: TypeConfigService, public showroomCategoryService: ShowroomCategoryService, public dialog: MatDialog, public carDetailsService: CarDetailsService,
    private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
    private stageService: StageService, private contactService: ContactService, private campaignsService: CampaignsService,public leadsService:LeadsService,
    private formValidationService: FormValidationService,private errorlogService: ErrorlogService) {
    this.route.queryParams.subscribe(params => {
      this.stageid = params['stageid'];
      // this.isEdit = params['isEdit'];
      console.log(this.stageid, this.stageid)
    });
  }

  // convenience getter for easy access to form fields
  get formControl(): any { return this.addEditForm.controls; }


  async ngOnInit() {

    this.addEditForm = this.fb.group({
      stagename: ['', [Validators.required, this.formValidationService.noWhitespaceValidator]],
      stageprobability: [''],
      weightage: [''],
      forecast: [''],
      minage: [''],
      maxage: [''],
      followupinterval: [''],
      dealstatus: [''],
      description: [''],
      approvedmoduleonly: [''],
      mandatoryallow: [''],
      handledby: [''],
      status: ['1'],
      dealstatusid: [''],
    });

    if (this.stageid) {
      this.stageService.getByIdStage(this.stageid).pipe()
        .subscribe(async (data: any) => {
          console.log("getByIdLeads", data);
          this.fillForm(data[0]);
        });
    }
  }

  private async fillForm(parsedData: any) {
    debugger
    this.addEditForm.patchValue({
      stagename: parsedData.stagename,
      stageprobability: parsedData.stageprobability,
      weightage: parsedData.weightage,
      forecast: parsedData.forecast,
      minage: parsedData.minage,
      maxage: parsedData.maxage,
      followupinterval: parsedData.followupinterval,
      color: parsedData.color,
      description: parsedData.description,
      approvedmoduleonly: parsedData.approvedmoduleonly,
      mandatoryallow: parsedData.mandatoryallow,
      dealstatusid: parsedData.dealstatusid ? parsedData.dealstatusid.toString():null,
      status: parsedData.status && parsedData.status.toString(),
    });
  }



  public save() {
    this.isShowErrors = true;
    if (!this.addEditForm.valid) {
      this.errorlogService.logFormErrors(this.addEditForm, 'addEditForm');
      this.formValidationService.markFormGroupTouched(this.addEditForm);
      return
    }
    this.formData = new FormData();
    var enteredData = this.addEditForm.value;
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    enteredData.userid = obj[0]?.login_id;
    enteredData.stageid = this.stageid;
    
    for (let ele in enteredData) {
      this.formData.append(ele, enteredData[ele]);
    }

    if (this.stageid) {
      this.stageService.updateStage(this.formData, this.stageid,).subscribe(
        async (response: any) => {
          this.success("Saved successfully");
          this.router.navigate(['stage']);
        });
    } else {
      this.stageService.createStage(this.formData).subscribe(
        async (response: any) => {
          this.success("Saved successfully");
          this.router.navigate(['stage']);

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

}




