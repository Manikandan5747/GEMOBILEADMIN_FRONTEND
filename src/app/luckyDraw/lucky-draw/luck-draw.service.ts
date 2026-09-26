import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';
@Injectable({
  providedIn: 'root'
})
export class LuckDrawService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }


  listAllCategoryType(){
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/category_type",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  
  listAllCategoryMasterpagination(obj) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/listAllcategorywithpagination",obj,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createCategory(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/category", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateCategory(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/category/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  
  getByIdCategory(leadsid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/category/"+leadsid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  
}
