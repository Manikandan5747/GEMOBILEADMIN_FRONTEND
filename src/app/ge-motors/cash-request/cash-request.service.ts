import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class CashRequestService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getCashRequest() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/cashrequest",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createCashRequest(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/cashrequest", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateCashRequest(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/cashrequest/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdCashRequest(leadsid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/cashrequest/"+leadsid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


    deleteCashRequestrecords(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteCashReqById/" + params.cashrequestid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}
