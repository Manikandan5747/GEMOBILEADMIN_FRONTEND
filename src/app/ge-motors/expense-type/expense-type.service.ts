import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTypeService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getExpensetype() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/expensetype", { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createExpensetype(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/expensetype", params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateExpensetype(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/expensetype/" + params.expensetypeid, params, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  ////////////////////////////
   getExpensedetails(carshowroom_id: any) {
    if (carshowroom_id) {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/allexpensebasedoncar/" + carshowroom_id, { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    } else {
      return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/allexpensebasedoncar", { headers: this.headers })
        .pipe(map(response => {
          return response;
        }));
    }

  }

  createExpense(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/expense", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  updateExpense(params: any,id:any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/expense/" + id,params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  expenseupdateStatusToInactive(id:any){
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/expenseupdatestatustoinactive/" + id,{ headers: this.headers })
    .pipe(map(response => {
      return response;
    }));
  }

    deleteExpenseById(id:any){
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteExpenseById/" + id,{},{ headers: this.headers })
    .pipe(map(response => {
      return response;
    }));
  }

}