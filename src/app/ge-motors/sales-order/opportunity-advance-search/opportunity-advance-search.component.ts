import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StageService } from '../../stage/stage.service';
import { DateFormat, MatTableAttributes } from 'src/app/common/ui.constant';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpportunityService } from '../../opportunity/opportunity.service';
import { ContactService } from '../../contact/contact.service';
import { AccountService } from '../../account/account.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SalesOrderService } from '../sales-order.service';

@Component({
  selector: 'app-opportunity-advance-search',
  templateUrl: './opportunity-advance-search.component.html',
  styleUrls: ['./opportunity-advance-search.component.css']
})
export class OpportunityAdvanceSearchComponent implements OnInit {
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  isShowErrors: boolean = false;
  user: any;
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  currentUser: any;
  stageList: any;
  stageFilterList: any;
  List: any;
  accountList: any;
  accountFilteredList: any;
  contactTotalList: any = [];
  contactFilterList: any;
  contactList: any;
  opportunityList: any;
  filteredopportunityList: any;
  constructor(public stageService: StageService, private opportunityService: OpportunityService, private contactService: ContactService, public accountService: AccountService,
    public salesOrderService:SalesOrderService, public dialogRef: MatDialogRef<OpportunityAdvanceSearchComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,) { }
  dataSource!: MatTableDataSource<any>;
  public addEditForm!: FormGroup;

  public displayedColumns: string[] = ['opportunityrefno', 'opportunityname', 'accountname', 'firstname', 'stagename', 'dealstatusname','expectedclosedate'];

  // convenience getter for easy access to form fields
  get f() {
    return this.addEditForm.controls;
  }
  public isFiltered(item: any) {
    return this.filteredopportunityList.find((ele: any) => ele.opportunityid == item.opportunityid);
  }
  

  async ngOnInit(): Promise<void> {
    this.addEditForm = this.fb.group({
      "opportunityrefno": [null],
      "opportunityid":[null],
      "opportunityname": [null],
      "stageid": [null],
      "dealstatusid": [null],
      "accountid": [null],
      "contactid": [null],
      "mobile":[null],
      "expectedclosedate":[null]
    })
    this.stageList = await this.stageService.getStage().toPromise();
    this.stageFilterList = this.stageList;
    this.contactTotalList = await this.contactService.getContact().toPromise();
    this.accountList = await this.accountService.get().toPromise();
    this.accountFilteredList = this.accountList;
    // this.opportunityList = await this.opportunityService.getOpportunity().toPromise();  
    // this.filteredopportunityList = this.opportunityList ;


    
    let getAllOpportunity = await this.opportunityService.getOpportunity().toPromise();
    // this.opportunityList = getAllOpportunity && getAllOpportunity.filter((ele: any) => ele.status == 1 && ele.conversionstatus == 1);
    // this.filteredopportunityList = this.opportunityList;


    const today = new Date();
    today.setDate(today.getDate() - 1); // Increase today by one day
    let totalSalesorderList = await this.salesOrderService.getSalesorder().toPromise();
    console.log("this.getAllOpportunity", getAllOpportunity);

    this.opportunityList = getAllOpportunity && getAllOpportunity.filter((ele: any) => 
      ele.status === 1 &&
      ele.dealstatusid !== 2 &&
      ele.opportunity_details && ele.opportunity_details.length > 0 && ele.opportunity_details[0].brandid  &&
      !totalSalesorderList.some((so: any) => so.opportunityid === ele.opportunityid) &&
      new Date(ele.expectedclosedate) >= today
  );
    this.filteredopportunityList = this.opportunityList;
    console.log("this.opportunityList", this.opportunityList);
    
  }

  isStageFiltered(item: any) {
    return this.stageFilterList.find((ele: any) => ele.stageid == item.stageid);
  }

  public accountidFiltered(item: any) {
    return this.accountFilteredList.find((ele: any) => ele.accountname
      == item.accountname
    );
  }

  isContactFiltered(item: any) {
    return this.contactFilterList.find((ele: any) => ele.firstname
      == item.firstname
    );
  }

  clearfilter(){
    this.addEditForm.reset();
    this.dataSource.data = [];
  }
  
  filter() {
    this.opportunityService.getOpportunityAdvanceFilter(this.addEditForm.value).pipe()
      .subscribe((data: any) => {
        console.log("getOpportunity", data);
        this.List = data;
        this.loadRecord();
      });
  }


  loadRecord() {
      // Clone and adjust the date
  const updatedList = this.List.map(item => {
    const newItem = { ...item };
    // if (newItem.expectedclosedate) {
    //   const date = new Date(newItem.expectedclosedate);
    //   date.setDate(date.getDate() + 1);
    //   newItem.expectedclosedate = date;
    // }
    return newItem;
  });
    this.dataSource = new MatTableDataSource(updatedList);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
    // this.loading = false;
  }
  onAccountOptionSelected(tempValue: any) {
    debugger
    let findData = this.contactTotalList.filter((ele: any) => ele.accountid == tempValue)
    this.contactFilterList = findData;
    this.contactList = findData;
  }

  selectedRow(row) {debugger
    this.dialogRef.close(row.opportunityid);
    console.log('selectedRow', row.opportunityid)
  }

  isDatePast(date: string | Date): boolean {
    const expectedDate = new Date(date);
    const today = new Date(); // Use current date, not form value
  
    // Remove time part for accurate comparison
    expectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    return expectedDate < today;
  }
  
  

}
