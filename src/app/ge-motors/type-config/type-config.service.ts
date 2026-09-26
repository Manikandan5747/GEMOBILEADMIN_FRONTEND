import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class TypeConfigService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  gettypeConfig() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/typeConfig",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createtypeConfig(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/typeConfig", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updatetypeConfig(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/typeConfig/" + params.typeid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



  ////ACCOUNT

  getAccounttypeConfig() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/accounttype",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  /////opportunity
  getopportunitytypeConfig() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/opportunitytypeConfig",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}