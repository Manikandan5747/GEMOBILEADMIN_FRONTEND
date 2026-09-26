import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class RentShowroomCarService {

  currentUser: any;
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getCarDetails() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/rentcardetails", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  //issolddate3days
  issolddate3days() {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/isSolddateactive", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createCarDetails(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/rentcardetails", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getCarDetailsByID(rentcarshowroom_id: any) {
    const id = rentcarshowroom_id ? parseInt(rentcarshowroom_id) : null;
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/rentcardetails/" + id, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  updateCarDetails(params: any, carshowroom_id: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/rentCardetailsUpdate/" + carshowroom_id, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getShowroomCarDetails() {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
      'type':'1'
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/showroomcar",{ headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  //Showroom Car Contact Details

  updateShowroomCarDetails(params: any, carshowroom_id: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/showroomcar/" + carshowroom_id, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



  createShowroomCarDetails(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/showroomcar", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  // getShowroomCarDetails() {
  //   return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/showroomcar", { headers: this.headers })
  //     .pipe(map(response => {
  //       return response;
  //     }));
  // }

  getnextRefno() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getnextRefno", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



  //RefNo
  getfindnextRefno() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/rentacargetfindnextRefno", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getfindnextshowroomRefno() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getfindnextshowroomRefno", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getCarShowroomDetailsByID(carshowroom_id: any) {
    const id = carshowroom_id ? parseInt(carshowroom_id) : null;
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/showroomcar/" + id, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  //CarShowroom Contact Details
  getList(showroomddetid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/showroomcontactdet/" + showroomddetid)
      .pipe(map(response => {
        return response;
      }));
  }

  create(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/showroomcontactdet", params)
      .pipe(map(response => {
        return response;
      }));
  }

  update(params: any, showroomdcon_id: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/showroomcontactdet/" + showroomdcon_id, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  // isAlreadyMapped
  isAlreadyMapped(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/isAlreadyMapped", { params })
      .pipe(map(response => {
        return response;
      }));
  }

  getCarCount(login_id:any){
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/dashboardCount", {login_id},{ headers: this.headers })
    .pipe(map(response => {
      return response;
    }));
  }

  getshowroomCount(login_id:any){
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/showroomdashboardCount", {login_id},{ headers: this.headers })
    .pipe(map(response => {
      return response;
    }));
  }

   // isAlreadyMappedInUserTable
   isAlreadyMappedInUserTable(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/isAlreadyMappedInUserTable",params)
      .pipe(map(response => {
        return response;
      }));
  }
}