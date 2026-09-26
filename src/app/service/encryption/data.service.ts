import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';


@Injectable({
  providedIn: 'root',
})
export class DataService {

  headers = new HttpHeaders({
    'apikey': 'a4db08b7-5729-4ba9-8c08-f2df493465a1',
  });

  constructor(private http: HttpClient) { }

  private storage = sessionStorage; 

  // Encrypt the key before storing it
  private encryptKey(key: string): string {
    try {
      return btoa(key); // Base64 encoding
    } catch (error) {
      console.error('Key encryption failed:', error);
      return '';
    }
  }

  // Decrypt the key when retrieving
  private decryptKey(encodedKey: string): string {
    try {
      return atob(encodedKey); // Base64 decoding
    } catch (error) {
      console.error('Key decryption failed:', error);
      return '';
    }
  }

  // Set data with encrypted key
  setData(key: string, value: any): void {
    const encryptedKey = this.encryptKey(key);  // Encrypt the key
    this.storage.setItem(encryptedKey, JSON.stringify(value)); // Store the value
  }

  // Get data by decrypting the key
  getData(key: string): any { debugger
    const encryptedKey = this.encryptKey(key);  // Encrypt the key to match what is stored
    const data = this.storage.getItem(encryptedKey);
    return data ? JSON.parse(data) : null;
  }

  // Clear specific data by encrypted key
  clearData(key: string): void {
    const encryptedKey = this.encryptKey(key);
    this.storage.removeItem(encryptedKey);
  }

  // Clear all data
  clearAllData(): void {
    this.storage.clear();
  }


  createData(params: any) {
    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/storage_data/create", params,{ headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }


  findById(storage_data_id: any) {
    return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/storage_data/findById/" + storage_data_id, { headers: this.headers })
      .pipe(map(response => {
        return response;
      }));
  }

  // deleteById(storage_data_id: any) {
  //   return this.http.delete<any>(CommonConstants.WEBAPI_URL + "/api/storage_data/deleteById/" + storage_data_id, { headers: this.headers })
  //     .pipe(map(response => {
  //       return response;
  //     }));
  // }

}
