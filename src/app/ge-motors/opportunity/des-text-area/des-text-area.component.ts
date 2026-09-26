import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-des-text-area',
  templateUrl: './des-text-area.component.html',
  styleUrls: ['./des-text-area.component.css']
})
export class DesTextAreaComponent implements OnInit {
  text: string;
  title: string;
  constructor(
    public dialogRef: MatDialogRef<DesTextAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title ? data.title :"Description";
    this.text = data.description;
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }


}
