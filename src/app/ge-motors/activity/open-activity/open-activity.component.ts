import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-open-activity',
  templateUrl: './open-activity.component.html',
  styleUrls: ['./open-activity.component.css']
})
export class OpenActivityComponent implements OnInit {
  entityid: any;
  entitytype: any;
  name:any;
  
  constructor(private route: ActivatedRoute) { 

    this.route.queryParams.subscribe(params => {
      this.entityid = params['entityid'];
      this.entitytype = params['entitytype'];  
      this.name = params['name'];           
    });
    
   }

  ngOnInit(): void {
  }

}
