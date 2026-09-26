import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class SpecialOfferService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }
//companyList
getCompanyList() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getCompanyList",{ headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }

  getSpecialoffer() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/specialoffers",)
        .pipe(map(response => {
          return response;
        }));
    }
  

    uploadImg(params:any,spclofferurl:any,cmp_id:any,login_id:any){
      const formData = new FormData();
      formData.append('spclofferurl',spclofferurl);
      formData.append('login_id',login_id);
      formData.append('spclofferpath',params);
      formData.append('cmp_id',cmp_id);
      return this.http.post(CommonConstants.WEBAPI_URL+"/api/upload-single-image",formData,spclofferurl);
    }  
  

    deleteRecord(reg_id:string,params:any){

      return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/specialoffers/"+reg_id,{params})
      .pipe(map(response => {
        return response;
      }));
    }


    getSpecialofferHistory() {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/list-specialofferhistory",{ headers: this.headers })
          .pipe(map(response => {
            return response;
          }));
      }


}


