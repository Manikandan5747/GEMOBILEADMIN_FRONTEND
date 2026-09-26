import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";  
import { ErrorMatcherService, errorMessages } from 'src/app/service/form-validation/form-validators.service';
import { TypeConfigService } from '../../type-config/type-config.service';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { CampaignsService } from '../campaigns.service';
import Swal from 'sweetalert2';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-add-edit-campaigns-form',
  templateUrl: './add-edit-campaigns-form.component.html',
  styleUrls: ['./add-edit-campaigns-form.component.css']
})
export class AddEditCampaignsFormComponent implements OnInit {
  minFromDate = new Date();
  minEndDate = new Date();
  @Input('isShowErrors') isShowErrors!: boolean;
  @Input('campaignid') campaignid!: any;
  
  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.  
  public addEditForm!: FormGroup;
  list: any;
  typeDetailsList: any;

  constructor(private fb: FormBuilder,private typeConfigService:TypeConfigService,
    public opportunityService: OpportunityService,private campaignsService: CampaignsService,private errorlogService: ErrorlogService) { }

    // convenience getter for easy access to form fields
    get f() {
      return this.addEditForm.controls;
    }
    
  async ngOnInit() {
    this.addEditForm = this.fb.group({
      name: ['', Validators.required],
      campaignrefno: ['',],
      type: ['', Validators.required],
      telestatustemplate: ['', ],
      owner: [''],
      campaignstatus: [''],
      parentcampaign: [null],
      description: [''],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      expectedrevenue: ['',  [Validators.pattern(/^[0-9\.]+$/)]],
      budgetedcost: ['',  [Validators.pattern(/^[0-9\.]+$/)]],
      actualcost:['',  [Validators.pattern(/^[0-9\.]+$/)]],
      expectedresponse: ['',  [Validators.pattern(/^[0-9\.]+$/)]],
      status: ["1"],
    });
    this.getTypeConfig();

    if (!this.campaignid) {
      let findnextRefno = await this.opportunityService.getfindnextRefno('CAMPAIGN').toPromise();
      // console.log("campaignrefno", findnextRefno.campaignrefno);
      this.addEditForm.patchValue({ campaignrefno: findnextRefno.campaignrefno });
    }else{
      this.minFromDate = this.addEditForm.controls['startdate'].value;
    }
  }

  getTypeConfig() {
    this.typeConfigService.gettypeConfig().pipe()
      .subscribe((data: any) => {
        console.log("gettypeConfig", data);
        this.list = data;
        this.typeDetailsList = data;
      });
  }

  public typeFiltered(item: any) {
    return this.typeDetailsList.find((ele: any) => ele.typename == item.typename);
  }



  setEndDateMinValue() {
    this.minEndDate = this.addEditForm.controls['startdate'].value;
  }


  private handleError(error:any) {
    Swal.fire({toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

  radioChange(event: any) {
    this.campaignsService.findCampaignsByIdLeadOpp(this.campaignid).pipe()
    .subscribe((data: any) => {
     if(data.exists){
      this.errorlogService.logFormErrors(this.addEditForm, `addEditForm Campaign already applied to a lead or opportunity`);
      this.handleError("Campaign already applied to a lead or opportunity");
      this.addEditForm.patchValue({ status: '1' });
     }
    });
}

}

