import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getquotation() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/quotation",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getquotationwithpagination(obj:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/quotationwithpagination",obj, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createquotation(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/quotation", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  
  findOpportunityById(id:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/findOpportunityById/" + id, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  updatequotation(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/quotation/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdquotation(quotationid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/quotation/"+quotationid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



  getTax() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/tax",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

   checkQuotationAvailability(quoteid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkQuotationAvailability/" + quoteid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteQuotationById(quoteid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/quote/" + quoteid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}
