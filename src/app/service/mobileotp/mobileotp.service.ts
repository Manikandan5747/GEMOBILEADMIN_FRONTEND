import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class MobileotpService {

  constructor(private http: HttpClient) { }
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  getmobileotp() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/mobileotp",)
      .pipe(map(response => {
        return response; ''
      }));
  }

  getMobileotpWithPagination(obj: any) {
     let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    let params = new HttpParams()
      .set('search', obj.search || '')
      .set('page', (obj.page || 1).toString())
      .set('limit', (obj.limit || 10).toString())
      .set('sortBy', obj.sortBy || 'created_at')   // default column
      .set('sortOrder', obj.sortOrder || 'desc');  // default order


    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/mobileotpwithpagination", { params,headers })
      .pipe(map(response => {
        return response;
      }));
  }



  getRating() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listrating", { headers: this.headers })
      .pipe(map(response => {
        return response; ''
      }));
  }


  getShortURL() {//CommonConstants.WEBAPI_URL +
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/short-links", { headers: this.headers })
      .pipe(map(response => {
        return response; ''
      }));
  }




  getQRCodeList() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/QRCodeList",)
      .pipe(map(response => {
        return response; ''
      }));
  }

  ViewPDF(ele: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/generatePDF", ele)
      .pipe(map(response => {
        return response; ''
      }));
  }

  listdigitalsignaturedetails() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listdigitalsignaturedetails",)
      .pipe(map(response => {
        return response; ''
      }));
  }

  GenerateSignedPDF(ele: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/GenerateSignedPDF", ele)
      .pipe(map(response => {
        return response; ''
      }));
  }

  GenerateSignedPDF2(ele: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/GenerateSignedPDF2", ele)
      .pipe(map(response => {
        return response; ''
      }));
  }

  getAccessToken() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/crmservicegetaccesstokenByStatus/Active/1", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  gettingTechnicianNotification() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/gettingTechnicianNotification", { headers: this.headers })
      .pipe(map(response => {
        return response; ''
      }));
  }

  gettingDriverNotification() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/gettingDriverappnotification", { headers: this.headers })
      .pipe(map(response => {
        return response; ''
      }));
  }

  getPaymentHisoty() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getpaymentdetails", { headers: this.headers })
      .pipe(map(response => {
        return response; ''
      }));
  }

}
