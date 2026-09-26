import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';


@Injectable({
  providedIn: 'root'
})
export class WebversionService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });

  constructor(private http:HttpClient) { }

  getwebversionList() {
    // let params = new HttpParams();
    // params = params.append("user_id", user_id);
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getwebversion",{ headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }

    createWebversion(params:any){
      return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createwebversion",params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
    }  

    getLastRow() {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getlastrow/Mobile Admin",{ headers: this.headers })
          .pipe(map(response => {
            return response;
          }));
      }
        
}
