import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class NewSpecialOfferService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }
 //companyList
getCompanyList() {
  return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getCompanyList",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

    getAllspecialoffer() {
      let headers = new HttpHeaders({
        'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
      });
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listspecialoffer", { headers: headers })
          .pipe(map(response => {
            return response;
          }));
      }
  

    createRecords(formData:any){
      return this.http.post(CommonConstants.WEBAPI_URL+"/api/createspecialoffer",formData);
    }  
  

    updateRecords(formData:any,specialofferid:any){
      return this.http.post(CommonConstants.WEBAPI_URL+"/api/updatespecialoffer/"+specialofferid,formData);
    }  


}


