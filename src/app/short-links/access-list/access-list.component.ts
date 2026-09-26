import { Component, OnInit,Inject, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-access-list',
  templateUrl: './access-list.component.html',
  styleUrls: ['./access-list.component.css']
})
export class AccessListComponent implements OnInit {
  isShowErrors: boolean = false;

  constructor(public dialogRef: MatDialogRef<AccessListComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    
  }

 
}

