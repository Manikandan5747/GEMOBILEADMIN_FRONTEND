import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }


  
  listAllCategoryMasterpagination(obj) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/listAllInventorywithpagination",obj,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createCategory(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/inventory", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateCategory(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/inventory/" + id, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  
  getByIdCategory(leadsid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/inventory/"+leadsid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  getCategoryList(){
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/lucky_draw/category",{ headers: this.headers })
    .pipe(map(response => {
      return response;
    }));
  }
}