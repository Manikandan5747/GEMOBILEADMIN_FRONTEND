import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getLeads() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/leads",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  listAllLeadswithpagination(obj) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/listAllLeadswithpagination",obj,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createLead(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/leads", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateLead(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/leads/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdLeads(leadsid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/leads/"+leadsid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  ////
  getindustrylist() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/industryconfig",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

    deleteLeadById(leadsid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/leads/" + leadsid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}