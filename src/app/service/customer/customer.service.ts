import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';
import { CookieService } from '../cookie.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  currentUser: any;
  privilegearr: any;
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  updatecustcode(obj: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/updatecustcode", obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getCustomer() {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/registration", { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getCustomerWithPagination(obj: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    let params = new HttpParams()
      .set('search', obj.search || '')
      .set('page', (obj.page || 1).toString())
      .set('limit', (obj.limit || 10).toString())
      .set('sortBy', obj.sortBy || 'created_at')   // default column
      .set('sortOrder', obj.sortOrder || 'desc')  // default order
      .set('customerstatus', obj.customerstatus || '')
      .set('block_status', obj.block_status || '')
      .set('customertypes', obj.customertypes || '');

    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/registrationwithpagination", { headers, params })
      .pipe(map(response => {
        return response;
      }));
  }

  createCustomer(params: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createWebRegistration", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  updateCustomer(params: any) {
    debugger
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });

    if (params.customertypes == 'INDIVIDUAL') {
      return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/registrationstatus/" + params.reg_id, params, { headers: headers })
        .pipe(map(response => {
          return response;
        }));
    } else {
      return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/updateWebRegistration", params, { headers: headers })
        .pipe(map(response => {
          return response;
        }));
    }
  }


  deleteCustomer(reg_id: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/regdel", reg_id)
      .pipe(map(response => {
        return response;
      }));
  }

  offlineuser(reg_id: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/offlineuser/" + reg_id, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }



  inActiveCustomer(reg_id: string, params: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/registrationdel/" + reg_id, { params }, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }



  /**
* Performs the auth
* @param email email of user
* @param password password of user
*/
  login(items: any) {

    let headers = new HttpHeaders();
    headers = headers.append('ipAddress', items.ipAddress);
    headers = headers.append('browserused', items.browserused);
    headers = headers.append('platform', items.platform);
    headers = headers.append('portallogin', "false");
    // headers = headers.append('ApiK', items.platform);

    // headers = headers.append('ipAddress', items.ipAddress);
    return this.http.get<any>(CommonConstants.WEBAPI_URL + `/api/login/` + items.username + "/" + items.password, { headers: headers })
      .pipe(map(user => {

        // login successful if there's a jwt token in the response
        if (user[0] && user[0].privilegearr) {
          var arr = user && user[0].privilegearr;
          localStorage.setItem('privilegearr', JSON.stringify(arr));
          delete user[0].privilegearr;
          this.cookieService.setCookie('geMobileAdminCurrentUser', JSON.stringify(user), 1);
        }
        return user;
      }));
  }




  createlogin(items: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/logincreate", items)
      .pipe(map(response => {
        return response;
      }));
  }


  updatelogin(items: any, id: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/loginupdate/" + id, items)
      .pipe(map(response => {
        return response;
      }));
  }


  
  getList() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/login", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getLogInLogList() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/loginlog", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getCompanyList() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getCompanyList", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getAllAddress() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/address", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  getAccessToken() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/crmserviceaccesstoken", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  unBlockRecord(reg_id: string, params: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/registrationunblock/" + reg_id, { params }, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }




  blockRecord(reg_id: string, params: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/registrationblock/" + reg_id, { params }, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  //getCurrentUser Details
  getCurrentUser(): any {
    // TODO: Enable after implementation
    this.currentUser = this.cookieService.getCookie('geMobileAdminCurrentUser');
    return JSON.parse(this.currentUser);
  }

  //Offline
  makeOfflineUser(user_id: string,) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/offlineuser/" + user_id, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  update_forcefulllogin_status(obj: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/update_forcefulllogin_status", obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  //makeInActiveUser
  makeActiveUser(user_id: string, currentUserid: any, showroomname: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    var obj = {
      login_id: user_id,
      currentUserid: currentUserid,
      showroomname: showroomname
    }
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/makeActiveUser", obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  makeCancelUser(user_id: string, showroomdcon_id: any, currentUserid: any, showroomname: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    var obj = {
      login_id: user_id,
      showroomdcon_id: showroomdcon_id,
      currentUserid: currentUserid,
      showroomname: showroomname
    }
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/makeCancelUser/", obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }



  //getCurrentUserPrivilegeArr Details
  getCurrentUserPrivilegeArr(): any {
    this.privilegearr = localStorage.getItem('privilegearr');
    return JSON.parse(this.privilegearr);
  }

  //getCarSoldOutDuration
  getCarSoldOutDuration() {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getCarSoldOutDuration", { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  createHistoryDocPrinted(obj: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/createHistoryDocPrinted", obj, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  gethistorydocprinted() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/gethistorydocprinted", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  checkCustomerExists(params: any, customertypes: string, mobilenumber: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });

    let obj = {
      customertypes: customertypes,
      customercode: params,
      mobilenumber: mobilenumber
    }
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/checkCustomerExists", obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getvehicleList() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/appraisals", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getdriverapprecoverylocationupdatelist() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getdriverapprecoverylocationupdatelist", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  changePassword(login_id: any, newpassword: any) {
    let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });

    var obj = {
      login_id: login_id,
      confirmpassword: newpassword
    }

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/changepasswordnew", obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  sendMailtoUser(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/passwordmail", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

}