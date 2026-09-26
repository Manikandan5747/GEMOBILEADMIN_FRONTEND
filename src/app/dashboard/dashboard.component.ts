import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CustomerService } from '../service/customer/customer.service';
import { SpecialOfferService } from '../service/special-offer/special-offer.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { CarDetailsService } from '../service/car-details/car-details.service';
import { CookieService } from '../service/cookie.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	loading: boolean = false;
	customerListCount: number = 0;
	pendingCount = 0;
	registrationCount = 0;
	specialOfferListCount = 0;
	data: any;
	lastApproval: any;
	colorScheme: any;
	registrationOnHoldCount: number = 0;
	CarCountList: any;
	viewBarChart: boolean = true;
	viewPieChart: boolean = false;
	viewgGuge: boolean = false;
	color: any;

	corporatePendingCount: any = 0;
	corporateCancelCount: any = 0;
	corporateOnholdCount: any = 0;


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
	barPadding: number = 50;

	allCount: any;
	secondCarCountList: any = [];
	user_type_name: any;
	requestList: any;
	ticInfoChart: any = [];
	currentUser: any;
	login_id: any;
	corporateUsercount: number = 0;
	individualUsercount: number = 0;
	// corporateApprovedCount: any = 0;
	// individualApprovedCount: any = 0;
	corporatedata: any;
	dashboardRequestStatusCount: any = {};

	constructor(public toastr: ToastrService, private cookieService: CookieService, private router: Router, private customerService: CustomerService,
		private carDetailsService: CarDetailsService,) {

		this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
		var dashboardurl = this.currentUser ? JSON.parse(this.currentUser)[0]?.dashboardurl : "";
		if (dashboardurl) {
			this.router.navigate([dashboardurl]);
		} else {
			//  this.router.navigate(['/dashboard']);
		}
	}

	showInfo(element: any) {
		debugger;
		var msg = "Pending Registration Available .Please Approve";
		this.toastr.info(msg, element.customername, {
			timeOut: 0,
			extendedTimeOut: 0
		});
	}

	ngAfterViewInit() {
		// this.pendingDetails = [];
		this.toastr.clear();
	}

	async ngOnInit() {
		debugger;
		this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
		const obj = this.currentUser ? JSON.parse(this.currentUser) : "";
		this.login_id = obj[0]?.login_id;
		this.loading = true;
		forkJoin(
			{
				getCustomer: await this.customerService.getCustomer(),
				getCarCount: await this.carDetailsService.getCarCount(null),
				getshowroomCount: await this.carDetailsService.getshowroomCount(this.login_id),
				dashboardrequeststatuscount: await this.carDetailsService.dashboardrequeststatuscount(),

			}).subscribe(async ({
				getCustomer,
				getCarCount,
				getshowroomCount, dashboardrequeststatuscount
			}) => {
				this.secondCarCountList = getshowroomCount.data.obj2;
				this.CarCountList = getCarCount.data;
				console.log("dashboardrequeststatuscount", dashboardrequeststatuscount)
				this.customerListCount = getCustomer.length;

				this.corporateUsercount = 0;
				this.individualUsercount = 0;

				this.corporatePendingCount = 0;
				this.corporateCancelCount = 0;
				this.corporateOnholdCount = 0;


				this.dashboardRequestStatusCount = dashboardrequeststatuscount.data;
				getCustomer && getCustomer.forEach((element: any) => {
					//INDIVIDUAL
					if (element.customerstatus == 'Pending' && element.customertypes == "INDIVIDUAL") {
						this.pendingCount = this.pendingCount + 1;
					}

					if (element.customerstatus == 'Cancel' && element.customertypes == "INDIVIDUAL") {
						this.registrationCount = this.registrationCount + 1;
					}
					if (element.customerstatus == 'OnHold' && element.customertypes == "INDIVIDUAL") {
						this.registrationOnHoldCount = this.registrationOnHoldCount + 1;
					}

					//CORPORATE
					if (element.customerstatus == 'Pending' && element.customertypes == "CORPORATE") {
						this.corporatePendingCount = this.corporatePendingCount + 1;
					}

					if (element.customerstatus == 'Cancel' && element.customertypes == "CORPORATE") {
						this.corporateCancelCount = this.corporateCancelCount + 1;
					}
					if (element.customerstatus == 'OnHold' && element.customertypes == "CORPORATE") {
						this.corporateOnholdCount = this.corporateOnholdCount + 1;
					}

					if (element.customertypes == "CORPORATE") {
						this.corporateUsercount = this.corporateUsercount + 1;
					}

					if (element.customertypes == "INDIVIDUAL") {
						this.individualUsercount = this.individualUsercount + 1;
					}
				});


				//this.specialOfferListCount = getSpecialoffer.length;
				this.data = [
					{ name: 'Registration', value: this.customerListCount },
					{ name: 'Pending', value: this.pendingCount },
					//{ name: 'Approved', value: this.individualApprovedCount },		
					{ name: 'Cancel', value: this.registrationCount },
					{ name: 'OnHold', value: this.registrationOnHoldCount },
				];

				this.corporatedata = [
					{ name: 'Registration', value: this.corporateUsercount },
					{ name: 'Pending', value: this.corporatePendingCount },
					//{ name: 'Approved', value: this.corporateApprovedCount },
					{ name: 'Cancel', value: this.corporateCancelCount },
					{ name: 'OnHold', value: this.corporateOnholdCount },
				];

				this.colorScheme = { domain: ['#22202082', '#fa5738', '#f4d35f', '#edf4f8', '#198754'] };
				// ✅ Get Max date
				const maxDate = new Date(
					Math.max(
						...getCustomer.map((element: any) => {
							return new Date(element.modified_at);
						}),
					),
				);
				//	var max = maxDate;
				this.lastApproval = getCustomer.find((o: any) => new Date(o.modified_at).getTime() == maxDate.getTime());

			});

		this.loading = false;
	}




	onPieSliceSelect(event: any) {
		debugger
		//    console.log("event",event.name);
		if (event.name == "Registration" || event.name == "Pending Status" || event.name == "Registration Cancel" || event.name == "Registration OnHold") {
			let name = ""
			if (event.name == "Pending Status") {
				name = "Pending";
			} else if (event.name == "Registration Cancel") {
				name = "Cancel";
			} else if (event.name == "Registration") {
				name = "Registration";
			} else if (event.name == "Registration OnHold") {
				name = "OnHold";
			}
			var navigationExtras = {
				queryParams: { homePageRedirection: name },
			};
			this.router.navigate(['/customer'], navigationExtras);
		} else {

			this.router.navigate(['/special-offer']);
		}
	}

	onHeaderSelect(name: any, customertypes: string) {
		var navigationExtras = {
			queryParams: { homePageRedirection: name, customertypes: customertypes },
		};
		// if (name == "Registration" || name == "Pending" || name == "Cancel" || name == "OnHold") {
		this.router.navigate(['/customer'], navigationExtras);
		// } else {
		//this.router.navigate(['/special-offer'], navigationExtras);
		// }
	}


	onHeaderSelectCar(name: any) {
		debugger
		var navigationExtras = {
			queryParams: { homePageRedirection: name.label ? name.label : name },
		};
		this.router.navigate(['/car-details'], navigationExtras);
	}

	onHeaderSelectShowroom() {
		this.router.navigate(['/showroom-contact-details']);
	}

	onHeaderSelectPortal(ele: string) {
		var navigationExtras = {
			queryParams: { homePageRedirection: ele },
		};
		this.router.navigate(['/portal-user'], navigationExtras);
	}


	clear() {
		this.toastr.clear();
	}

	issolddate3days() {
		this.carDetailsService.issolddate3days().pipe()
			.subscribe((data: any) => {
				var inActiveCount = data && data.data.length;
				Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: inActiveCount + " Cars - InActive", icon: 'success', });
			});
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

	redirectToDashboard() {
		this.router.navigate(['dashboard/gemotor']);
	}

	onHeaderSelectRequest(status: string) {
		var navigationExtras = {
			queryParams: { request_status:status },
		};
		this.router.navigate(['/car-details/request-inspection-report'], navigationExtras);
	}

}
