import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class StageService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getStage() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/stage", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createStage(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/stage", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateStage(params: any, id: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/stage/" + id, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdStage(opportunityid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/stage/" + opportunityid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



  checkStageAvailability(stageid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkStageAvailability/" + stageid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteStageById(stageid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteStageById/" + stageid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}
