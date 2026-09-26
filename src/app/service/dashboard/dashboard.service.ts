import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  private baseUrl = CommonConstants.WEBAPI_URL+'/api/ge_motors/';

  constructor(private http: HttpClient) { }



  getDashboardData(payload: any): Observable<any> {


    return this.http.post<any>(this.baseUrl + 'newdashboardcount', payload, { headers: this.headers });
  }
  getTileData(payload: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'tilescount', { headers: this.headers });

  }

  getsoldcarsalesreporttopfive() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/soldcarsalesreporttopfive",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}