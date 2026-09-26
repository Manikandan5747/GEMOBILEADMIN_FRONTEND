import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  currentUser: any;
  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });
  constructor(private http: HttpClient) { }


  listbrandwithactivecars() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/listbrandwithactivecars",)
      .pipe(map(response => {
        return response;
      }));
  }

  getBrand() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/buycarbrand",)
      .pipe(map(response => {
        return response;
      }));
  }

  createBrand(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/buycarbrand", params,)
      .pipe(map(response => {
        return response;
      }));
  }

  updateBrand(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/buycarbrandUpdate", params,)
      .pipe(map(response => {
        return response;
      }));
  }


  uploadCSVBrandFile(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/bulkUploadBrands", params)
      .pipe(map(response => {
        return response;
      }));
  }

  bulkUploadModels(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/bulkUploadModels", params)
      .pipe(map(response => {
        return response;
      }));
  }


  findBrandsFromCatalogue() {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/findBrandsFromCatalogue",)
      .pipe(map(response => {
        return response;
      }));
  }

  getBrandsbasedModelsFromCatalogue(catalogueid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/getBrandsbasedModelsFromCatalogue", { catalogueid })
      .pipe(map(response => {
        return response;
      }));
  }

  // brandIsAlreadyMapped
  brandIsAlreadyMapped(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/brandIsAlreadyMapped", { params })
      .pipe(map(response => {
        return response;
      }));
  }

  checkBrandAvailability(brandid: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/checkBrandAvailability/" + brandid, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  deleteBrandById(brandid: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/deleteBrandById/" + brandid, {},{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


}