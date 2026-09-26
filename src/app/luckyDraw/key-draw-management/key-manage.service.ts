import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class KeyManageService {


  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }

  

  getkeyManagewithpagination(obj: any) {
    // Comment out the actual HTTP request  ,, 
    
    return this.http.post<any>(CommonConstants.WEBAPI_URL+"/api/lucky_draw/listAllKeyManagementWithPagination", obj, { headers: this.headers })
      .pipe(map(response => {
        return response; // Adjust based on actual API response structure
      }));
    
      // geapps.germanexperts.ae
    // Return static mock data for development

  }


 

}
