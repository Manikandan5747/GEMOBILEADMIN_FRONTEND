import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class TestDriveService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getAllTestDrives() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getAllTestDrives",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getTestDrive(opportunityid:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getTestDrive/"+opportunityid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createTestDrive(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createTestDrive", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


}
