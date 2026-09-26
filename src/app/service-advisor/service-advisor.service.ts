import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ServiceAdvisorService {
  constructor(private http: HttpClient) { }
  
  getServiceadvisorlist() {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listallemployees", { headers: headers })
        .pipe(map(response => {
          return response;
        }));
    }

    getServiceadvisorlistbyreceptionist() {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listofserviceadvisornew", { headers: headers })
        .pipe(map(response => {
          return response;
        }));
    }



  createRecords(formData:any){
    return this.http.post(CommonConstants.WEBAPI_URL+"/api/createspecialoffer",formData);
  }  


  syncServiceAdvisor(obj:any){
    return this.http.post(CommonConstants.WEBAPI_URL+"/api/createserviceadvisor",obj);
  
  }  

  crmserviceaccesstoken(obj:any){
    return this.http.post(CommonConstants.WEBAPI_URL+"/api/crmserviceaccesstoken",obj);
  
  } 
  
  crmserviceaccesstokenInactive(obj:any){
    return this.http.post(CommonConstants.WEBAPI_URL+"/api/crmserviceaccesstokenInactive/1",obj);
  }


  getNewAccessToken() {
    const body = {
      "username": "geappadmin.a",
      "password": "admin123"
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(CommonConstants.WEBAPI_URL+'/api/crmservicegeneralcrmapiaccesstoken', body, { headers });
  }


  getAccessToken(){
    return this.http.get(CommonConstants.WEBAPI_URL+"/api/crmservicegetaccesstokenByStatus/Active/1");  
  }  

  updateRecords(formData:any,appservice_id:any){
    return this.http.post(CommonConstants.WEBAPI_URL+"/api/updateofserviceadvisor/"+appservice_id,formData);
  }  


  createAnnualLeave(params:any){
    
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/updateannualleave/"+ params.appservice_id
      ,params)
    .pipe(map(response => {
      return response;
    }));
  }  


}


