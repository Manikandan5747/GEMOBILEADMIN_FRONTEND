import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getByID(accountid) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/contacts/"+accountid,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getContact() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/contacts",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createContact(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/contacts", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateContact(params: any,contactid:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/contacts/" + contactid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }



  leadsratingconfig() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/leadsratingconfig",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  leadsourceconfig() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/leadsourceconfig",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  contactnameuniquevalidation(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/contactnameuniquevalidation", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  checkContactAvailability(contactid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkContactAvailability/" + contactid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteContactById(contactid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/contact/" + contactid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}