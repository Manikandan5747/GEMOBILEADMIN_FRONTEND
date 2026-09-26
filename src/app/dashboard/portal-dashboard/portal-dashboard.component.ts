import { Component, AfterViewInit, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { CarDetailsService } from 'src/app/service/car-details/car-details.service';
import { CookieService } from 'src/app/service/cookie.service';

@Component({
  selector: 'app-portal-dashboard',
  templateUrl: './portal-dashboard.component.html',
  styleUrls: ['./portal-dashboard.component.css']
})
export class PortalDashboardComponent implements OnInit {
  loading: boolean = false;
  error: any;
  

  CarCountList: any;
  viewBarChart: boolean = true;
  viewPieChart: boolean = false;
  viewgGuge: boolean = false;
  color: any;




  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  label = "Report"
  showDataLabel: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  barPadding: number = 45;
  colorScheme: any;
  currentUser:any;
  login_id: any;
  constructor(public toastr: ToastrService, private router: Router,private cookieService:CookieService,
    private carDetailsService: CarDetailsService) { }

  ngAfterViewInit() {
    this.toastr.clear();
  }

  async ngOnInit() {
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
    this.login_id = obj[0]?.login_id;
    this.colorScheme = { domain: ['#22202082', '#fa5738', '#f4d35f', '#edf4f8'] };
    this.loading = true;
    forkJoin(
      { getCarCount: await this.carDetailsService.getCarCount(this.login_id ) }).subscribe(async ({
        getCarCount
      }) => {
        this.CarCountList = getCarCount.data;
        console.log("CarCountList", this.CarCountList);
      });
    this.loading = false;
  }


  onHeaderSelectCar(name: any) {
    debugger
    var navigationExtras = {
      queryParams: { homePageRedirection: name.label ? name.label : name },
    };
    this.router.navigate(['/car-details'], navigationExtras);
  }


  clear() {
    this.toastr.clear();
  }

  pieChart() {
    this.viewBarChart = false;
    this.viewPieChart = true;
    this.viewgGuge = false;
  }

  barChart() {
    this.viewBarChart = true;
    this.viewPieChart = false;
    this.viewgGuge = false;
  }

  gauge() {
    this.viewBarChart = false;
    this.viewPieChart = false;
    this.viewgGuge = true;
  }

}
