import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getOpportunityAdvanceFilter(filtervalue) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/getopportunityadvancefilter",filtervalue,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  
  getOpportunity() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/opportunity",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getopportunitywithpagination(obj:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/opportunitywithpagination",obj, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createOpportunity(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/opportunity", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateOpportunity(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/opportunity/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdOpportunity(opportunityid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/opportunity/"+opportunityid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  convertlead(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/convertlead", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

    //RefNo
    getfindnextRefno(categoryType:any) {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + `/api/ge_motors/getNextOQSRefNo?categoryType=${categoryType}`,{ headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }
   
     checkOpportunityAvailability(opportunityid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkOpportunityAvailability/" + opportunityid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteOpportunityById(opportunityid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/opportunity/" + opportunityid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}