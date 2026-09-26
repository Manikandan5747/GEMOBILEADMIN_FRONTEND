import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  getCampaigns() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/campaigns",{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  findCampaignsByIdLeadOpp(items:any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/findCampaignsByIdLeadOpp/"+items,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteRecord(items) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/deleteRecord/"+items,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  

  createCampaigns(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/campaigns", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  updateCampaigns(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/ge_motors/campaigns/" + params.campaignid, params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

   checkCampaignAvailability(campaignid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkCampaignsAvailability/" + campaignid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteCampaignById(campaignid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteCampaignsById/" + campaignid,{}, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }
  
}