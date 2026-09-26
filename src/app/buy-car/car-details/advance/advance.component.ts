import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {
  carshowroom_id: any;
  showroomname: any;
  brandname: any;
  modelname: any;
  carshowroomrefno: any;

  constructor(private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      this.carshowroom_id = params['carshowroom_id'];
      this.showroomname = params['showroomname'];
      this.brandname = params['brandname'];
      this.modelname = params['modelname'];
      this.carshowroomrefno = params['carshowroomrefno'];
    });
    
   }

  ngOnInit(): void {
  }

}
