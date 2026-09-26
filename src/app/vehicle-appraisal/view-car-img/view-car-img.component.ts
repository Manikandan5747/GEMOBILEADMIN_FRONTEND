import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-car-img',
  templateUrl: './view-car-img.component.html',
  styleUrls: ['./view-car-img.component.css']
})
export class ViewCarImgComponent implements OnInit {
  carimgpathList: any;
  imageObject:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewCarImgComponent>) { }
  CommonConstants :any="https://geapps.germanexperts.ae:7006/";

  ngOnInit(): void {
    debugger
    let carimgpath = this.data;
    this.carimgpathList = carimgpath;
    console.log("this.carimgpathList",this.carimgpathList);

    this.carimgpathList.forEach((element:any) => {
        var obj ={
            image: element,
            thumbImage: element,
        }
        this.imageObject.push(obj);
    });
  }


}
