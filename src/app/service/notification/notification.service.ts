import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { CommonConstants } from 'src/app/common/common.constant';
import { SelectControlValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(private http: HttpClient) { }

  getNotification() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/notification",)
      .pipe(map(response => {
        return response;
      }));
  }

  getNotificationWithPagination(obj: any) {
     let headers = new HttpHeaders({
      'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
    });
 let params = new HttpParams()
  .set('search', obj.search || '')
  .set('page', (obj.page || 1).toString())
  .set('limit', (obj.limit || 10).toString())
  .set('sortBy', obj.sortBy || 'created_at')   // default column
  .set('sortOrder', obj.sortOrder || 'desc');  // default order


  return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/notificationwithpagination", { params,headers })
    .pipe(map(response => {
      return response;
    }));
}

  CreateNotification(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/notification", params)
      .pipe(map(response => {
        return response;
      }));
  }

  getAllapikey_Notify(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/getAllapikey_Notify", params)
      .pipe(map(response => {
        return response;
      }));
  }


  deleteRecord(campaign_id: string, params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/notificationinactive/" + campaign_id, { params })
      .pipe(map(response => {
        return response;
      }));
  }



  pushNotification(obj: any, data: any) {
    var thirdpartyurl = data && data.find((ele: any) => ele.appsetparameter == "thirdpartyurl");
    var ThirdpartyAuthorization = data && data.find((ele: any) => ele.appsetparameter == "newAuthorization");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ThirdpartyAuthorization.appsetparametervalue,
    });
    // thirdpartyurl.appsetparametervalue
    return this.http.post<any>(thirdpartyurl.appsetparametervalue, obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }



  publicPushNotification(obj: any, data: any) {
    var thirdpartyurl = data && data.find((ele: any) => ele.appsetparameter == "thirdpartyurl");
    var ThirdpartyAuthorization = data && data.find((ele: any) => ele.appsetparameter == "newAuthorization");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ThirdpartyAuthorization.appsetparametervalue,
    });
    // https://fcm.googleapis.com/fcm/send
    // thirdpartyurl.appsetparametervalue
    return this.http.post<any>(thirdpartyurl.appsetparametervalue, obj, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }



  sendSMS(obj: any, data: any) {


    var url = data && data.find((ele: any) => ele.appsetparameter == "url");
    var User = data && data.find((ele: any) => ele.appsetparameter == "User");
    var passwd = data && data.find((ele: any) => ele.appsetparameter == "passwd");
    var mtype = data && data.find((ele: any) => ele.appsetparameter == "mtype");

    //  url+'?'+'User='+User+'&passwd='+passwd+"&mobilenumber="
    var link = url.appsetparametervalue + 'User=' + User.appsetparametervalue + '&passwd=' + passwd.appsetparametervalue + "&mobilenumber=" + "+" + obj.data.mobilenumber + "&mtype=" + mtype.appsetparametervalue + "&message=" + obj.messageContent + ""
    console.log("link", link);
    return this.http.get<any>(link)
      .pipe(map(response => {
        return response;
      }));
  }








  //Internal Notifications
  getAllRecords(obj: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/getinternalnotify", obj)
      .pipe(map(response => {
        return response; ''
      }));
  }

  setReadRecord(obj: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + '/api/markASRead', obj)
      .pipe(map(response => {
        console.log(response);
        return response;
      }));
  }

  markASReadAll(obj: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + '/api/markASReadAll/' + obj.userid)
      .pipe(map(response => {
        console.log(response);
        return response;
      }));
  }

}

// https://www.smscountry.com/smscwebservice_bulk.aspx?User=germanex&passwd=GE21284248&mobilenumber=+971501504835&mtype=LNG&message=Dear Jenish Jacob, Your mobile app registration has been approved.Your mobile app security pin is 8168. KINDLY ENSURE YOUR SECURITY PIN IS NOT SHARED WITH ANYONE.