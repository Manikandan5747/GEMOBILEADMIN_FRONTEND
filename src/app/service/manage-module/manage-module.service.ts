import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ManageModuleService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getModule(selectedRoleisAdmin: any) {
    var headers = new HttpHeaders({
      'selectedroleisadmin': selectedRoleisAdmin,
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/module", { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getAllListModule(selectedRoleisAdmin: any) {
    var headers = new HttpHeaders({
      'selectedroleisadmin': selectedRoleisAdmin,
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getAllListModule", { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


  

  createModule(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/module", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateModule(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/module/" + params.module_id, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  // UserPrivilege
  getAllUserPrivilege(role_id: any,test:any) {
    var headers = new HttpHeaders({
      'roleid': role_id.toString(),
      'systemmenufilter': test,
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/userprivilege", { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


    // UserPrivilege
    getAllReportUserPrivilege(role_id: any) {
      var headers = new HttpHeaders({
        'roleid': role_id.toString(),
        'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
      });
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getAllReportUserPrivilege", { headers: headers })
        .pipe(map(response => {
          return response;
        }));
    }

  createUserPrivilege(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/userprivilege", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  miscelleneosRulesSave(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createconditionalprivilege", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getAllReportListModule() {
    var headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getAllReportListModule", { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


    // getModuleFieldDetailsByParentModuleId
    getModuleFieldDetailsByParentModuleId(module_id: any) {
      var headers = new HttpHeaders({
        'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
      });
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/getalllistchildmodule/"+module_id, { headers: headers })
        .pipe(map(response => {
          return response;
        }));
    }


  // getModuleFieldWithprivilege
  getModuleFieldWithprivilege(module_id: any, role_id: any) {
    let Obj = {
      module_id: module_id,
      role_id: role_id
    }
    var headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/getConditionalPrivileges", Obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


   miscMapping(module_id: any) {
    var headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/misc-mapping/"+module_id, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  getMiscPrivilegesById(obj: any) {
    var headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/misc-mapping-privileges",obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


   createorupdatemiscprivileges(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createorupdatemiscprivileges", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


}