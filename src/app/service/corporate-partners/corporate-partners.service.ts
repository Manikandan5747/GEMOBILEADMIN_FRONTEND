import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';


@Injectable({
  providedIn: 'root'
})
export class CorporatePartnersService {
 
  constructor(private http: HttpClient) { }

  getCorporatepartners() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/corporatepartners",)
        .pipe(map(response => {
          return response;
        }));
    }


    corporatepartnersmax() {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/corporatepartnersmax",)
          .pipe(map(response => {
            return response;
          }));
      }

    getAllCorporatespecialoffer(partnerid:any) {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/corporatespecialofferid/"+partnerid+"",)
          .pipe(map(response => {
            return response;
          }));
      }
  

    createRecords(formData:any){
      return this.http.post(CommonConstants.WEBAPI_URL+"/api/corporatepartners",formData);
    }  
  

    deleteRecord(reg_id:string){
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/corporatepartners-img/"+reg_id)
      .pipe(map(response => {
        return response;
      }));
    }

    updateRecords(formData:any,partnerid:any){
      return this.http.post(CommonConstants.WEBAPI_URL+"/api/corporatepartners/"+partnerid,formData);
    }  

    ///

    createCorporatespecialoffer(formData:any){
      return this.http.post(CommonConstants.WEBAPI_URL+"/api/corporatespecialoffer",formData);
    } 

    updateCorporatespecialoffer(params: any) {
      return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/corporatespecialoffer/" + params.corporatespecialofferid, params,)
        .pipe(map(response => {
          return response;
        }));
    }

    corporatespecialofferdel(reg_id:string){
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/corporatespecialofferdel/"+reg_id)
      .pipe(map(response => {
        return response;
      }));
    }


    //specialofferregistration
    specialofferregistration() {

      let headers = new HttpHeaders({
        'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
      });
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/specialofferregistration",{ headers: headers })
          .pipe(map(response => {
            return response;
          }));
      }
}


