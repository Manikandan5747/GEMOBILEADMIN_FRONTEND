import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getSalesorder() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/salesorder",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getsalesorderwithpagination(obj:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/salesorderwithpagination",obj, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  listAllSalesContractDetails(salesorderid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/listAllSalesContractDetails/"+salesorderid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  createSalesorder(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/salesorder", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateSalesorder(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/salesorder/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdSalesorder(quotationid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/salesorder/"+quotationid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  
  productdetailswithsoldstatus(params: any) {
    let obj ={"productDetails":params}
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/productdetailswithsoldstatus",obj,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  findSettingsappsetcategory(id:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/findSettingsappsetcategory/" + id, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

   deleteSalesOrderById(salesorderid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/salesorder/" + salesorderid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}
