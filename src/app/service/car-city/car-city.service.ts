import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class CarCityService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getlistallnationality(){
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/getlistallnationality",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  
getlistbank(){
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/getlistbank",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  
  getCarCity() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/carcity",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createCarCity(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/carcity", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateCarCity(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/carcity/" + params.carcityid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  
  getCountry() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/country",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getStateCity(filterValue:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/state/"+filterValue,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getCity(filterValue:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/city/"+filterValue,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}