import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class CarownerTypeService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getCarownertype() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/carownertype", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createCarownertype(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/carownertype", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateCarownertype(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/carownertype/" + params.carownertypeid, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}