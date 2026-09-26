import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class AdvanceService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }



    getAdvance(carshowroom_id: any) {
    if (carshowroom_id) {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/alladvancebasedoncar/" + carshowroom_id, { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    } else {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/alladvancebasedoncar", { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }
  }


  getAdvanceById(advanceid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/advance/"+advanceid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createAdvance(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/advance", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  updateAdvance(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/advance/" + id,params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  advanceUpdateStatusToInactive(id:any){
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/advanceupdatestatustoinactive/" + id,{ headers: this.headers })
    .pipe(map(response => {
      return response;
    }));
  }


   deleteAdvancerecords(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteAdvaceById/" + params.advanceid, {},{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}