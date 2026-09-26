import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getSetting(userrole:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/settingsAll",{userrole},{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  
  createSetting(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/settings", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateSetting(params: any,appsettingid:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/settings/" + appsettingid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}