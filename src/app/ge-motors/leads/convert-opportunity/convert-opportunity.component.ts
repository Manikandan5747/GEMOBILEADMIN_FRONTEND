import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { CookieService } from 'src/app/service/cookie.service';
import Swal from 'sweetalert2';
import { StageService } from '../../stage/stage.service';

@Component({
  selector: 'app-convert-opportunity',
  templateUrl: './convert-opportunity.component.html',
  styleUrls: ['./convert-opportunity.component.css']
})
export class ConvertOpportunityComponent implements OnInit {

  currentUser: any;
  formData = new FormData();
  accountname: any;
  firstname: any;
  opportunityname: any;
  stageList: any=[];
  constructor(public opportunityService: OpportunityService, public dialogRef: MatDialogRef<ConvertOpportunityComponent>,public stageService:StageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService,) {
  }

  async ngOnInit() {
    this.accountname = this.data.accountname;
    if(!this.data.accountname){
      this.accountname = this.data.firstname + " " + this.data.lastname;

    }

  this.firstname = this.data.firstname;
  this.opportunityname =  this.accountname +"_"+ this.data.firstname;
  this.stageList = await this.stageService.getStage().toPromise();
  }

  async submit() {debugger
    let findaccountnextrefno = await this.opportunityService.getfindnextRefno('ACCOUNT').toPromise();
    this.formData = new FormData();
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.data.userid = obj[0]?.login_id;
    this.data.opportunityname =  this.opportunityname;
    this.data.contactname = this.data.firstname+" "+this.data.lastname;
    this.data.showroomdetid = 1;
    this.data.accountcode = findaccountnextrefno.accountcode;

    this.data.typeid = this.data.leadtype == 'individual' ? ['1'] : ['1','2'];
    // this.data.phonenumber = this.data.mobile ;

    for (let ele in this.data.typeid) {
      this.formData.append("typeList", this.data.typeid[ele]);
    }

    if(!this.data.accountname){
      this.data.accountname = this.data.firstname + " " + this.data.lastname;
    }
    for (let ele in this.data) {
      this.formData.append(ele, this.data[ele]);
    }
    this.opportunityService.convertlead(this.formData).subscribe(
      async (response: any) => {
        console.log("response", response);
        if (response.success) {
          let findopportunitynextrefno = await this.opportunityService.getfindnextRefno('OPPORTUNITY').toPromise();
          this.data.accountid = response.data.accountid;
          this.data.contactid = response.data.contactid;
          this.data.opportunityrefno = findopportunitynextrefno.opportunityrefno;
          let findData = this.stageList.find((ele:any) => ele.stageid == 1);
          this.data.stageid= 1;
          this.data.currencyid= 1;  this.data.exchangerate =1;
          this.data.stageprobability= findData.stageprobability;
          this.data.forecastcategoryid= findData.forecast;
          this.data.dealstatusid= findData.dealstatusid && findData.dealstatusid.toString();
          
          this.data.typeid = 1;
          this.data.conversionstatus= 1;
          let formData = new FormData(); 
          for (let ele in this.data) {
            formData.append(ele, this.data[ele]);
          }
          await this.opportunityService.createOpportunity(formData).subscribe(
            async (response: any) => {
              console.log("response", response);
              if(response.status){
                Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'success', });
                this.dialogRef.close('Success'); 
              }else{
                Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'info', });
              }
            })
                
        } else {
          Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: response.message, icon: 'info', });
        }

      });
  }

}
