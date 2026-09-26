import { Component, OnInit, Input, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';

@Component({
  selector: 'app-view-img',
  templateUrl: './view-img.component.html',
  styleUrls: ['./view-img.component.css']
})
export class ViewImgComponent implements OnInit {
  title = "Image View";
  spclofferpath: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewImgComponent>) 
  {   }
    
  ngOnInit() {
    this.spclofferpath = this.data.spclofferpath;
  
  }
  


}
