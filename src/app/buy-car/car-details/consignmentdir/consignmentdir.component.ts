import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consignmentdir',
  templateUrl: './consignmentdir.component.html',
  styleUrls: ['./consignmentdir.component.css']
})
export class ConsignmentdirComponent implements OnInit {

  
  carshowroom_id: any;
  showroomname: any;
  brandname: any;
  modelname: any;
  carshowroomrefno: any;
  accountid: any;

  constructor(private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      this.carshowroom_id = params['carshowroom_id'];
      this.showroomname = params['showroomname'];
      this.brandname = params['brandname'];
      this.modelname = params['modelname'];
      this.carshowroomrefno = params['carshowroomrefno'];
      this.accountid = params['accountid'];
     });
    
   }

  ngOnInit(): void {
  }

}
