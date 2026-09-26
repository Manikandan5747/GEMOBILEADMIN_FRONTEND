import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  findtheleadtype(accountname:string){
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/findtheleadtype/"+accountname,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getaccountwithpagination(obj) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/accountwithpagination",obj, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  get() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/account",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByID(accountid) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/account/"+accountid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  create(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/account", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  update(params: any,accountid: string) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/account/" + accountid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  accountnameuniquevalidation(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/accountnameuniquevalidation", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

   checkAccountAvailability(accountid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkAccountAvailability/" + accountid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteAccountById(accountid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/account/" + accountid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



    getUserOnlineStatus(obj) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/useronlinestatusdetailswithpagination",obj, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

 

}