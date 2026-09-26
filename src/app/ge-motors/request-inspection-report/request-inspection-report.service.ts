import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class RequestInspectionReportService {

  base = CommonConstants.WEBAPI_URL;
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getRequestInspectionReport(carshowroom_id: any) {
    if (carshowroom_id) {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/allinspectionreportrequestbasedoncar/" + carshowroom_id, { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    } else {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/allinspectionreportrequestbasedoncar", { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }
  }


  // Paginated + searchable customer list, backed by /api/registration
  // (page, limit, total, totalPages, data[] response shape)
  // Adjust the URL below to your actual registration endpoint.
  getCustomers(page: number = 1, limit: number = 50, search: string = '') {
    let params: any = { page, limit };
    if (search) {
      params.search = search;
    }
    return this.http.get(`${this.base}/api/registration`, { params, headers: this.headers },);
  }

  getAllByCar(carshowroom_id?: any, request_status?: string) {
    let url = `${this.base}/api/ge_motors/allinspectionreportrequestbasedoncar`;
    if (carshowroom_id) {
      url += `/${carshowroom_id}`;
    }
    const params: any = {};
    if (request_status) {
      params.request_status = request_status;
    }
    return this.http.get(url, { params });
  }

  findById(id: any) {
    return this.http.get(`${this.base}/api/ge_motors/inspectionreportrequest/${id}`);
  }

  updateById(id: any, payload: any) {
    return this.http.post(`${this.base}/api/ge_motors/updateinspectionreportrequest/${id}`, payload, { headers: this.headers });
  }

  approve(id: any, actioned_by: any) {
    return this.http.get(`${this.base}/api/ge_motors/inspectionreportrequestapprove/${id}`, { params: { actioned_by } });
  }

  reject(id: any, actioned_by: any) {
    return this.http.get(`${this.base}/api/ge_motors/inspectionreportrequestreject/${id}`, { params: { actioned_by } });
  }

  deleteInspectionReportRequest(id: any) {
    return this.http.get(`${this.base}/api/ge_motors/deleteinspectionreportrequest/${id}`);
  }

  inActiveInspectionReportRequest(id: any, login_id: any) {
    return this.http.post(`${this.base}/api/ge_motors/inActiveInspectionReportRequest`, { request_id: id, modified_by: login_id }, { headers: this.headers });
  }



  createInspectionReportRequest(payload: any) {
    return this.http.post(`${this.base}/api/ge_motors/createinspectionreportrequest`, payload, { headers: this.headers });
  }

  // request-inspection-report.service.ts
  getNextRefNo(categoryType: string) {
    return this.http.get(`${this.base}/api/ge_motors/getNextOQSRefNo`, {
      headers: this.headers,
      params: { categoryType }
    });
  }


}