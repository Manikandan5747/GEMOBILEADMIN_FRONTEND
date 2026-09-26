import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  currentUser: any;
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getCarModel() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/buycarmodel", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createCarModel(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/buycarmodel", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  buycarmodelbrandid(params: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/buycarmodelbrandid/" + params)
      .pipe(map(response => {
        return response;
      }));
  }

  updateCarModel(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/buycarmodel/" + params.modelid, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  // modelIsAlreadyMapped
  modelIsAlreadyMapped(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/modelIsAlreadyMapped", { params })
      .pipe(map(response => {
        return response;
      }));
  }

  checkModelAvailability(modelid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkModelAvailability/" + modelid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteModelById(modelid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteModelById/" + modelid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


}