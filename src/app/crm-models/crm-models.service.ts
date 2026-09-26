import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class CrmModelsService {

  constructor(private http: HttpClient) { }
  
 getcrmmodellist() {
  const params = new HttpParams().set(
    'apikey',
    'a4db08b7-5729-4ba9-8c08-f2df493465a1'
  );

  return this.http.get<any>(
    CommonConstants.WEBAPI_URL + '/api/crmmodel',
    { params }
  ).pipe(
    map(response => response)
  );
}
    




syncCrmModel(token: any, obj?: any) {
  let headers = new HttpHeaders({
    'access_token': token,
  });
  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + "/api/crmmodel/sync",
    obj || {},
    { headers: headers }
  );
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


updateCrmModel(id: any, formData: any) {
    const headers = new HttpHeaders().set(
    'apikey',
    'a4db08b7-5729-4ba9-8c08-f2df493465a1'
  );

  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + "/api/crmmodelupdate/" + id,
    formData,
    { headers }
  );
}


deleteCrmModelImage(id: any) {
  return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/crmmodel/delete/" + id, {});
}





}


