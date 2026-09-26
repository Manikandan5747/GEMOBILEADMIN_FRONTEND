import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';

@Component({
  selector: 'app-view-corporate-icon',
  templateUrl: './view-corporate-icon.component.html',
  styleUrls: ['./view-corporate-icon.component.css']
})
export class ViewCorporateIconComponent implements OnInit {

  title = "Icon View";
  spclofferpath: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewCorporateIconComponent>) 
  {   }
    
  ngOnInit() {
    this.spclofferpath = this.data.corporatepartnericonpath;
  
  }

}
  