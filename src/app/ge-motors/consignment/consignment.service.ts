import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ConsignmentService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getConsignment(carshowroom_id: any) {
    if (carshowroom_id) {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/allconsignmentbasedoncar/" + carshowroom_id, { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    } else {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/allconsignmentbasedoncar", { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }
  }

  getPurchaseAgreement(carshowroom_id: any) {
    if (carshowroom_id) {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/AGFindBycarshowroom_id/" + carshowroom_id, { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    } else {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/AGFindBycarshowroom_id", { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }
  }



  createConsignment(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/consignment", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  updateConsignment(params: any, id: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/consignment/" + id, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  consignmentupdatestatustoinactive(id: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/consignmentupdatestatustoinactive/" + id, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createPurchaseAgreement(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/purchaseagreement", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



  sendMailtoUser(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/sendMailtoUser", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  deletePurchaseAgreementById(purchaseagreementid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/purchaseAgreement/" + purchaseagreementid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  deleteConsignmentrecords(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteConsignmentById/" + params.consignmentid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}