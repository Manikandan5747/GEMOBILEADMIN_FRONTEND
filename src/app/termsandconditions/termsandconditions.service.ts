import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';
@Injectable({
  providedIn: 'root'
})
export class TermsandconditionsService {

  constructor(private http: HttpClient,) { }
   headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });

  
  getTermsandConditions() {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/viewtermsandconditions",{ headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getContractType() {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listcontracttype",{ headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  createTermsandConditions(items: any) {
    let headers = new HttpHeaders({
       'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
     });
   
     return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createtermsandconditions",items,{ headers: headers })
       .pipe(map(response => {
         return response;
       }));
   }

   updateTermsandConditions(items: any,id:any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/updatetermsandconditions/"+id,items,{ headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateStatusChangeById(items: any) {
    let headers = new HttpHeaders({
       'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
     });
   
     return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/updateStatusChangeById",items,{ headers: headers })
       .pipe(map(response => {
         return response;
       }));
   }

}
