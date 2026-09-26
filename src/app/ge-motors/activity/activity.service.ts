import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getActivity(obj:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/getactivitylistusingtablename",obj,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createActivity(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/activity", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getByIdActivity(activityid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/activity/"+activityid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateActivity(params: any,activityid:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/activity/" + activityid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}