import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MobileotpService } from "src/app/service/mobileotp/mobileotp.service";
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2'
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('test1', { static: false }) content!: ElementRef;
  testAttributesMap = new Map();
  PAGE_SIZE = MatTableAttributes.PAGE_SIZE;
  PAGINATION_RANGE = MatTableAttributes.PAGINATION_RANGE;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  error = '';
  List: any;
  dynamicTableData!: any[];
  search: any;
  selectedAppType: any = "";

  constructor(private otpService: MobileotpService,
    public dialog: MatDialog,) { }

  public displayedColumns: string[] = ['customercode','pay_type','pay_action','currencycode','value','orderreference','crm_quotation_id','paymentstatus',  'created_at',];
  

  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getPaymentData();
  }

  getPaymentData() {
    this.loading = true;
    this.otpService.getPaymentHisoty().pipe()
      .subscribe((data: any) => {
        console.log("getPaymentHistory ", data);
        this.List = data.Data;
        this.loadRecord();
      });
  }


  loadRecord() {
    this.dataSource = new MatTableDataSource(this.List);
    setTimeout(() => this.dataSource.sort = this.sort);
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch() {
    this.search = "";
    //localStorage.removeItem('search');
    const filterValue = this.search;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  selectionFilterChange(event: any) {
    this.selectedAppType = event.value;
    console.log('selection', this.selectedAppType);

    // Filter the list based on payment_status value
    if (this.selectedAppType === 'true') {
      this.dataSource = new MatTableDataSource(this.List.filter(item => item.payment_status === 'true'));
    } else if (this.selectedAppType === 'false') {
      this.dataSource = new MatTableDataSource(this.List.filter(item => item.payment_status === 'false'));
    } else {
      // If selection is anything else or reset, show full list
      this.dataSource = new MatTableDataSource(this.List);
    }

    // Re-apply sorting and pagination
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
    this.dataSource.paginator = this.paginator;
  }

}
