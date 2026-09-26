import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { ModeOfPaymentService } from "./mode-of-payment.service";
import { EditModeOfPaymentComponent } from "./edit-mode-of-payment/edit-mode-of-payment.component";
import { AddModeOfPaymentComponent } from "./add-mode-of-payment/add-mode-of-payment.component";

@Component({
  selector: 'app-mode-of-payment',
  templateUrl: './mode-of-payment.component.html',
  styleUrls: ['./mode-of-payment.component.css']
})
export class ModeOfPaymentComponent implements OnInit {

  loading: boolean = false;
  search: any;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  List: any = [];
  dynamicTableData!: any[];

  constructor(public toastr: ToastrService, private modeOfPaymentService: ModeOfPaymentService, private router: Router,
    private route: ActivatedRoute, public dialog: MatDialog) {
  }

  public displayedColumns: string[] = ['modeofpayment', 'status', 'createdby', 'createdat', 'modifiedby', 'modifiedat', 'actions'];

  dataSource!: MatTableDataSource<any>;

  ngOnInit() {
    this.getModeofpayment();
  }

  getModeofpayment() {
    this.loading = true;
    this.modeOfPaymentService.getModeofpayment().pipe()
      .subscribe((data: any) => {
        console.log("getModeofpayment", data);
        this.List = data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   public addRecord() {
      const dialogRef = this.dialog.open(AddModeOfPaymentComponent, {
        width: '500px',
        height: 'fit-content',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result == 'Success') {
          this.getModeofpayment();
        }
      });
    }
  
    public editRecord(items: any) {
      debugger
      const dialogRef = this.dialog.open(EditModeOfPaymentComponent, {
        width: '500px',
        height: 'fit-content',
        disableClose: true,
        data: items
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result == 'Success') {
          this.getModeofpayment();
        }
      });
    }
  

 
}


