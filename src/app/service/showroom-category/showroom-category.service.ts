import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ShowroomCategoryService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getShowroomCategory() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/showroomcategory",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createShowroomCategory(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/showroomcategory", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateShowroomCategory(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/showroomcategory/" + params.srcategoryid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}