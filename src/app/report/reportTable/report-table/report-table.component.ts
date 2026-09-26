import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DateFormat, MatTableAttributes } from "src/app/common/ui.constant";
import { HttpClient } from '@angular/common/http'; // Import HttpClient module
import { ReportsService } from "src/app/service/reports/reports.service";
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { debounceTime, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ACTIVE_CAR_SALES_REPORT, ACTIVE_CARS_DETAILS_COLUMNS, CASH_REQUEST, CASHREQUESTCARSDETAILSREPORT, CONSIGNMENT_CARS_DETAILS_COLUMNS, GIFT_DRAW_INVENTORY_COLUMNS, INSPECTION_REPORT_REQUESTS_COLUMNS, KEY_DRAW_MANAGEMEN_COLUMNS, PAYMENTDETAILS_COLUMNS, PRINT_DOCUMENT_HISTORY, PURCHASEAGGREMENTCARSDETAILSREPORT, SHARE_REPORT, SHORT_LINK_REPORT, SPECIAL_OFFER_HISTORY_REPORT_COLUMNS, SPECIAL_OFFER_REPORT_COLUMNS, } from '../../columnData/columndata';
import { SOLD_CAR_DETAIL_COLUMNS } from '../../columnData/columndata';
import { ADVANCE_DETAIL_COLUMNS } from '../../columnData/columndata';
import { BRAND_WISE_CAR_DETAILS_COLUMNS } from '../../columnData/columndata';
import { LEAD_DETAIL_COLUMNS } from '../../columnData/columndata';
import { OPPORTUNITY_DETAIL_COLUMNS } from '../../columnData/columndata';
import { QUOTATION_DETAIL_COLUMNS } from '../../columnData/columndata';
import { SALES_ORDER_DETAIL_COLUMNS } from '../../columnData/columndata';
import { EXPENSE_DETAIL_COLUMNS } from '../../columnData/columndata';
import { CONSIGNMENT_DETAIL_COLUMNS } from '../../columnData/columndata';
import { OPPORTUNITY_CAR_DETAILS_COLUMNS } from '../../columnData/columndata';
import { QUOTATION_CAR_DETAILS_COLUMNS } from '../../columnData/columndata';
import { SALES_ORDER_CAR_DETAILS_COLUMNS } from '../../columnData/columndata';
import { ExportToExcelService } from 'src/app/service/exportExcel/export-to-excel.service';
import { ExportToPDFService } from 'src/app/service/exportPDF/export-to-pdf.service';
import { MOBILEADMIN_CAR_DETAIL_COLUMNS } from '../../columnData/columndata';
import { ADDITIONAL_COST_COLUMNS } from '../../columnData/columndata';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { FilterModalComponent } from '../../filter-modal/filter-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorlogService } from 'src/app/errorlog.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css']
})
export class ReportTableComponent implements OnInit {
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  DATE_ONLYFORMAT = DateFormat.DATE_ONLYFORMAT;
  // DATE_FORMAT = 'dd-MMM-yyyy HH:mm:ss a';
  private filterSubject: Subject<any> = new Subject<any>();
  @ViewChild(MatSort) sort!: MatSort;
  reportName: string = '';
  dataSource: MatTableDataSource<any>;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  totalRecords: number = 0;
  search: string = '';
  filters: any = {};
  sortInfo: any = {};
  payLoad = {
    Page: 1,
    PageSize: 10,
    SearchTerm: {},
    SortInfo: {},
  };
  sortStates: { [key: string]: 'asc' | 'desc' | '' } = {};
  columnsData: any[] = [];
  fieldNames: any = [];
  dataForExcel: any = [];
  testAttributesMap = new Map();
  reportHeader: any;
  reportEndPoint: any;
  showFilterContainer: boolean = false;
  // Define FormControl for the input field
  control = new FormControl('');
  allFilterData: string[] = [];
  allFilteredData: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  selectedCol: any;


  exceldata: any;
  exportExcelFile: boolean = false;
  exportPdfFile: boolean = false;


  filtersForm: any;
  filterOptions: Observable<any[]>[] = [];
  existingFilters: any;
  dayspassedcar: any;
  carownertype: any;
  printaccess: any;


  // Inject HttpClient in the constructor
  constructor(private httpClient: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef, private dialog: MatDialog, private reportsService: ReportsService, private exportToPDFService: ExportToPDFService, private exportToExcelService: ExportToExcelService, private router: Router, private route: ActivatedRoute, private errorlogService: ErrorlogService) {

    this.route.queryParams.subscribe(params => {
      this.dayspassedcar = params['dayspassedcar'];
      this.carownertype = params['carownertype']
    });

    this.dataSource = new MatTableDataSource<any>([]);
    this.filterSubject.pipe(debounceTime(500)).subscribe(() => {
      this.triggerFilter();
    });
  }

  // Use ngOnInit to initialize data
  ngOnInit() {
    this.reportHeader = localStorage.getItem('reportHeader');
    this.printaccess = localStorage.getItem('NHPmhskvw2by/7HORiT8ww==');

    this.route.params.subscribe(params => {
      this.reportName = params['reportName'];
      console.log(this.reportName)
    });
    switch (this.reportName) {
      case 'ActiveCarsDetailsReport':
        this.reportEndPoint = 'activecardetailsreport';
        this.columnsData = ACTIVE_CARS_DETAILS_COLUMNS;
        break;
      case 'AdvanceReport':
        this.reportEndPoint = 'advancereport';
        this.columnsData = ADVANCE_DETAIL_COLUMNS;
        break;
      case 'BrandwiseCarDetailsReport':
        this.reportEndPoint = 'brandwisecardetailsreport';
        this.columnsData = BRAND_WISE_CAR_DETAILS_COLUMNS;
        break;
      case 'LeadsReport':
        this.reportEndPoint = 'leadsreport';
        this.columnsData = LEAD_DETAIL_COLUMNS;
        break;
      case 'OpportunityReport':
        this.reportEndPoint = 'opportunityheaderdetailsreport';
        this.columnsData = OPPORTUNITY_DETAIL_COLUMNS;
        break;
      case 'QuotationReport':
        this.reportEndPoint = 'quotationheaderdetailsreport';
        this.columnsData = QUOTATION_DETAIL_COLUMNS;
        break;
      case 'SalesOrderReport':
        this.reportEndPoint = 'salesorderheaderdetailsreport';
        this.columnsData = SALES_ORDER_DETAIL_COLUMNS;
        break;
      case 'ExpenseReport':
        this.reportEndPoint = 'expensereport';
        this.columnsData = EXPENSE_DETAIL_COLUMNS;
        break;
      case 'Consignmentreport':
        this.reportEndPoint = 'consignmentreport';
        this.columnsData = CONSIGNMENT_DETAIL_COLUMNS;
        break;
      case 'Opportunitycardetailsreport':
        this.reportEndPoint = 'opportunitycardetailsreport';
        this.columnsData = OPPORTUNITY_CAR_DETAILS_COLUMNS;
        break;
      case 'Quotationcardetailsreport':
        this.reportEndPoint = 'quotationcardetailsreport';
        this.columnsData = QUOTATION_CAR_DETAILS_COLUMNS;
        break;
      case 'Salesordercardetailsreport':
        this.reportEndPoint = 'salesordercardetailsreport';
        this.columnsData = SALES_ORDER_CAR_DETAILS_COLUMNS;
        break;
      case 'CarDetailsReport':
        this.reportEndPoint = 'buycardetailspagination';
        this.columnsData = MOBILEADMIN_CAR_DETAIL_COLUMNS;
        break;
      case 'SalesReport':
        this.reportEndPoint = 'addiionalCostreport';
        this.columnsData = ADDITIONAL_COST_COLUMNS;;
        break;
      case 'SoldCarSalesReport':
        this.reportEndPoint = 'soldcarsalesreport';
        this.columnsData = ADDITIONAL_COST_COLUMNS;;
        break;
      case 'ActiveCarSalesReport':
        this.reportEndPoint = 'activecarsalesreport';
        this.columnsData = ACTIVE_CAR_SALES_REPORT;;
        break;

      case 'PrintDocumentHistory':
        this.reportEndPoint = 'gethistorydocprinted1';
        this.columnsData = PRINT_DOCUMENT_HISTORY;;
        break;
      case 'GiftDrawInventory':
        this.reportEndPoint = 'lucky_draw/inventoryreport';
        this.columnsData = GIFT_DRAW_INVENTORY_COLUMNS;;
        break;

      case 'KeyDrawDetails':
        this.reportEndPoint = 'lucky_draw/KeyManagementReport';
        this.columnsData = KEY_DRAW_MANAGEMEN_COLUMNS;;
        break;

      case 'Shortlink':
        this.reportEndPoint = 'shortlinkreport';
        this.columnsData = SHORT_LINK_REPORT;;
        break;

      case 'cashrequest':
        this.reportEndPoint = 'cashrequest-report';
        this.columnsData = CASH_REQUEST;;
        break;

      case 'Sharedcarsalesreport':
        this.reportEndPoint = 'sharedcarsalesreport';
        this.columnsData = SHARE_REPORT;;
        break;

      case 'consignmentcarsdetailsreport':
        this.reportEndPoint = 'consignmentcarsdetailsreport';
        this.columnsData = CONSIGNMENT_CARS_DETAILS_COLUMNS;;
        break;
      case 'purchaseaggrementcarsdetailsreport':
        this.reportEndPoint = 'purchaseaggrementcarsdetailsreport';
        this.columnsData = PURCHASEAGGREMENTCARSDETAILSREPORT;;
        break;

      case 'cashrequestcarsdetailsreport':
        this.reportEndPoint = 'cashrequestcarsdetailsreport';
        this.columnsData = CASHREQUESTCARSDETAILSREPORT;;
        break;

      case 'getpaymentdetailsreport':
        this.reportEndPoint = 'getpaymentdetailsreport';
        this.columnsData = PAYMENTDETAILS_COLUMNS;;
        break;


      case 'getspecialofferreport':
        this.reportEndPoint = 'getspecialofferreport';
        this.columnsData = SPECIAL_OFFER_REPORT_COLUMNS;;
        break;

      case 'specialofferhistoryreport':
        this.reportEndPoint = 'specialofferhistoryreport';
        this.columnsData = SPECIAL_OFFER_HISTORY_REPORT_COLUMNS;;
        break;

      case 'inspectionreportrequestsreport':
        this.reportEndPoint = 'inspectionreportrequestsreport';
        this.columnsData = INSPECTION_REPORT_REQUESTS_COLUMNS;;
        break;




      default:
        // Default case if reportName does not match any specific report
        break;
    }
    this.fieldNames = this.columnsData.map(column => column.fieldName);
    this.loadData(this.payLoad, this.reportEndPoint);


  }



  toggleSort(fieldName: string) {
    this.sortStates[fieldName] = this.sortStates[fieldName] === 'asc' ? 'desc' : 'asc';
    // Implement sorting logic here using this.sortStates[fieldName]
    const sortField = fieldName;
    const sortOrder = this.sortStates[fieldName];

    this.sortInfo = {
      field: sortField,
      order: sortOrder
    };
    // Construct the payload
    const payload = {
      Page: 1,
      PageSize: this.pageSize,
      SearchTerm: this.filters,
      SortInfo: this.sortInfo,
      advanceFilters: this.existingFilters
    };
    console.log(payload)
    // Call the service method with the constructed payload
    this.loadData(payload, this.reportEndPoint);
  }
  getFieldType(field: string): string {
    console.log(field)
    const filterField = this.columnsData.find(item => item.fieldName === field);
    console.log(filterField)

    return filterField ? filterField.type : 'text';
  }

  applyAdvanceFilter() {
    // Create a new filter object

    // Construct the payload
    const payload = {
      Page: 1, // or use this.currentPage if dynamic
      PageSize: this.pageSize,
      SearchTerm: this.filters,
      SortInfo: this.sortInfo,
      advanceFilters: this.existingFilters
    };

    console.log(payload);
    // Call the service method with the constructed payload
    this.loadData(payload, this.reportEndPoint);
  }

  toggleFilterContainer() {
    this.showFilterContainer = !this.showFilterContainer;
  }

  getSortIcon(fieldName: string): string {
    const sortState = this.sortStates[fieldName];
    if (sortState === 'asc') {
      return 'arrow_upward';
    } else if (sortState === 'desc') {
      return 'arrow_downward';
    } else {
      return 'unfold_more'; // or any default icon
    }
  }

  shouldRenderFilter(fieldName: string): boolean {
    // Check if the field should have the input filter
    return ![''].includes(fieldName);
  }

  loadData(payLoad: any, reportEndPoint: string) {
    console.log(reportEndPoint)

    if (reportEndPoint == "activecardetailsreport" && this.dayspassedcar) {
      payLoad.dayspassedcar = true
    } else if (reportEndPoint == "activecardetailsreport" && this.carownertype) {
      payLoad.SearchTerm = {
        carownertype: { filterVal: this.carownertype }
      }
    }

    //Consignmentreport
    if (reportEndPoint == "consignmentreport" && this.reportHeader == 'CONSIGNMENT REPORT - IN SHOWROOM') {
      payLoad.SearchTerm = {
        status: { filterVal: 0 },
        showroomcarstatus: { filterVal: 1 },
        instock: { filterVal: true }
      }
    }

    if (reportEndPoint == "consignmentreport" && this.reportHeader == 'CONSIGNMENT REPORT - OUT FROM SHOWROOM') {
      payLoad.SearchTerm = {

        showroomcarstatus: { filterVal: 0 },
        instock: { filterVal: false }
      }
    }

    //cashrequest
    if (reportEndPoint == "cashrequest-report" && this.reportHeader == 'CASH REQUEST') {
      payLoad.SearchTerm = {
        paymentstatus: { filterVal: 'PENDING' },
      }
    }


    //salesorderheaderdetailsreport
    if (reportEndPoint == "salesorderheaderdetailsreport" && this.reportHeader == 'SALES ORDER') {
      payLoad.SearchTerm = {
        paymentstatus: { filterVal: 'PENDING' },
      }
    }


    if (reportEndPoint == "sharedcarsalesreport" && this.reportHeader == 'SHARED CAR SALES REPORT') {
      payLoad.SearchTerm = {
        status: { filterVal: 1 }
      }
    }

    this.reportsService.getReportData(payLoad, reportEndPoint)
      .subscribe(response => {
        if (response.response || response.data) {
          let Arr = response.response || response.data;
          const uppercaseResponse = Arr.map((item: any) => {
            const uppercaseItem: any = {};
            for (const key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key)) {
                uppercaseItem[key] = typeof item[key] === 'string' ? item[key].toUpperCase() : item[key]; // Convert value to uppercase if it's a string
              }
            }
            return uppercaseItem;
          });

          console.log("uppercaseResponse", uppercaseResponse);
          this.exceldata = uppercaseResponse;
          if (this.exportExcelFile) {

            this.exportExcelFile = false;


            this.dataForExcel = []; // Clear previous data
            const columnNamesWithNo = this.columnsData.map(column => column.fieldName);
            const columnHeader = this.columnsData.map(column => column.columnName);

            // Inject DatePipe
            const datePipe = new DatePipe('en-US');
            console.log("this.exceldata", this.exceldata);

            // this.exceldata?.forEach((row: any) => {
            //   const rowData: any[] = [];
            //   columnNamesWithNo.forEach(columnName => {
            //     if (row.hasOwnProperty(columnName)) {
            //       // Format date values if the column contains date
            //       if (typeof row[columnName] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(row[columnName])) {
            //         rowData.push(datePipe.transform(new Date(row[columnName]), this.DATE_FORMAT));
            //       } else if (columnName === 'status') {
            //         rowData.push(row[columnName] === 1 ? 'Active' : 'Inactive');
            //       } else {
            //         rowData.push(row[columnName]);
            //       }
            //     } else {
            //       rowData.push(''); // If the column doesn't exist, add an empty string
            //     }
            //   });
            //   console.log(rowData);
            //   this.dataForExcel.push(rowData);
            // });

            this.exceldata?.forEach((row: any) => {
              const rowData: any[] = [];

              columnNamesWithNo.forEach(columnName => {
                if (row.hasOwnProperty(columnName)) {
                  // Format date values if the column contains date
                  if (typeof row[columnName] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(row[columnName])) {
                    if (this.isDateOnlyField(columnName)) {
                      // If it's a date-only field, use DATE_ONLYFORMAT
                      rowData.push(datePipe.transform(new Date(row[columnName]), this.DATE_ONLYFORMAT));
                    } else {
                      // Otherwise, use full DATE_FORMAT
                      rowData.push(datePipe.transform(new Date(row[columnName]), this.DATE_FORMAT));
                    }
                  } else if (columnName === 'status') {
                    // Map status field values
                    rowData.push(row[columnName] === 1 ? 'Active' : 'Inactive');
                  }
                  else if (columnName === 'payment_status') {
                    // Map status field values
                    rowData.push(row[columnName] === 1 ? 'Active' : 'Inactive');
                  } else {
                    rowData.push(row[columnName]);
                  }
                } else {
                  // If the column doesn't exist, add an empty string
                  rowData.push('');
                }
              });

              console.log(rowData);
              this.dataForExcel.push(rowData);
            });


            if (this.dataForExcel && this.dataForExcel.length > 0) {
              this.exportToExcelService.exportAsExcelFile(columnHeader, this.dataForExcel, "Report Excel", '', this.reportHeader);
            } else {
              this.errorlogService.logManualValidationError('No Data Found!');
              this.handleError("No Data Found!")
            }

          }
          else if (this.exportPdfFile) {

            this.exportPdfFile = false;
            let tableBody: any = this.exceldata;
            const columnNamesWithNo = this.columnsData.map(column => column.fieldName);
            const columnHeader = this.columnsData.map(column => column.columnName);

            // Inject DatePipe
            const datePipe = new DatePipe('en-US');

            // const dataForPdf = tableBody.map((row: any) => {
            //   const rowData: any = {};
            //   columnNamesWithNo.forEach(columnName => {
            //     if (row.hasOwnProperty(columnName)) {
            //       // Check if the value is a ISO 8601 date string
            //       if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(row[columnName])) {
            //         rowData[columnName] = datePipe.transform(new Date(row[columnName]), this.DATE_FORMAT);
            //       } else if (columnName === 'status') {
            //         rowData[columnName] = row[columnName] === 1 ? 'Active' : 'Inactive';
            //       } else {
            //         rowData[columnName] = row[columnName];
            //       }
            //     } else {
            //       rowData[columnName] = ''; // If the column doesn't exist, add an empty string
            //     }
            //   });
            //   return rowData;
            // });

            const dataForPdf = tableBody.map((row: any) => {
              const rowData: any = {};

              columnNamesWithNo.forEach(columnName => {
                if (row.hasOwnProperty(columnName)) {
                  // Check if the value is a ISO 8601 date string
                  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(row[columnName])) {
                    // Check if the column requires DATE_ONLYFORMAT or DATE_FORMAT
                    if (this.isDateOnlyField(columnName)) {
                      rowData[columnName] = datePipe.transform(new Date(row[columnName]), this.DATE_ONLYFORMAT);
                    } else {
                      rowData[columnName] = datePipe.transform(new Date(row[columnName]), this.DATE_FORMAT);
                    }
                  } else if (columnName === 'status') {
                    // Map status field values
                    rowData[columnName] = row[columnName] === 1 ? 'Active' : 'Inactive';
                  } else {
                    // For other columns, retain the original value
                    rowData[columnName] = row[columnName];
                  }
                } else {
                  // If the column doesn't exist in the row, add an empty string
                  rowData[columnName] = '';
                }
              });

              return rowData;
            });


            if (dataForPdf && dataForPdf.length > 0) {
              this.exportToPDFService.exportPdf(columnHeader, dataForPdf, "Report PDF", this.testAttributesMap, "GERMAN EXPERTS CAR MAINTENANCE", this.reportHeader, "Admin");
            } else {
              this.errorlogService.logManualValidationError('No Data Found!');
              this.handleError("No Data Found!")
            }
          }
          else {
            this.dataSource = new MatTableDataSource<any>(uppercaseResponse);
          }


          this.totalRecords = response.totalCount || response.total_count;
          console.log('Total Records:', this.totalRecords);
          this.dataSource.filterPredicate = (data: any, filter: string) => {
            const searchData = `${data.quoteid} ${data.quotename}`.toLowerCase();
            return searchData.indexOf(filter.toLowerCase()) !== -1;
          };
        }
      });
  }


  isDateOnlyField(fieldName: string): boolean {
    const dateOnlyFields = [
      'purchasedate',
      'consignmentexpirydate',
      'consignmentenddate',
      'consignmentstartdate',
      'expectedclosedate',
      'duedate',
      'expirydate',
      'expensedate',
      'gift_validity',
      'validity',
      'requestdate', 'paymentdate'
    ];
    return dateOnlyFields.includes(fieldName);
  }

  getRowRange(): string {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    return ` ${endIndex} to  ${this.totalRecords}`;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    const payload = {
      Page: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: this.filters,
      SortInfo: this.sortInfo,
      advanceFilters: this.existingFilters

    };
    this.loadData(payload, this.reportEndPoint);
  }

  openFilterModal(): void {
    // Assuming this.filters is an array of filters that you want to prefill
    const dialogRef = this.dialog.open(FilterModalComponent, {
      data: {
        columnsData: this.columnsData,
        existingFilters: this.existingFilters // Pass current filters to the modal
      },
      position: { top: '0px' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.existingFilters = result;
        const payload = {
          Page: this.currentPage,
          PageSize: this.pageSize,
          SearchTerm: this.filters,
          SortInfo: this.sortInfo,
          advanceFilters: result
        };

        // Apply the filter based on the result
        this.applyFilter(result.selectedField);
        this.loadData(payload, this.reportEndPoint);
      }
    });
  }

  clearAdvancedFilter(): void {
    this.existingFilters = []; // Clear the existing filters array

    const payload = {
      Page: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: this.filters, // Keep search term if necessary
      SortInfo: this.sortInfo,
      advanceFilters: this.existingFilters // Pass empty filters to clear them
    };

    this.loadData(payload, this.reportEndPoint); // Reload the data without filters
  }

  applyFilter(filterValue: string) {
    this.search = filterValue;
    this.dataSource.filter = this.search?.trim().toLowerCase();
  }

  applyFilter1(event: any, fieldName: string) {
    const filterValue = event.target.value;

    // Update or add the filter for the specified field
    if (filterValue.trim()) {
      if (fieldName === 'status') {
        // Convert filter value to 0 or 1 based on the input
        const statusFilter = filterValue.trim().toUpperCase().includes('IN') ? "0" : "1";
        this.filters[fieldName] = { filterVal: statusFilter };
      } else {
        this.filters[fieldName] = { filterVal: filterValue.trim() };
      }
    } else {
      delete this.filters[fieldName]; // Remove the filter if the value is empty
    }

    // Emit the filter event
    this.filterSubject.next();
  }

  private triggerFilter() {
    // Construct the payload with all current filters
    const payload = {
      Page: 1,
      PageSize: this.pageSize,
      SearchTerm: this.filters,
      SortInfo: this.sortInfo,
      advanceFilters: this.existingFilters
    };

    // Call the service method with the constructed payload
    this.loadData(payload, this.reportEndPoint);
  }

  onSortChange(event: any) {



    const sortField = event.active;
    const sortOrder = event.direction;

    this.sortInfo = {
      field: sortField,
      order: sortOrder
    };
    // Construct the payload
    const payload = {
      Page: 1,
      PageSize: this.pageSize,
      SearchTerm: this.filters,
      SortInfo: this.sortInfo
    };
    console.log(payload)
    // Call the service method with the constructed payload
    this.loadData(payload, this.reportEndPoint);
  }

  clearSearch() {
    this.search = '';
    this.applyFilter('');
  }
  async exportExcel() {
    this.exportExcelFile = true;
    const payload = {
      Page: 1,
      PageSize: this.totalRecords,
      SearchTerm: this.filters,
      SortInfo: this.sortInfo,
      advanceFilters: this.existingFilters

    };
    console.log(payload)
    // Call the service method with the constructed payload
    await this.loadData(payload, this.reportEndPoint);

  }
  async exportPdf() {
    this.exportPdfFile = true;
    const payload = {
      Page: 1,
      PageSize: this.totalRecords,
      SearchTerm: this.filters,
      SortInfo: this.sortInfo,
      advanceFilters: this.existingFilters

    };
    console.log(payload)
    // Call the service method with the constructed payload
    await this.loadData(payload, this.reportEndPoint);


  }


  goBack() {
    this.router.navigate(['/report']);
  }

  private handleError(error: any) {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: error, icon: 'error', });
  }

}
