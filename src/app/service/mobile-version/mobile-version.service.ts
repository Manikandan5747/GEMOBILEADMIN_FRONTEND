import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class MobileVersionService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getAppVersion() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/appversion",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createAppVersion(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/appversion", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateAppVersion(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/appversion/" + params.appid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  deleteAppCategory(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteappversionbyid/" + params.appid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getInternalAppVersion() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listallinternalappversion",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createInternalAppVersion(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createinternalappversion", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  updateInternalAppVersion(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/updateinternalappversionbyid/" + params.appid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}