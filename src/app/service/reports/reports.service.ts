import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });

  
  private baseUrl = CommonConstants.WEBAPI_URL+'/api/ge_motors/';
 private baseUrl1 = CommonConstants.WEBAPI_URL+'/api/';
  constructor(private http: HttpClient) { }

  getAppVersion(payload:any) {
    console.log(payload)
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/appversion", { headers: this.headers ,params:payload} )
      .pipe(map(response => {
        return response;
      }));
  }


  getOptionsAutoComplete(tableName: string, fieldName: string): Observable<string[]> {
    return this.http.get<string[]>(`${CommonConstants.WEBAPI_URL}/api/ge_motors/uniqueValues/${tableName}/${fieldName}`, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  

   getReportData(payload: any, reportEndPoint: string): Observable<any> {
    
    if(reportEndPoint == "lucky_draw/inventoryreport" || reportEndPoint == "lucky_draw/KeyManagementReport"){
      if (payload.comparisonOperator === 'ILIKE') {
        payload.filterCriteria = `%${payload.filterCriteria}%`;
      }
        return this.http.post<any>(this.baseUrl1 + reportEndPoint, payload , { headers: this.headers});
    }
    if (payload.comparisonOperator === 'ILIKE') {
      payload.filterCriteria = `%${payload.filterCriteria}%`;
    }
      return this.http.post<any>(this.baseUrl + reportEndPoint, payload , { headers: this.headers});
  }

  getAppVersion1() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/appversion", { headers: this.headers} )
      .pipe(map(response => {
        return response;
      }));
  }




}
