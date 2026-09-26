import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiReportService {

  private apiUrl = 'http://localhost:7001/ai-report';

  constructor(private http: HttpClient) {}

  generateReport(question: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      question: question
    });
  }
}