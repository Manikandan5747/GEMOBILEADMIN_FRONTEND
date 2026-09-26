import { Component, AfterViewInit, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import * as echarts from 'echarts';
import { MatTableDataSource } from '@angular/material/table';
import { DateFormat } from 'src/app/common/ui.constant';
import { CookieService } from 'src/app/service/cookie.service';
import { ManageModuleService } from 'src/app/service/manage-module/manage-module.service';
import { ModuleIdList } from 'src/app/common/enum';
import { ErrorlogService } from 'src/app/errorlog.service';
@Component({
  selector: 'app-db-showroom-manager',
  templateUrl: './db-showroom-manager.component.html',
  styleUrls: ['./db-showroom-manager.component.css']
})
export class DbShowroomManagerComponent implements OnInit {
  responseData: any;
  DATE_FORMAT = DateFormat.DATE_FORMAT;
  startDate: any;
  doughnutChartDataSalesorder: any;
  endDate: any;
  pieChartDataSalesorder: any;
  defaultStartDate: string = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  defaultEndDate: string = new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0];

  lineChartData: any;
  pieChartData: any;
  doughnutChartData: any;
  barChartData: any;
  brandWiseBarData: any;
  bodyTypeBarChartdata: any;
  regionalspecandbrandwisesoldcarChartData: any;

  totalLeadsData: any;
  totalOpportunitiesData: any;
  totalQuotesData: any;
  totalSalesOrdersData: any;
  showNoDataMessage: boolean = false; // Add this property
  funnelChart: any;
  totalTileDataArray: any;
  @ViewChild('funnelChart') chartElement!: ElementRef;




  lineChartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    height: 500,
    width: 400,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          stepSize: 1
        },
        grid: {
          display: false
        },
        min: 1
      }
    }
  };
  barChartOptions: any = {
    maintainAspectRatio: false,
    responsive: false,
    height: 400,
    width: 400
  };
  pieChartOptions: any = {
    maintainAspectRatio: false,
    responsive: false,
    height: 400,
    width: 400
  };

  doughnutChartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    height: 400,
    width: 400
  };


  bodyTypeBarChartOptions: any = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        labels: {
          color: 'var(--text-color)'
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        }
      }
    }
  };

  brandWiseBarOptions: any = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.8,

    scales: {
      x: {
        grid: {
          display: false // Hide the x-axis gridlines
        }
      },
      y: {
        grid: {
          display: false // Hide the y-axis gridlines
        }
      }
    }

  };
  share: any;
  list: any = [];
  public displayedColumns = ['carshowroomrefno', 'brandname', 'modelname', 'shelflife'];
  public displayedLabelColumns = ['car showroom ref no', 'brand', 'model', 'shelf life'];

  public displayedColumns2 = ['carshowroomrefno', 'brandname', 'modelname', 'holdingperiod'];
  public displayedLabelColumns2 = ['car showroom ref no', 'brand', 'model', 'holding period'];

  list2: any;
  currentUser: any;
  userPrivilegeList: any = [];
  monthWiseCarCountChartData: any;
  monthWiseCarCountChartOptions: any;
  role_id: any;
  userPrivilegeModuleList: any;
  constructor(private dashboardService: DashboardService, private router: Router, private cookieService: CookieService, private manageModuleService: ManageModuleService, private errorlogService: ErrorlogService) { }
  dataSource!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;



  getAllUserPrivilege(role_id: any) {
    this.manageModuleService.getAllUserPrivilege(role_id, '').pipe()
      .subscribe((data: any) => {
        console.log("getAllUserPrivilege", data);
        this.userPrivilegeList = data.filter(ele => ele.isreport === true);
        this.userPrivilegeModuleList = data;
      });
  }

  ngOnInit(): void {

    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.role_id = obj[0]?.role_id;
    if (this.role_id) {
      this.getAllUserPrivilege(this.role_id)
    }

    // enteredData.userid = obj[0]?.login_id;
    const now = new Date();
    this.startDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
    this.endDate = new Date(now.getFullYear(), 11, 31); // Dec 31st of current year

    this.dashboardService.getsoldcarsalesreporttopfive().pipe()
      .subscribe((data: any) => {
        console.log("getsoldcarsalesreporttopfive", data);
        this.list = data.shelflife;
        this.list2 = data.holdingperiod;
        this.dataSource = new MatTableDataSource(this.list);
        this.dataSource2 = new MatTableDataSource(this.list2);
      });




  }
  ngAfterViewInit(): void {

    // Ensure that the chart elements are available before attempting to initialize the charts
    if (this.chartElement && this.chartElement.nativeElement) {
      this.funnelChart = echarts.init(this.chartElement.nativeElement);
    }


    // Fetch dashboard data after the charts are initialized
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {


    const today = new Date(); // Current date

    const startDate = this.startDate
      ? new Date(this.startDate.getFullYear(), 0, 1).toISOString().split('T')[0] // Jan 1 of the selected start year
      : new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]; // Default: Jan 1 of the current year

    const endDate = this.endDate
      ? new Date(this.endDate.getFullYear(), 11, 31).toISOString().split('T')[0] // Dec 31 of the selected end year
      : new Date(today.getFullYear() + 1, 0, 1).toISOString().split('T')[0] // Default: Dec 31 of the current year


    const payload = {
      startDate: this.startDate?.toISOString() || startDate,
      endDate: this.endDate?.toISOString() || endDate
    };

    // const payload = {
    //   startDate,
    //   endDate,
    // };

    console.log("payload", payload);

    this.dashboardService.getTileData(payload).subscribe(
      (data) => {
        this.totalLeadsData = data.find(item => item.key === 'lead');
        this.totalOpportunitiesData = data.find(item => item.key === 'opportunity');
        this.totalQuotesData = data.find(item => item.key === 'quote');
        this.totalSalesOrdersData = data.find(item => item.key === 'salesorder');

        const TileDataArray = [
          { name: 'TOTAL LEADS DATA', value: data.find(item => item.key === 'lead').leadstotalcount },
          { name: 'TOTAL OPPORTUNITIES DATA', value: data.find(item => item.key === 'opportunity').opportunitytotalCount },
          { name: 'TOTAL QUOTES DATA', value: data.find(item => item.key === 'quote').quotetotalCount },
          { name: 'TOTAL SALES ORDERS_DATA', value: data.find(item => item.key === 'salesorder').salesOrdertotalCount }

        ];

        const labelColors = {
          'TOTAL LEADS DATA': '#ee8095', // Professional Blue
          'TOTAL OPPORTUNITIES DATA': '#faa051', // Green for Growth
          'TOTAL QUOTES DATA': '#f3674d', // Warm Yellow
          'TOTAL SALES ORDERS_DATA': '#95cf92', // Subtle Purple
        };
        this.totalTileDataArray = {
          labels: TileDataArray.map((item: any) => item.name),
          datasets: [
            {
              label: 'Summary',
              data: TileDataArray.map((item: any) => parseInt(item.value)),
              backgroundColor: TileDataArray.map((item: any) => labelColors[item.name]),
            }
          ]
        };

        // Optionally, you can further process the tileDataArray here if needed


      });
    // Assuming this.dashboardService.getDashboardData() returns an observable with the REST response
    this.dashboardService.getDashboardData(payload).subscribe(
      (data) => {

        let findData = data && data.carownertypewiseactivecar.find(ele => ele.carownertype == "SHARE");
        console.log("data.gemotorsActiveCars", data.gemotoractivecars);

        this.share = findData.carcount;

        this.responseData = {
          totalCar: data.totalCar,
          activeShowroom: data.activeShowroom,
          soldCar: data.soldCar,
          totalBrand: data.totalBrand,
          consignmentActiveCars: data.consignmentActiveCars,
          cars_70_days_passed: data.cars_70_days_passed,
          shareActiveCars: data.shareActiveCars,
          gemotoractivecars: data.gemotoractivecars,
          expiredconsignmentstillinshowroomcars: data.expiredconsignmentstillinshowroomcars,
          expiredconsignmentoutfromshowroomcars: data.expiredconsignmentoutfromshowroomcars,
          pendingcashrequestcount: data.pendingcashrequestcount,
          pendingpaymentinsalesorder: data.pendingpaymentinsalesorder,
          totalvehicleappraisal:data?.totalvehicleappraisal
        };
        const lineData = data.lineChartData;
        const labelColors = {
          "AUDI": "#e79476",            // Silver
          "BENTLEY": "#02c0f0",         // British Racing Green
          "BMW": "#257a79",             // Blue
          "BUGATTI": "#cc97cd",         // Purple
          "FERRARI": "#f28135",         // Orange-Red
          "FIAT": "#f2d378",            // Yellow
          "LAMBORGHINI": "#d13f30",     // Yellow-Green
          "LAND ROVER": "#52adcc",      // Saddle-Brown
          "MERCEDES": "#e79e73",        // Navy Blue
          "MINI": "#4b86b0",            // Hot Pink
          "PORSCHE": "#c45050",         // Maroon
          "ROLLS-ROYCE": "#98a7be",     // White
          "TOYOTA": "#80b9dd",          // Black
        };
        this.lineChartData = {
          labels: lineData.labels.map((label: string) => label + ' '), // Append current year to each label
          datasets: lineData.datasets.map((dataset: any) => {
            const color = labelColors[dataset.label];
            return {
              label: dataset.label.toUpperCase(),
              data: dataset.data,
              borderColor: color,
              pointBackgroundColor: color,
              backgroundColor: color,
              fill: false,
              tension: 0.4
            };
          })
        };
        this.pieChartData = {
          labels: data.brandWiseOpportunity.map((item: any) => item.brandname),
          datasets: [{
            label: 'Opportunities',
            data: data.brandWiseOpportunity.map((item: any) => parseInt(item.opportunitycount)),
            backgroundColor: data.brandWiseOpportunity.map((item: any) => labelColors[item.brandname])
          }]
        };

        const dealstatusColors = {
          "Abandoned": "#ee8095",       // Soft Red-Pink
          "In-Progress": "#ffde80",        // Light Yellow
          "Lost": "#ceb68a",            // Light Brown
          "Success": "#80c7ee",          // Calm Blue
          "Not Interested": "#c4c4c4"   // Neutral Gray
        };

        this.pieChartDataSalesorder = {
          labels: data.dealstatusbasedSalesorder.map((item: any) => item.dealstatusname),
          datasets: [{
            label: 'Deal Status',
            data: data.dealstatusbasedSalesorder.map((item: any) => item.carcount),
            backgroundColor: data.dealstatusbasedSalesorder.map((item: any) => dealstatusColors[item.dealstatusname])
          }]
        };
        console.log(data.dealstatusbasedSalesorder);
        console.log(this.pieChartDataSalesorder);


        this.brandWiseBarData = {
          labels: data.brandwiseactivecar.map((item: any) => item.brandname),
          datasets: [{
            label: 'Brandwise Active Car',
            data: data.brandwiseactivecar.map((item: any) => parseInt(item.carcount)),
            backgroundColor: data.brandwiseactivecar.map((item: any) => labelColors[item.brandname])
          }]
        };

        let consignmentCarCount = 0;
        for (const item of data.carownertypewiseactivecar) {
          if (item.carownertype === "CONSIGNMENT") {
            consignmentCarCount = parseInt(item.carcount);
            break;
          }
        }

        this.responseData = {
          ...this.responseData, // Keep previous values
          consignmentCarCount: consignmentCarCount
        };

        let allCountsZero = true;

        for (const item of data.carownertypewiseactivecar) {
          if (parseInt(item.carcount) !== 0) {
            allCountsZero = false;
            break;
          }
        }

        if (allCountsZero) {
          // Display "No data available" message
          this.showNoDataMessage = true;
        } else {
          const carOwnerTypeColors = {
            "CONSIGNMENT": "#ee8095", // Orange
            "SHARE": "#ffde80",       // Blue
            "GEMOTORS": "#ceb68a"     // Green
          };
          this.doughnutChartData = {
            labels: data.carownertypewiseactivecar.map((item: any) => item.carownertype),
            datasets: [
              {
                data: data.carownertypewiseactivecar.map((item: any) => parseInt(item.carcount)),
                backgroundColor: data.carownertypewiseactivecar.map(item => carOwnerTypeColors[item.carownertype])
              }
            ]
          };


          const dealstatusColors = {
            "Abandoned": "#ee8095",       // Soft Red-Pink
            "In-Progress": "#ffde80",        // Light Yellow
            "Lost": "#ceb68a",            // Light Brown
            "Success": "#80c7ee",          // Calm Blue
            "Not Interested": "#c4c4c4"   // Neutral Gray
          };


          this.doughnutChartDataSalesorder = {
            labels: data.dealstatusbasedSalesorder.map((item: any) => item.dealstatusname),
            datasets: [
              {
                data: data.dealstatusbasedSalesorder.map((item: any) => parseInt(item.carcount)),
                backgroundColor: data.dealstatusbasedSalesorder.map(item => dealstatusColors[item.dealstatusname])
              }
            ]
          };
        }
        const uniqueBrands = [...new Set(data.bodytypebrandwiseactivecar.map((entry: any) => entry.brandname))];
        const uniqueBodyTypes = [...new Set(data.bodytypebrandwiseactivecar.map((entry: any) => entry.bodytype))];

        // Initialize datasets array
        const datasets: {
          label: any;
          data: number[];
          backgroundColor: string;
        }[] = [];
        const bodyTypeColors = {
          "Hatchback": "#ee8095",      // Silver
          "SUV": "#faa051",            // Dark Gray
          "Coupe": "#51c8ed",          // Red
          "Sedan": "#95cf92",          // Silver
          "Convertible": "#5281c1",    // Gold
          "Sports": "#ceb68a"          // Green
        };
        // Iterate over each unique body type to create datasets
        uniqueBodyTypes.forEach(bodyType => {
          const dataPoints: any = [];
          uniqueBrands.forEach((brand: any) => {
            const carData = data.bodytypebrandwiseactivecar.find((entry: any) => entry.brandname === brand && entry.bodytype === bodyType);
            dataPoints.push(carData ? parseInt(carData.carcount) : 0);
          });


          datasets.push({
            label: bodyType,
            data: dataPoints,
            backgroundColor: bodyTypeColors[bodyType as keyof typeof bodyTypeColors], // Use type assertion to indicate that bodyType is a valid key of bodyTypeColors
          });
        });

        // Construct the final data object
        this.bodyTypeBarChartdata = {
          labels: uniqueBrands,
          datasets: datasets
        };

        const uniqueNewBrands = [...new Set(data.regionalspecandbrandwisesoldcar.map((entry: any) => entry.brandname))];
        const uniqueSpecs = [...new Set(data.regionalspecandbrandwisesoldcar.map((entry: any) => entry.specs))];

        // Initialize datasets array
        const soldCarDatasets: {
          label: any;
          data: number[];
          backgroundColor: string;
        }[] = [];
        const specColors = {
          "American Specs": "#ee8095",                      // Blue
          "European Specs": "#faa051",                      // Green
          "Gcc Specs": "#51c8ed", // Coral
          "Canadian Specs": "#8bcfb6 ",                      // Yellow
          "Japanese Specs": "#5281c1",                      // Orange
          "German Spec": "#ceb68a"                         // Light Blue
        };


        // Iterate over each unique spec to create datasets
        uniqueSpecs.forEach(spec => {
          const dataPoints: any = [];
          uniqueNewBrands.forEach((brand: any) => {
            const carData = data.regionalspecandbrandwisesoldcar.find((entry: any) => entry.brandname === brand && entry.specs === spec);
            dataPoints.push(carData ? parseInt(carData.carcount) : 0);
          });

          // Generate random background color

          soldCarDatasets.push({
            label: spec,
            data: dataPoints,
            backgroundColor: specColors[spec as keyof typeof soldCarDatasets],
          });
        });

        // Construct the final data object
        this.regionalspecandbrandwisesoldcarChartData = {
          labels: uniqueNewBrands,
          datasets: soldCarDatasets
        };


        const funnelColors = {
          'CAR SALES NEGOTIATING OR DISCUSSION': '#e79476', // Professional Blue
          'A CAR SELLING TEST DRIVE': '#02c0f0', // Green for Test Drive
          'POST-TEST DRIVE DISCOVERY': '#257a79', // Discovery after Test Drive
          'CLOSED LOST': '#cc97cd', // Subtle Purple for Closed Lost
          'CLOSED WON': '#f28135', // Successful Green for Closed Won
          'DISCOVERY AND DETERMINE NEEDS': '#f2d378', // Sky Blue for Discovery
          'ENQUIRY': '#d13f30', // Turquoise for Enquiry
          'CAR SALES WALK-AROUND': '#52adcc', // Bright Orange for Walk-Around
          'CAR SALES MEET AND GREET': '#e79e73', // Dark Orange for Meet and Greet
          'CLOSING THE CAR SALE – MAKE A DEAL': '#4b86b0', // Rich Purple for Deal Closing
          'FOLLOW-UP': '#c45050', // Fresh Green for Follow-Up
        };
        const funnelChartData = data.stagewisefunelreport.filter(item => item.value !== "0");
        const legendData = funnelChartData.map(item => item.name);

        // Define legend data based on the extracted names
        const legend = {
          data: legendData
        };
        const option = {

          tooltip: {
            trigger: 'item',
          },

          legend: legend,
          series: [
            {
              type: 'funnel',
              top: 60,
              right: 200,

              minSize: '0%',
              maxSize: '100%',
              sort: 'descending',
              gap: 2,
              label: {
                show: false,
                position: 'outside'
              },

              data: funnelChartData.map((item: any) => ({
                value: item.value,
                name: item.name,
                itemStyle: {
                  color: funnelColors[item.name]  // Set random color for each data item
                }
              }))
            }
          ]
        };

        if (this.funnelChart) {
          // Set options for funnelChart
          this.funnelChart.setOption(option);

          // Set options for totalFunnelChart
        } else {
          console.error("Charts are not properly initialized.");
        }


        // Example monthly data
        const monthlyData = data.monthlyCarCountData

        // Prepare the data for the bar chart
        this.monthWiseCarCountChartData = {
          labels: monthlyData.map(data => data.month),
          datasets: [
            {
              label: 'Car Count',
              data: monthlyData.map(data => data.carCount),
              backgroundColor: '#42A5F5' // Adjust the color as needed
            }
          ]
        };

        // Set chart options
        this.monthWiseCarCountChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              type: 'category',
              labels: monthlyData.map(data => data.month)
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Monthly Car Count'
          }
        };


      },
      (error) => {
        console.error('Error fetching dashboard data: ', error);
      }
    );

  }



  generateRandomColor(): string {
    const colors = ['#22202082', '#fa5738', '#f4d35f', '#b6d2e3'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
  generateNewRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  getRandomColor(baseColor: any, maxDifference: any) {
    const baseRed = parseInt(baseColor.slice(1, 3), 16);
    const baseGreen = parseInt(baseColor.slice(3, 5), 16);
    const baseBlue = parseInt(baseColor.slice(5, 7), 16);

    const randomChannelValue = (baseValue: any, maxDifference: any) => {
      const minValue = Math.max(0, baseValue - maxDifference);
      const maxValue = Math.min(255, baseValue + maxDifference);
      return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    };

    const randomRed = randomChannelValue(baseRed, maxDifference);
    const randomGreen = randomChannelValue(baseGreen, maxDifference);
    const randomBlue = randomChannelValue(baseBlue, maxDifference);

    const randomColor = `#${randomRed.toString(16).padStart(2, '0')}${randomGreen.toString(16).padStart(2, '0')}${randomBlue.toString(16).padStart(2, '0')}`;
    return randomColor;
  };



  viewAll(link, reportname: string) {
    localStorage.setItem('reportHeader', reportname);
    this.router.navigate([link]);
  }

  // carsDaysPassed() {
  //   var navigationExtras = {
  //     queryParams: {
  //       dayspassedcar: true
  //     },
  //   };
  //   localStorage.setItem('reportHeader', 'ACTIVE CAR SALES REPORT' );
  //   this.router.navigate(['/report/ActiveCarsDetailsReport'], navigationExtras);
  // }

  // activeCars(){
  //   localStorage.setItem('reportHeader', 'ACTIVE CAR SALES REPORT' );
  //   this.router.navigate(['/report/ActiveCarsDetailsReport'], );
  // }

  // soldCars(){
  //   localStorage.setItem('reportHeader', 'SOLD CAR SALES REPORT' );
  //   this.router.navigate(['/report/SoldCarSalesReport'], );
  // }

  // carownertypeCar(type) {
  //   var navigationExtras = {
  //     queryParams: {
  //       carownertype:type 
  //     },
  //   };

  //   if(type=="SHARE"){
  //     localStorage.setItem('reportHeader', 'SHARED CAR SALES REPORT' );
  //     this.router.navigate(['/report/Sharedcarsalesreport'], navigationExtras);
  //   }else{
  //     localStorage.setItem('reportHeader', 'ACTIVE CAR SALES REPORT' );
  //   this.router.navigate(['/report/ActiveCarsDetailsReport'], navigationExtras); 
  //   }

  // }



  carsDaysPassed() {
    let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['ACTIVE CAR SALES REPORT']);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|carsDaysPassed()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }
    var navigationExtras = {
      queryParams: {
        dayspassedcar: true
      },
    };
    localStorage.setItem('reportHeader', 'ACTIVE CAR SALES REPORT');
    this.router.navigate(['/report/ActiveCarsDetailsReport'], navigationExtras);
  }

  getPendingCashRequest() {
    let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['CASH REQUEST REPORT']);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|getPendingCashRequest()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }

    localStorage.setItem('reportHeader', 'CASH REQUEST');
    this.router.navigate(['/report/cashrequest']);
  }

  getPendingPaymentSalesorder() {
    let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['SALES ORDER REPORT']);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|getPendingPaymentSalesorder()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }

    localStorage.setItem('reportHeader', 'SALES ORDER');
    this.router.navigate(['/report/SalesOrderReport']);
  }

  getExpiredConsignmentsOutShowroom() {
    let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['CONSIGNMENT REPORT']);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|getExpiredConsignmentsOutShowroom()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }
    var navigationExtras = {
      queryParams: {
        dayspassedcar: true
      },
    };
    localStorage.setItem('reportHeader', 'CONSIGNMENT REPORT - OUT FROM SHOWROOM');
    this.router.navigate(['/report/Consignmentreport'], navigationExtras);
  }

  getExpiredConsignmentsInShowroom() {
    let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['CONSIGNMENT REPORT']);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|getExpiredConsignmentsInShowroom()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }
    var navigationExtras = {
      queryParams: {
        dayspassedcar: true
      },
    };
    localStorage.setItem('reportHeader', 'CONSIGNMENT REPORT - IN SHOWROOM');
    this.router.navigate(['/report/Consignmentreport'], navigationExtras);
  }

  activeCars() {
    let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['ACTIVE CAR SALES REPORT']);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|activeCars()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }

    localStorage.setItem('reportHeader', 'ACTIVE CAR SALES REPORT');
    this.router.navigate(['/report/ActiveCarsDetailsReport']);
  }


  carownertypeCar(type) {

    var navigationExtras = {
      queryParams: {
        carownertype: type
      },
    };

    if (type == "SHARE") {

      let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['SHARED CAR SALES REPORT']);
      console.log("access", access);

      if (!access?.viewaccess) {
        this.errorlogService.logManualValidationError(`db-showroom-manager component|carownertypeCar()|Permission denied`);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: "Permission denied",
          icon: 'info',
        });
        return;
      }

      localStorage.setItem('reportHeader', 'SHARED CAR SALES REPORT');
      this.router.navigate(['/report/Sharedcarsalesreport'], navigationExtras);
    } else {
      let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['ACTIVE CAR SALES REPORT']);
      console.log("access", access);
      this.errorlogService.logManualValidationError(`db-showroom-manager component|carownertypeCar() 2|Permission denied`);
      if (!access?.viewaccess) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: "Permission denied",
          icon: 'info',
        });
        return;
      }

      localStorage.setItem('reportHeader', 'ACTIVE CAR SALES REPORT');
      this.router.navigate(['/report/ActiveCarsDetailsReport'], navigationExtras);
    }

  }


  soldCars() {
    let access = this.userPrivilegeList.find(ele => ele.module_id == ModuleIdList['SOLD CAR SALES REPORT']);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|soldCars()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }

    localStorage.setItem('reportHeader', 'SOLD CAR SALES REPORT');
    this.router.navigate(['/report/SoldCarSalesReport'],);
  }

  vehicleappraisal(){debugger
     let access = this.userPrivilegeModuleList && this.userPrivilegeModuleList.find(ele => ele.module_id == ModuleIdList.VehicleAppraisal);
    console.log("access", access);

    if (!access?.viewaccess) {
      this.errorlogService.logManualValidationError(`db-showroom-manager component|soldCars()|Permission denied`);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: "Permission denied",
        icon: 'info',
      });
      return;
    }
    this.router.navigate(['/vehicle-appraisal'],);
  }


}






